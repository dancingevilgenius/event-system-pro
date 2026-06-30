-- Production API grants: anon is read-only (+ auth RPCs); authenticated may mutate app data.
-- Reverses dev-wide write access from migration 004_postgrest_dev_writes.sql.
--
-- Run: psql -U postgres -d event_system_pro -f database/migrations/021_prod_grants.sql
--
-- Requires JWT auth (migration 018 + PGRST_JWT_SECRET) for REST writes from the web app.

\connect event_system_pro

-- ---------------------------------------------------------------------------
-- authenticated: writes on api views and underlying tables
-- ---------------------------------------------------------------------------

GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA api TO authenticated;

GRANT INSERT, UPDATE, DELETE ON
  public.event_type_lu,
  public.governing_body,
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
TO authenticated;

-- User rows are read via api."user" and mutated only through SECURITY DEFINER RPCs.
REVOKE INSERT, UPDATE, DELETE ON api."user" FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- anon: revoke REST writes (lookups remain SELECT-only from migration 003)
-- ---------------------------------------------------------------------------

REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA api FROM anon;

REVOKE INSERT, UPDATE, DELETE ON
  public.event_type_lu,
  public.governing_body,
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
FROM anon;

-- ---------------------------------------------------------------------------
-- Default privileges for future api objects
-- ---------------------------------------------------------------------------

ALTER DEFAULT PRIVILEGES IN SCHEMA api
  REVOKE INSERT, UPDATE, DELETE ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA api
  GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- ---------------------------------------------------------------------------
-- RPC hardening: password change requires a signed-in JWT
-- ---------------------------------------------------------------------------

REVOKE ALL ON FUNCTION api.change_password(bigint, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.change_password(bigint, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
