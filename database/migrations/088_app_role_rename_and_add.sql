-- Rename floorcoordinator -> floorparent; add ballroomcoordinator, dj, eventcoordinator.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/088_app_role_rename_and_add.sql

\connect event_system_pro

DELETE FROM public.user_app_role old
WHERE old.role_code = 'floorcoordinator'
  AND EXISTS (
    SELECT 1
    FROM public.user_app_role newer
    WHERE newer.user_id = old.user_id
      AND newer.role_code = 'floorparent'
  );

UPDATE public.user_app_role
SET role_code = 'floorparent'
WHERE role_code = 'floorcoordinator';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'floorcoordinator', 'floorparent')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%floorcoordinator%';

ALTER TABLE public.user_app_role
  DROP CONSTRAINT IF EXISTS user_app_role_role_code_check;

ALTER TABLE public.user_app_role
  ADD CONSTRAINT user_app_role_role_code_check
  CHECK (role_code IN (
    'admin',
    'staff',
    'judge',
    'headjudge',
    'registration',
    'floorparent',
    'ballroomcoordinator',
    'dj',
    'eventcoordinator',
    'competitor'
  ));

NOTIFY pgrst, 'reload schema';
