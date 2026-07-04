-- Update password_recovery_json for the signed-in user (secret questions setup).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/059_update_password_recovery.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.get_password_recovery_setup()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_ids json;
BEGIN
  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE u.user_id = api.current_user_id()
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to view password recovery settings.');
  END IF;

  IF NOT api._user_has_secret_questions(v_user.password_recovery_json) THEN
    RETURN json_build_object(
      'ok', true,
      'has_setup', false,
      'secret_question_ids', '[]'::json
    );
  END IF;

  SELECT coalesce(json_agg((q ->> 'secret_question_id')::integer ORDER BY (q ->> 'secret_question_id')::integer), '[]'::json)
  INTO v_ids
  FROM json_array_elements(v_user.password_recovery_json -> 'questions') AS q;

  RETURN json_build_object(
    'ok', true,
    'has_setup', true,
    'secret_question_ids', v_ids
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.update_password_recovery(p_answers json)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
  v_username text;
  v_hash_result json;
  v_recovery json;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to update password recovery settings.');
  END IF;

  v_hash_result := api.hash_password_recovery_answers(p_answers);

  IF coalesce((v_hash_result ->> 'ok')::boolean, false) IS NOT TRUE THEN
    RETURN v_hash_result;
  END IF;

  v_recovery := v_hash_result -> 'password_recovery_json';
  v_username := api.resolve_audit_actor(NULL);

  IF v_username IS NULL THEN
    SELECT u.username
    INTO v_username
    FROM public."user" u
    WHERE u.user_id = v_user_id;
  END IF;

  PERFORM api.set_audit_actor(v_username);

  UPDATE public."user"
  SET password_recovery_json = v_recovery,
      modified_date = CURRENT_TIMESTAMP,
      modified_by = v_username
  WHERE user_id = v_user_id
    AND active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Account not found.');
  END IF;

  RETURN json_build_object(
    'ok', true,
    'message', 'Password recovery secret questions saved.',
    'password_recovery_json', v_recovery
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.get_password_recovery_setup() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.update_password_recovery(json) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
