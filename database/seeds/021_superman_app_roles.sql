-- App roles for superman (same roles as dancingevilgenius). Safe to re-run.
--
--   psql -U postgres -d event_system_pro -f database/seeds/021_superman_app_roles.sql

\connect event_system_pro

INSERT INTO public.user_app_role (user_id, role_code, created_by)
SELECT u.user_id, r.role_code, 'c-agent'
FROM public."user" u
CROSS JOIN (
  SELECT DISTINCT deg.role_code
  FROM public.user_app_role deg
  JOIN public."user" owner ON owner.user_id = deg.user_id
  WHERE owner.username = 'dancingevilgenius'
  UNION
  SELECT v.role_code
  FROM (
    VALUES
      ('ADMIN'),
      ('STAFF'),
      ('JUDGE'),
      ('HEAD_JUDGE'),
      ('REGISTRATION'),
      ('FLOOR_PARENT'),
      ('EVENT_MANAGER'),
      ('DJ'),
      ('EVENT_DIRECTOR'),
      ('COMPETITOR')
  ) AS v(role_code)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.user_app_role deg
    JOIN public."user" owner ON owner.user_id = deg.user_id
    WHERE owner.username = 'dancingevilgenius'
  )
) AS r
WHERE u.username = 'superman'
  AND EXISTS (
    SELECT 1
    FROM pg_constraint c
    WHERE c.conname = 'user_app_role_role_code_check'
      AND pg_get_constraintdef(c.oid) LIKE ('%' || r.role_code || '%')
  )
ON CONFLICT DO NOTHING;

UPDATE public."user" u
SET
  volunteer_json = jsonb_set(
    COALESCE(u.volunteer_json::jsonb, '{}'::jsonb),
    '{roles}',
    COALESCE(
      (
        SELECT to_jsonb(array_agg(r.role_code ORDER BY r.role_code))
        FROM public.user_app_role r
        WHERE r.user_id = u.user_id
      ),
      '[]'::jsonb
    )
  )::json
WHERE u.username = 'superman';

SELECT u.user_id, u.username, u.email, array_agg(r.role_code ORDER BY r.role_code) AS app_roles
FROM public."user" u
LEFT JOIN public.user_app_role r ON r.user_id = u.user_id
WHERE u.username = 'superman'
GROUP BY u.user_id, u.username, u.email;
