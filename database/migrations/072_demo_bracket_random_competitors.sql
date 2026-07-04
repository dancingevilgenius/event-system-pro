-- Randomize tournament bracket demo sampling from demo-flagged users only.
-- User table stores the flag in additional_info_json (json), not more_json.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/072_demo_bracket_random_competitors.sql

\connect event_system_pro

UPDATE public."user"
SET additional_info_json = (
  COALESCE(additional_info_json::jsonb, '{}'::jsonb)
  || jsonb_build_object('demo', true)
)::json
WHERE email LIKE '%@superhero.com'
   OR username IN ('demo_alice', 'demo_bob', 'demo_carol');

CREATE OR REPLACE FUNCTION api.demo_tournament_bracket_competitors()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, api
VOLATILE
AS $$
  SELECT COALESCE(
    (
      SELECT json_agg(competitor)
      FROM (
        SELECT json_build_object(
          'user_id', u.user_id,
          'username', u.username,
          'first_name', coalesce(u.name_json->>'first', ''),
          'last_name', coalesce(u.name_json->>'last', ''),
          'display-name', trim(concat_ws(' ', u.name_json->>'first', u.name_json->>'last'))
        ) AS competitor
        FROM public."user" AS u
        WHERE COALESCE((u.additional_info_json::jsonb->>'demo')::boolean, false) = true
        ORDER BY random()
        LIMIT 16
      ) AS rows
    ),
    '[]'::json
  );
$$;

REVOKE ALL ON FUNCTION api.demo_tournament_bracket_competitors() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.demo_tournament_bracket_competitors() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
