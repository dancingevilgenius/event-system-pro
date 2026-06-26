-- Login RPC: verify email/username + bcrypt password.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/009_login_rpc.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.login(p_identifier text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
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

  RETURN json_build_object(
    'ok', true,
    'message', 'Signed in successfully.',
    'user_id', v_user.user_id,
    'username', v_user.username,
    'email', v_user.email
  );
END;
$$;

GRANT EXECUTE ON FUNCTION api.login(text, text) TO anon, authenticated;
