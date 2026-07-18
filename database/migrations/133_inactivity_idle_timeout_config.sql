-- Configurable inactivity idle timeout (separate from job schedule frequency).
-- Frequency = how often inactivity_logout runs; idle timeout = how long without
-- last-activity before a session is marked inactive.
-- Default remains 600 seconds (10 minutes).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/133_inactivity_idle_timeout_config.sql

\connect event_system_pro

INSERT INTO public.system_config (label, value, active, created_by)
SELECT
  'inactivity_idle_timeout_seconds',
  '600'::jsonb,
  true,
  'c-agent'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.system_config AS s
  WHERE s.label = 'inactivity_idle_timeout_seconds'
);

UPDATE maintenance.job_definition
SET
  description = 'Mark signed-in users inactive after the configured idle timeout without last-activity. Schedule frequency is how often to check; idle timeout is configured separately on this task.',
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent'
WHERE job_name = 'inactivity_logout'
  AND (
    description IS DISTINCT FROM 'Mark signed-in users inactive after the configured idle timeout without last-activity. Schedule frequency is how often to check; idle timeout is configured separately on this task.'
  );

CREATE OR REPLACE FUNCTION api.inactivity_idle_timeout_seconds()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
  SELECT GREATEST(
    1,
    COALESCE(
      (
        SELECT NULLIF(public.system_config_value_text(s.value), '')::integer
        FROM public.system_config AS s
        WHERE s.label = 'inactivity_idle_timeout_seconds'
          AND s.active IS NOT FALSE
        LIMIT 1
      ),
      600
    )
  );
$$;

CREATE OR REPLACE FUNCTION api.inactivity_idle_interval()
RETURNS interval
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
  SELECT make_interval(secs => api.inactivity_idle_timeout_seconds());
$$;

CREATE OR REPLACE FUNCTION api.is_last_activity_stale(p_info json)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT
    p_info IS NOT NULL
    AND (p_info::jsonb ->> 'last-activity') IS NOT NULL
    AND api.parse_activity_timestamp(p_info::jsonb ->> 'last-activity')
        <= api.activity_timestamp() - api.inactivity_idle_interval();
$$;

CREATE OR REPLACE FUNCTION api.set_inactivity_idle_timeout_seconds(p_seconds integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_seconds integer := p_seconds;
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

  IF v_seconds IS NULL OR v_seconds < 1 OR v_seconds > 86400 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Idle timeout must be between 1 and 86400 seconds.'
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

  UPDATE public.system_config
  SET
    value = to_jsonb(v_seconds),
    active = true,
    modified_date = CURRENT_TIMESTAMP,
    modified_by = v_username
  WHERE label = 'inactivity_idle_timeout_seconds';

  IF NOT FOUND THEN
    INSERT INTO public.system_config (label, value, active, created_by)
    VALUES (
      'inactivity_idle_timeout_seconds',
      to_jsonb(v_seconds),
      true,
      v_username
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'idle_timeout_seconds', v_seconds,
    'message', format(
      'Inactivity idle timeout set to %s second%s.',
      v_seconds,
      CASE WHEN v_seconds = 1 THEN '' ELSE 's' END
    )
  );
END;
$$;

-- Expose idle_timeout_seconds on inactivity_logout rows for the admin UI.
CREATE OR REPLACE FUNCTION api.list_scheduled_tasks()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_tasks json;
  v_idle_timeout integer := api.inactivity_idle_timeout_seconds();
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
      CASE
        WHEN j.job_name = 'inactivity_logout' THEN v_idle_timeout
        ELSE NULL
      END AS idle_timeout_seconds,
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

REVOKE ALL ON FUNCTION api.inactivity_idle_timeout_seconds() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.inactivity_idle_interval() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.set_inactivity_idle_timeout_seconds(integer) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.inactivity_idle_timeout_seconds() TO authenticated, maintenance;
GRANT EXECUTE ON FUNCTION api.inactivity_idle_interval() TO authenticated, maintenance;
GRANT EXECUTE ON FUNCTION api.set_inactivity_idle_timeout_seconds(integer) TO authenticated;

NOTIFY pgrst, 'reload schema';
