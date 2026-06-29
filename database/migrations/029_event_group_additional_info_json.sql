-- Add event_group.more_json with demo flag.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/029_event_group_additional_info_json.sql

\connect event_system_pro

ALTER TABLE public.event_group
  ADD COLUMN IF NOT EXISTS more_json jsonb DEFAULT NULL;

UPDATE public.event_group
SET more_json = '{"demo": false}'::jsonb
WHERE event_group_code LIKE 'TSL%'
   OR created_by = 'ceg';

UPDATE public.event_group
SET more_json = '{"demo": true}'::jsonb
WHERE created_by = 'c-agent';

DROP VIEW IF EXISTS api.event_group;

CREATE VIEW api.event_group AS
SELECT
  event_group_code,
  full_name,
  short_name,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_group;

GRANT SELECT ON api.event_group TO anon, authenticated;
