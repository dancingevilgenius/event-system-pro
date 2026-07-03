-- Score secret-question answers for forgot-password; fix duplicate _verify_secret_recovery_answers overload.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/063_forgot_password_secret_answer_feedback.sql

\connect event_system_pro

DROP FUNCTION IF EXISTS api._verify_secret_recovery_answers(json, integer[], json);

CREATE OR REPLACE FUNCTION api._score_secret_recovery_answers(
  p_recovery json,
  p_required_question_ids integer[],
  p_answers json,
  p_minimum_correct integer DEFAULT 2
)
RETURNS json
LANGUAGE plpgsql
STABLE
SET search_path = public, api
AS $$
DECLARE
  v_item json;
  v_question_id integer;
  v_answer text;
  v_answer_hash text;
  v_correct integer := 0;
  v_incorrect integer := 0;
  v_seen integer[] := ARRAY[]::integer[];
  v_required_count integer;
  v_minimum integer;
  v_correct_ids integer[] := ARRAY[]::integer[];
  v_incorrect_ids integer[] := ARRAY[]::integer[];
BEGIN
  v_required_count := cardinality(p_required_question_ids);
  v_minimum := LEAST(
    GREATEST(coalesce(p_minimum_correct, 2), 1),
    GREATEST(v_required_count, 1)
  );

  IF p_recovery IS NULL
     OR p_recovery ->> 'method' IS DISTINCT FROM 'secret_questions'
     OR p_answers IS NULL
     OR json_typeof(p_answers) <> 'array'
     OR v_required_count < v_minimum THEN
    RETURN json_build_object(
      'ok', false,
      'valid', false,
      'correct_count', 0,
      'incorrect_count', 0,
      'correct_question_ids', '[]'::json,
      'incorrect_question_ids', '[]'::json,
      'message', 'Invalid secret question answers.'
    );
  END IF;

  FOR v_item IN SELECT value FROM json_array_elements(p_answers)
  LOOP
    v_question_id := (v_item ->> 'secret_question_id')::integer;
    v_answer := v_item ->> 'answer';

    IF v_answer IS NULL OR btrim(v_answer) = '' THEN
      CONTINUE;
    END IF;

    IF v_question_id IS NULL OR NOT (v_question_id = ANY (p_required_question_ids)) THEN
      RETURN json_build_object(
        'ok', false,
        'valid', false,
        'correct_count', v_correct,
        'incorrect_count', v_incorrect,
        'correct_question_ids', to_json(v_correct_ids),
        'incorrect_question_ids', to_json(v_incorrect_ids),
        'message', 'Invalid secret question answers.'
      );
    END IF;

    IF v_question_id = ANY (v_seen) THEN
      RETURN json_build_object(
        'ok', false,
        'valid', false,
        'correct_count', v_correct,
        'incorrect_count', v_incorrect,
        'correct_question_ids', to_json(v_correct_ids),
        'incorrect_question_ids', to_json(v_incorrect_ids),
        'message', 'Invalid secret question answers.'
      );
    END IF;

    v_seen := array_append(v_seen, v_question_id);

    SELECT q ->> 'answer_hash'
    INTO v_answer_hash
    FROM json_array_elements(p_recovery -> 'questions') AS q
    WHERE (q ->> 'secret_question_id')::integer = v_question_id
    LIMIT 1;

    IF v_answer_hash IS NOT NULL
       AND crypt(api._normalize_secret_answer(v_answer), v_answer_hash) = v_answer_hash THEN
      v_correct := v_correct + 1;
      v_correct_ids := array_append(v_correct_ids, v_question_id);
    ELSE
      v_incorrect := v_incorrect + 1;
      v_incorrect_ids := array_append(v_incorrect_ids, v_question_id);
    END IF;
  END LOOP;

  RETURN json_build_object(
    'ok', true,
    'valid', v_correct >= v_minimum,
    'correct_count', v_correct,
    'incorrect_count', v_incorrect,
    'correct_question_ids', to_json(v_correct_ids),
    'incorrect_question_ids', to_json(v_incorrect_ids),
    'message',
      CASE
        WHEN v_correct >= v_minimum THEN 'Secret question answers accepted.'
        WHEN v_correct = 0 AND v_incorrect = 0 THEN 'Answer at least two secret questions.'
        ELSE format('%s correct. %s incorrect.', v_correct, v_incorrect)
      END
  );
END;
$$;

CREATE OR REPLACE FUNCTION api._verify_secret_recovery_answers(
  p_recovery json,
  p_required_question_ids integer[],
  p_answers json,
  p_minimum_correct integer DEFAULT 2
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public, api
AS $$
DECLARE
  v_score json;
BEGIN
  v_score := api._score_secret_recovery_answers(
    p_recovery,
    p_required_question_ids,
    p_answers,
    p_minimum_correct
  );

  RETURN coalesce((v_score ->> 'valid')::boolean, false);
END;
$$;

CREATE OR REPLACE FUNCTION api.forgot_password_secret_questions_verify(
  p_identifier text,
  p_answers json
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_reset public.user_password_reset%ROWTYPE;
  v_required_ids integer[];
  v_score json;
BEGIN
  v_user := api._find_user_by_identifier(p_identifier);

  IF v_user.user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Invalid secret question answers.');
  END IF;

  SELECT *
  INTO v_reset
  FROM public.user_password_reset r
  WHERE r.user_id = v_user.user_id
    AND r.used_at IS NULL
    AND r.expires_at > NOW()
    AND r.reset_method = 'secret_questions'
  ORDER BY r.created_date DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Your reset session expired. Start again from step 1.');
  END IF;

  SELECT array_agg((value)::integer)
  INTO v_required_ids
  FROM json_array_elements_text(v_reset.challenge_json -> 'question_ids');

  v_score := api._score_secret_recovery_answers(
    v_user.password_recovery_json,
    v_required_ids,
    p_answers
  );

  IF coalesce((v_score ->> 'valid')::boolean, false) THEN
    RETURN json_build_object(
      'ok', true,
      'message', v_score ->> 'message',
      'correct_count', (v_score ->> 'correct_count')::integer,
      'incorrect_count', (v_score ->> 'incorrect_count')::integer,
      'correct_question_ids', v_score -> 'correct_question_ids',
      'incorrect_question_ids', v_score -> 'incorrect_question_ids'
    );
  END IF;

  RETURN json_build_object(
    'ok', false,
    'message', v_score ->> 'message',
    'correct_count', (v_score ->> 'correct_count')::integer,
    'incorrect_count', (v_score ->> 'incorrect_count')::integer,
    'correct_question_ids', v_score -> 'correct_question_ids',
    'incorrect_question_ids', v_score -> 'incorrect_question_ids'
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
