-- Partial-column audit trail for demo_event_active_window scheduler updates.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/114_demo_event_active_window_audit.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.audit_json_subset(p_data jsonb, p_keys text[])
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_key text;
  v_result jsonb := '{}'::jsonb;
BEGIN
  IF p_data IS NULL OR p_keys IS NULL OR cardinality(p_keys) = 0 THEN
    RETURN v_result;
  END IF;

  FOREACH v_key IN ARRAY p_keys LOOP
    IF p_data ? v_key THEN
      v_result := v_result || jsonb_build_object(v_key, p_data -> v_key);
    END IF;
  END LOOP;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_partial_change_data(
  p_old jsonb,
  p_new jsonb
)
RETURNS TABLE(old_data jsonb, new_data jsonb)
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_changed text[];
BEGIN
  v_changed := public.audit_changed_columns(p_old, p_new);

  old_data := public.audit_json_subset(p_old, v_changed);
  new_data := public.audit_json_subset(p_new, v_changed);
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION api.set_skip_row_audit(p_skip boolean DEFAULT true)
RETURNS void
LANGUAGE sql
SET search_path = public, api
AS $$
  SELECT set_config(
    'app.skip_row_audit',
    CASE WHEN p_skip THEN 'true' ELSE 'false' END,
    true
  );
$$;

CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_action text;
  v_old jsonb;
  v_new jsonb;
  v_record_key text;
  v_actor_user_id bigint;
BEGIN
  IF current_setting('app.skip_row_audit', true) = 'true' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  v_actor_user_id := api.current_user_id();

  IF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_old := to_jsonb(OLD);
    v_new := NULL;
    v_record_key := public.audit_row_record_key(TG_RELID, v_old);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_record_key := public.audit_row_record_key(TG_RELID, v_new);
  ELSE
    v_action := 'INSERT';
    v_old := NULL;
    v_new := to_jsonb(NEW);
    v_record_key := public.audit_row_record_key(TG_RELID, v_new);
  END IF;

  IF public.audit_should_skip_change(TG_TABLE_NAME, TG_OP, v_old, v_new) THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  PERFORM api.record_audit_event(
    p_action => v_action,
    p_actor_user_id => v_actor_user_id,
    p_table_name => TG_TABLE_NAME,
    p_record_key => v_record_key,
    p_old_data => v_old,
    p_new_data => v_new
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

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

  RETURN json_build_object(
    'ok', true,
    'current_year', v_current_year,
    'window_start', v_today - 2,
    'window_end', v_today + 2,
    'events_updated', v_updated,
    'events', v_events
  );
EXCEPTION
  WHEN OTHERS THEN
    PERFORM api.set_skip_row_audit(false);
    RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION api.run_demo_event_active_window()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor text;
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  v_actor := api.current_username();
  IF v_actor IS NOT NULL AND btrim(v_actor) <> '' THEN
    PERFORM api.set_audit_actor(v_actor);
  END IF;

  RETURN api.demo_event_active_window_core();
END;
$$;

GRANT EXECUTE ON FUNCTION api.set_skip_row_audit(boolean) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
