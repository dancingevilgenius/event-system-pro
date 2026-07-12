-- Robust json merge for demo_event_active_window (json has no || operator in PostgreSQL).
-- Migration 118 used json || json, which also fails at runtime on some versions.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/119_fix_demo_event_active_window_json_merge.sql

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
  ev RECORD;
  v_today date;
  v_current_year int;
  v_updated integer := 0;
  v_events jsonb := '[]'::jsonb;
  v_new_start timestamptz;
  v_new_end timestamptz;
  v_old_row jsonb;
  v_new_row jsonb;
  v_changed text[];
  v_old_partial jsonb;
  v_new_partial jsonb;
  v_record_key text;
BEGIN
  v_today := (clock_timestamp() AT TIME ZONE event_tz)::date;
  v_current_year := extract(year from (clock_timestamp() AT TIME ZONE event_tz))::int;

  PERFORM api.set_skip_row_audit(true);

  FOR ev IN
    SELECT e.*
    FROM public."event" AS e
    WHERE e.event_group_code = ANY(target_group_codes)
      AND extract(year from (e.start_date AT TIME ZONE event_tz))::int = v_current_year
      AND e.start_date IS NOT NULL
      AND e.end_date IS NOT NULL
    ORDER BY e.event_group_code
  LOOP
    v_new_start := (
      (v_today - 2)::timestamp
      + ((ev.start_date AT TIME ZONE event_tz)::time)
    ) AT TIME ZONE event_tz;
    v_new_end := (
      (v_today + 2)::timestamp
      + ((ev.end_date AT TIME ZONE event_tz)::time)
    ) AT TIME ZONE event_tz;

    IF ev.start_date IS NOT DISTINCT FROM v_new_start
       AND ev.end_date IS NOT DISTINCT FROM v_new_end THEN
      CONTINUE;
    END IF;

    v_old_row := to_jsonb(ev);

    UPDATE public."event" AS e
    SET
      start_date = v_new_start,
      end_date = v_new_end
    WHERE e.event_id = ev.event_id
    RETURNING to_jsonb(e.*) INTO v_new_row;

    SELECT p.old_data, p.new_data
    INTO v_old_partial, v_new_partial
    FROM public.audit_partial_change_data(v_old_row, v_new_row) AS p;

    IF v_old_partial IS NULL
       OR v_new_partial IS NULL
       OR v_old_partial = '{}'::jsonb THEN
      CONTINUE;
    END IF;

    v_record_key := public.audit_row_record_key('public.event'::regclass, v_new_row);

    PERFORM api.record_audit_event(
      p_action => 'UPDATE',
      p_table_name => 'event',
      p_record_key => v_record_key,
      p_old_data => v_old_partial,
      p_new_data => v_new_partial,
      p_metadata => jsonb_build_object('source', 'demo_event_active_window')
    );

    v_updated := v_updated + 1;
    v_events := v_events || jsonb_build_array(
      jsonb_build_object(
        'event_id', v_new_row -> 'event_id',
        'event_code', v_new_row -> 'event_code',
        'event_group_code', v_new_row -> 'event_group_code',
        'name', v_new_row -> 'name',
        'start_date', v_new_row -> 'start_date',
        'end_date', v_new_row -> 'end_date'
      )
    );
  END LOOP;

  PERFORM api.set_skip_row_audit(false);

  RETURN (
    jsonb_build_object(
      'ok', true,
      'current_year', v_current_year,
      'window_start', v_today - 2,
      'window_end', v_today + 2,
      'events_updated', v_updated,
      'events', v_events
    )
  )::json;
EXCEPTION
  WHEN OTHERS THEN
    PERFORM api.set_skip_row_audit(false);
    RAISE;
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
  RETURN (
    v_result::jsonb || jsonb_build_object('skipped', false)
  )::json;
END;
$$;

REVOKE ALL ON FUNCTION api.demo_event_active_window_core() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.demo_event_active_window() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.demo_event_active_window() TO maintenance;

NOTIFY pgrst, 'reload schema';
