-- Add Instructor, Setup, and Teardown to the assignable role catalog.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/150_add_instructor_setup_teardown_roles.sql

\connect event_system_pro

INSERT INTO public.app_role (role_code, more_json, created_by)
SELECT
  role_code,
  jsonb_build_object('Labels', jsonb_build_array(label)),
  'c-agent'
FROM (
  SELECT
    role_code,
    (
      SELECT string_agg(initcap(word), ' ' ORDER BY ordinality)
      FROM unnest(string_to_array(role_code, '_')) WITH ORDINALITY AS parts(word, ordinality)
    ) AS label
  FROM (
    VALUES
      ('INSTRUCTOR'),
      ('SETUP'),
      ('TEARDOWN')
  ) AS roles(role_code)
) AS labeled
ON CONFLICT (role_code) DO NOTHING;
