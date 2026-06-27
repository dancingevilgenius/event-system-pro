-- Fix JWT user id resolution for PostgREST v12 claim format.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/037_fix_current_user_id_jwt.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.current_user_id()
RETURNS bigint
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.sub', true), '')::bigint,
    NULLIF(
      NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub',
      ''
    )::bigint
  );
$$;

GRANT EXECUTE ON FUNCTION api.current_user_id() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
