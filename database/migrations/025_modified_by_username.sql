-- Use logged-in username for modified_by on row updates (JWT); RPCs set username explicitly when unauthenticated.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/025_modified_by_username.sql

\connect event_system_pro

-- ---------------------------------------------------------------------------
-- JWT: include username claim on login
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION api.login(p_identifier text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_roles json;
  v_role_codes text[];
  v_secret text;
  v_token text;
BEGIN
  IF p_identifier IS NULL OR trim(p_identifier) = ''
     OR p_password IS NULL OR trim(p_password) = '' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Enter your username or email and password.'
    );
  END IF;

  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE (lower(u.email) = lower(trim(p_identifier))
      OR lower(u.username) = lower(trim(p_identifier)))
    AND u.active IS NOT FALSE
  ORDER BY u.user_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'No account found for that username or email.'
    );
  END IF;

  IF v_user.password_encrypted IS NULL
     OR v_user.password_encrypted NOT LIKE '$2%'
     OR crypt(trim(p_password), v_user.password_encrypted) <> v_user.password_encrypted THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Incorrect password.'
    );
  END IF;

  SELECT COALESCE(json_agg(r.role_code ORDER BY r.role_code), '[]'::json)
  INTO v_roles
  FROM public.user_app_role r
  WHERE r.user_id = v_user.user_id;

  SELECT COALESCE(array_agg(r.role_code ORDER BY r.role_code), ARRAY[]::text[])
  INTO v_role_codes
  FROM public.user_app_role r
  WHERE r.user_id = v_user.user_id;

  v_secret := current_setting('app.jwt_secret', true);
  v_token := api.sign_jwt_hs256(
    json_build_object(
      'role', 'authenticated',
      'sub', v_user.user_id::text,
      'username', v_user.username,
      'app_roles', to_jsonb(v_role_codes)
    ),
    v_secret
  );

  RETURN json_build_object(
    'ok', true,
    'message', 'Signed in successfully.',
    'user_id', v_user.user_id,
    'username', v_user.username,
    'email', v_user.email,
    'roles', v_roles,
    'token', v_token
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Helper: username from JWT (falls back to sub -> user row)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION api.current_username()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.username', true), ''),
    (
      SELECT u.username
      FROM public."user" u
      WHERE u.user_id = api.current_user_id()
    )
  );
$$;

GRANT EXECUTE ON FUNCTION api.current_username() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- BEFORE UPDATE trigger: set modified_* when a JWT identifies the user
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_row_modified_audit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, api
AS $$
DECLARE
  v_username text;
BEGIN
  v_username := api.current_username();
  IF v_username IS NOT NULL THEN
    NEW.modified_by := v_username;
    NEW.modified_date := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.oid, c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND EXISTS (
        SELECT 1 FROM pg_attribute a
        WHERE a.attrelid = c.oid AND a.attname = 'modified_by'
          AND a.attnum > 0 AND NOT a.attisdropped
      )
      AND EXISTS (
        SELECT 1 FROM pg_attribute a
        WHERE a.attrelid = c.oid AND a.attname = 'modified_date'
          AND a.attnum > 0 AND NOT a.attisdropped
      )
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_modified_audit ON %s;
       CREATE TRIGGER trg_set_modified_audit
         BEFORE UPDATE ON %s
         FOR EACH ROW
         EXECUTE FUNCTION public.set_row_modified_audit();',
      r.oid::regclass,
      r.oid::regclass
    );
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- RPCs: modified_by = acting user's username
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION api.change_password(
  p_user_id bigint,
  p_old_password text,
  p_new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to change your password.');
  END IF;

  IF p_old_password IS NULL OR trim(p_old_password) = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Enter your current password.');
  END IF;

  IF p_new_password IS NULL OR length(trim(p_new_password)) < 8 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'New password must be at least 8 characters.'
    );
  END IF;

  IF trim(p_old_password) = trim(p_new_password) THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'New password must be different from your current password.'
    );
  END IF;

  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE u.user_id = p_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Account not found.');
  END IF;

  IF v_user.password_encrypted IS NULL
     OR v_user.password_encrypted NOT LIKE '$2%'
     OR crypt(trim(p_old_password), v_user.password_encrypted) <> v_user.password_encrypted THEN
    RETURN json_build_object('ok', false, 'message', 'Current password is incorrect.');
  END IF;

  UPDATE public."user"
  SET password_encrypted = crypt(trim(p_new_password), gen_salt('bf')),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_user.username
  WHERE user_id = v_user.user_id;

  RETURN json_build_object('ok', true, 'message', 'Your password has been updated.');
END;
$$;

CREATE OR REPLACE FUNCTION api.forgot_password_complete(
  p_email text,
  p_code text,
  p_new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_reset public.user_password_reset%ROWTYPE;
BEGIN
  IF p_new_password IS NULL OR length(trim(p_new_password)) < 8 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Password must be at least 8 characters.'
    );
  END IF;

  SELECT u.user_id, u.username
  INTO v_user_id, v_username
  FROM public."user" u
  WHERE lower(u.email) = lower(trim(p_email))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Invalid verification code.');
  END IF;

  SELECT *
  INTO v_reset
  FROM public.user_password_reset r
  WHERE r.user_id = v_user_id
    AND r.used_at IS NULL
    AND r.expires_at > NOW()
  ORDER BY r.created_date DESC
  LIMIT 1;

  IF NOT FOUND OR crypt(trim(p_code), v_reset.code_hash) <> v_reset.code_hash THEN
    RETURN json_build_object('ok', false, 'message', 'Invalid or expired verification code.');
  END IF;

  UPDATE public."user"
  SET password_encrypted = crypt(trim(p_new_password), gen_salt('bf')),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_username
  WHERE user_id = v_user_id;

  UPDATE public.user_password_reset
  SET used_at = NOW(),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_username
  WHERE reset_id = v_reset.reset_id;

  RETURN json_build_object('ok', true, 'message', 'Your password has been updated.');
END;
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

  IF p_email IS NULL OR trim(p_email) = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Email is required.');
  END IF;

  IF EXISTS (SELECT 1 FROM public."user" u WHERE lower(u.username) = lower(trim(p_username))) THEN
    RETURN json_build_object('ok', false, 'message', 'That username is already taken.');
  END IF;

  IF EXISTS (SELECT 1 FROM public."user" u WHERE lower(u.email) = lower(trim(p_email))) THEN
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
    'username', trim(p_username)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.change_password(bigint, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.forgot_password_complete(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.register_user(text, text, text, json, json, json, json) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
