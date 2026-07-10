-- Phase 2 scheduler hardening: job_run history, advisory locks, run wrapper, health check.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/105_maintenance_job_runs.sql

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maintenance') THEN
    CREATE ROLE maintenance NOLOGIN;
  END IF;
END $$;

CREATE SCHEMA IF NOT EXISTS maintenance;
COMMENT ON SCHEMA maintenance IS 'Internal scheduled-job history; not exposed via PostgREST.';

CREATE TABLE IF NOT EXISTS maintenance.job_run (
  job_run_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_name varchar(64) NOT NULL,
  started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at timestamptz NULL,
  status varchar(16) NOT NULL,
  result_json jsonb NULL,
  error_message text NULL,
  created_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL,
  modified_date timestamptz NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL,
  CONSTRAINT job_run_status_check CHECK (status IN ('running', 'ok', 'error', 'skipped'))
);

CREATE INDEX IF NOT EXISTS job_run_job_name_started_at_idx
  ON maintenance.job_run (job_name, started_at DESC);

COMMENT ON TABLE maintenance.job_run IS
  'One row per maintenance job invocation (cron or manual).';

-- Namespace for advisory locks: key1 = 901001 (maintenance jobs), key2 = hashtext(job_name).
CREATE OR REPLACE FUNCTION api.nightly_cleanup()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_shifted integer;
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('nightly_cleanup')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  UPDATE public."event" AS e
  SET
    start_date = e.start_date + INTERVAL '1 day',
    end_date = e.end_date + INTERVAL '1 day'
  FROM public.event_group AS g
  WHERE e.event_group_code = g.event_group_code
    AND COALESCE((g.more_json->>'demo')::boolean, false) = true
    AND e.start_date IS NOT NULL
    AND e.end_date IS NOT NULL;

  GET DIAGNOSTICS v_shifted = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'skipped', false,
    'demo_events_shifted', v_shifted
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.inactivity_logout()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_marked integer;
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('inactivity_logout')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  UPDATE public."user" AS u
  SET additional_info_json = (
    COALESCE(u.additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object('inactive_logout_at', to_jsonb(api.activity_timestamp()))
  )::json
  WHERE u.active IS NOT FALSE
    AND (u.additional_info_json::jsonb ->> 'last_login_at') IS NOT NULL
    AND api.user_session_is_active(u.additional_info_json)
    AND api.is_last_activity_stale(u.additional_info_json);

  GET DIAGNOSTICS v_marked = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'skipped', false,
    'inactive_sessions_marked', v_marked
  );
END;
$$;

-- Records job_run history, then invokes the named maintenance RPC.
-- On job failure, records status=error and returns ok:false (does not re-raise),
-- so the history row commits.
CREATE OR REPLACE FUNCTION api.run_maintenance_job(p_job_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance
AS $$
DECLARE
  v_job_name text := lower(trim(COALESCE(p_job_name, '')));
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

  IF v_job_name NOT IN ('nightly_cleanup', 'inactivity_logout') THEN
    RETURN json_build_object(
      'ok', false,
      'status', 'error',
      'error_message', format('unknown job_name: %s', v_job_name)
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
    IF v_job_name = 'nightly_cleanup' THEN
      v_result := api.nightly_cleanup();
    ELSE
      v_result := api.inactivity_logout();
    END IF;

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

-- Stale-job / last-run summary for ops (not a public HTTP health endpoint).
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
      j.max_age_interval,
      lr.job_run_id AS last_job_run_id,
      lr.status AS last_status,
      lr.started_at AS last_started_at,
      lr.finished_at AS last_finished_at,
      lr.error_message AS last_error_message,
      CASE
        WHEN lr.job_run_id IS NULL THEN true
        WHEN lr.status = 'error' THEN true
        WHEN lr.status IN ('ok', 'skipped')
          AND lr.finished_at < clock_timestamp() - j.max_age_interval THEN true
        ELSE false
      END AS stale,
      CASE
        WHEN lr.job_run_id IS NULL THEN 'never_run'
        WHEN lr.status = 'error' THEN 'last_run_error'
        WHEN lr.status IN ('ok', 'skipped')
          AND lr.finished_at < clock_timestamp() - j.max_age_interval THEN 'stale_success'
        WHEN lr.status = 'running' THEN 'running'
        ELSE 'ok'
      END AS health
    FROM (
      VALUES
        ('inactivity_logout', INTERVAL '15 minutes'),
        ('nightly_cleanup', INTERVAL '25 hours')
    ) AS j(job_name, max_age_interval)
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

REVOKE ALL ON FUNCTION api.nightly_cleanup() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.inactivity_logout() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.run_maintenance_job(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_health() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.nightly_cleanup() TO maintenance;
GRANT EXECUTE ON FUNCTION api.inactivity_logout() TO maintenance;
GRANT EXECUTE ON FUNCTION api.run_maintenance_job(text) TO maintenance;
GRANT EXECUTE ON FUNCTION api.scheduler_health() TO maintenance;

GRANT maintenance TO postgres;

NOTIFY pgrst, 'reload schema';
