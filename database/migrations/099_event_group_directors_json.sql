-- event_group.directors_json: array of director objects (username, firstname, lastname, email).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/099_event_group_directors_json.sql

\connect event_system_pro

ALTER TABLE public.event_group
  ADD COLUMN IF NOT EXISTS directors_json json DEFAULT NULL;

COMMENT ON COLUMN public.event_group.directors_json IS
  'JSON array of event group directors: {username, firstname, lastname, email}.';

DROP VIEW IF EXISTS api.event_group;

CREATE VIEW api.event_group AS
SELECT
  event_group_code,
  full_name,
  short_name,
  directors_json,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_group;

GRANT SELECT ON api.event_group TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
