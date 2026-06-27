-- Rename fight_event_group -> event_group and fight_event -> event.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/015_rename_fight_event_tables.sql

\connect event_system_pro

ALTER TABLE IF EXISTS public.fight_event_group RENAME TO event_group;
ALTER TABLE IF EXISTS public.fight_event RENAME TO event;

DROP VIEW IF EXISTS api.fight_event;
DROP VIEW IF EXISTS api.fight_event_group;

CREATE OR REPLACE VIEW api.event_group AS
SELECT
  event_group_code,
  full_name,
  short_name,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_group;

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

GRANT SELECT ON api.event_group, api.event TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.event_group, public."event" TO anon, authenticated;
