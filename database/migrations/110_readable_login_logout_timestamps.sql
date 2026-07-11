-- Store last_login_at / last_logout_at as readable strings (not ISO-8601).
-- Example: Jul 11, 2026, 5:42:28 AM CDT
-- Also parse session comparisons via api.parse_activity_timestamp.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/110_readable_login_logout_timestamps.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.user_session_is_active(p_info json)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT NOT (
    p_info IS NOT NULL
    AND (p_info::jsonb ->> 'inactive_logout_at') IS NOT NULL
    AND (p_info::jsonb ->> 'last_login_at') IS NOT NULL
    AND api.parse_activity_timestamp(p_info::jsonb ->> 'inactive_logout_at')
        >= api.parse_activity_timestamp(p_info::jsonb ->> 'last_login_at')
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
  v_identifier text;
  v_formatted text;
BEGIN
  v_identifier := trim(COALESCE(p_identifier, ''));

  IF v_identifier = '' OR p_password IS NULL OR trim(p_password) = '' THEN
    PERFORM api.record_audit_event(
      p_action => 'LOGIN_FAILED',
      p_metadata => jsonb_build_object(
        'reason', 'missing_credentials',
        'identifier', v_identifier
      )
    );

    RETURN json_build_object(
      'ok', false,
      'message', 'Enter your username or email and password.'
    );
  END IF;

  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE (lower(u.email) = lower(v_identifier)
      OR lower(u.username) = lower(v_identifier))
    AND u.active IS NOT FALSE
  ORDER BY u.user_id
  LIMIT 1;

  IF NOT FOUND THEN
    PERFORM api.record_audit_event(
      p_action => 'LOGIN_FAILED',
      p_metadata => jsonb_build_object(
        'reason', 'account_not_found',
        'identifier', v_identifier
      )
    );

    RETURN json_build_object(
      'ok', false,
      'message', 'No account found for that username or email.'
    );
  END IF;

  IF v_user.password_encrypted IS NULL
     OR v_user.password_encrypted NOT LIKE '$2%'
     OR crypt(trim(p_password), v_user.password_encrypted) <> v_user.password_encrypted THEN
    PERFORM api.record_audit_event(
      p_action => 'LOGIN_FAILED',
      p_actor_user_id => v_user.user_id,
      p_actor_username => v_user.username,
      p_table_name => 'user',
      p_record_key => v_user.user_id::text,
      p_metadata => jsonb_build_object(
        'reason', 'incorrect_password',
        'identifier', v_identifier
      )
    );

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
  v_formatted := api.format_activity_timestamp(v_now);
  PERFORM api.set_audit_actor(v_user.username);

  UPDATE public."user"
  SET additional_info_json = (
    (COALESCE(additional_info_json, '{}'::json)::jsonb - 'inactive_logout_at')
    || jsonb_build_object(
      'last_login_at', to_jsonb(v_formatted),
      'last-activity', to_jsonb(v_formatted)
    )
  )::json
  WHERE user_id = v_user.user_id;

  PERFORM api.record_audit_event(
    p_action => 'LOGIN',
    p_actor_user_id => v_user.user_id,
    p_actor_username => v_user.username,
    p_table_name => 'user',
    p_record_key => v_user.user_id::text,
    p_metadata => jsonb_build_object(
      'identifier', v_identifier,
      'roles', to_jsonb(v_role_codes)
    )
  );

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

CREATE OR REPLACE FUNCTION api.logout()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_now timestamptz;
  v_formatted text;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'You are not signed in.');
  END IF;

  SELECT u.username
  INTO v_username
  FROM public."user" u
  WHERE u.user_id = v_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Account not found.');
  END IF;

  v_now := api.activity_timestamp();
  v_formatted := api.format_activity_timestamp(v_now);
  PERFORM api.set_audit_actor(v_username);

  UPDATE public."user"
  SET additional_info_json = (
    COALESCE(additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object('last_logout_at', to_jsonb(v_formatted))
  )::json
  WHERE user_id = v_user_id;

  PERFORM api.record_audit_event(
    p_action => 'LOGOUT',
    p_actor_user_id => v_user_id,
    p_actor_username => v_username,
    p_table_name => 'user',
    p_record_key => v_user_id::text,
    p_metadata => jsonb_build_object('logout_at', to_jsonb(v_formatted))
  );

  RETURN json_build_object('ok', true, 'message', 'You have been signed out.');
END;
$$;

-- Include last_logout_at in session-only audit skip keys.
CREATE OR REPLACE FUNCTION public.audit_user_session_info_keys()
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ARRAY[
    'last-activity',
    'last_login_at',
    'last_logout_at',
    'inactive_logout_at'
  ]::text[];
$$;

CREATE OR REPLACE FUNCTION api.inactivity_logout()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_marked integer;
BEGIN
  IF NOT pg_try_advisory_xact_lock(901001, hashtext('inactivity_logout')) THEN
    RETURN json_build_object(
      'ok', true,
      'skipped', true,
      'reason', 'already_running'
    );
  END IF;

  PERFORM api.set_audit_actor('maintenance');

  UPDATE public."user" AS u
  SET additional_info_json = (
    COALESCE(u.additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object(
      'inactive_logout_at',
      to_jsonb(api.format_activity_timestamp(api.activity_timestamp()))
    )
  )::json
  WHERE u.active IS NOT FALSE
    AND (u.additional_info_json::jsonb ->> 'last_login_at') IS NOT NULL
    AND api.user_session_is_active(u.additional_info_json)
    AND api.is_last_activity_stale(u.additional_info_json);

  GET DIAGNOSTICS v_marked = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'skipped', false,
    'inactive_sessions_marked', v_marked
  );
END;
$$;

-- One-time: convert existing ISO login/logout strings to readable format.
UPDATE public."user" u
SET
  additional_info_json = (
    WITH info AS (
      SELECT COALESCE(u.additional_info_json, '{}'::json)::jsonb AS j
    ),
    converted AS (
      SELECT
        j
        || CASE
          WHEN (j ->> 'last_login_at') ~ '^\d{4}-\d{2}-\d{2}' THEN
            jsonb_build_object(
              'last_login_at',
              to_jsonb(
                api.format_activity_timestamp(
                  api.parse_activity_timestamp(j ->> 'last_login_at')
                )
              )
            )
          ELSE '{}'::jsonb
        END
        || CASE
          WHEN (j ->> 'last_logout_at') ~ '^\d{4}-\d{2}-\d{2}' THEN
            jsonb_build_object(
              'last_logout_at',
              to_jsonb(
                api.format_activity_timestamp(
                  api.parse_activity_timestamp(j ->> 'last_logout_at')
                )
              )
            )
          ELSE '{}'::jsonb
        END
        || CASE
          WHEN (j ->> 'inactive_logout_at') ~ '^\d{4}-\d{2}-\d{2}' THEN
            jsonb_build_object(
              'inactive_logout_at',
              to_jsonb(
                api.format_activity_timestamp(
                  api.parse_activity_timestamp(j ->> 'inactive_logout_at')
                )
              )
            )
          ELSE '{}'::jsonb
        END AS next_j
      FROM info
    )
    SELECT next_j::json FROM converted
  ),
  modified_by = 'c-agent',
  modified_date = CURRENT_TIMESTAMP
WHERE u.additional_info_json IS NOT NULL
  AND (
    (u.additional_info_json::jsonb ->> 'last_login_at') ~ '^\d{4}-\d{2}-\d{2}'
    OR (u.additional_info_json::jsonb ->> 'last_logout_at') ~ '^\d{4}-\d{2}-\d{2}'
    OR (u.additional_info_json::jsonb ->> 'inactive_logout_at') ~ '^\d{4}-\d{2}-\d{2}'
  );

GRANT EXECUTE ON FUNCTION api.login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.logout() TO authenticated;

NOTIFY pgrst, 'reload schema';
