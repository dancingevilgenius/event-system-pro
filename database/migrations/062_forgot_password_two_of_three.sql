-- Forgot-password secret questions: require any 2 of 3 correct answers (not all 3).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/062_forgot_password_two_of_three.sql

\connect event_system_pro

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
  v_item json;
  v_question_id integer;
  v_answer text;
  v_answer_hash text;
  v_correct integer := 0;
  v_seen integer[] := ARRAY[]::integer[];
  v_required_count integer;
  v_minimum integer;
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
    RETURN false;
  END IF;

  FOR v_item IN SELECT value FROM json_array_elements(p_answers)
  LOOP
    v_question_id := (v_item ->> 'secret_question_id')::integer;
    v_answer := v_item ->> 'answer';

    IF v_answer IS NULL OR btrim(v_answer) = '' THEN
      CONTINUE;
    END IF;

    IF v_question_id IS NULL OR NOT (v_question_id = ANY (p_required_question_ids)) THEN
      RETURN false;
    END IF;

    IF v_question_id = ANY (v_seen) THEN
      RETURN false;
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
    END IF;
  END LOOP;

  RETURN v_correct >= v_minimum;
END;
$$;

NOTIFY pgrst, 'reload schema';
