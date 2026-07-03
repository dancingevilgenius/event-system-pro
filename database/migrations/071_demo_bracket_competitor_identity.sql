-- Extend demo bracket RPC with user identity fields for JSON serialization.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/071_demo_bracket_competitor_identity.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.demo_tournament_bracket_competitors()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, api
STABLE
AS $$
  SELECT COALESCE(
    (
      SELECT json_agg(competitor ORDER BY competitor->>'display-name')
      FROM (
        SELECT json_build_object(
          'user_id', u.user_id,
          'username', u.username,
          'first_name', coalesce(u.name_json->>'first', ''),
          'last_name', coalesce(u.name_json->>'last', ''),
          'display-name', trim(concat_ws(' ', u.name_json->>'first', u.name_json->>'last'))
        ) AS competitor
        FROM public."user" AS u
        ORDER BY u.name_json->>'last', u.name_json->>'first', u.user_id
        LIMIT 16
      ) AS rows
    ),
    '[]'::json
  );
$$;

REVOKE ALL ON FUNCTION api.demo_tournament_bracket_competitors() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.demo_tournament_bracket_competitors() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
