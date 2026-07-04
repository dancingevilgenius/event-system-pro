-- Public RPC: first 16 users for the tournament bracket demo (no login required).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/070_demo_tournament_bracket_competitors.sql

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
      SELECT json_agg(competitor ORDER BY competitor->>'label')
      FROM (
        SELECT json_build_object(
          'user_id', u.user_id,
          'label', trim(concat_ws(' ', u.name_json->>'first', u.name_json->>'last'))
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
