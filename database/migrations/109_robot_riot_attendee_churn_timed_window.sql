-- Admin-started Robot Riot attendee churn: run every minute for N minutes, then remove the job.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/109_robot_riot_attendee_churn_timed_window.sql

\connect event_system_pro

-- Ephemeral job: created by start RPC, deleted when the window expires.
DELETE FROM maintenance.job_definition
WHERE job_name = 'robot_riot_attendee_churn';

INSERT INTO public.system_config (label, value, active, created_by)
SELECT 'robot_riot_attendee_churn_until', NULL, true, 'c-agent'
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_config WHERE label = 'robot_riot_attendee_churn_until'
);

-- Drop presence RPC if a prior draft of this migration created it.
DROP FUNCTION IF EXISTS api.touch_attendees_page_presence(bigint);

CREATE OR REPLACE FUNCTION api.robot_riot_attendee_churn()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_event_id bigint;
  v_event_name text := 'Robot Riot 2026';
  v_attendee_count integer;
  v_remove integer;
  v_replaced integer := 0;
  v_available integer;
  v_until timestamptz;
  v_now timestamptz := clock_timestamp();
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('robot_riot_attendee_churn')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  SELECT NULLIF(trim(s.value), '')::timestamptz
  INTO v_until
  FROM public.system_config AS s
  WHERE s.label = 'robot_riot_attendee_churn_until'
    AND s.active IS NOT FALSE;

  IF v_until IS NULL OR v_now >= v_until THEN
    DELETE FROM maintenance.job_definition
    WHERE job_name = 'robot_riot_attendee_churn';

    UPDATE public.system_config
    SET
      value = '',
      modified_by = 'maintenance',
      modified_date = CURRENT_TIMESTAMP
    WHERE label = 'robot_riot_attendee_churn_until'
      AND active IS NOT FALSE
      AND NULLIF(trim(value), '') IS NOT NULL;

    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', CASE WHEN v_until IS NULL THEN 'not_started' ELSE 'window_expired' END,
      'cleaned_up', true,
      'until', v_until
    );
  END IF;

  SELECT e.event_id
  INTO v_event_id
  FROM public."event" AS e
  WHERE e.event_group_code = 'ROBOT_RIOT'
    AND e.name = v_event_name
  ORDER BY e.event_id
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'skipped', false,
      'error_message', format('Event not found: %s', v_event_name)
    );
  END IF;

  SELECT count(*)::integer
  INTO v_attendee_count
  FROM public.attendee AS a
  WHERE a.event_id = v_event_id;

  IF v_attendee_count = 0 THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'no_attendees',
      'event_id', v_event_id,
      'event_name', v_event_name,
      'until', v_until
    );
  END IF;

  v_remove := GREATEST(1, floor(v_attendee_count * 0.10)::integer);

  SELECT count(*)::integer
  INTO v_available
  FROM public."user" AS u
  WHERE u.active IS NOT FALSE
    AND NOT EXISTS (
      SELECT 1
      FROM public.attendee AS a
      WHERE a.event_id = v_event_id
        AND a.user_id = u.user_id
    );

  IF v_available = 0 THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'no_replacement_users',
      'event_id', v_event_id,
      'event_name', v_event_name,
      'attendee_count', v_attendee_count,
      'until', v_until
    );
  END IF;

  v_remove := LEAST(v_remove, v_available);

  WITH to_replace AS (
    SELECT s.attendee_id, row_number() OVER () AS rn
    FROM (
      SELECT a.attendee_id
      FROM public.attendee AS a
      WHERE a.event_id = v_event_id
      ORDER BY random()
      LIMIT v_remove
    ) AS s
  ),
  replacements AS (
    SELECT s.user_id, row_number() OVER () AS rn
    FROM (
      SELECT u.user_id
      FROM public."user" AS u
      WHERE u.active IS NOT FALSE
        AND NOT EXISTS (
          SELECT 1
          FROM public.attendee AS a
          WHERE a.event_id = v_event_id
            AND a.user_id = u.user_id
        )
      ORDER BY random()
      LIMIT v_remove
    ) AS s
  ),
  paired AS (
    SELECT t.attendee_id, r.user_id
    FROM to_replace AS t
    INNER JOIN replacements AS r ON r.rn = t.rn
  )
  UPDATE public.attendee AS a
  SET
    user_id = p.user_id,
    modified_by = 'maintenance',
    modified_date = CURRENT_TIMESTAMP
  FROM paired AS p
  WHERE a.attendee_id = p.attendee_id;

  GET DIAGNOSTICS v_replaced = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'skipped', false,
    'event_id', v_event_id,
    'event_name', v_event_name,
    'attendee_count', v_attendee_count,
    'requested_remove', GREATEST(1, floor(v_attendee_count * 0.10)::integer),
    'replaced', v_replaced,
    'until', v_until
  );
END;
$$;

REVOKE ALL ON FUNCTION api.robot_riot_attendee_churn() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.robot_riot_attendee_churn() TO maintenance;

