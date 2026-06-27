-- Change password while signed in (verify current password).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/019_change_password_rpc.sql

\connect event_system_pro

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
BEGIN
  IF p_user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to change your password.');
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

  UPDATE public."user"
  SET password_encrypted = crypt(trim(p_new_password), gen_salt('bf')),
      updated_date = NOW(),
      updated_by = 'change_password'
  WHERE user_id = v_user.user_id;

  RETURN json_build_object('ok', true, 'message', 'Your password has been updated.');
END;
$$;

GRANT EXECUTE ON FUNCTION api.change_password(bigint, text, text) TO anon, authenticated;

-- Ask PostgREST to reload its schema cache (no-op if PostgREST is not running).
NOTIFY pgrst, 'reload schema';
