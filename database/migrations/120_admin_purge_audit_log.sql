-- Admin-only audit log purge for dev deployments (app.allow_audit_purge).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/120_admin_purge_audit_log.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.admin_purge_audit_log(p_confirmation_secret text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_secret text;
  v_deleted_count bigint;
  v_now timestamptz;
  v_purged_at text;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'You are not signed in.'
    );
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  IF COALESCE(current_setting('app.allow_audit_purge', true), '') <> 'true' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Audit log purge is not available in this environment.'
    );
  END IF;

  v_secret := trim(COALESCE(p_confirmation_secret, ''));

  IF v_secret = '' OR v_secret NOT LIKE 'DefyantYorkie%' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Confirmation secret is invalid.'
    );
  END IF;

  SELECT u.username
  INTO v_username
  FROM public."user" u
  WHERE u.user_id = v_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Account not found.'
    );
  END IF;

  SELECT COUNT(*)::bigint
  INTO v_deleted_count
  FROM public.audit_log;

  TRUNCATE public.audit_log RESTART IDENTITY;

  v_now := date_trunc('second', api.activity_timestamp());
  v_purged_at := api.format_activity_timestamp(v_now);
  PERFORM api.set_audit_actor(v_username);

  PERFORM api.record_audit_event(
    p_action => 'AUDIT_PURGE',
    p_actor_user_id => v_user_id,
    p_actor_username => v_username,
    p_table_name => 'audit_log',
    p_metadata => jsonb_build_object(
      'deleted_count', v_deleted_count,
      'purged_at', v_purged_at
    )
  );

  RETURN json_build_object(
    'ok', true,
    'message', format(
      'Deleted %s audit event(s). One AUDIT_PURGE record retained.',
      v_deleted_count
    ),
    'deleted_count', v_deleted_count
  );
END;
$$;

REVOKE ALL ON FUNCTION api.admin_purge_audit_log(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.admin_purge_audit_log(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
