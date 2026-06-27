-- PostgREST API roles, schema, and read-only views.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/003_postgrest_api.sql
--
-- Change authenticator password before production (see back-ends/postgrest/.env.example).

\connect event_system_pro

-- ---------------------------------------------------------------------------
-- Roles (idempotent)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'postgrest_dev_password';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
END $$;

GRANT anon TO authenticator;
GRANT authenticated TO authenticator;

-- ---------------------------------------------------------------------------
-- API schema (views only — no passwords or write tables exposed to anon)
-- ---------------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS api;
GRANT USAGE ON SCHEMA api TO anon, authenticated;

CREATE OR REPLACE VIEW api.event_type_lu AS
SELECT event_type_code, description_json, created_date, created_by
FROM public."event"_type_lu;

CREATE OR REPLACE VIEW api.country_lu AS
SELECT
  country_id,
  iso2,
  short_name,
  long_name,
  iso3,
  numcode,
  un_member,
  calling_code,
  cctld,
  active
FROM public.country_lu
WHERE active IS NOT FALSE;

CREATE OR REPLACE VIEW api.us_state_lu AS
SELECT id, code, name, active
FROM public.us_state_lu
WHERE active IS NOT FALSE;

CREATE OR REPLACE VIEW api.competitor_type_lu AS
SELECT competitor_type_id, description
FROM public.competitor_type_lu;

CREATE OR REPLACE VIEW api.skill_level_lu AS
SELECT skill_level_id, full_name, abbr_name, skill_level_group_id, ranking
FROM public.skill_level_lu;

CREATE OR REPLACE VIEW api.secret_question_lu AS
SELECT secret_question_id, question, created_date
FROM public.secret_question_lu;

CREATE OR REPLACE VIEW api.event_group AS
SELECT
  event_group_code,
  full_name,
  short_name,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."event"_group;

CREATE OR REPLACE VIEW api.event AS
SELECT
  event_id,
  fight_event_group_code,
  name,
  contact_user_id,
  host_charter_id,
  country_code,
  state_or_province,
  location_json,
  active,
  number_of_days,
  start_date,
  end_date,
  created_date,
  created_by,
  updated_date,
  updated_by
FROM public."event"
WHERE active IS NOT FALSE;

CREATE OR REPLACE VIEW api.contest AS
SELECT
  contest_id,
  event_id,
  event_type_code,
  competitors_json,
  results_json,
  age_division_id,
  current_heat_id,
  current_heat_index,
  media_links_json,
  is_active,
  is_cancelled,
  staff_json,
  location_json,
  male_or_female,
  number_of_heats,
  original_start_time,
  original_end_time,
  pushed_back_start_time,
  pushed_back_end_time,
  primary_contact_id,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.contest
WHERE is_active <> 0
  AND COALESCE(is_cancelled, 0) = 0;

CREATE OR REPLACE VIEW api."user" AS
SELECT
  user_id,
  username,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  additional_info_json,
  addresses_json,
  active,
  created_date,
  created_by,
  updated_date,
  updated_by
FROM public."user"
WHERE active IS NOT FALSE;

CREATE OR REPLACE VIEW api.competitor AS
SELECT
  competitor_id,
  contest_id,
  event_id,
  user_id,
  first_name,
  last_name,
  gear_json,
  competitor_type_id
FROM public.competitor;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT ON ALL TABLES IN SCHEMA api TO anon, authenticated;

GRANT SELECT ON public."user", public.competitor TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA api
  GRANT SELECT ON TABLES TO anon, authenticated;

-- Authenticated role can write to selected tables later via direct grants or RPCs.
-- Example (uncomment when JWT auth is wired up):
-- GRANT INSERT, UPDATE ON public.contact TO authenticated;
