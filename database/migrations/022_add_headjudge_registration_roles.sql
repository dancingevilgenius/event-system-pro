-- Add headjudge and registration application roles.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/022_add_headjudge_registration_roles.sql

\connect event_system_pro

ALTER TABLE public.user_app_role
  DROP CONSTRAINT IF EXISTS user_app_role_role_code_check;

ALTER TABLE public.user_app_role
  ADD CONSTRAINT user_app_role_role_code_check
  CHECK (role_code IN ('admin', 'staff', 'judge', 'headjudge', 'registration', 'floorcoordinator', 'competitor'));

NOTIFY pgrst, 'reload schema';
