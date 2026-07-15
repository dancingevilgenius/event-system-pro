-- Admin-only RPC to update a user's first/last name, username, and optional password.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/128_admin_update_user.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.admin_update_user(
  p_user_id bigint,
  p_first_name text,
  p_last_name text,
  p_username text,
  p_new_password text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_user_id bigint;
  v_actor_username text;
  v_target public."user"%ROWTYPE;
  v_username text;
  v_first text;
  v_last text;
  v_display text;
  v_password text;
  v_name_json jsonb;
BEGIN
  v_actor_user_id := api.current_user_id();

  IF v_actor_user_id IS NULL THEN
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

  IF p_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'User id is required.'
    );
  END IF;

  v_username := trim(COALESCE(p_username, ''));
  v_first := trim(COALESCE(p_first_name, ''));
  v_last := trim(COALESCE(p_last_name, ''));
  v_password := NULLIF(trim(COALESCE(p_new_password, '')), '');

  IF v_username = '' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Username is required.'
    );
  END IF;

  IF length(v_username) > 64 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Username must be 64 characters or fewer.'
    );
  END IF;

  IF v_password IS NOT NULL AND length(v_password) < 8 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'New password must be at least 8 characters.'
    );
  END IF;

  SELECT u.username
  INTO v_actor_username
  FROM public."user" u
  WHERE u.user_id = v_actor_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Account not found.'
    );
  END IF;

  SELECT *
  INTO v_target
  FROM public."user" u
  WHERE u.user_id = p_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'User not found.'
    );
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public."user" u
    WHERE lower(u.username) = lower(v_username)
      AND u.user_id <> p_user_id
  ) THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'That username is already taken.'
    );
  END IF;

  v_display := NULLIF(trim(concat_ws(' ', NULLIF(v_first, ''), NULLIF(v_last, ''))), '');
  v_name_json := COALESCE(v_target.name_json::jsonb, '{}'::jsonb);
  v_name_json := jsonb_set(v_name_json, '{first}', to_jsonb(NULLIF(v_first, '')), true);
  v_name_json := jsonb_set(v_name_json, '{last}', to_jsonb(NULLIF(v_last, '')), true);
  v_name_json := jsonb_set(v_name_json, '{display}', to_jsonb(v_display), true);

  PERFORM api.set_audit_actor(v_actor_username);

  IF v_password IS NOT NULL THEN
    UPDATE public."user"
    SET
      username = v_username,
      name_json = v_name_json::json,
      password_encrypted = crypt(v_password, gen_salt('bf')),
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_actor_username
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public."user"
    SET
      username = v_username,
      name_json = v_name_json::json,
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_actor_username
    WHERE user_id = p_user_id;
  END IF;

  RETURN json_build_object(
    'ok', true,
    'message', 'User updated.',
    'user_id', p_user_id,
    'username', v_username
  );
END;
$$;

REVOKE ALL ON FUNCTION api.admin_update_user(bigint, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.admin_update_user(bigint, text, text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
