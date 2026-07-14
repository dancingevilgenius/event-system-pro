-- Rename maintenance.job_definition.enabled → is_enabled; admin toggle RPC.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/121_job_definition_is_enabled.sql

\connect event_system_pro

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'maintenance'
      AND table_name = 'job_definition'
      AND column_name = 'enabled'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'maintenance'
      AND table_name = 'job_definition'
      AND column_name = 'is_enabled'
  ) THEN
    ALTER TABLE maintenance.job_definition
      RENAME COLUMN enabled TO is_enabled;
  END IF;
END $$;

COMMENT ON COLUMN maintenance.job_definition.is_enabled IS
  'When false, the scheduler skips this job (crontab / interval loops and run_maintenance_job).';

-- Keep existing rows enabled; default for any future inserts that omit the column.
ALTER TABLE maintenance.job_definition
  ALTER COLUMN is_enabled SET DEFAULT true;

UPDATE maintenance.job_definition
SET is_enabled = true
WHERE is_enabled IS NULL;

ALTER TABLE maintenance.job_definition
  ALTER COLUMN is_enabled SET NOT NULL;

CREATE OR REPLACE FUNCTION api.scheduler_crontab()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_body text;
BEGIN
  SELECT
    '# Generated from maintenance.job_definition (is_enabled cron rows).' || E'\n'
    || '# Times use the container TZ (default America/Chicago).' || E'\n'
    || 'MAILTO=""' || E'\n'
    || COALESCE(
      string_agg(
        d.schedule_cron || ' /run-maintenance-job.sh ' || d.job_name,
        E'\n'
        ORDER BY d.job_name
      ),
      ''
    )
    || E'\n'
  INTO v_body
  FROM maintenance.job_definition AS d
  WHERE d.is_enabled IS TRUE
    AND d.schedule_cron IS NOT NULL;

  RETURN v_body;
END;
$$;

CREATE OR REPLACE FUNCTION api.scheduler_interval_jobs()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_body text;
BEGIN
  SELECT COALESCE(
    string_agg(d.job_name || E'\t' || d.interval_seconds::text, E'\n' ORDER BY d.job_name),
    ''
  )
  INTO v_body
  FROM maintenance.job_definition AS d
  WHERE d.is_enabled IS TRUE
    AND d.interval_seconds IS NOT NULL;

  RETURN COALESCE(v_body, '');
END;
$$;

CREATE OR REPLACE FUNCTION api.scheduler_health()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_jobs json;
  v_ok boolean := true;
BEGIN
  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.job_name), '[]'::json)
  INTO v_jobs
  FROM (
    SELECT
      j.job_name,
      j.is_enabled,
      j.schedule_cron,
      j.stale_after_interval AS max_age_interval,
      lr.job_run_id AS last_job_run_id,
      lr.status AS last_status,
      lr.started_at AS last_started_at,
      lr.finished_at AS last_finished_at,
      lr.error_message AS last_error_message,
      CASE
        WHEN j.is_enabled IS NOT TRUE THEN false
        WHEN lr.job_run_id IS NULL THEN true
        WHEN lr.status = 'error' THEN true
        WHEN lr.status IN ('ok', 'skipped')
          AND lr.finished_at < clock_timestamp() - j.stale_after_interval THEN true
        ELSE false
      END AS stale,
      CASE
        WHEN j.is_enabled IS NOT TRUE THEN 'disabled'
        WHEN lr.job_run_id IS NULL THEN 'never_run'
        WHEN lr.status = 'error' THEN 'last_run_error'
        WHEN lr.status IN ('ok', 'skipped')
          AND lr.finished_at < clock_timestamp() - j.stale_after_interval THEN 'stale_success'
        WHEN lr.status = 'running' THEN 'running'
        ELSE 'ok'
      END AS health
    FROM maintenance.job_definition AS j
    LEFT JOIN LATERAL (
      SELECT r.job_run_id, r.status, r.started_at, r.finished_at, r.error_message
      FROM maintenance.job_run AS r
      WHERE r.job_name = j.job_name
      ORDER BY r.started_at DESC, r.job_run_id DESC
      LIMIT 1
    ) AS lr ON true
  ) AS x;

  SELECT NOT COALESCE(bool_or((elem->>'stale')::boolean), false)
  INTO v_ok
  FROM json_array_elements(v_jobs) AS elem;

  RETURN json_build_object(
    'ok', v_ok,
    'checked_at', date_trunc('second', clock_timestamp()),
    'jobs', v_jobs
  );
