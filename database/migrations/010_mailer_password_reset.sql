-- Mailer service: issue reset codes and send email (no code in public RPC response).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/010_mailer_password_reset.sql

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mailer') THEN
    CREATE ROLE mailer LOGIN PASSWORD 'mailer_dev_password';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE event_system_pro TO mailer;
GRANT USAGE ON SCHEMA api TO mailer;

CREATE OR REPLACE FUNCTION api._issue_password_reset_for_identifier(p_identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user public."user"%ROWTYPE;
  v_code text;
  v_code_hash text;
BEGIN
  SELECT *
  INTO v_user
  FROM public."user" u
  WHERE lower(u.email) = lower(trim(p_identifier))
     OR lower(u.username) = lower(trim(p_identifier))
  ORDER BY u.user_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', true,
      'message', 'If an account exists for that email or username, a verification code has been sent.'
    );
  END IF;

  v_code := lpad((floor(random() * 1000000)::int)::text, 6, '0');
  v_code_hash := crypt(v_code, gen_salt('bf'));

  UPDATE public.user_password_reset
  SET used_at = NOW()
  WHERE user_id = v_user.user_id
    AND used_at IS NULL;

  INSERT INTO public.user_password_reset (user_id, code_hash, expires_at)
  VALUES (v_user.user_id, v_code_hash, NOW() + INTERVAL '15 minutes');

  RETURN json_build_object(
    'ok', true,
    'message', 'If an account exists for that email or username, a verification code has been sent.',
    'email', v_user.email,
    'verification_code', v_code
  );
END;
$$;

-- Public RPC (Swagger): no verification code in response.
CREATE OR REPLACE FUNCTION api.forgot_password_request(identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_result json;
BEGIN
  v_result := api._issue_password_reset_for_identifier(identifier);
  RETURN (v_result::jsonb - 'verification_code')::json;
END;
$$;

-- Mailer service only: includes verification_code for outbound email.
CREATE OR REPLACE FUNCTION api.mailer_issue_password_reset(p_identifier text)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, api
AS $$
  SELECT api._issue_password_reset_for_identifier(p_identifier);
$$;

REVOKE ALL ON FUNCTION api.mailer_issue_password_reset(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.mailer_issue_password_reset(text) TO mailer;

GRANT EXECUTE ON FUNCTION api.forgot_password_request(text) TO anon, authenticated;
