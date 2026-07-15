-- Rename EVENT_COORDINATOR -> EVENT_DIRECTOR; BALLROOM_COORDINATOR -> EVENT_MANAGER.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/127_app_role_rename_event_director_manager.sql

\connect event_system_pro

ALTER TABLE public.user_app_role
  DROP CONSTRAINT IF EXISTS user_app_role_role_code_check;

-- Avoid PK conflicts when a user already has the target role.
DELETE FROM public.user_app_role old
WHERE old.role_code = 'EVENT_COORDINATOR'
  AND EXISTS (
    SELECT 1
    FROM public.user_app_role newer
    WHERE newer.user_id = old.user_id
      AND newer.role_code = 'EVENT_DIRECTOR'
  );

DELETE FROM public.user_app_role old
WHERE old.role_code = 'BALLROOM_COORDINATOR'
  AND EXISTS (
    SELECT 1
    FROM public.user_app_role newer
    WHERE newer.user_id = old.user_id
      AND newer.role_code = 'EVENT_MANAGER'
  );

UPDATE public.user_app_role
SET role_code = 'EVENT_DIRECTOR'
WHERE role_code = 'EVENT_COORDINATOR';

UPDATE public.user_app_role
SET role_code = 'EVENT_MANAGER'
WHERE role_code = 'BALLROOM_COORDINATOR';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'EVENT_COORDINATOR', 'EVENT_DIRECTOR')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%EVENT_COORDINATOR%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'BALLROOM_COORDINATOR', 'EVENT_MANAGER')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%BALLROOM_COORDINATOR%';

ALTER TABLE public.user_app_role
  ADD CONSTRAINT user_app_role_role_code_check
  CHECK (role_code IN (
    'ADMIN',
    'STAFF',
    'JUDGE',
    'HEAD_JUDGE',
    'REGISTRATION',
    'FLOOR_PARENT',
    'EVENT_MANAGER',
    'DJ',
    'EVENT_DIRECTOR',
    'COMPETITOR'
  ));

NOTIFY pgrst, 'reload schema';
