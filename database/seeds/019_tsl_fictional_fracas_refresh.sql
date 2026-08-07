-- Refresh TSL Fictional Fracas (re-runnable).
-- schema_seeds tracks each filename once, so updates to 018 are skipped on existing DBs.
-- This 019 copy reapplies the full Fracas group/event/attendees/contests/pools/brackets.
-- Safe to re-run content-wise; apply once via seed tracker (or manually with psql).
-- Requires migrations 136 (contest_stage_pool) and 137 (contest_stage_bracket).
--
--   psql -U postgres -d event_system_pro -f database/seeds/019_tsl_fictional_fracas_refresh.sql

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

CREATE OR REPLACE FUNCTION pg_temp.fighter_from_user(p_user public."user")
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'user_id', p_user.user_id,
    'username', p_user.username,
    'first_name', coalesce(p_user.name_json->>'first', ''),
    'last_name', coalesce(p_user.name_json->>'last', ''),
    'display-name',
      nullif(
        btrim(
          concat_ws(
            ' ',
            nullif(btrim(coalesce(p_user.name_json->>'first', '')), ''),
            nullif(btrim(coalesce(p_user.name_json->>'last', '')), '')
          )
        ),
        ''
      )
  );
$$;

CREATE OR REPLACE FUNCTION pg_temp.empty_bracket_rounds(p_size int)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_round_count int;
  v_round_index int;
  v_match_index int;
  v_match_count int;
  v_rounds jsonb := '[]'::jsonb;
  v_matches jsonb;
  v_name text;
BEGIN
  IF p_size < 2 OR (p_size & (p_size - 1)) <> 0 THEN
    RAISE EXCEPTION 'Bracket size must be a power of 2 (got %)', p_size;
  END IF;

  v_round_count := round(log(2, p_size))::int;

  FOR v_round_index IN 0..(v_round_count - 1) LOOP
    v_match_count := p_size / (2 ^ (v_round_index + 1));
    IF v_round_index = v_round_count - 1 THEN
      v_name := 'Final';
    ELSIF v_match_count = 2 THEN
      v_name := 'Semifinals';
    ELSIF v_match_count = 4 THEN
      v_name := 'Quarterfinals';
    ELSE
      v_name := format('Round of %s', v_match_count * 2);
    END IF;

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
      jsonb_build_object('name', v_name, 'matches', v_matches)
    );
  END LOOP;

  RETURN v_rounds;
END;
$$;

