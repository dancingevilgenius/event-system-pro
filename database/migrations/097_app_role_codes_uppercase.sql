-- Uppercase underscore-separated app role codes (HEAD_JUDGE, EVENT_COORDINATOR, …).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/097_app_role_codes_uppercase.sql

\connect event_system_pro

ALTER TABLE public.user_app_role
  DROP CONSTRAINT IF EXISTS user_app_role_role_code_check;

-- Avoid PK conflicts when multiple legacy codes map to the same uppercase role
-- (e.g. floorcoordinator + floorparent -> FLOOR_PARENT).
WITH mapped AS (
  SELECT
    ctid,
    user_id,
    CASE role_code
      WHEN 'admin' THEN 'ADMIN'
      WHEN 'staff' THEN 'STAFF'
      WHEN 'judge' THEN 'JUDGE'
      WHEN 'headjudge' THEN 'HEAD_JUDGE'
      WHEN 'registration' THEN 'REGISTRATION'
      WHEN 'floorcoordinator' THEN 'FLOOR_PARENT'
      WHEN 'floorparent' THEN 'FLOOR_PARENT'
      WHEN 'ballroomcoordinator' THEN 'BALLROOM_COORDINATOR'
      WHEN 'dj' THEN 'DJ'
      WHEN 'eventcoordinator' THEN 'EVENT_COORDINATOR'
      WHEN 'competitor' THEN 'COMPETITOR'
      ELSE role_code
    END AS target_code
  FROM public.user_app_role
  WHERE role_code IN (
    'admin', 'staff', 'judge', 'headjudge', 'registration',
    'floorcoordinator', 'floorparent', 'ballroomcoordinator',
    'dj', 'eventcoordinator', 'competitor'
  )
)
DELETE FROM public.user_app_role AS old
USING mapped AS m
WHERE old.ctid = m.ctid
  AND EXISTS (
    SELECT 1
    FROM mapped AS keeper
    WHERE keeper.user_id = m.user_id
      AND keeper.target_code = m.target_code
      AND keeper.ctid < m.ctid
  );

-- Avoid PK conflicts if a row was partially migrated.
DELETE FROM public.user_app_role old
WHERE old.role_code IN (
    'admin', 'staff', 'judge', 'headjudge', 'registration',
    'floorcoordinator', 'floorparent', 'ballroomcoordinator',
    'dj', 'eventcoordinator', 'competitor'
  )
  AND EXISTS (
    SELECT 1
    FROM public.user_app_role newer
    WHERE newer.user_id = old.user_id
      AND newer.role_code = CASE old.role_code
        WHEN 'admin' THEN 'ADMIN'
        WHEN 'staff' THEN 'STAFF'
        WHEN 'judge' THEN 'JUDGE'
        WHEN 'headjudge' THEN 'HEAD_JUDGE'
        WHEN 'registration' THEN 'REGISTRATION'
        WHEN 'floorcoordinator' THEN 'FLOOR_PARENT'
        WHEN 'floorparent' THEN 'FLOOR_PARENT'
        WHEN 'ballroomcoordinator' THEN 'BALLROOM_COORDINATOR'
        WHEN 'dj' THEN 'DJ'
        WHEN 'eventcoordinator' THEN 'EVENT_COORDINATOR'
        WHEN 'competitor' THEN 'COMPETITOR'
      END
  );

UPDATE public.user_app_role SET role_code = 'ADMIN' WHERE role_code = 'admin';
UPDATE public.user_app_role SET role_code = 'STAFF' WHERE role_code = 'staff';
UPDATE public.user_app_role SET role_code = 'JUDGE' WHERE role_code = 'judge';
UPDATE public.user_app_role SET role_code = 'HEAD_JUDGE' WHERE role_code = 'headjudge';
UPDATE public.user_app_role SET role_code = 'REGISTRATION' WHERE role_code = 'registration';
UPDATE public.user_app_role SET role_code = 'FLOOR_PARENT' WHERE role_code IN ('floorcoordinator', 'floorparent');
UPDATE public.user_app_role SET role_code = 'BALLROOM_COORDINATOR' WHERE role_code = 'ballroomcoordinator';
UPDATE public.user_app_role SET role_code = 'DJ' WHERE role_code = 'dj';
UPDATE public.user_app_role SET role_code = 'EVENT_COORDINATOR' WHERE role_code = 'eventcoordinator';
UPDATE public.user_app_role SET role_code = 'COMPETITOR' WHERE role_code = 'competitor';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'eventcoordinator', 'EVENT_COORDINATOR')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%eventcoordinator%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'ballroomcoordinator', 'BALLROOM_COORDINATOR')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%ballroomcoordinator%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'floorcoordinator', 'FLOOR_PARENT')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%floorcoordinator%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'floorparent', 'FLOOR_PARENT')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%floorparent%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'headjudge', 'HEAD_JUDGE')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%headjudge%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'registration', 'REGISTRATION')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%registration%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'competitor', 'COMPETITOR')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%competitor%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'admin', 'ADMIN')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%admin%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'staff', 'STAFF')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%staff%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, 'judge', 'JUDGE')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%judge%';

UPDATE public."user"
SET volunteer_json = replace(volunteer_json::text, '"dj"', '"DJ"')::json
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%"dj"%';

ALTER TABLE public.user_app_role
  ADD CONSTRAINT user_app_role_role_code_check
  CHECK (role_code IN (
    'ADMIN',
    'STAFF',
    'JUDGE',
    'HEAD_JUDGE',
    'REGISTRATION',
    'FLOOR_PARENT',
    'BALLROOM_COORDINATOR',
    'DJ',
    'EVENT_COORDINATOR',
    'COMPETITOR'
  ));

DROP POLICY IF EXISTS user_select_authenticated_admin ON public."user";
CREATE POLICY user_select_authenticated_admin ON public."user"
  FOR SELECT
  TO authenticated
  USING (api.has_app_role('ADMIN'));

DROP POLICY IF EXISTS user_write_authenticated_admin ON public."user";
CREATE POLICY user_write_authenticated_admin ON public."user"
  FOR ALL
  TO authenticated
  USING (api.has_app_role('ADMIN'))
  WITH CHECK (api.has_app_role('ADMIN'));

DROP POLICY IF EXISTS audit_log_select_admin ON public.audit_log;
CREATE POLICY audit_log_select_admin ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (api.has_app_role('ADMIN'));

CREATE OR REPLACE FUNCTION api.generate_demo_attendees()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  RETURN api.generate_demo_attendees_core();
END;
$$;

NOTIFY pgrst, 'reload schema';
