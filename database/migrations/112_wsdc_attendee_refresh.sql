-- Refresh WSDC registry info for attendees of in-progress / upcoming (3 months) events.
-- Scheduler shell script fetches HTTP; this migration provides prepare/apply/record RPCs.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/112_wsdc_attendee_refresh.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.events_in_progress_or_starting_within(
  p_within interval DEFAULT INTERVAL '3 months'
)
RETURNS SETOF public."event"
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT e.*
  FROM public."event" AS e
  WHERE e.active IS NOT FALSE
    AND e.start_date IS NOT NULL
    AND (
      (
        e.end_date IS NOT NULL
        AND clock_timestamp() BETWEEN e.start_date AND e.end_date
      )
      OR (
        e.start_date > clock_timestamp()
        AND e.start_date < clock_timestamp() + p_within
      )
    );
$$;

CREATE OR REPLACE FUNCTION api._wsdc_attendee_refresh_prepare()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_seed_user_id bigint;
  v_seed_username text := 'dancingevilgenius';
  v_events_count integer := 0;
  v_attendees_added integer := 0;
  v_targets json;
BEGIN
  PERFORM api.set_audit_actor('maintenance');

  SELECT u.user_id
  INTO v_seed_user_id
  FROM public."user" AS u
  WHERE lower(u.username) = lower(v_seed_username)
    AND u.active IS NOT FALSE
  ORDER BY u.user_id
  LIMIT 1;

  IF v_seed_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', format('Seed user %s was not found.', v_seed_username),
      'events_count', 0,
      'attendees_added', 0,
      'targets', '[]'::json
    );
  END IF;

  SELECT count(*)::integer
  INTO v_events_count
  FROM api.events_in_progress_or_starting_within(INTERVAL '3 months');

  INSERT INTO public.attendee (
    user_id,
    event_id,
    created_by,
    more_json
  )
  SELECT
    v_seed_user_id,
    e.event_id,
    'maintenance',
    jsonb_build_object('wsdc_refresh_seed', true)
  FROM api.events_in_progress_or_starting_within(INTERVAL '3 months') AS e
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.attendee AS a
    WHERE a.event_id = e.event_id
      AND a.user_id = v_seed_user_id
  );

  GET DIAGNOSTICS v_attendees_added = ROW_COUNT;

  SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.user_id), '[]'::json)
  INTO v_targets
  FROM (
    SELECT DISTINCT
      u.user_id,
      u.username,
      api.user_stored_wsdc_id(u.additional_info_json) AS wsdc_id
    FROM api.events_in_progress_or_starting_within(INTERVAL '3 months') AS e
    JOIN public.attendee AS a ON a.event_id = e.event_id
    JOIN public."user" AS u ON u.user_id = a.user_id
    WHERE u.active IS NOT FALSE
      AND api.user_stored_wsdc_id(u.additional_info_json) IS NOT NULL
  ) AS t;

  RETURN json_build_object(
    'ok', true,
    'message', format(
      'Prepared WSDC refresh for %s event(s); added %s seed attendee row(s).',
      v_events_count,
      v_attendees_added
    ),
    'events_count', v_events_count,
    'attendees_added', v_attendees_added,
    'seed_user_id', v_seed_user_id,
    'seed_username', v_seed_username,
    'target_count', json_array_length(v_targets),
    'targets', v_targets
  );
END;
$$;

-- Admin / UI: prepare event attendees and return WSDC refresh targets.
CREATE OR REPLACE FUNCTION api.prepare_wsdc_attendee_refresh()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to run WSDC attendee refresh.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Only an admin can run WSDC attendee refresh.');
  END IF;

  RETURN api._wsdc_attendee_refresh_prepare();
END;
$$;

-- Maintenance apply (no JWT). Used by the scheduler shell script.
CREATE OR REPLACE FUNCTION api.apply_user_wsdc_info_maintenance(
  p_user_id bigint,
  p_wsdc_id text,
  p_wsdc_info json DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_target_id bigint := p_user_id;
  v_wsdc_id text;
  v_info jsonb;
  v_wsdc jsonb;
  v_now timestamptz := CURRENT_TIMESTAMP;
BEGIN
  IF v_target_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'user_id is required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public."user" AS u
    WHERE u.user_id = v_target_id
      AND u.active IS NOT FALSE
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'User not found.');
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  SELECT COALESCE(u.additional_info_json, '{}'::json)::jsonb
  INTO v_info
  FROM public."user" AS u
  WHERE u.user_id = v_target_id;

  v_wsdc_id := api.normalize_wsdc_id(p_wsdc_id);

  IF v_wsdc_id IS NULL AND p_wsdc_info IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'WSDC id or info is required.');
  END IF;

  v_wsdc := api.build_user_wsdc_object(v_info, v_wsdc_id, p_wsdc_info);
  v_wsdc_id := api.normalize_wsdc_id(v_wsdc ->> 'wsdc_id');
  v_wsdc := v_wsdc || jsonb_build_object(
    'last_update_datetime',
    to_jsonb(api.format_wsdc_update_timestamp(v_now))
  );
  v_info := (v_info - 'wsdc_id') || jsonb_build_object('wsdc', v_wsdc);

  UPDATE public."user" AS u
  SET
    additional_info_json = v_info::json,
    modified_by = 'maintenance',
    modified_date = v_now
  WHERE u.user_id = v_target_id;

  RETURN json_build_object(
    'ok', true,
    'message', 'WSDC info saved.',
    'user_id', v_target_id,
    'wsdc_id', v_wsdc_id,
    'wsdc', v_info -> 'wsdc'
  );
