-- Admin RPCs to list and manually run maintenance scheduler jobs.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/117_admin_scheduled_tasks.sql

\connect event_system_pro

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
      j.enabled,
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
        WHEN j.enabled IS NOT TRUE THEN 'disabled'
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
  v_result json;
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

  v_result := api.run_maintenance_job(v_job_name);

  RETURN (
    v_result::jsonb || jsonb_build_object(
      'triggered_by', v_username,
      'manual', true
    )
  )::json;
END;
$$;

REVOKE ALL ON FUNCTION api.list_scheduled_tasks() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.run_scheduled_task(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.list_scheduled_tasks() TO authenticated;
GRANT EXECUTE ON FUNCTION api.run_scheduled_task(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
