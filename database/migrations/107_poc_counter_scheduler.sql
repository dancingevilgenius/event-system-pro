-- Drive POC counter ticks from the maintenance scheduler (every 10 seconds).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/107_poc_counter_scheduler.sql

\connect event_system_pro

-- Allow either cron schedule OR sub-minute interval (not both).
ALTER TABLE maintenance.job_definition
  ALTER COLUMN schedule_cron DROP NOT NULL;

ALTER TABLE maintenance.job_definition
  ADD COLUMN IF NOT EXISTS interval_seconds integer NULL;

ALTER TABLE maintenance.job_definition
  DROP CONSTRAINT IF EXISTS job_definition_schedule_cron_check;

ALTER TABLE maintenance.job_definition
  DROP CONSTRAINT IF EXISTS job_definition_schedule_mode_check;

ALTER TABLE maintenance.job_definition
  ADD CONSTRAINT job_definition_schedule_mode_check CHECK (
    (
      schedule_cron IS NOT NULL
      AND interval_seconds IS NULL
      AND schedule_cron ~ '^[^ ]+ [^ ]+ [^ ]+ [^ ]+ [^ ]+$'
    )
    OR (
      schedule_cron IS NULL
      AND interval_seconds IS NOT NULL
      AND interval_seconds > 0
    )
  );

COMMENT ON COLUMN maintenance.job_definition.interval_seconds IS
  'When set, scheduler-entrypoint runs a sleep loop (sub-minute jobs). Mutually exclusive with schedule_cron.';

-- Tick RPC: increment poc_counter, or reset to 0 on America/Chicago hour boundary.
CREATE OR REPLACE FUNCTION api.poc_counter_tick()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_label text := 'poc_counter';
  v_modified timestamptz;
  v_value text;
  v_action text;
  v_tz text := 'America/Chicago';
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('poc_counter_tick')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  SELECT s.modified_date, s.value
  INTO v_modified, v_value
  FROM public.system_config AS s
  WHERE s.label = v_label
    AND s.active IS NOT FALSE
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'skipped', false,
      'error_message', 'poc_counter row not found'
    );
  END IF;

  IF date_trunc('hour', clock_timestamp() AT TIME ZONE v_tz)
       > date_trunc('hour', COALESCE(v_modified, '-infinity'::timestamptz) AT TIME ZONE v_tz)
  THEN
    UPDATE public.system_config
    SET
      value = '0',
      modified_by = 'maintenance',
      modified_date = CURRENT_TIMESTAMP
    WHERE label = v_label
      AND active IS NOT FALSE;

    v_action := 'reset';
    v_value := '0';
  ELSE
    UPDATE public.system_config
    SET
      value = (COALESCE(NULLIF(value, ''), '0')::int + 1)::text,
      modified_by = 'maintenance',
      modified_date = CURRENT_TIMESTAMP
    WHERE label = v_label
      AND active IS NOT FALSE
    RETURNING value INTO v_value;

    v_action := 'increment';
  END IF;

  RETURN json_build_object(
    'ok', true,
    'skipped', false,
    'action', v_action,
    'value', v_value
  );
END;
$$;

REVOKE ALL ON FUNCTION api.poc_counter_tick() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.poc_counter_tick() TO maintenance;

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
  'poc_counter_tick',
  'api',
  'poc_counter_tick',
  NULL,
  10,
  true,
  INTERVAL '30 seconds',
  'Increment admin-home POC counter every 10 seconds (reset each America/Chicago hour).',
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

-- Crontab only includes cron-scheduled jobs (not interval loops).
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
    '# Generated from maintenance.job_definition (enabled cron rows).' || E'\n'
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
  WHERE d.enabled IS TRUE
    AND d.schedule_cron IS NOT NULL;

  RETURN v_body;
END;
$$;

-- Interval jobs for scheduler-entrypoint sleep loops: "job_name\tseconds" per line.
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
  WHERE d.enabled IS TRUE
    AND d.interval_seconds IS NOT NULL;

  RETURN COALESCE(v_body, '');
END;
$$;

REVOKE ALL ON FUNCTION api.scheduler_crontab() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.scheduler_interval_jobs() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.scheduler_crontab() TO maintenance;
GRANT EXECUTE ON FUNCTION api.scheduler_interval_jobs() TO maintenance;

-- realtime service is broadcast-only now (NOTIFY → WebSocket).
REVOKE UPDATE ON public.system_config FROM realtime;
GRANT SELECT ON public.system_config TO realtime;

NOTIFY pgrst, 'reload schema';
