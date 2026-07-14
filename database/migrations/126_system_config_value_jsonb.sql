-- Convert public.system_config.value from varchar to jsonb so audit trail
-- (to_jsonb(row)) stores nested objects instead of escaped JSON strings.
-- Also unwrap value string values already recorded in audit_log.
-- Safe to re-run: only alters the column when it is not already jsonb.
--
--   psql -U postgres -d event_system_pro -f database/migrations/126_system_config_value_jsonb.sql

DROP VIEW IF EXISTS api.system_config;

CREATE OR REPLACE FUNCTION public.system_config_value_text(p_value jsonb)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_value IS NULL THEN NULL
    WHEN jsonb_typeof(p_value) = 'string' THEN p_value #>> '{}'
    WHEN jsonb_typeof(p_value) IN ('number', 'boolean') THEN p_value::text
    ELSE p_value::text
  END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_config'
      AND column_name = 'value'
      AND udt_name <> 'jsonb'
  ) THEN
    EXECUTE $sql$
      ALTER TABLE public.system_config
        ALTER COLUMN value DROP DEFAULT
    $sql$;

    EXECUTE $sql$
      ALTER TABLE public.system_config
        ALTER COLUMN value TYPE jsonb
        USING (
          CASE
            WHEN value IS NULL OR btrim(value::text) = '' THEN NULL
            WHEN NOT pg_input_is_valid(btrim(value::text), 'jsonb') THEN to_jsonb(btrim(value::text))
            WHEN jsonb_typeof(btrim(value::text)::jsonb) = 'string'
              AND pg_input_is_valid(btrim(value::text)::jsonb #>> '{}', 'jsonb')
              THEN (btrim(value::text)::jsonb #>> '{}')::jsonb
            ELSE btrim(value::text)::jsonb
          END
        )
    $sql$;
  END IF;
END
$$;

-- Historical audit rows captured varchar value as a JSON string
-- (extra escape characters in the UI). Promote those values to objects/scalars.
UPDATE public.audit_log AS a
SET
  old_data = CASE
    WHEN a.old_data IS NOT NULL
      AND jsonb_typeof(a.old_data -> 'value') = 'string'
      AND pg_input_is_valid(a.old_data ->> 'value', 'jsonb')
    THEN jsonb_set(
      a.old_data,
      '{value}',
      (a.old_data ->> 'value')::jsonb
    )
    ELSE a.old_data
  END,
  new_data = CASE
    WHEN a.new_data IS NOT NULL
      AND jsonb_typeof(a.new_data -> 'value') = 'string'
      AND pg_input_is_valid(a.new_data ->> 'value', 'jsonb')
    THEN jsonb_set(
      a.new_data,
      '{value}',
      (a.new_data ->> 'value')::jsonb
    )
    ELSE a.new_data
  END
WHERE a.table_name = 'system_config'
  AND (
    (
      a.old_data IS NOT NULL
      AND jsonb_typeof(a.old_data -> 'value') = 'string'
      AND pg_input_is_valid(a.old_data ->> 'value', 'jsonb')
    )
    OR (
      a.new_data IS NOT NULL
      AND jsonb_typeof(a.new_data -> 'value') = 'string'
      AND pg_input_is_valid(a.new_data ->> 'value', 'jsonb')
    )
  );

CREATE OR REPLACE VIEW api.system_config AS
SELECT
  system_config_id,
  label,
  value,
  active,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.system_config
WHERE active IS NOT FALSE;

GRANT SELECT ON api.system_config TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.notify_poc_counter_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.label = 'poc_counter'
     AND (TG_OP = 'INSERT' OR OLD.value IS DISTINCT FROM NEW.value) THEN
    PERFORM pg_notify(
      'system_config_poc_counter',
      public.system_config_value_text(NEW.value)
    );
  END IF;
  RETURN NEW;
END;
$$;

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

  SELECT s.modified_date, public.system_config_value_text(s.value)
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
      value = to_jsonb(0),
      modified_by = 'maintenance',
      modified_date = CURRENT_TIMESTAMP
    WHERE label = v_label
      AND active IS NOT FALSE;

    v_action := 'reset';
    v_value := '0';
  ELSE
    UPDATE public.system_config
    SET
      value = to_jsonb(
        COALESCE(NULLIF(public.system_config_value_text(value), ''), '0')::int + 1
      ),
      modified_by = 'maintenance',
      modified_date = CURRENT_TIMESTAMP
    WHERE label = v_label
      AND active IS NOT FALSE
    RETURNING public.system_config_value_text(value) INTO v_value;

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

  SELECT NULLIF(trim(public.system_config_value_text(s.value)), '')::timestamptz
  INTO v_until
  FROM public.system_config AS s
  WHERE s.label = 'robot_riot_attendee_churn_until'
    AND s.active IS NOT FALSE;

  IF v_until IS NULL OR v_now >= v_until THEN
    DELETE FROM maintenance.job_definition
    WHERE job_name = 'robot_riot_attendee_churn';

    UPDATE public.system_config
    SET
      value = NULL,
      modified_by = 'maintenance',
      modified_date = CURRENT_TIMESTAMP
    WHERE label = 'robot_riot_attendee_churn_until'
      AND active IS NOT FALSE
      AND value IS NOT NULL;

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
    value = to_jsonb(v_until::text),
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

NOTIFY pgrst, 'reload schema';
