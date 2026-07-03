-- Allow optional email at registration; require 2 of email, phone, secret questions.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/066_register_recovery_two_of_three.sql

\connect event_system_pro

ALTER TABLE public."user"
  ALTER COLUMN email DROP NOT NULL;

CREATE OR REPLACE FUNCTION api._registration_has_phone(p_phone_numbers_json json)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM json_array_elements(coalesce(p_phone_numbers_json, '[]'::json)) AS entry
    WHERE length(regexp_replace(coalesce(entry ->> 'number', ''), '\D', '', 'g')) = 10
  );
$$;

CREATE OR REPLACE FUNCTION api._registration_has_secret_questions(p_password_recovery_json json)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    p_password_recovery_json IS NOT NULL
    AND p_password_recovery_json ->> 'method' = 'secret_questions'
    AND json_typeof(p_password_recovery_json -> 'questions') = 'array'
    AND json_array_length(p_password_recovery_json -> 'questions') = 3;
$$;

DROP FUNCTION IF EXISTS api.register_user(text, text, text, json, json, json, json);

CREATE OR REPLACE FUNCTION api.register_user(
  p_username text,
  p_password text,
  p_email text,
  p_name_json json,
  p_phone_numbers_json json DEFAULT NULL,
  p_addresses_json json DEFAULT NULL,
  p_password_recovery_json json DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_recovery_count integer := 0;
  v_email text;
BEGIN
  IF p_username IS NULL OR trim(p_username) = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Username is required.');
  END IF;

  IF p_password IS NULL OR length(trim(p_password)) < 8 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Password must be at least 8 characters.'
    );
  END IF;

  v_email := nullif(lower(trim(p_email)), '');

  IF v_email IS NOT NULL THEN
    v_recovery_count := v_recovery_count + 1;
  END IF;

  IF api._registration_has_phone(p_phone_numbers_json) THEN
    v_recovery_count := v_recovery_count + 1;
  END IF;

  IF api._registration_has_secret_questions(p_password_recovery_json) THEN
    v_recovery_count := v_recovery_count + 1;
  END IF;

  IF v_recovery_count < 2 THEN
    RETURN json_build_object(
      'ok', false,
      'message',
      'For password recovery help, provide at least two of: email, phone number, and secret question answers.'
    );
  END IF;

  IF EXISTS (SELECT 1 FROM public."user" u WHERE lower(u.username) = lower(trim(p_username))) THEN
    RETURN json_build_object('ok', false, 'message', 'That username is already taken.');
  END IF;

  IF v_email IS NOT NULL
     AND EXISTS (SELECT 1 FROM public."user" u WHERE lower(u.email) = v_email) THEN
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
    v_email,
    p_phone_numbers_json,
    p_addresses_json,
    coalesce(p_password_recovery_json, '{}'::json),
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
    'email', v_email
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.register_user(text, text, text, json, json, json, json) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
