-- Idle timeout for inactivity_logout equals the job's schedule period
-- (interval_seconds, or the inferred period of schedule_cron).
-- Frequency is the idle window — not a separate knob.
-- Default schedule is */10 * * * * so the idle window stays 10 minutes.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/133_inactivity_idle_timeout_config.sql

\connect event_system_pro

-- Preserve the historical ~10 minute idle window for the default job.
UPDATE maintenance.job_definition
SET
  schedule_cron = '*/10 * * * *',
  interval_seconds = NULL,
  description = 'Mark signed-in users inactive when last-activity is older than this task''s schedule period (frequency = idle window).',
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent'
WHERE job_name = 'inactivity_logout'
  AND schedule_cron = '*/5 * * * *'
  AND interval_seconds IS NULL;

UPDATE maintenance.job_definition
SET
  description = 'Mark signed-in users inactive when last-activity is older than this task''s schedule period (frequency = idle window).',
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent'
WHERE job_name = 'inactivity_logout'
  AND description IS DISTINCT FROM 'Mark signed-in users inactive when last-activity is older than this task''s schedule period (frequency = idle window).';

CREATE OR REPLACE FUNCTION api.schedule_period_seconds(
  p_schedule_cron text,
  p_interval_seconds integer
)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, api
AS $$
DECLARE
  v_parts text[];
  v_min text;
  v_hour text;
  v_dom text;
  v_mon text;
  v_dow text;
  v_n integer;
BEGIN
  IF p_interval_seconds IS NOT NULL AND p_interval_seconds > 0 THEN
    RETURN p_interval_seconds;
  END IF;

  IF p_schedule_cron IS NULL OR btrim(p_schedule_cron) = '' THEN
    RETURN NULL;
  END IF;

  v_parts := regexp_split_to_array(btrim(p_schedule_cron), '\s+');
  IF coalesce(array_length(v_parts, 1), 0) <> 5 THEN
    RETURN NULL;
  END IF;

  v_min := v_parts[1];
  v_hour := v_parts[2];
  v_dom := v_parts[3];
  v_mon := v_parts[4];
  v_dow := v_parts[5];

  -- Once a minute: * * * * *
  IF v_min = '*' AND v_hour = '*' AND v_dom = '*' AND v_mon = '*' AND v_dow = '*' THEN
    RETURN 60;
  END IF;

  -- Every N minutes: */N * * * *
  IF v_min ~ '^\*/[0-9]+$'
     AND v_hour = '*'
     AND v_dom = '*'
     AND v_mon = '*'
     AND v_dow = '*' THEN
    v_n := substring(v_min FROM 3)::integer;
    IF v_n > 0 THEN
      RETURN v_n * 60;
    END IF;
  END IF;

  -- Once an hour: M * * * *
  IF v_min ~ '^[0-9]+$'
     AND v_hour = '*'
     AND v_dom = '*'
     AND v_mon = '*'
     AND v_dow = '*' THEN
    RETURN 3600;
  END IF;

  -- Once a day: M H * * *
  IF v_min ~ '^[0-9]+$'
     AND v_hour ~ '^[0-9]+$'
     AND v_dom = '*'
     AND v_mon = '*'
     AND v_dow = '*' THEN
    RETURN 86400;
  END IF;

  -- Once a week: M H * * D
  IF v_min ~ '^[0-9]+$'
     AND v_hour ~ '^[0-9]+$'
     AND v_dom = '*'
     AND v_mon = '*'
     AND v_dow ~ '^[0-9]+$' THEN
    RETURN 604800;
  END IF;

  -- Once a year: M H D Mo *
  IF v_min ~ '^[0-9]+$'
     AND v_hour ~ '^[0-9]+$'
     AND v_dom ~ '^[0-9]+$'
     AND v_mon ~ '^[0-9]+$'
     AND v_dow = '*' THEN
    RETURN 31536000;
  END IF;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION api.inactivity_idle_timeout_seconds()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
  SELECT GREATEST(
    1,
    COALESCE(
      (
        SELECT api.schedule_period_seconds(d.schedule_cron, d.interval_seconds)
        FROM maintenance.job_definition AS d
        WHERE d.job_name = 'inactivity_logout'
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

-- Drop the short-lived separate setter from earlier drafts of this migration if present.
DROP FUNCTION IF EXISTS api.set_inactivity_idle_timeout_seconds(integer);

-- Expose derived idle_timeout_seconds on inactivity_logout for the admin UI.
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
      CASE
        WHEN j.job_name = 'inactivity_logout' THEN
          api.schedule_period_seconds(j.schedule_cron, j.interval_seconds)
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

REVOKE ALL ON FUNCTION api.schedule_period_seconds(text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.inactivity_idle_timeout_seconds() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.inactivity_idle_interval() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.schedule_period_seconds(text, integer) TO authenticated, maintenance;
GRANT EXECUTE ON FUNCTION api.inactivity_idle_timeout_seconds() TO authenticated, maintenance;
GRANT EXECUTE ON FUNCTION api.inactivity_idle_interval() TO authenticated, maintenance;

NOTIFY pgrst, 'reload schema';
