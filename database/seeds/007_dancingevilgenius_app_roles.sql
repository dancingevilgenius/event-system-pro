-- App roles for dancingevilgenius (all roles). Safe to re-run.
--
--   psql -U postgres -d event_system_pro -f database/seeds/007_dancingevilgenius_app_roles.sql
--
-- Creates user_app_role if migration 018 has not been applied yet.

\connect event_system_pro

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

INSERT INTO public.user_app_role (user_id, role_code)
SELECT u.user_id, r.role_code
FROM public."user" u
CROSS JOIN (
  VALUES ('admin'), ('staff'), ('judge'), ('competitor')
) AS r(role_code)
WHERE u.username = 'dancingevilgenius'
ON CONFLICT DO NOTHING;

UPDATE public."user" u
SET
  volunteer_json = jsonb_set(
    COALESCE(u.volunteer_json::jsonb, '{}'::jsonb),
    '{roles}',
    '["admin", "staff", "judge", "competitor"]'::jsonb
  )::json,
  updated_by = 'seed',
  updated_date = CURRENT_TIMESTAMP
WHERE u.username = 'dancingevilgenius';

SELECT u.user_id, u.username, u.email, array_agg(r.role_code ORDER BY r.role_code) AS app_roles
FROM public."user" u
LEFT JOIN public.user_app_role r ON r.user_id = u.user_id
WHERE u.username = 'dancingevilgenius'
GROUP BY u.user_id, u.username, u.email;
