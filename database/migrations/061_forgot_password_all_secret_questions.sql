-- Forgot-password secret questions: prompt for all 3 saved answers (not a random subset of 2).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/061_forgot_password_all_secret_questions.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.forgot_password_secret_questions_start(p_identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_question_ids integer[] := ARRAY[]::integer[];
  v_questions jsonb := '[]'::jsonb;
  v_item json;
  v_question_id integer;
BEGIN
  IF p_identifier IS NULL OR btrim(p_identifier) = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Enter your email or username.');
  END IF;

  v_user := api._find_user_by_identifier(p_identifier);

  IF v_user.user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'No account was found for that email or username. Check the spelling and try again.'
    );
  END IF;

  IF NOT api._user_has_secret_questions(v_user.password_recovery_json) THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'This account does not have secret questions set up. Use a verification code instead.'
    );
  END IF;

  FOR v_item IN SELECT value FROM json_array_elements(v_user.password_recovery_json -> 'questions')
  LOOP
    v_question_id := (v_item ->> 'secret_question_id')::integer;
    IF v_question_id IS NOT NULL THEN
      v_question_ids := array_append(v_question_ids, v_question_id);
    END IF;
  END LOOP;

  IF cardinality(v_question_ids) <> 3 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'This account does not have secret questions set up. Use a verification code instead.'
    );
  END IF;

  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'secret_question_id', sq.secret_question_id,
      'question', sq.question
    )
    ORDER BY sq.secret_question_id
  ), '[]'::jsonb)
  INTO v_questions
  FROM public.secret_question_lu sq
  WHERE sq.secret_question_id = ANY (v_question_ids);

  UPDATE public.user_password_reset
  SET used_at = NOW()
  WHERE user_id = v_user.user_id
    AND used_at IS NULL;

  INSERT INTO public.user_password_reset (
    user_id,
    code_hash,
    expires_at,
    reset_method,
    challenge_json
  )
  VALUES (
    v_user.user_id,
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    NOW() + INTERVAL '15 minutes',
    'secret_questions',
    json_build_object('question_ids', v_question_ids)
  );

  RETURN json_build_object(
    'ok', true,
    'message', 'Answer your secret questions to continue.',
    'email', v_user.email,
    'questions', v_questions
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