END;
$$;

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
      'is_enabled', false,
      'result', json_build_object(
        'ok', true,
        'skipped', true,
        'reason', 'job_not_registered'
      )
    );
  END IF;

  IF v_def.is_enabled IS NOT TRUE THEN
    RETURN json_build_object(
      'ok', true,
      'job_name', v_job_name,
      'status', 'skipped',
      'is_enabled', false,
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
      'is_enabled', v_def.is_enabled,
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
    is_enabled,
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
    is_enabled = true,
    stale_after_interval = EXCLUDED.stale_after_interval,
    description = EXCLUDED.description,
    modified_date = CURRENT_TIMESTAMP,
    modified_by = v_username;

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

CREATE OR REPLACE FUNCTION api.list_scheduled_tasks()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_tasks json;
BEGIN
  IF api.current_user_id() IS NULL THEN
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

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.job_name), '[]'::json)
  INTO v_tasks
  FROM (
    SELECT
      j.job_name,
      j.description,
      j.rpc_schema,
      j.rpc_name,
      j.schedule_cron,
      j.interval_seconds,
      j.is_enabled,
      CASE
        WHEN j.interval_seconds IS NOT NULL THEN
          format('Every %s second%s', j.interval_seconds, CASE WHEN j.interval_seconds = 1 THEN '' ELSE 's' END)
        ELSE j.schedule_cron
      END AS schedule_label,
      lr.job_run_id AS last_job_run_id,
      lr.status AS last_status,
      lr.started_at AS last_started_at,
      lr.finished_at AS last_finished_at,
      lr.error_message AS last_error_message,
      CASE
        WHEN j.is_enabled IS NOT TRUE THEN 'disabled'
        WHEN lr.job_run_id IS NULL THEN 'never_run'
        WHEN lr.status = 'error' THEN 'last_run_error'
        WHEN lr.status IN ('ok', 'skipped')
          AND lr.finished_at < clock_timestamp() - j.stale_after_interval THEN 'stale_success'
        WHEN lr.status = 'running' THEN 'running'
        ELSE 'ok'
      END AS health
    FROM maintenance.job_definition AS j
    LEFT JOIN LATERAL (
      SELECT
        r.job_run_id,
        r.status,
        r.started_at,
        r.finished_at,
        r.error_message
      FROM maintenance.job_run AS r
      WHERE r.job_name = j.job_name
      ORDER BY r.started_at DESC, r.job_run_id DESC
      LIMIT 1
    ) AS lr ON true
  ) AS x;

  RETURN json_build_object(
    'ok', true,
    'tasks', v_tasks
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.set_scheduled_task_enabled(
  p_job_name text,
  p_is_enabled boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_job_name text := lower(trim(COALESCE(p_job_name, '')));
  v_is_enabled boolean := COALESCE(p_is_enabled, false);
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

  IF v_job_name = '' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'job_name is required.'
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

  UPDATE maintenance.job_definition AS d
  SET
    is_enabled = v_is_enabled,
    modified_date = CURRENT_TIMESTAMP,
    modified_by = v_username
  WHERE d.job_name = v_job_name;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', format('Unknown job_name: %s', v_job_name)
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'job_name', v_job_name,
    'is_enabled', v_is_enabled,
    'message', CASE
      WHEN v_is_enabled THEN format('%s is enabled.', v_job_name)
      ELSE format('%s is disabled.', v_job_name)
    END
  );
END;
$$;

REVOKE ALL ON FUNCTION api.scheduler_crontab() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_interval_jobs() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_health() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.run_maintenance_job(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.start_robot_riot_attendee_churn(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.list_scheduled_tasks() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.set_scheduled_task_enabled(text, boolean) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.scheduler_crontab() TO maintenance;
GRANT EXECUTE ON FUNCTION api.scheduler_interval_jobs() TO maintenance;
GRANT EXECUTE ON FUNCTION api.scheduler_health() TO maintenance;
GRANT EXECUTE ON FUNCTION api.run_maintenance_job(text) TO maintenance;
GRANT EXECUTE ON FUNCTION api.start_robot_riot_attendee_churn(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION api.list_scheduled_tasks() TO authenticated;
GRANT EXECUTE ON FUNCTION api.set_scheduled_task_enabled(text, boolean) TO authenticated;

NOTIFY pgrst, 'reload schema';