END;
$$;

-- Record a completed job_run for the external (shell) WSDC refresh runner.
CREATE OR REPLACE FUNCTION api.record_maintenance_job_result(
  p_job_name text,
  p_result json,
  p_ok boolean DEFAULT true,
  p_error_message text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_job_name text := lower(trim(COALESCE(p_job_name, '')));
  v_run_id bigint;
  v_started timestamptz := clock_timestamp();
  v_status text;
BEGIN
  IF v_job_name = '' THEN
    RETURN json_build_object('ok', false, 'message', 'job_name is required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM maintenance.job_definition AS d WHERE d.job_name = v_job_name
  ) THEN
    RETURN json_build_object(
      'ok', false,
      'message', format('unknown job_name: %s', v_job_name)
    );
  END IF;

  v_status := CASE WHEN COALESCE(p_ok, false) THEN 'ok' ELSE 'error' END;

  INSERT INTO maintenance.job_run (
    job_name,
    started_at,
    finished_at,
    status,
    result_json,
    error_message,
    created_by,
    modified_date,
    modified_by
  )
  VALUES (
    v_job_name,
    v_started,
    clock_timestamp(),
    v_status,
    COALESCE(p_result, '{}'::json)::jsonb,
    NULLIF(btrim(COALESCE(p_error_message, '')), ''),
    'maintenance',
    clock_timestamp(),
    'maintenance'
  )
  RETURNING job_run_id INTO v_run_id;

  RETURN json_build_object(
    'ok', COALESCE(p_ok, false),
    'job_name', v_job_name,
    'job_run_id', v_run_id,
    'status', v_status,
    'result', p_result
  );
END;
$$;

-- SQL-only job entry (used if shell runner is unavailable): prepare targets only.
CREATE OR REPLACE FUNCTION api.wsdc_attendee_refresh()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_prepare json;
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('wsdc_attendee_refresh')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  v_prepare := api._wsdc_attendee_refresh_prepare();

  IF coalesce((v_prepare ->> 'ok')::boolean, false) IS NOT TRUE THEN
    RETURN v_prepare;
  END IF;

  RETURN json_build_object(
    'ok', true,
    'skipped', false,
    'events_count', v_prepare -> 'events_count',
    'attendees_added', v_prepare -> 'attendees_added',
    'target_count', v_prepare -> 'target_count',
    'users_updated', 0,
    'users_failed', 0,
    'message',
      'Prepared targets only. Registry HTTP refresh runs via /wsdc-attendee-refresh.sh.',
    'targets', v_prepare -> 'targets'
  );
END;
$$;

INSERT INTO maintenance.job_definition (
  job_name,
  rpc_schema,
  rpc_name,
  schedule_cron,
  interval_seconds,
  enabled,
  stale_after_interval,
  description,
  created_by
)
VALUES (
  'wsdc_attendee_refresh',
  'api',
  'wsdc_attendee_refresh',
  '0 3 * * *',
  NULL,
  true,
  INTERVAL '36 hours',
  'Refresh WSDC registry info for attendees of in-progress and next-3-month events.',
  'c-agent'
)
ON CONFLICT (job_name) DO UPDATE
SET
  rpc_schema = EXCLUDED.rpc_schema,
  rpc_name = EXCLUDED.rpc_name,
  schedule_cron = EXCLUDED.schedule_cron,
  interval_seconds = EXCLUDED.interval_seconds,
  enabled = EXCLUDED.enabled,
  stale_after_interval = EXCLUDED.stale_after_interval,
  description = EXCLUDED.description,
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent';

REVOKE ALL ON FUNCTION api.events_in_progress_or_starting_within(interval) FROM PUBLIC;
REVOKE ALL ON FUNCTION api._wsdc_attendee_refresh_prepare() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.prepare_wsdc_attendee_refresh() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.apply_user_wsdc_info_maintenance(bigint, text, json) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.record_maintenance_job_result(text, json, boolean, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.wsdc_attendee_refresh() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.events_in_progress_or_starting_within(interval) TO maintenance;
GRANT EXECUTE ON FUNCTION api._wsdc_attendee_refresh_prepare() TO maintenance;
GRANT EXECUTE ON FUNCTION api.apply_user_wsdc_info_maintenance(bigint, text, json) TO maintenance;
GRANT EXECUTE ON FUNCTION api.record_maintenance_job_result(text, json, boolean, text) TO maintenance;
GRANT EXECUTE ON FUNCTION api.wsdc_attendee_refresh() TO maintenance;

GRANT EXECUTE ON FUNCTION api.prepare_wsdc_attendee_refresh() TO authenticated;

NOTIFY pgrst, 'reload schema';
