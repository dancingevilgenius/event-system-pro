-- Rotate 10% of Robot Riot 2026 demo attendees each minute (scheduler interval job).
-- Replaces user_id in place so reserved demo attendee_id slots stay intact.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/108_robot_riot_attendee_churn.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.robot_riot_attendee_churn()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_event_id bigint;
  v_event_name text := 'Robot Riot 2026';
  v_attendee_count integer;
  v_remove integer;
  v_replaced integer := 0;
  v_available integer;
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('robot_riot_attendee_churn')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

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
      'event_name', v_event_name
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
      'attendee_count', v_attendee_count
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
    'replaced', v_replaced
  );
END;
$$;

REVOKE ALL ON FUNCTION api.robot_riot_attendee_churn() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.robot_riot_attendee_churn() TO maintenance;

-- Job row is created ephemerally by api.start_robot_riot_attendee_churn (migration 109)
-- and deleted when the timed window expires.

NOTIFY pgrst, 'reload schema';
