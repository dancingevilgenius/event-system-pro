-- Stamp additional_info_json.wsdc.last_update_datetime on insert/update (human-readable).
-- Example: July 20, 2026 8:00pm
-- Run: psql -U postgres -d event_system_pro -f database/migrations/101_wsdc_last_update_datetime.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.format_wsdc_update_timestamp(p_ts timestamptz DEFAULT CURRENT_TIMESTAMP)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT
    to_char(date_trunc('minute', p_ts), 'FMMonth FMDD, YYYY FMHH12:MI')
    || lower(to_char(date_trunc('minute', p_ts), 'am'));
$$;

CREATE OR REPLACE FUNCTION api.register_user(
  p_username text,
  p_password text,
  p_email text,
  p_name_json json,
  p_phone_numbers_json json DEFAULT NULL,
  p_addresses_json json DEFAULT NULL,
  p_password_recovery_json json DEFAULT NULL,
  p_wsdc_id text DEFAULT NULL
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
  v_wsdc_id text;
  v_additional_info json;
  v_now timestamptz := CURRENT_TIMESTAMP;
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
  v_wsdc_id := api.normalize_wsdc_id(p_wsdc_id);

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

  IF v_wsdc_id IS NOT NULL THEN
    v_additional_info := json_build_object(
      'wsdc',
      json_build_object(
        'wsdc_id', v_wsdc_id,
        'last_update_datetime', api.format_wsdc_update_timestamp(v_now)
      )
    );
  ELSE
    v_additional_info := NULL;
  END IF;

  INSERT INTO public."user" (
    username,
    password_encrypted,
    name_json,
    email,
    phone_numbers_json,
    addresses_json,
    password_recovery_json,
    additional_info_json,
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
    v_additional_info,
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
    'email', v_email,
    'wsdc_id', v_wsdc_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.set_user_wsdc_id(
  p_user_id bigint,
  p_wsdc_id text,
  p_wsdc_info json DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_actor_username text;
  v_target_id bigint;
  v_wsdc_id text;
  v_info jsonb;
  v_wsdc jsonb;
  v_now timestamptz := CURRENT_TIMESTAMP;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to save a WSDC ID.');
  END IF;

  v_target_id := p_user_id;

  IF v_target_id IS NULL THEN
    v_target_id := v_actor_id;
  END IF;

  IF v_target_id <> v_actor_id AND NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Only an admin can set another user''s WSDC ID.'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public."user" u
    WHERE u.user_id = v_target_id
      AND u.active IS NOT FALSE
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'User not found.');
  END IF;

  v_actor_username := api.resolve_audit_actor(NULL);

  IF v_actor_username IS NULL THEN
    SELECT u.username
    INTO v_actor_username
    FROM public."user" u
    WHERE u.user_id = v_actor_id;
  END IF;

  PERFORM api.set_audit_actor(v_actor_username);

  SELECT COALESCE(u.additional_info_json, '{}'::json)::jsonb
  INTO v_info
  FROM public."user" u
  WHERE u.user_id = v_target_id;

  v_wsdc_id := api.normalize_wsdc_id(p_wsdc_id);

  IF v_wsdc_id IS NULL AND p_wsdc_info IS NULL THEN
    v_info := (v_info - 'wsdc') - 'wsdc_id';
  ELSE
    v_wsdc := api.build_user_wsdc_object(v_info, v_wsdc_id, p_wsdc_info);
    v_wsdc_id := api.normalize_wsdc_id(v_wsdc ->> 'wsdc_id');
    v_wsdc := v_wsdc || jsonb_build_object(
      'last_update_datetime',
      to_jsonb(api.format_wsdc_update_timestamp(v_now))
    );
    v_info := (v_info - 'wsdc_id') || jsonb_build_object('wsdc', v_wsdc);
  END IF;

  UPDATE public."user" u
  SET
    additional_info_json = CASE
      WHEN v_info = '{}'::jsonb THEN NULL
      ELSE v_info::json
    END,
    modified_by = v_actor_username,
    modified_date = v_now
  WHERE u.user_id = v_target_id;

  RETURN json_build_object(
    'ok', true,
    'message', CASE
      WHEN v_wsdc_id IS NULL AND p_wsdc_info IS NULL THEN 'WSDC info cleared.'
      ELSE 'WSDC info saved.'
    END,
    'user_id', v_target_id,
    'wsdc_id', v_wsdc_id,
    'wsdc', CASE
      WHEN v_wsdc_id IS NULL AND p_wsdc_info IS NULL THEN NULL
      ELSE (v_info -> 'wsdc')
    END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.format_wsdc_update_timestamp(timestamptz) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
