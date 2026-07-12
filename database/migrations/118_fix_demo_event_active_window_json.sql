-- Fix demo_event_active_window: json || jsonb is invalid in PostgreSQL.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/118_fix_demo_event_active_window_json.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.demo_event_active_window()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_result json;
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('demo_event_active_window')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  v_result := api.demo_event_active_window_core();
  RETURN (
    v_result::jsonb || jsonb_build_object('skipped', false)
  )::json;
END;
$$;

REVOKE ALL ON FUNCTION api.demo_event_active_window() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.demo_event_active_window() TO maintenance;

NOTIFY pgrst, 'reload schema';
