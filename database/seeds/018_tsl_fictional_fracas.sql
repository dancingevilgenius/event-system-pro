-- TSL Fictional Fracas: demo event_group, July 2026 event, 40 attendees, 4 division contests.
-- Each contest gets an empty pools stage + empty primary_elim bracket (size 8).
-- Safe to re-run (deletes prior Fracas rows first).
-- Requires migrations 136 (contest_stage_pool) and 137 (contest_stage_bracket).
--
--   psql -U postgres -d event_system_pro -f database/seeds/018_tsl_fictional_fracas.sql

\connect event_system_pro

INSERT INTO public.event_group (
  event_group_code,
  full_name,
  short_name,
  event_type_code,
  more_json,
  created_by
)
VALUES (
  'TSL_FICTIONAL_FRACAS',
  'TSL Fictional Fracas',
  'Fictional Fracas',
  'SWORD_LIGHT_SABER',
  '{"demo": true}'::jsonb,
  'c-agent'
)
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name,
  event_type_code = EXCLUDED.event_type_code,
  more_json = EXCLUDED.more_json;

DO $$
DECLARE
  v_event_id bigint;
  v_event_code varchar(64);
  v_start timestamptz := TIMESTAMPTZ '2026-07-17 09:00:00-05';
  v_end timestamptz := TIMESTAMPTZ '2026-07-19 18:00:00-05';
  v_contest_id bigint;
  v_division record;
  v_pools jsonb;
  v_bracket jsonb;
  v_round_index int;
  v_match_index int;
  v_match_count int;
  v_rounds jsonb;
  v_matches jsonb;
  v_round_names text[] := ARRAY['Quarterfinals', 'Semifinals', 'Final'];
