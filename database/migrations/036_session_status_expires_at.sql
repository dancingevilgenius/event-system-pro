-- Return activity_expires_at from session_status for front-end inactivity timer sync.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/036_session_status_expires_at.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.session_status()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_info json;
  v_last_activity timestamptz;
  v_expires_at timestamptz;
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

  v_last_activity := api.parse_activity_timestamp(v_info::jsonb ->> 'last-activity');
  IF v_last_activity IS NOT NULL THEN
    v_expires_at := date_trunc('second', v_last_activity + INTERVAL '10 minutes');
  END IF;

  IF NOT api.user_session_is_active(v_info)
     OR api.is_last_activity_stale(v_info) THEN
    RETURN json_build_object(
      'ok', true,
      'active', false,
      'message', 'You have been signed out due to inactivity to protect your account.',
      'last-activity', v_info::jsonb -> 'last-activity',
      'activity_expires_at', CASE WHEN v_expires_at IS NULL THEN NULL ELSE to_json(v_expires_at) END
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'active', true,
    'last-activity', v_info::jsonb -> 'last-activity',
    'activity_expires_at', CASE WHEN v_expires_at IS NULL THEN NULL ELSE to_json(v_expires_at) END
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
