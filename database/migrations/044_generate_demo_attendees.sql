-- Admin RPC: regenerate demo attendees (attendee_id 1–3000).
-- Core logic in generate_demo_attendees_core(); admin wrapper for PostgREST.
--
-- Run: psql -U postgres -d event_system_pro -f database/migrations/044_generate_demo_attendees.sql

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
  trios_to_select CONSTANT INT := 5;
  demo_attendee_reserve CONSTANT INT := 3000;
  selected_event_count INT;
  inserted_total INT := 0;
  preserved_above INT := 0;
  row_count INT;
  event_count INT;
  id_min BIGINT;
  id_max BIGINT;
  overlap_count INT;
  mismatch_count INT;
  selected_groups_json json;
BEGIN
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

  CREATE TEMP TABLE selected_demo_groups (
    event_group_code varchar(64) NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO selected_demo_groups (event_group_code)
  SELECT g.event_group_code
  FROM public.event_group AS g
  WHERE COALESCE((g.more_json->>'demo')::boolean, false) = true
    AND (
      SELECT count(*)
      FROM public."event" AS e
      WHERE e.event_group_code = g.event_group_code
        AND COALESCE((e.more_json->>'demo')::boolean, false) = true
    ) = 3
  ORDER BY random()
  LIMIT trios_to_select;

  SELECT count(*) INTO selected_event_count
  FROM public."event" AS e
  JOIN selected_demo_groups AS s ON s.event_group_code = e.event_group_code
  WHERE COALESCE((e.more_json->>'demo')::boolean, false) = true;

  IF selected_event_count <> trios_to_select * 3 THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'Expected %s demo events, found %s.',
        trios_to_select * 3,
        selected_event_count
      )
    );
  END IF;

  SELECT json_agg(s.event_group_code ORDER BY s.event_group_code)
  INTO selected_groups_json
  FROM selected_demo_groups AS s;

  FOR ev IN
    SELECT
      e.event_id,
      e.start_date,
      e.more_json
    FROM public."event" AS e
    JOIN selected_demo_groups AS s ON s.event_group_code = e.event_group_code
    WHERE COALESCE((e.more_json->>'demo')::boolean, false) = true
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
      ORDER BY random()
      LIMIT attendees_per_event
    ) AS u;

    inserted_total := inserted_total + attendees_per_event;
  END LOOP;

  IF inserted_total <> demo_attendee_reserve THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'Expected %s attendee rows, inserted %s.',
        demo_attendee_reserve,
        inserted_total
      )
    );
  END IF;

  PERFORM setval(
    pg_get_serial_sequence('public.attendee', 'attendee_id'),
    (SELECT GREATEST(demo_attendee_reserve, COALESCE(MAX(attendee_id), demo_attendee_reserve)) FROM public.attendee),
    true
  );

  SELECT count(*), min(attendee_id), max(attendee_id)
  INTO row_count, id_min, id_max
  FROM public.attendee
  WHERE attendee_id <= demo_attendee_reserve;

  SELECT count(DISTINCT event_id) INTO event_count
  FROM public.attendee
  WHERE attendee_id <= demo_attendee_reserve;

  IF row_count <> demo_attendee_reserve OR event_count <> 15 OR id_min <> 1 OR id_max <> demo_attendee_reserve THEN
    RETURN json_build_object(
      'ok', false,
      'message', format(
        'Reserved range invalid: %s rows, %s events, attendee_id %s–%s.',
        row_count, event_count, id_min, id_max
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
      'Generated %s demo attendees (attendee_id 1–%s).',
      demo_attendee_reserve,
      demo_attendee_reserve
    ),
    'inserted', demo_attendee_reserve,
    'events', event_count,
    'preserved_above_3000', preserved_above,
    'event_groups', COALESCE(selected_groups_json, '[]'::json)
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.generate_demo_attendees()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
BEGIN
  IF NOT api.has_app_role('admin') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  RETURN api.generate_demo_attendees_core();
END;
$$;

REVOKE ALL ON FUNCTION api.generate_demo_attendees_core() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.generate_demo_attendees() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.generate_demo_attendees() TO authenticated;

NOTIFY pgrst, 'reload schema';