BEGIN
  -- Tear down prior Fracas data (FK-safe order).
  DELETE FROM public.contest_stage_pool
  WHERE contest_id IN (
    SELECT c.contest_id
    FROM public.contest AS c
    JOIN public."event" AS e ON e.event_id = c.event_id
    WHERE e.event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.contest_stage_bracket
  WHERE contest_id IN (
    SELECT c.contest_id
    FROM public.contest AS c
    JOIN public."event" AS e ON e.event_id = c.event_id
    WHERE e.event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.contest_entry
  WHERE contest_id IN (
    SELECT c.contest_id
    FROM public.contest AS c
    JOIN public."event" AS e ON e.event_id = c.event_id
    WHERE e.event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.competitor
  WHERE contest_id IN (
    SELECT c.contest_id
    FROM public.contest AS c
    JOIN public."event" AS e ON e.event_id = c.event_id
    WHERE e.event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.judging_panel
  WHERE contest_id IN (
    SELECT c.contest_id
    FROM public.contest AS c
    JOIN public."event" AS e ON e.event_id = c.event_id
    WHERE e.event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.contest_heat
  WHERE contest_id IN (
    SELECT c.contest_id
    FROM public.contest AS c
    JOIN public."event" AS e ON e.event_id = c.event_id
    WHERE e.event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.contest
  WHERE event_id IN (
    SELECT event_id FROM public."event" WHERE event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public.attendee
  WHERE event_id IN (
    SELECT event_id FROM public."event" WHERE event_group_code = 'TSL_FICTIONAL_FRACAS'
  );

  DELETE FROM public."event"
  WHERE event_group_code = 'TSL_FICTIONAL_FRACAS';

  INSERT INTO public."event" (
    event_group_code,
    name,
    country_code,
    state_or_province,
    location_json,
    active,
    number_of_days,
    start_date,
    end_date,
    created_by
  )
  VALUES (
    'TSL_FICTIONAL_FRACAS',
    'TSL Fictional Fracas 2026',
    'USA',
    'MN',
    jsonb_build_object(
      'venue', 'Fracas Fieldhouse',
      'street', '1720 Plasma Parade',
      'city', 'Minneapolis',
      'state', 'MN',
      'country', 'USA'
    ),
    TRUE,
    3,
    v_start,
    v_end,
    'c-agent'
  )
  RETURNING event_id, event_code INTO v_event_id, v_event_code;

  UPDATE public."event" AS e
  SET more_json = jsonb_build_object('demo', true)
  WHERE e.event_id = v_event_id;

  -- 40 fictional (superhero) users; attendee_id assigned by identity above demo reserve.
  INSERT INTO public.attendee (user_id, event_id, more_json, created_by)
  SELECT
    u.user_id,
    v_event_id,
    '{"demo": true}'::jsonb,
    'c-agent'
  FROM public."user" AS u
  WHERE u.user_id BETWEEN 1 AND 1000
    AND COALESCE(u.active, TRUE) IS TRUE
  ORDER BY u.user_id
  LIMIT 40;

  FOR v_division IN
    SELECT *
    FROM (
      VALUES
        (91001::bigint, 'STD', 'Standard'),
        (91002::bigint, 'WOM', 'Womens'),
        (91003::bigint, 'MAS', 'Masters'),
        (91004::bigint, 'EXO', 'Exotics')
    ) AS d(contest_id, division_key, division_label)
  LOOP
    v_contest_id := v_division.contest_id;

    INSERT INTO public.contest (
      contest_id,
      event_id,
      competitors_json,
      results_json,
      more_json,
      event_type_code,
      is_active,
      is_cancelled,
      original_start_time,
      created_by,
      created_date,
      modified_by,
      modified_date
    )
    VALUES (
      v_contest_id,
      v_event_id,
      '[]'::jsonb,
      jsonb_build_object(
        'stages', jsonb_build_array('pools', 'primary_elim')
      ),
      jsonb_build_object(
        'demo', true,
        'division_key', v_division.division_key,
        'division_label', v_division.division_label,
        'name', v_division.division_label
      ),
      'SWORD_LIGHT_SABER',
      1,
      0,
      v_start::date,
      'c-agent',
      CURRENT_DATE,
      'c-agent',
      CURRENT_DATE
    );

    v_pools := jsonb_build_object(
      'stage', 'pools',
      'score_a_label', 'Red',
      'score_b_label', 'Blue',
      'mat_label', 'Mat',
      'overtime_label', 'Sudden Death',
      'division_key', v_division.division_key,
      'division_label', v_division.division_label,
      'event_code', v_event_code,
      'contest_id', v_contest_id,
      'rules', jsonb_build_object('points_to_win', 10, 'double_limit', 3),
      'pools', '[]'::jsonb
    );

    INSERT INTO public.contest_stage_pool (
      contest_id,
      stage,
      pools_json,
      created_by
    )
    VALUES (
      v_contest_id,
      'pools',
      v_pools,
      'c-agent'
    );

    -- Empty size-8 single-elim skeleton.
    v_rounds := '[]'::jsonb;
    FOR v_round_index IN 0..2 LOOP
      v_match_count := 8 / (2 ^ (v_round_index + 1));
      v_matches := '[]'::jsonb;
      FOR v_match_index IN 0..(v_match_count - 1) LOOP
        v_matches := v_matches || jsonb_build_array(
          jsonb_build_object(
            'id', format('r%s-m%s', v_round_index, v_match_index),
            'round_index', v_round_index,
            'match_index', v_match_index,
            'slot_a', NULL,
            'slot_b', NULL,
            'winner', NULL,
            'loser', NULL
          )
        );
      END LOOP;

      v_rounds := v_rounds || jsonb_build_array(
        jsonb_build_object(
          'name', v_round_names[v_round_index + 1],
          'matches', v_matches
        )
      );
    END LOOP;

    v_bracket := jsonb_build_object(
      'stage', 'primary_elim',
      'score_a_label', 'Red',
      'score_b_label', 'Blue',
      'mat_label', 'Mat',
      'overtime_label', 'Sudden Death',
      'division_key', v_division.division_key,
      'division_label', v_division.division_label,
      'event_code', v_event_code,
      'contest_id', v_contest_id,
      'format', 'single-elimination',
      'size', 8,
      'updated_at', NULL,
      'rounds', v_rounds,
      'champion', NULL
    );

    INSERT INTO public.contest_stage_bracket (
      contest_id,
      stage,
      bracket_json,
      created_by
    )
    VALUES (
      v_contest_id,
      'primary_elim',
      v_bracket,
      'c-agent'
    );
  END LOOP;

  RAISE NOTICE 'TSL Fictional Fracas seeded: event_id=%, event_code=%, contests=91001-91004, attendees=40',
    v_event_id, v_event_code;
END
$$;
