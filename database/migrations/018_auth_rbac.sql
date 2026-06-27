-- Auth / RBAC: app roles, JWT login, helpers, and starter RLS.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/018_auth_rbac.sql
--
-- Prerequisites (before login returns a usable token):
--   1. Install pgjwt: https://github.com/michelp/pgjwt
--      (not bundled with PostgreSQL; skip JWT until installed).
--   2. Use the same secret as PostgREST PGRST_JWT_SECRET:
--        ALTER DATABASE event_system_pro
--          SET app.jwt_secret = 'replace-with-a-long-random-string';
--   3. Restart PostgREST after setting PGRST_JWT_SECRET in back-ends/postgrest/.env
--
-- Production follow-up (not applied here — migration 004 is dev-only):
--   REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA api FROM anon;
--   GRANT INSERT, UPDATE, DELETE ON selected public tables TO authenticated;

\connect event_system_pro

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pgjwt provides sign() / verify() for PostgREST-compatible HS256 JWTs.
-- Comment out the next line if pgjwt is not installed yet; login still returns roles.
CREATE EXTENSION IF NOT EXISTS pgjwt;

-- ---------------------------------------------------------------------------
-- App roles (admin, staff, judge, competitor — separate from dance primary-role)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_app_role (
  user_id   bigint NOT NULL,
  role_code text   NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_code),
  CONSTRAINT user_app_role_fk_user
    FOREIGN KEY (user_id) REFERENCES public."user" (user_id) ON DELETE CASCADE,
  CONSTRAINT user_app_role_role_code_check
    CHECK (role_code IN ('admin', 'staff', 'judge', 'competitor'))
);

CREATE INDEX IF NOT EXISTS user_app_role_role_code_idx
  ON public.user_app_role (role_code);

COMMENT ON TABLE public.user_app_role IS
  'Application roles for page/API access. Not exposed via api schema; read via login JWT or helpers.';

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

-- Optional: expose own roles when authenticated (empty for anon).
CREATE OR REPLACE VIEW api.my_app_roles AS
SELECT role_code
FROM public.user_app_role
WHERE user_id = api.current_user_id();

GRANT SELECT ON api.my_app_roles TO authenticated;

-- ---------------------------------------------------------------------------
-- Login: bcrypt check + roles array + JWT (when app.jwt_secret is set)
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
  v_token := NULL;

  IF v_secret IS NOT NULL AND v_secret <> '' THEN
    BEGIN
      v_token := sign(
        json_build_object(
          'role', 'authenticated',
          'sub', v_user.user_id::text,
          'app_roles', to_jsonb(v_role_codes)
        ),
        v_secret
      );
    EXCEPTION
      WHEN undefined_function THEN
        -- pgjwt not installed; login succeeds without token.
        v_token := NULL;
    END;
  END IF;

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

-- ---------------------------------------------------------------------------
-- Starter RLS on public.user (api."user" view inherits via security invoker)
-- ---------------------------------------------------------------------------

ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_select_authenticated_self ON public."user";
CREATE POLICY user_select_authenticated_self ON public."user"
  FOR SELECT
  TO authenticated
  USING (user_id = api.current_user_id());

DROP POLICY IF EXISTS user_select_authenticated_admin ON public."user";
CREATE POLICY user_select_authenticated_admin ON public."user"
  FOR SELECT
  TO authenticated
  USING (api.has_app_role('admin'));

-- anon: no direct SELECT rows (login/register RPCs remain SECURITY DEFINER).
DROP POLICY IF EXISTS user_select_anon_none ON public."user";
CREATE POLICY user_select_anon_none ON public."user"
  FOR SELECT
  TO anon
  USING (false);

-- Writes still go through RPCs (register_user, etc.), not open table access.
DROP POLICY IF EXISTS user_write_authenticated_admin ON public."user";
CREATE POLICY user_write_authenticated_admin ON public."user"
  FOR ALL
  TO authenticated
  USING (api.has_app_role('admin'))
  WITH CHECK (api.has_app_role('admin'));

-- ---------------------------------------------------------------------------
-- Example: assign admin to Carlos (uncomment after seed 004_user_carlos.sql)
-- ---------------------------------------------------------------------------
-- INSERT INTO public.user_app_role (user_id, role_code)
-- SELECT u.user_id, 'admin'
-- FROM public."user" u
-- WHERE u.username = 'dancingevilgenius'
-- ON CONFLICT DO NOTHING;
