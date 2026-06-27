-- User inactivity tracking and scheduled inactive sign-out.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/033_inactivity_logout.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.activity_timestamp()
RETURNS timestamptz
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT date_trunc('second', NOW()::timestamptz);
$$;

CREATE OR REPLACE FUNCTION api.user_session_is_active(p_info json)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NOT (
    p_info IS NOT NULL
    AND (p_info::jsonb ->> 'inactive_logout_at') IS NOT NULL
    AND (p_info::jsonb ->> 'last_login_at') IS NOT NULL
    AND (p_info::jsonb ->> 'inactive_logout_at')::timestamptz
        >= (p_info::jsonb ->> 'last_login_at')::timestamptz
  );
$$;

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
  v_now timestamptz;
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

  v_now := api.activity_timestamp();
  PERFORM api.set_audit_actor(v_user.username);

  UPDATE public."user"
  SET additional_info_json = (
    (COALESCE(additional_info_json, '{}'::json)::jsonb - 'inactive_logout_at')
    || jsonb_build_object(
      'last_login_at', to_jsonb(v_now),
      'last-activity', to_jsonb(v_now)
    )
  )::json
  WHERE user_id = v_user.user_id;

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

CREATE OR REPLACE FUNCTION api.touch_last_activity()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_info json;
  v_now timestamptz;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'active', false,
      'message', 'You are not signed in.'
    );
  END IF;

  SELECT u.username, u.additional_info_json
  INTO v_username, v_info
  FROM public."user" u
  WHERE u.user_id = v_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'active', false,
      'message', 'Account not found.'
    );
  END IF;

  IF NOT api.user_session_is_active(v_info) THEN
    RETURN json_build_object(
      'ok', true,
      'active', false,
      'message', 'You have been signed out due to inactivity to protect your account.'
    );
  END IF;

  v_now := api.activity_timestamp();
  PERFORM api.set_audit_actor(v_username);

  UPDATE public."user"
  SET additional_info_json = (
    COALESCE(additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object('last-activity', to_jsonb(v_now))
  )::json
  WHERE user_id = v_user_id;

  RETURN json_build_object(
    'ok', true,
    'active', true,
    'last-activity', to_json(v_now)
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.session_status()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_info json;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'active', false,
      'message', 'You are not signed in.'
    );
  END IF;

  SELECT u.additional_info_json
  INTO v_info
  FROM public."user" u
  WHERE u.user_id = v_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'active', false,
      'message', 'Account not found.'
    );
  END IF;

  IF NOT api.user_session_is_active(v_info) THEN
    RETURN json_build_object(
      'ok', true,
      'active', false,
      'message', 'You have been signed out due to inactivity to protect your account.'
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'active', true,
    'last-activity', v_info::jsonb -> 'last-activity'
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.inactivity_logout()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_marked integer;
  v_cutoff timestamptz;
BEGIN
  PERFORM api.set_audit_actor('maintenance');

  v_cutoff := api.activity_timestamp() - INTERVAL '10 minutes';

  UPDATE public."user" AS u
  SET additional_info_json = (
    COALESCE(u.additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object('inactive_logout_at', to_jsonb(api.activity_timestamp()))
  )::json
  WHERE u.active IS NOT FALSE
    AND (u.additional_info_json::jsonb ->> 'last-activity') IS NOT NULL
    AND (u.additional_info_json::jsonb ->> 'last-activity')::timestamptz <= v_cutoff
    AND (u.additional_info_json::jsonb ->> 'last_login_at') IS NOT NULL
    AND api.user_session_is_active(u.additional_info_json);

  GET DIAGNOSTICS v_marked = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'inactive_sessions_marked', v_marked
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.touch_last_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION api.session_status() TO authenticated;

REVOKE ALL ON FUNCTION api.inactivity_logout() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.inactivity_logout() TO maintenance;

NOTIFY pgrst, 'reload schema';
