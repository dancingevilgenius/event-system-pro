-- Admin RPC to update a maintenance job schedule (cron), clearing interval_seconds.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/122_set_scheduled_task_schedule.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.set_scheduled_task_schedule(
  p_job_name text,
  p_schedule_cron text,
  p_stale_after_interval text DEFAULT NULL
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
  v_cron text := btrim(COALESCE(p_schedule_cron, ''));
  v_stale_text text := NULLIF(btrim(COALESCE(p_stale_after_interval, '')), '');
  v_stale interval;
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

  IF v_cron = '' OR v_cron !~ '^[^ ]+ [^ ]+ [^ ]+ [^ ]+ [^ ]+$' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'schedule_cron must be a 5-field cron expression.'
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

  BEGIN
    IF v_stale_text IS NOT NULL THEN
      v_stale := v_stale_text::interval;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'stale_after_interval is not a valid interval.'
    );
  END;

  PERFORM api.set_audit_actor(v_username);

  UPDATE maintenance.job_definition AS d
  SET
    schedule_cron = v_cron,
    interval_seconds = NULL,
    stale_after_interval = COALESCE(v_stale, d.stale_after_interval),
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
    'schedule_cron', v_cron,
    'interval_seconds', NULL,
    'message', format('Schedule for %s updated.', v_job_name)
  );
END;
$$;

REVOKE ALL ON FUNCTION api.set_scheduled_task_schedule(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.set_scheduled_task_schedule(text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
