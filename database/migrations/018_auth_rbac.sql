-- Auth / RBAC: app roles, JWT login (pgcrypto), and claim helpers.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/018_auth_rbac.sql
--
-- Set the same secret in PostgREST PGRST_JWT_SECRET (see back-ends/postgrest/.env.example).
-- Row-level security on public.user is applied in 020_auth_rls.sql after the frontend sends JWTs.
-- Production table grants (anon read-only) are applied in 021_prod_grants.sql.

\connect event_system_pro

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dev default — override in production via ALTER DATABASE ... SET app.jwt_secret.
ALTER DATABASE event_system_pro
  SET app.jwt_secret = 'esp-dev-jwt-secret-change-in-production-min-32-chars';

-- ---------------------------------------------------------------------------
-- App roles (admin, staff, judge, headjudge, registration, floorcoordinator, competitor)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_app_role (
  user_id   bigint NOT NULL,
  role_code text   NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_code),
  CONSTRAINT user_app_role_fk_user
    FOREIGN KEY (user_id) REFERENCES public."user" (user_id) ON DELETE CASCADE,
  CONSTRAINT user_app_role_role_code_check
    CHECK (role_code IN ('admin', 'staff', 'judge', 'headjudge', 'registration', 'floorcoordinator', 'competitor'))
);

CREATE INDEX IF NOT EXISTS user_app_role_role_code_idx
  ON public.user_app_role (role_code);

COMMENT ON TABLE public.user_app_role IS
  'Application roles for page/API access. Not exposed via api schema; read via login JWT or helpers.';

-- ---------------------------------------------------------------------------
-- JWT signing (pgcrypto HS256 — no pgjwt extension required)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION api.base64url_encode(p_data bytea)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT rtrim(translate(encode(p_data, 'base64'), E'+/\n', '-_'), '=');
$$;

CREATE OR REPLACE FUNCTION api.sign_jwt_hs256(p_claims json, p_secret text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_header json := '{"alg":"HS256","typ":"JWT"}';
  v_header_segment text;
  v_payload_segment text;
  v_signing_input text;
  v_signature_segment text;
BEGIN
  IF p_secret IS NULL OR p_secret = '' THEN
    RETURN NULL;
  END IF;

  v_header_segment := api.base64url_encode(convert_to(v_header::text, 'utf8'));
  v_payload_segment := api.base64url_encode(convert_to(p_claims::text, 'utf8'));
  v_signing_input := v_header_segment || '.' || v_payload_segment;
  v_signature_segment := api.base64url_encode(hmac(v_signing_input, p_secret, 'sha256'));

  RETURN v_signing_input || '.' || v_signature_segment;
END;
$$;

-- ---------------------------------------------------------------------------
-- JWT claim helpers (for RLS policies and SECURITY DEFINER RPCs)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION api.current_user_id()
RETURNS bigint
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::bigint;
$$;

CREATE OR REPLACE FUNCTION api.current_app_roles()
RETURNS text[]
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT COALESCE(
    ARRAY(
      SELECT jsonb_array_elements_text(
        current_setting('request.jwt.claims', true)::jsonb -> 'app_roles'
      )
    ),
    ARRAY[]::text[]
  );
$$;

CREATE OR REPLACE FUNCTION api.has_app_role(p_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT p_role = ANY (api.current_app_roles());
$$;

GRANT EXECUTE ON FUNCTION api.current_user_id() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.current_app_roles() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION api.has_app_role(text) TO anon, authenticated;

CREATE OR REPLACE VIEW api.my_app_roles AS
SELECT role_code
FROM public.user_app_role
WHERE user_id = api.current_user_id();

GRANT SELECT ON api.my_app_roles TO authenticated;

-- ---------------------------------------------------------------------------
-- Login: bcrypt check + roles array + JWT
-- ---------------------------------------------------------------------------

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

  SELECT COALESCE(json_agg(r.role_code ORDER BY r.role_code), '[]'::json)
  INTO v_roles
  FROM public.user_app_role r
  WHERE r.user_id = v_user.user_id;

  SELECT COALESCE(array_agg(r.role_code ORDER BY r.role_code), ARRAY[]::text[])
  INTO v_role_codes
  FROM public.user_app_role r
  WHERE r.user_id = v_user.user_id;

  v_secret := current_setting('app.jwt_secret', true);
  v_token := api.sign_jwt_hs256(
    json_build_object(
      'role', 'authenticated',
      'sub', v_user.user_id::text,
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

GRANT EXECUTE ON FUNCTION api.login(text, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