CREATE OR REPLACE FUNCTION pg_temp.distribute_pools(
  p_fighters jsonb,
  p_pool_size int DEFAULT 5
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_total int;
  v_pool_count int;
  v_pool_index int;
  v_fighter jsonb;
  v_pools jsonb := '[]'::jsonb;
  v_fighters jsonb;
  v_idx int := 0;
  v_pool_id text;
BEGIN
  v_total := jsonb_array_length(p_fighters);
  IF v_total = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  v_pool_count := greatest(1, ceil(v_total::numeric / p_pool_size)::int);

  FOR v_pool_index IN 0..(v_pool_count - 1) LOOP
    v_fighters := '[]'::jsonb;
    v_pools := v_pools; -- keep lint quiet
  END LOOP;

  -- Round-robin into pools so sizes stay balanced.
  FOR v_pool_index IN 0..(v_pool_count - 1) LOOP
    v_fighters := '[]'::jsonb;
    v_pool_id := chr(65 + v_pool_index); -- A, B, C...

    FOR v_idx IN 0..(v_total - 1) LOOP
      IF (v_idx % v_pool_count) = v_pool_index THEN
        v_fighter := p_fighters -> v_idx;
        v_fighters := v_fighters || jsonb_build_array(
          jsonb_build_object(
            'user_id', (v_fighter->>'user_id')::bigint,
            'username', v_fighter->>'username',
            'display-name', coalesce(v_fighter->>'display-name', v_fighter->>'username')
          )
        );
      END IF;
    END LOOP;

    v_pools := v_pools || jsonb_build_array(
      jsonb_build_object(
        'pool_id', v_pool_id,
        'mat', v_pool_index + 1,
        'status', 'pending',
        'fighters', v_fighters,
        'bouts', '[]'::jsonb,
        'standings', '[]'::jsonb
      )
    );
  END LOOP;

  RETURN v_pools;
END;
$$;

DO $$
DECLARE
  v_event_id bigint;
  v_event_code varchar(64);
  v_start timestamptz := TIMESTAMPTZ '2026-07-17 09:00:00-05';
  v_end timestamptz := TIMESTAMPTZ '2026-07-19 18:00:00-05';
  v_contest_id bigint;
  v_division record;
  v_pools_doc jsonb;
  v_bracket_doc jsonb;
  v_all_fighters jsonb := '[]'::jsonb;
  v_competitors jsonb;
  v_fighter jsonb;
  v_user public."user"%ROWTYPE;
  v_count int;
  v_bracket_size int;
  v_pool_size int;
BEGIN
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

  -- 40 attendees (superhero users). Standard uses all 40; other divisions overlap.
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

  FOR v_user IN
    SELECT u.*
    FROM public.attendee AS a
    JOIN public."user" AS u ON u.user_id = a.user_id
    WHERE a.event_id = v_event_id
    ORDER BY u.user_id
  LOOP
    v_fighter := pg_temp.fighter_from_user(v_user);
    IF v_fighter->>'display-name' IS NULL THEN
      v_fighter := jsonb_set(v_fighter, '{display-name}', to_jsonb(v_user.username), true);
    END IF;
    v_all_fighters := v_all_fighters || jsonb_build_array(v_fighter);
  END LOOP;

  IF jsonb_array_length(v_all_fighters) < 40 THEN
    RAISE EXCEPTION 'Expected 40 Fracas attendees, found %', jsonb_array_length(v_all_fighters);
  END IF;

  FOR v_division IN
    SELECT *
    FROM (
      VALUES
        -- contest_id, key, label, participant_count, pool_size, bracket_size
        (91001::bigint, 'STD', 'Standard', 40, 5, 16),
        (91002::bigint, 'WOM', 'Womens', 11, 4, 8),
        (91003::bigint, 'MAS', 'Masters', 16, 4, 8),
        (91004::bigint, 'EXO', 'Exotics', 35, 5, 16)
    ) AS d(contest_id, division_key, division_label, participant_count, pool_size, bracket_size)
  LOOP
    v_contest_id := v_division.contest_id;
    v_count := v_division.participant_count;
    v_pool_size := v_division.pool_size;
    v_bracket_size := v_division.bracket_size;

    v_competitors := (
      SELECT coalesce(jsonb_agg(f.fighter ORDER BY f.ord), '[]'::jsonb)
      FROM (
        SELECT value AS fighter, ordinality AS ord
        FROM jsonb_array_elements(v_all_fighters) WITH ORDINALITY
        LIMIT v_count
      ) AS f
    );

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
      v_competitors,
      jsonb_build_object(
        'stages', jsonb_build_array('pools', 'primary_elim')
      ),
      jsonb_build_object(
        'demo', true,
        'division_key', v_division.division_key,
        'division_label', v_division.division_label,
        'name', v_division.division_label,
        'participant_count', v_count
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

    v_pools_doc := jsonb_build_object(
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
      'pools', pg_temp.distribute_pools(v_competitors, v_pool_size)
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
      v_pools_doc,
      'c-agent'
    );

    v_bracket_doc := jsonb_build_object(
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
      'size', v_bracket_size,
      'updated_at', NULL,
      'rounds', pg_temp.empty_bracket_rounds(v_bracket_size),
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
      v_bracket_doc,
      'c-agent'
    );
  END LOOP;

  -- Mark attendee contest enrollments (overlap across divisions).
  UPDATE public.attendee AS a
  SET contests_json = (
    SELECT coalesce(jsonb_agg(x.enrollment ORDER BY x.contest_id), '[]'::jsonb)
    FROM (
      SELECT
        c.contest_id,
        jsonb_build_object(
          'contest_id', c.contest_id,
          'division_key', c.more_json->>'division_key',
          'division_label', c.more_json->>'division_label'
        ) AS enrollment
      FROM public.contest AS c
      WHERE c.event_id = v_event_id
        AND EXISTS (
          SELECT 1
          FROM jsonb_array_elements(c.competitors_json) AS comp
          WHERE (comp->>'user_id')::bigint = a.user_id
        )
    ) AS x
  )
  WHERE a.event_id = v_event_id;

  RAISE NOTICE
    'TSL Fictional Fracas seeded: event_id=%, event_code=%, attendees=40, contests STD=40 WOM=11 MAS=16 EXO=35',
    v_event_id, v_event_code;
END
$$;
