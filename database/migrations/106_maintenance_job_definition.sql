-- Phase 3 scheduler foundation: job_definition registry, dynamic dispatch, crontab export.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/106_maintenance_job_definition.sql

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maintenance') THEN
    CREATE ROLE maintenance NOLOGIN;
  END IF;
END $$;

CREATE SCHEMA IF NOT EXISTS maintenance;

CREATE TABLE IF NOT EXISTS maintenance.job_definition (
  job_name varchar(64) PRIMARY KEY,
  rpc_schema varchar(64) NOT NULL DEFAULT 'api',
  rpc_name varchar(128) NOT NULL,
  schedule_cron varchar(64) NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  stale_after_interval interval NOT NULL,
  timeout_seconds integer NULL,
  description text NULL,
  created_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL,
  modified_date timestamptz NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL,
  CONSTRAINT job_definition_rpc_schema_check CHECK (rpc_schema ~ '^[a-z_][a-z0-9_]*$'),
  CONSTRAINT job_definition_rpc_name_check CHECK (rpc_name ~ '^[a-z_][a-z0-9_]*$'),
  CONSTRAINT job_definition_job_name_check CHECK (job_name ~ '^[a-z][a-z0-9_]*$'),
  CONSTRAINT job_definition_schedule_cron_check CHECK (
    schedule_cron ~ '^[^ ]+ [^ ]+ [^ ]+ [^ ]+ [^ ]+$'
  ),
  CONSTRAINT job_definition_timeout_check CHECK (
    timeout_seconds IS NULL OR timeout_seconds > 0
  )
);

COMMENT ON TABLE maintenance.job_definition IS
  'Registry of scheduled maintenance jobs. Enabled rows drive crontab generation.';

INSERT INTO maintenance.job_definition (
  job_name,
  rpc_schema,
  rpc_name,
  schedule_cron,
  enabled,
  stale_after_interval,
  description,
  created_by
)
VALUES
  (
    'inactivity_logout',
    'api',
    'inactivity_logout',
    '*/5 * * * *',
    true,
    INTERVAL '15 minutes',
    'Mark inactive signed-in users for forced sign-out.',
    'c-agent'
  ),
  (
    'nightly_cleanup',
    'api',
    'nightly_cleanup',
    '0 0 * * *',
    true,
    INTERVAL '25 hours',
    'Shift demo event start/end dates forward one day.',
    'c-agent'
  )
ON CONFLICT (job_name) DO UPDATE
SET
  rpc_schema = EXCLUDED.rpc_schema,
  rpc_name = EXCLUDED.rpc_name,
  schedule_cron = EXCLUDED.schedule_cron,
  enabled = EXCLUDED.enabled,
  stale_after_interval = EXCLUDED.stale_after_interval,
  description = EXCLUDED.description,
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent';

-- Dynamic dispatch from job_definition (no-arg SECURITY DEFINER RPCs returning json).
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

-- Crontab body for the scheduler container (enabled jobs only).
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
    '# Generated from maintenance.job_definition (enabled rows).' || E'\n'
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
  WHERE d.enabled IS TRUE;

  RETURN v_body;
END;
$$;

-- Stale-job / last-run summary driven by job_definition.
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
      j.enabled,
      j.schedule_cron,
      j.stale_after_interval AS max_age_interval,
      lr.job_run_id AS last_job_run_id,
      lr.status AS last_status,
      lr.started_at AS last_started_at,
      lr.finished_at AS last_finished_at,
      lr.error_message AS last_error_message,
      CASE
        WHEN j.enabled IS NOT TRUE THEN false
        WHEN lr.job_run_id IS NULL THEN true
        WHEN lr.status = 'error' THEN true
        WHEN lr.status IN ('ok', 'skipped')
          AND lr.finished_at < clock_timestamp() - j.stale_after_interval THEN true
        ELSE false
      END AS stale,
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

REVOKE ALL ON FUNCTION api.run_maintenance_job(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_crontab() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_health() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.run_maintenance_job(text) TO maintenance;
GRANT EXECUTE ON FUNCTION api.scheduler_crontab() TO maintenance;
GRANT EXECUTE ON FUNCTION api.scheduler_health() TO maintenance;

GRANT maintenance TO postgres;

NOTIFY pgrst, 'reload schema';
