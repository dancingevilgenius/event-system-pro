-- PostgREST dev-only write grants (local testing via Swagger / curl).
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/004_postgrest_dev_writes.sql
--
-- WARNING: Do not apply in production. The anon role can mutate api views without JWT.
-- PostgREST still exposes only the api schema (see back-ends/postgrest/.env).

\connect event_system_pro

GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA api TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA api
  GRANT INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

-- Underlying tables (views are security invoker in PG15+; anon needs base-table rights too).
GRANT INSERT, UPDATE, DELETE ON
  public.event_type_lu,
  public.country_lu,
  public.us_state_lu,
  public.competitor_type_lu,
  public.skill_level_lu,
  public.secret_question_lu,
  public.event_group,
  public."event",
  public.contest,
  public.competitor,
  public.judging_panel,
  public.attendee
TO anon, authenticated;

-- User API is read-only (password_encrypted is not exposed on api."user").
REVOKE INSERT, UPDATE, DELETE ON api."user" FROM anon, authenticated;
