-- Forgot-password recovery via secret questions (2 of 3 stored answers).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/058_forgot_password_secret_questions.sql

\connect event_system_pro

ALTER TABLE public.user_password_reset
  ADD COLUMN IF NOT EXISTS reset_method varchar(32) NOT NULL DEFAULT 'email_code',
  ADD COLUMN IF NOT EXISTS challenge_json json DEFAULT NULL;

CREATE OR REPLACE FUNCTION api._user_has_secret_questions(p_recovery json)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    p_recovery IS NOT NULL
    AND p_recovery ->> 'method' = 'secret_questions'
    AND json_typeof(p_recovery -> 'questions') = 'array'
    AND json_array_length(p_recovery -> 'questions') = 3
    AND NOT EXISTS (
      SELECT 1
      FROM json_array_elements(p_recovery -> 'questions') AS q
      WHERE (q ->> 'secret_question_id') IS NULL
         OR (q ->> 'answer_hash') IS NULL
         OR btrim(q ->> 'answer_hash') = ''
    );
$$;

CREATE OR REPLACE FUNCTION api._find_user_by_identifier(p_identifier text)
RETURNS public."user"
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
BEGIN
  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE lower(u.email) = lower(trim(p_identifier))
     OR lower(u.username) = lower(trim(p_identifier))
  ORDER BY u.user_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN v_user;
END;
$$;

CREATE OR REPLACE FUNCTION api._verify_secret_recovery_answers(
  p_recovery json,
  p_required_question_ids integer[],
  p_answers json
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_item json;
  v_question_id integer;
  v_answer text;
  v_answer_hash text;
  v_matched integer := 0;
BEGIN
  IF p_recovery IS NULL
     OR p_recovery ->> 'method' IS DISTINCT FROM 'secret_questions'
     OR p_answers IS NULL
     OR json_typeof(p_answers) <> 'array'
     OR json_array_length(p_answers) <> cardinality(p_required_question_ids) THEN
    RETURN false;
  END IF;

  FOR v_item IN SELECT value FROM json_array_elements(p_answers)
  LOOP
    v_question_id := (v_item ->> 'secret_question_id')::integer;
    v_answer := v_item ->> 'answer';

    IF v_question_id IS NULL
       OR NOT (v_question_id = ANY (p_required_question_ids))
       OR v_answer IS NULL
       OR btrim(v_answer) = '' THEN
      RETURN false;
    END IF;

    SELECT q ->> 'answer_hash'
    INTO v_answer_hash
    FROM json_array_elements(p_recovery -> 'questions') AS q
    WHERE (q ->> 'secret_question_id')::integer = v_question_id
    LIMIT 1;

    IF v_answer_hash IS NULL
       OR crypt(api._normalize_secret_answer(v_answer), v_answer_hash) <> v_answer_hash THEN
      RETURN false;
    END IF;

    v_matched := v_matched + 1;
  END LOOP;

  RETURN v_matched = cardinality(p_required_question_ids);
END;
$$;

CREATE OR REPLACE FUNCTION api.forgot_password_recovery_options(p_identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
BEGIN
  IF p_identifier IS NULL OR btrim(p_identifier) = '' THEN
    RETURN json_build_object(
      'ok', true,
      'found', false,
      'has_secret_questions', false
    );
  END IF;

  v_user := api._find_user_by_identifier(p_identifier);

  IF v_user.user_id IS NULL THEN
    RETURN json_build_object(
      'ok', true,
      'found', false,
      'has_secret_questions', false
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'found', true,
    'has_secret_questions', api._user_has_secret_questions(v_user.password_recovery_json),
    'email', v_user.email
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.forgot_password_secret_questions_start(p_identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_question_ids integer[] := ARRAY[]::integer[];
  v_selected_ids integer[] := ARRAY[]::integer[];
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

  SELECT array_agg(qid ORDER BY random())
  INTO v_selected_ids
  FROM (
    SELECT unnest(v_question_ids) AS qid
    ORDER BY random()
    LIMIT 2
  ) picked;

  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'secret_question_id', sq.secret_question_id,
      'question', sq.question
    )
    ORDER BY sq.secret_question_id
  ), '[]'::jsonb)
  INTO v_questions
  FROM public.secret_question_lu sq
  WHERE sq.secret_question_id = ANY (v_selected_ids);

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
    json_build_object('question_ids', v_selected_ids)
  );

  RETURN json_build_object(
    'ok', true,
    'message', 'Answer your secret questions to continue.',
    'email', v_user.email,
    'questions', v_questions
  );
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

  IF NOT api._verify_secret_recovery_answers(
    v_user.password_recovery_json,
    v_required_ids,
    p_answers
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'One or more secret question answers are incorrect.');
  END IF;

  RETURN json_build_object('ok', true, 'message', 'Secret question answers accepted.');
END;
$$;

CREATE OR REPLACE FUNCTION api.forgot_password_secret_questions_complete(
  p_identifier text,
  p_answers json,
  p_new_password text
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
BEGIN
  IF p_new_password IS NULL OR length(trim(p_new_password)) < 8 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Password must be at least 8 characters.'
    );
  END IF;

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

  IF NOT api._verify_secret_recovery_answers(
    v_user.password_recovery_json,
    v_required_ids,
    p_answers
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'One or more secret question answers are incorrect.');
  END IF;

  PERFORM api.set_audit_actor(v_user.username);

  UPDATE public."user"
  SET password_encrypted = crypt(trim(p_new_password), gen_salt('bf')),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_user.username
  WHERE user_id = v_user.user_id;

  UPDATE public.user_password_reset
  SET used_at = NOW()
  WHERE reset_id = v_reset.reset_id;

  RETURN json_build_object('ok', true, 'message', 'Your password has been updated.');
END;
$$;

GRANT EXECUTE ON FUNCTION api.forgot_password_recovery_options(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.forgot_password_secret_questions_start(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.forgot_password_secret_questions_verify(text, json) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.forgot_password_secret_questions_complete(text, json, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
