-- session_status: treat a session as inactive only when the inactivity_logout
-- cron has stamped inactive_logout_at (user_session_is_active). Do not treat
-- stale last-activity as inactive without the scheduler.
-- Drop activity_expires_at (was only for the removed client local timer).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/132_session_status_cron_only_inactivity.sql

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

NOTIFY pgrst, 'reload schema';
