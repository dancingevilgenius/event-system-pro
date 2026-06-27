-- Unify row audit columns: created_date, created_by, modified_date, modified_by.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/024_unify_audit_columns.sql

\connect event_system_pro

-- ---------------------------------------------------------------------------
-- Renames (no-op when baseline schema already uses unified names)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION pg_temp.rename_column_if_exists(
  p_table regclass,
  p_old text,
  p_new text
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_attribute a
    WHERE a.attrelid = p_table
      AND a.attname = p_old
      AND a.attnum > 0
      AND NOT a.attisdropped
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_attribute a
    WHERE a.attrelid = p_table
      AND a.attname = p_new
      AND a.attnum > 0
      AND NOT a.attisdropped
  ) THEN
    EXECUTE format('ALTER TABLE %s RENAME COLUMN %I TO %I', p_table, p_old, p_new);
  END IF;
END;
$$;

SELECT pg_temp.rename_column_if_exists('public.charter'::regclass, 'updated_date', 'modified_date');
SELECT pg_temp.rename_column_if_exists('public.charter'::regclass, 'updated_by', 'modified_by');

SELECT pg_temp.rename_column_if_exists('public.event'::regclass, 'updated_date', 'modified_date');
SELECT pg_temp.rename_column_if_exists('public.event'::regclass, 'updated_by', 'modified_by');

SELECT pg_temp.rename_column_if_exists('public."user"'::regclass, 'updated_date', 'modified_date');
SELECT pg_temp.rename_column_if_exists('public."user"'::regclass, 'updated_by', 'modified_by');

SELECT pg_temp.rename_column_if_exists('public.user_preference'::regclass, 'updated_date', 'modified_date');
SELECT pg_temp.rename_column_if_exists('public.user_preference'::regclass, 'updated_by', 'modified_by');

SELECT pg_temp.rename_column_if_exists('public.system_config'::regclass, 'updated_date', 'modified_date');
SELECT pg_temp.rename_column_if_exists('public.system_config'::regclass, 'updated_by', 'modified_by');

SELECT pg_temp.rename_column_if_exists('public.image'::regclass, 'updated_date', 'modified_date');

SELECT pg_temp.rename_column_if_exists('public.contest_heat'::regclass, 'updated_date', 'modified_date');
SELECT pg_temp.rename_column_if_exists('public.contest_heat'::regclass, 'updated_by', 'modified_by');

-- judging_panel legacy names (table added in 016; may already use unified names)
DO $$
BEGIN
  IF to_regclass('public.judging_panel') IS NOT NULL THEN
    PERFORM pg_temp.rename_column_if_exists('public.judging_panel'::regclass, 'created_on', 'created_date');
    PERFORM pg_temp.rename_column_if_exists('public.judging_panel'::regclass, 'last_modified_on', 'modified_date');
    PERFORM pg_temp.rename_column_if_exists('public.judging_panel'::regclass, 'last_modified_by', 'modified_by');
  END IF;
END $$;

-- auth helper tables (added in 011/018; may already use created_date)
DO $$
BEGIN
  IF to_regclass('public.user_app_role') IS NOT NULL THEN
    PERFORM pg_temp.rename_column_if_exists('public.user_app_role'::regclass, 'created_at', 'created_date');
  END IF;
  IF to_regclass('public.user_password_reset') IS NOT NULL THEN
    PERFORM pg_temp.rename_column_if_exists('public.user_password_reset'::regclass, 'created_at', 'created_date');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Add missing audit columns
-- ---------------------------------------------------------------------------

ALTER TABLE public.competitor_type_lu
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.country_lu
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.us_state_lu
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.skill_level_lu
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.competitor
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.contact
  ADD COLUMN IF NOT EXISTS created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.secret_question_lu
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.event_type_lu
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.image
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.user_app_role
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

ALTER TABLE public.user_password_reset
  ADD COLUMN IF NOT EXISTS created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  ADD COLUMN IF NOT EXISTS modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS modified_by varchar(128) NULL DEFAULT NULL;

-- ---------------------------------------------------------------------------
-- PostgREST views (column renames on underlying tables)
-- DROP required: CREATE OR REPLACE cannot rename view output columns.
-- ---------------------------------------------------------------------------

DROP VIEW IF EXISTS api.event;
CREATE VIEW api.event AS
SELECT
  event_id,
  fight_event_group_code,
  name,
  contact_user_id,
  host_charter_id,
  country_code,
  state_or_province,
  location_json,
  active,
  number_of_days,
  start_date,
  end_date,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."event"
WHERE active IS NOT FALSE;

DROP VIEW IF EXISTS api."user";
CREATE VIEW api."user" AS
SELECT
  user_id,
  username,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  additional_info_json,
  addresses_json,
  active,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."user"
WHERE active IS NOT FALSE;

DROP VIEW IF EXISTS api.judging_panel;
CREATE VIEW api.judging_panel AS
SELECT
  judging_panel_id,
  event_id,
  contest_id,
  judges_json,
  created_by,
  created_date,
  modified_by,
  modified_date
FROM public.judging_panel;

GRANT SELECT ON api.event, api."user", api.judging_panel TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPCs referencing renamed user audit columns
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

CREATE OR REPLACE FUNCTION api.forgot_password_verify(p_email text, p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_reset public.user_password_reset%ROWTYPE;
BEGIN
  SELECT u.user_id
  INTO v_user_id
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

  RETURN json_build_object('ok', true, 'message', 'Verification code accepted.');
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
    'username', trim(p_username),
    'email', lower(trim(p_email))
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
