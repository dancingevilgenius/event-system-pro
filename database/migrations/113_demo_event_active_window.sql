-- Daily maintenance: keep Hollowfen Blade Congress and Jitterbug Jamboree (current year)
-- in an active window (start = today - 2 days, end = today + 2 days, America/Chicago).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/113_demo_event_active_window.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.demo_event_active_window_core()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  event_tz CONSTANT text := 'America/Chicago';
  target_group_codes CONSTANT text[] := ARRAY[
    'HOLLOWFEN_BLADE_CONGRESS',
    'JITTERBUG_JAMBOREE'
  ];
  v_today date;
  v_current_year int;
  v_updated integer;
  v_events json;
BEGIN
  v_today := (clock_timestamp() AT TIME ZONE event_tz)::date;
  v_current_year := extract(year from (clock_timestamp() AT TIME ZONE event_tz))::int;

  UPDATE public."event" AS e
  SET
    start_date = (
      (v_today - 2)::timestamp
      + ((e.start_date AT TIME ZONE event_tz)::time)
    ) AT TIME ZONE event_tz,
    end_date = (
      (v_today + 2)::timestamp
      + ((e.end_date AT TIME ZONE event_tz)::time)
    ) AT TIME ZONE event_tz
  WHERE e.event_group_code = ANY(target_group_codes)
    AND extract(year from (e.start_date AT TIME ZONE event_tz))::int = v_current_year
    AND e.start_date IS NOT NULL
    AND e.end_date IS NOT NULL;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  SELECT COALESCE(
    json_agg(
      json_build_object(
        'event_id', e.event_id,
        'event_group_code', e.event_group_code,
        'name', e.name,
        'start_date', e.start_date,
        'end_date', e.end_date
      )
      ORDER BY e.event_group_code
    ),
    '[]'::json
  )
  INTO v_events
  FROM public."event" AS e
  WHERE e.event_group_code = ANY(target_group_codes)
    AND extract(year from (e.start_date AT TIME ZONE event_tz))::int = v_current_year;

  RETURN json_build_object(
    'ok', true,
    'current_year', v_current_year,
    'window_start', v_today - 2,
    'window_end', v_today + 2,
    'events_updated', v_updated,
    'events', v_events
  );
END;
$$;

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
  RETURN v_result || jsonb_build_object('skipped', false);
END;
$$;

CREATE OR REPLACE FUNCTION api.run_demo_event_active_window()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  RETURN api.demo_event_active_window_core();
END;
$$;

INSERT INTO maintenance.job_definition (
  job_name,
  rpc_schema,
  rpc_name,
  schedule_cron,
  enabled,
  stale_after_interval,
  description,
  created_by
)
VALUES (
  'demo_event_active_window',
  'api',
  'demo_event_active_window',
  '0 0 * * *',
  true,
  INTERVAL '25 hours',
  'Set Hollowfen Blade Congress and Jitterbug Jamboree (current year) to an in-progress window: start two days ago, end two days ahead (America/Chicago).',
  'c-agent'
)
ON CONFLICT (job_name) DO UPDATE
SET
  rpc_schema = EXCLUDED.rpc_schema,
  rpc_name = EXCLUDED.rpc_name,
  schedule_cron = EXCLUDED.schedule_cron,
  enabled = EXCLUDED.enabled,
  stale_after_interval = EXCLUDED.stale_after_interval,
  description = EXCLUDED.description,
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent';

REVOKE ALL ON FUNCTION api.demo_event_active_window_core() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.demo_event_active_window() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.run_demo_event_active_window() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.demo_event_active_window() TO maintenance;
GRANT EXECUTE ON FUNCTION api.run_demo_event_active_window() TO authenticated;

GRANT maintenance TO postgres;

NOTIFY pgrst, 'reload schema';
