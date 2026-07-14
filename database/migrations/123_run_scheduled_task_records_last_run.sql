-- Manual Run Now always records a job_run so last-run timestamps update.
-- Admin runs execute even when is_enabled is false (scheduler path still skips disabled jobs).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/123_run_scheduled_task_records_last_run.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.run_scheduled_task(p_job_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_job_name text := lower(trim(COALESCE(p_job_name, '')));
  v_def maintenance.job_definition%ROWTYPE;
  v_run_id bigint;
  v_result json;
  v_started timestamptz := clock_timestamp();
  v_finished timestamptz;
  v_status text;
  v_error text;
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

  SELECT *
  INTO v_def
  FROM maintenance.job_definition AS d
  WHERE d.job_name = v_job_name;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', format('Unknown job_name: %s', v_job_name)
    );
  END IF;

  PERFORM api.set_audit_actor(v_username);

  -- Always insert a run row at click time so Last run updates in DB and UI.
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
    v_username
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

    v_finished := clock_timestamp();

    UPDATE maintenance.job_run
    SET
      finished_at = v_finished,
      status = v_status,
      result_json = jsonb_build_object(
        'manual', true,
        'triggered_by', v_username,
        'result', COALESCE(v_result::jsonb, '{}'::jsonb)
      ),
      modified_date = v_finished,
      modified_by = v_username
    WHERE job_run_id = v_run_id;

    RETURN json_build_object(
      'ok', true,
      'job_name', v_job_name,
      'job_run_id', v_run_id,
      'status', v_status,
      'is_enabled', v_def.is_enabled,
      'manual', true,
      'triggered_by', v_username,
      'started_at', v_started,
      'finished_at', v_finished,
      'result', v_result
    );
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_error = MESSAGE_TEXT;
    v_finished := clock_timestamp();

    UPDATE maintenance.job_run
    SET
      finished_at = v_finished,
      status = 'error',
      error_message = v_error,
      result_json = jsonb_build_object(
        'manual', true,
        'triggered_by', v_username
      ),
      modified_date = v_finished,
      modified_by = v_username
    WHERE job_run_id = v_run_id;

    RETURN json_build_object(
      'ok', false,
      'job_name', v_job_name,
      'job_run_id', v_run_id,
      'status', 'error',
      'error_message', v_error,
      'manual', true,
      'triggered_by', v_username,
      'started_at', v_started,
      'finished_at', v_finished
    );
  END;
END;
$$;

REVOKE ALL ON FUNCTION api.run_scheduled_task(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.run_scheduled_task(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
