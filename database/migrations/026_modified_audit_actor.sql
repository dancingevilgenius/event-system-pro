-- Reliable modified_by / modified_date for app-initiated changes (RPC + REST PATCH).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/026_modified_audit_actor.sql

\connect event_system_pro

-- ---------------------------------------------------------------------------
-- Session actor (RPCs) + JWT username (REST) -> modified_* on UPDATE
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION api.set_audit_actor(p_username text)
RETURNS void
LANGUAGE sql
SET search_path = public, api
AS $$
  SELECT set_config(
    'app.audit_actor',
    COALESCE(NULLIF(trim(p_username), ''), ''),
    true
  );
$$;

CREATE OR REPLACE FUNCTION api.resolve_audit_actor(p_fallback text DEFAULT NULL)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('app.audit_actor', true), ''),
    api.current_username(),
    NULLIF(trim(p_fallback), '')
  );
$$;

GRANT EXECUTE ON FUNCTION api.set_audit_actor(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.resolve_audit_actor(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_row_modified_audit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, api
AS $$
DECLARE
  v_actor text;
BEGIN
  v_actor := api.resolve_audit_actor(NULL);
  IF v_actor IS NOT NULL THEN
    NEW.modified_by := v_actor;
    NEW.modified_date := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;

-- Only tables with timestamptz modified_date (skip legacy contest / contest_heat types).
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.oid
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_attribute a ON a.attrelid = c.oid AND a.attname = 'modified_date'
    JOIN pg_type t ON t.oid = a.atttypid
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND NOT a.attisdropped
      AND t.typname = 'timestamptz'
      AND EXISTS (
        SELECT 1 FROM pg_attribute ab
        WHERE ab.attrelid = c.oid AND ab.attname = 'modified_by'
          AND ab.attnum > 0 AND NOT ab.attisdropped
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

  -- Drop trigger on legacy tables if a prior migration attached it.
  IF to_regclass('public.contest') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_set_modified_audit ON public.contest';
  END IF;
  IF to_regclass('public.contest_heat') IS NOT NULL THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_set_modified_audit ON public.contest_heat';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- RPCs: set audit actor before UPDATE (works inside SECURITY DEFINER)
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
  v_actor text;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to change your password.');
  END IF;

  IF api.current_user_id() IS NOT NULL AND api.current_user_id() <> p_user_id THEN
    RETURN json_build_object('ok', false, 'message', 'You can only change your own password.');
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

  v_actor := api.resolve_audit_actor(v_user.username);
  PERFORM api.set_audit_actor(v_actor);

  UPDATE public."user"
  SET password_encrypted = crypt(trim(p_new_password), gen_salt('bf')),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_actor
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

  PERFORM api.set_audit_actor(v_username);

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

CREATE OR REPLACE FUNCTION api._issue_password_reset_for_identifier(p_identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_code text;
  v_code_hash text;
BEGIN
  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE lower(u.email) = lower(trim(p_identifier))
     OR lower(u.username) = lower(trim(p_identifier))
  ORDER BY u.user_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', true,
      'message', 'If an account exists for that email or username, a verification code has been sent.'
    );
  END IF;

  v_code := lpad((floor(random() * 1000000)::int)::text, 6, '0');
  v_code_hash := crypt(v_code, gen_salt('bf'));

  PERFORM api.set_audit_actor(v_user.username);

  UPDATE public.user_password_reset
  SET used_at = NOW(),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_user.username
  WHERE user_id = v_user.user_id
    AND used_at IS NULL;

  INSERT INTO public.user_password_reset (user_id, code_hash, expires_at, created_by)
  VALUES (v_user.user_id, v_code_hash, NOW() + INTERVAL '15 minutes', v_user.username);

  RETURN json_build_object(
    'ok', true,
    'message', 'If an account exists for that email or username, a verification code has been sent.',
    'email', v_user.email,
    'verification_code', v_code
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.change_password(bigint, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.forgot_password_complete(text, text, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
