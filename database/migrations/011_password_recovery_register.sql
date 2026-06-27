-- Hash secret-question answers and register users with password_recovery_json.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/011_password_recovery_register.sql

\connect event_system_pro

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Normalize answers for consistent verification (case-insensitive, trimmed).
CREATE OR REPLACE FUNCTION api._normalize_secret_answer(p_answer text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(trim(p_answer));
$$;

CREATE OR REPLACE FUNCTION api.hash_password_recovery_answers(p_answers json)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_item json;
  v_question_id integer;
  v_answer text;
  v_seen integer[] := ARRAY[]::integer[];
  v_questions jsonb := '[]'::jsonb;
BEGIN
  IF p_answers IS NULL OR json_typeof(p_answers) <> 'array' OR json_array_length(p_answers) <> 3 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Choose three different secret questions with an answer for each.'
    );
  END IF;

  FOR v_item IN SELECT value FROM json_array_elements(p_answers)
  LOOP
    v_question_id := (v_item ->> 'secret_question_id')::integer;
    v_answer := v_item ->> 'answer';

    IF v_question_id IS NULL OR v_answer IS NULL OR btrim(v_answer) = '' THEN
      RETURN json_build_object(
        'ok', false,
        'message', 'Each answer must contain non-whitespace characters.'
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.secret_question_lu sq WHERE sq.secret_question_id = v_question_id
    ) THEN
      RETURN json_build_object('ok', false, 'message', 'Invalid secret question selected.');
    END IF;

    IF v_question_id = ANY (v_seen) THEN
      RETURN json_build_object('ok', false, 'message', 'Each secret question can only be used once.');
    END IF;

    v_seen := array_append(v_seen, v_question_id);
    v_questions := v_questions || jsonb_build_array(
      jsonb_build_object(
        'secret_question_id', v_question_id,
        'answer_hash', crypt(api._normalize_secret_answer(v_answer), gen_salt('bf'))
      )
    );
  END LOOP;

  RETURN json_build_object(
    'ok', true,
    'message', 'Password recovery answers encrypted and saved.',
    'password_recovery_json', jsonb_build_object(
      'method', 'secret_questions',
      'questions', v_questions
    )::json
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.register_user(
  p_username text,
  p_email text,
  p_password text,
  p_name_json json,
  p_phone_numbers_json json,
  p_addresses_json json,
  p_password_recovery_json json
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
BEGIN
  IF p_username IS NULL OR trim(p_username) = ''
     OR p_email IS NULL OR trim(p_email) = ''
     OR p_password IS NULL OR trim(p_password) = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Username, email, and password are required.');
  END IF;

  IF length(trim(p_password)) < 8 THEN
    RETURN json_build_object('ok', false, 'message', 'Password must be at least 8 characters.');
  END IF;

  IF p_password_recovery_json IS NULL
     OR p_password_recovery_json ->> 'method' IS DISTINCT FROM 'secret_questions'
     OR json_array_length(p_password_recovery_json -> 'questions') IS DISTINCT FROM 3 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Set up three password recovery secret questions before creating your account.'
    );
  END IF;

  IF EXISTS (
    SELECT 1 FROM public."user" u WHERE lower(u.username) = lower(trim(p_username))
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'That username is already taken.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public."user" u WHERE lower(u.email) = lower(trim(p_email))
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'That email is already registered.');
  END IF;

  INSERT INTO public."user" (
    username,
    password_encrypted,
    name_json,
    email,
    phone_numbers_json,
    addresses_json,
    password_recovery_json,
    created_by,
    modified_by,
    modified_date
  )
  VALUES (
    trim(p_username),
    crypt(trim(p_password), gen_salt('bf')),
    p_name_json,
    lower(trim(p_email)),
    p_phone_numbers_json,
    p_addresses_json,
    p_password_recovery_json,
    trim(p_username),
    NULL,
    NULL
  )
  RETURNING user_id INTO v_user_id;

  RETURN json_build_object(
    'ok', true,
    'message', 'Account created successfully.',
    'user_id', v_user_id,
    'username', trim(p_username),
    'email', lower(trim(p_email))
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.hash_password_recovery_answers(json) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.register_user(text, text, text, json, json, json, json) TO anon, authenticated;