-- Admin button: open a timed window and register the interval job for the scheduler.
CREATE OR REPLACE FUNCTION api.start_robot_riot_attendee_churn(p_duration_minutes integer DEFAULT 10)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_minutes integer := COALESCE(p_duration_minutes, 10);
  v_until timestamptz;
  v_first json;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'You are not signed in.'
    );
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  IF v_minutes < 1 OR v_minutes > 60 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'duration_minutes must be between 1 and 60.'
    );
  END IF;

  SELECT u.username
  INTO v_username
  FROM public."user" AS u
  WHERE u.user_id = v_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Account not found.'
    );
  END IF;

  PERFORM api.set_audit_actor(v_username);

  v_until := date_trunc('second', clock_timestamp() + make_interval(mins => v_minutes));

  UPDATE public.system_config
  SET
    value = v_until::text,
    modified_by = v_username,
    modified_date = CURRENT_TIMESTAMP
  WHERE label = 'robot_riot_attendee_churn_until'
    AND active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'robot_riot_attendee_churn_until config row not found.'
    );
  END IF;

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
    'robot_riot_attendee_churn',
    'api',
    'robot_riot_attendee_churn',
    NULL,
    60,
    true,
    INTERVAL '3 minutes',
    format(
      'Timed Robot Riot 2026 attendee rotation (every 60s until %s).',
      v_until
    ),
    v_username
  )
  ON CONFLICT (job_name) DO UPDATE
  SET
    rpc_schema = EXCLUDED.rpc_schema,
    rpc_name = EXCLUDED.rpc_name,
    schedule_cron = EXCLUDED.schedule_cron,
    interval_seconds = EXCLUDED.interval_seconds,
    enabled = true,
    stale_after_interval = EXCLUDED.stale_after_interval,
    description = EXCLUDED.description,
    modified_date = CURRENT_TIMESTAMP,
    modified_by = v_username;

  -- First rotation immediately; scheduler continues every minute until expiry.
  v_first := api.robot_riot_attendee_churn();

  RETURN json_build_object(
    'ok', true,
    'message', format(
      'Robot Riot 2026 attendee rotation started for %s minute(s).',
      v_minutes
    ),
    'duration_minutes', v_minutes,
    'until', v_until,
    'first_run', v_first
  );
END;
$$;

REVOKE ALL ON FUNCTION api.start_robot_riot_attendee_churn(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.start_robot_riot_attendee_churn(integer) TO authenticated;

-- Soft-skip missing/disabled jobs so ephemeral cleanup does not error-spam scheduler loops.
CREATE OR REPLACE FUNCTION api.run_maintenance_job(p_job_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_job_name text := lower(trim(COALESCE(p_job_name, '')));
  v_def maintenance.job_definition%ROWTYPE;
  v_run_id bigint;
  v_result json;
  v_started timestamptz := clock_timestamp();
  v_status text;
  v_error text;
BEGIN
  IF v_job_name = '' THEN
    RETURN json_build_object(
      'ok', false,
      'status', 'error',
      'error_message', 'job_name is required'
    );
  END IF;

  SELECT *
  INTO v_def
  FROM maintenance.job_definition AS d
  WHERE d.job_name = v_job_name;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', true,
      'job_name', v_job_name,
      'status', 'skipped',
      'enabled', false,
      'result', json_build_object(
        'ok', true,
        'skipped', true,
        'reason', 'job_not_registered'
      )
    );
  END IF;

  IF v_def.enabled IS NOT TRUE THEN
    RETURN json_build_object(
      'ok', true,
      'job_name', v_job_name,
      'status', 'skipped',
      'enabled', false,
      'result', json_build_object(
        'ok', true,
        'skipped', true,
        'reason', 'job_disabled'
      )
    );
  END IF;

  INSERT INTO maintenance.job_run (
    job_name,
    started_at,
    status,
    created_by
  )
  VALUES (
    v_job_name,
    v_started,
    'running',
    'maintenance'
  )
  RETURNING job_run_id INTO v_run_id;

  BEGIN
    EXECUTE format('SELECT %I.%I()', v_def.rpc_schema, v_def.rpc_name)
      INTO v_result;

    IF COALESCE((v_result->>'skipped')::boolean, false) THEN
      v_status := 'skipped';
    ELSE
      v_status := 'ok';
    END IF;

    UPDATE maintenance.job_run
    SET
      finished_at = clock_timestamp(),
      status = v_status,
      result_json = v_result::jsonb,
      modified_date = clock_timestamp(),
      modified_by = 'maintenance'
    WHERE job_run_id = v_run_id;

    RETURN json_build_object(
      'ok', true,
      'job_name', v_job_name,
      'job_run_id', v_run_id,
      'status', v_status,
      'enabled', v_def.enabled,
      'result', v_result
    );
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_error = MESSAGE_TEXT;

    UPDATE maintenance.job_run
    SET
      finished_at = clock_timestamp(),
      status = 'error',
      error_message = v_error,
      modified_date = clock_timestamp(),
      modified_by = 'maintenance'
    WHERE job_run_id = v_run_id;

    RETURN json_build_object(
      'ok', false,
      'job_name', v_job_name,
      'job_run_id', v_run_id,
      'status', 'error',
      'error_message', v_error
    );
  END;
END;
$$;

REVOKE ALL ON FUNCTION api.run_maintenance_job(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.run_maintenance_job(text) TO maintenance;

NOTIFY pgrst, 'reload schema';
