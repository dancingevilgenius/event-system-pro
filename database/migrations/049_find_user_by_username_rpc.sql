-- Plain-text username lookup RPC (no PostgREST eq./ilike. filter operators).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/049_find_user_by_username_rpc.sql
--
-- Swagger: POST /rpc/find_user_by_username  {"p_username": "batman"}

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.find_user_by_username(p_username text)
RETURNS SETOF api."user"
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = api, public
AS $$
BEGIN
  IF p_username IS NULL OR trim(p_username) = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT u.*
  FROM api."user" u
  WHERE lower(u.username) = lower(trim(p_username))
  ORDER BY u.user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION api.find_user_by_username(text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
