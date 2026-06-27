-- Treat stale last-activity as inactive in session_status (no scheduler required).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/035_session_status_stale_activity.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.is_last_activity_stale(p_info json)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT
    p_info IS NOT NULL
    AND (p_info::jsonb ->> 'last-activity') IS NOT NULL
    AND api.parse_activity_timestamp(p_info::jsonb ->> 'last-activity')
        <= api.activity_timestamp() - INTERVAL '10 minutes';
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

  IF NOT api.user_session_is_active(v_info)
     OR api.is_last_activity_stale(v_info) THEN
    RETURN json_build_object(
      'ok', true,
      'active', false,
      'message', 'You have been signed out due to inactivity to protect your account.',
      'last-activity', v_info::jsonb -> 'last-activity'
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
BEGIN
  PERFORM api.set_audit_actor('maintenance');

  UPDATE public."user" AS u
  SET additional_info_json = (
    COALESCE(u.additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object('inactive_logout_at', to_jsonb(api.activity_timestamp()))
  )::json
  WHERE u.active IS NOT FALSE
    AND (u.additional_info_json::jsonb ->> 'last_login_at') IS NOT NULL
    AND api.user_session_is_active(u.additional_info_json)
    AND api.is_last_activity_stale(u.additional_info_json);

  GET DIAGNOSTICS v_marked = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'inactive_sessions_marked', v_marked
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
