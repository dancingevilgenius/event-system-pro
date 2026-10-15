-- app_role: catalog of assignable role codes. user_app_role.role_code references it.
-- more_json.Labels[0] is the role code in title case, underscores replaced by spaces.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/146_app_role.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.app_role (
  role_code text NOT NULL,
  more_json jsonb NOT NULL,
  created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL,
  modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL,
  PRIMARY KEY (role_code)
);

COMMENT ON TABLE public.app_role IS
  'Assignable application roles. user_app_role.role_code must match a row here.';

COMMENT ON COLUMN public.app_role.more_json IS
  'Role metadata. Labels is an array of display strings; the first entry is the role code in title case with spaces instead of underscores.';

DROP TRIGGER IF EXISTS trg_set_modified_audit ON public.app_role;
CREATE TRIGGER trg_set_modified_audit
  BEFORE UPDATE ON public.app_role
  FOR EACH ROW
  EXECUTE FUNCTION public.set_row_modified_audit();

DROP TRIGGER IF EXISTS trg_audit_row_change ON public.app_role;
CREATE TRIGGER trg_audit_row_change
  AFTER INSERT OR UPDATE OR DELETE ON public.app_role
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_row_change();

-- Drop the inline code list before renaming leftover assignments.
ALTER TABLE public.user_app_role
  DROP CONSTRAINT IF EXISTS user_app_role_role_code_check;

-- Databases that have not applied 127 still store the previous codes.
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
SET
  role_code = 'EVENT_DIRECTOR',
  modified_by = 'c-agent',
  modified_date = CURRENT_TIMESTAMP
WHERE role_code = 'EVENT_COORDINATOR';

UPDATE public.user_app_role
SET
  role_code = 'EVENT_MANAGER',
  modified_by = 'c-agent',
  modified_date = CURRENT_TIMESTAMP
WHERE role_code = 'BALLROOM_COORDINATOR';

UPDATE public."user"
SET
  volunteer_json = replace(volunteer_json::text, 'EVENT_COORDINATOR', 'EVENT_DIRECTOR')::json,
  modified_by = 'c-agent',
  modified_date = CURRENT_TIMESTAMP
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%EVENT_COORDINATOR%';

UPDATE public."user"
SET
  volunteer_json = replace(volunteer_json::text, 'BALLROOM_COORDINATOR', 'EVENT_MANAGER')::json,
  modified_by = 'c-agent',
  modified_date = CURRENT_TIMESTAMP
WHERE volunteer_json IS NOT NULL
  AND volunteer_json::text LIKE '%BALLROOM_COORDINATOR%';

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
  ) AS roles(role_code)
) AS labeled
ON CONFLICT (role_code) DO NOTHING;

ALTER TABLE public.user_app_role
  DROP CONSTRAINT IF EXISTS user_app_role_fk_app_role;

ALTER TABLE public.user_app_role
  ADD CONSTRAINT user_app_role_fk_app_role
  FOREIGN KEY (role_code) REFERENCES public.app_role (role_code)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

CREATE OR REPLACE VIEW api.app_role AS
SELECT
  role_code,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.app_role;

GRANT SELECT ON public.app_role TO anon, authenticated;
GRANT SELECT ON api.app_role TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.app_role FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON api.app_role FROM anon, authenticated;

NOTIFY pgrst, 'reload schema';
