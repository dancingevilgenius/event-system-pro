-- audit_log: unified action trail (auth events now; table CRUD triggers later).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/073_audit_log.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.audit_log (
  audit_id bigserial PRIMARY KEY,
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action varchar(64) NOT NULL,
  actor_user_id bigint NULL,
  actor_username varchar(128) NULL,
  table_name varchar(128) NULL,
  record_key text NULL,
  old_data jsonb NULL,
  new_data jsonb NULL,
  metadata jsonb NULL,
  created_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL,
  modified_date timestamptz NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS audit_log_occurred_at_idx
  ON public.audit_log (occurred_at DESC);

CREATE INDEX IF NOT EXISTS audit_log_action_idx
  ON public.audit_log (action);

CREATE INDEX IF NOT EXISTS audit_log_actor_user_id_idx
  ON public.audit_log (actor_user_id);

CREATE INDEX IF NOT EXISTS audit_log_table_record_idx
  ON public.audit_log (table_name, record_key);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_log_select_admin ON public.audit_log;
CREATE POLICY audit_log_select_admin ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (api.has_app_role('admin'));

REVOKE INSERT, UPDATE, DELETE ON public.audit_log FROM anon, authenticated;

CREATE OR REPLACE FUNCTION api.record_audit_event(
  p_action text,
  p_actor_user_id bigint DEFAULT NULL,
  p_actor_username text DEFAULT NULL,
  p_table_name text DEFAULT NULL,
  p_record_key text DEFAULT NULL,
  p_old_data jsonb DEFAULT NULL,
  p_new_data jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_action text;
  v_actor_username text;
  v_audit_id bigint;
BEGIN
  v_action := upper(trim(COALESCE(p_action, '')));
  IF v_action = '' THEN
    RAISE EXCEPTION 'audit action is required';
  END IF;

  v_actor_username := COALESCE(
    NULLIF(trim(p_actor_username), ''),
    api.resolve_audit_actor(NULL),
    CASE
      WHEN p_actor_user_id IS NOT NULL THEN 'user:' || p_actor_user_id::text
      ELSE NULL
    END,
    'system'
  );

  INSERT INTO public.audit_log (
    action,
    actor_user_id,
    actor_username,
    table_name,
    record_key,
    old_data,
    new_data,
    metadata,
    created_by
  ) VALUES (
    v_action,
    p_actor_user_id,
    v_actor_username,
    NULLIF(trim(p_table_name), ''),
    NULLIF(trim(p_record_key), ''),
    p_old_data,
    p_new_data,
    p_metadata,
    v_actor_username
  )
  RETURNING audit_id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$;

GRANT EXECUTE ON FUNCTION api.record_audit_event(
  text, bigint, text, text, text, jsonb, jsonb, jsonb
) TO anon, authenticated;

DROP VIEW IF EXISTS api.audit_log;

CREATE VIEW api.audit_log AS
SELECT
  audit_id,
  occurred_at,
  action,
  actor_user_id,
  actor_username,
  table_name,
  record_key,
  old_data,
  new_data,
  metadata,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.audit_log;

GRANT SELECT ON api.audit_log TO authenticated;

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
  PERFORM api.set_audit_actor(v_user.username);

  UPDATE public."user"
  SET additional_info_json = (
    (COALESCE(additional_info_json, '{}'::json)::jsonb - 'inactive_logout_at')
    || jsonb_build_object(
      'last_login_at', to_jsonb(v_now),
      'last-activity', to_jsonb(api.format_activity_timestamp(v_now))
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
  PERFORM api.set_audit_actor(v_username);

  UPDATE public."user"
  SET additional_info_json = (
    COALESCE(additional_info_json, '{}'::json)::jsonb
    || jsonb_build_object('last_logout_at', to_jsonb(v_now))
  )::json
  WHERE user_id = v_user_id;

  PERFORM api.record_audit_event(
    p_action => 'LOGOUT',
    p_actor_user_id => v_user_id,
    p_actor_username => v_username,
    p_table_name => 'user',
    p_record_key => v_user_id::text,
    p_metadata => jsonb_build_object('logout_at', to_jsonb(v_now))
  );

  RETURN json_build_object('ok', true, 'message', 'You have been signed out.');
END;
$$;

GRANT EXECUTE ON FUNCTION api.login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.logout() TO authenticated;

NOTIFY pgrst, 'reload schema';
