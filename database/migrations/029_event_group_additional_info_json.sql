-- Add event_group.additional_info_json with is_demo flag.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/029_event_group_additional_info_json.sql

\connect event_system_pro

ALTER TABLE public.event_group
  ADD COLUMN IF NOT EXISTS additional_info_json json DEFAULT NULL;

UPDATE public.event_group
SET additional_info_json = '{"is_demo": false}'::json
WHERE event_group_code LIKE 'TSL%'
   OR created_by = 'ceg';

UPDATE public.event_group
SET additional_info_json = '{"is_demo": true}'::json
WHERE created_by = 'c-agent';

DROP VIEW IF EXISTS api.event_group;

CREATE VIEW api.event_group AS
SELECT
  event_group_code,
  full_name,
  short_name,
  additional_info_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_group;

GRANT SELECT ON api.event_group TO anon, authenticated;
