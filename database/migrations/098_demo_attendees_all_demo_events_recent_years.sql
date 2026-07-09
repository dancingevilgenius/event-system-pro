-- Generate demo attendees for every demo event in current_year and current_year - 1.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/098_demo_attendees_all_demo_events_recent_years.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.generate_demo_attendees_core()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  ev RECORD;
  event_tz CONSTANT TEXT := 'America/Chicago';
  attendees_per_event CONSTANT INT := 200;
  current_year INT := extract(year from (CURRENT_TIMESTAMP AT TIME ZONE event_tz))::int;
  demo_year_min INT := current_year - 1;
  demo_year_max INT := current_year;
  target_event_count INT := 0;
  expected_total INT := 0;
  demo_attendee_reserve INT := 0;
  inserted_total INT := 0;
  preserved_above INT := 0;
  row_count INT;
  event_count INT;
  id_min BIGINT;
  id_max BIGINT;
  overlap_count INT;
  mismatch_count INT;
  selected_groups_json json;
  user_pool_count INT;
BEGIN
  SELECT count(*) INTO target_event_count
  FROM public."event" AS e
  WHERE COALESCE((e.more_json->>'demo')::boolean, false) = true
    AND extract(year from (e.start_date AT TIME ZONE event_tz))::int
      BETWEEN demo_year_min AND demo_year_max;

  IF target_event_count = 0 THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'No demo events found for years %s-%s.',
        demo_year_min,
        demo_year_max
      )
    );
  END IF;

  expected_total := target_event_count * attendees_per_event;
  demo_attendee_reserve := expected_total;

  SELECT count(*) INTO user_pool_count
  FROM public."user"
  WHERE active IS NOT FALSE;

  IF user_pool_count < attendees_per_event THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'Need at least %s users for demo attendees; found %s.',
        attendees_per_event,
        user_pool_count
      )
    );
  END IF;

  SELECT count(*) INTO preserved_above
  FROM public.attendee
  WHERE attendee_id > demo_attendee_reserve;

  DELETE FROM public.attendee
  WHERE attendee_id <= demo_attendee_reserve;

  PERFORM setval(
    pg_get_serial_sequence('public.attendee', 'attendee_id'),
    1,
    false
  );

  SELECT json_agg(DISTINCT e.event_group_code ORDER BY e.event_group_code)
  INTO selected_groups_json
  FROM public."event" AS e
  WHERE COALESCE((e.more_json->>'demo')::boolean, false) = true
    AND extract(year from (e.start_date AT TIME ZONE event_tz))::int
      BETWEEN demo_year_min AND demo_year_max;

  FOR ev IN
    SELECT
      e.event_id,
      e.start_date,
      e.more_json
    FROM public."event" AS e
    WHERE COALESCE((e.more_json->>'demo')::boolean, false) = true
      AND extract(year from (e.start_date AT TIME ZONE event_tz))::int
        BETWEEN demo_year_min AND demo_year_max
    ORDER BY e.event_group_code, e.start_date
  LOOP
    INSERT INTO public.attendee (
      user_id,
      event_id,
      more_json,
      created_date,
      created_by
    )
    SELECT
      u.user_id,
      ev.event_id,
      COALESCE(
        ev.more_json,
        jsonb_build_object('demo', true)
      ),
      (
        GREATEST(
          make_date(
            extract(YEAR FROM (ev.start_date AT TIME ZONE event_tz))::INT,
            1,
            1
          ),
          (ev.start_date AT TIME ZONE event_tz)::date
            - (1 + floor(random() * 90))::INT
        )::timestamp
        + random() * INTERVAL '1 day'
      ) AT TIME ZONE event_tz,
      'c-agent'
    FROM (
      SELECT user_id
      FROM public."user"
      WHERE active IS NOT FALSE
      ORDER BY random()
      LIMIT attendees_per_event
    ) AS u;

    inserted_total := inserted_total + attendees_per_event;
  END LOOP;

  IF inserted_total <> expected_total THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'Expected %s attendee rows, inserted %s.',
        expected_total,
        inserted_total
      )
    );
  END IF;

  PERFORM setval(
    pg_get_serial_sequence('public.attendee', 'attendee_id'),
    (
      SELECT GREATEST(
        demo_attendee_reserve,
        COALESCE(MAX(attendee_id), demo_attendee_reserve)
      )
      FROM public.attendee
    ),
    true
  );

  SELECT count(*), min(attendee_id), max(attendee_id)
  INTO row_count, id_min, id_max
  FROM public.attendee
  WHERE attendee_id <= demo_attendee_reserve;

  SELECT count(DISTINCT event_id) INTO event_count
  FROM public.attendee
  WHERE attendee_id <= demo_attendee_reserve;

  IF row_count <> expected_total
     OR event_count <> target_event_count
     OR id_min <> 1
     OR id_max <> demo_attendee_reserve THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'Reserved range invalid: %s rows, %s events, attendee_id %s-%s (expected %s rows, %s events).',
        row_count,
        event_count,
        id_min,
        id_max,
        expected_total,
        target_event_count
      )
    );
  END IF;

  SELECT count(*) INTO overlap_count
  FROM public.attendee
  WHERE attendee_id <= demo_attendee_reserve
    AND COALESCE((more_json->>'demo')::boolean, false) = false;

  IF overlap_count > 0 THEN
    RETURN json_build_object(
      'ok', false,
      'message', format('Reserved range contains %s non-demo row(s).', overlap_count)
    );
  END IF;

  SELECT count(*) INTO mismatch_count
  FROM public.attendee a
  JOIN public."event" e ON e.event_id = a.event_id
  WHERE a.attendee_id <= demo_attendee_reserve
    AND extract(YEAR FROM (a.created_date AT TIME ZONE event_tz))
      <> extract(YEAR FROM (e.start_date AT TIME ZONE event_tz));

  IF mismatch_count > 0 THEN
    RETURN json_build_object(
      'ok', false,
      'message', format('Created-date year mismatch on %s row(s).', mismatch_count)
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'message', format(
      'Generated %s demo attendees (attendee_id 1-%s) for %s demo events in %s-%s.',
      expected_total,
      demo_attendee_reserve,
      target_event_count,
      demo_year_min,
      demo_year_max
    ),
    'inserted', expected_total,
    'events', event_count,
    'years', json_build_array(demo_year_min, demo_year_max),
    'preserved_above_reserve', preserved_above,
    'preserved_above_3000', preserved_above,
    'event_groups', COALESCE(selected_groups_json, '[]'::json)
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
