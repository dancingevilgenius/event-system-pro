-- Add contests_json to event (after contact_user_id in api.event view).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/050_event_contests_json.sql

\connect event_system_pro

ALTER TABLE public."event"
  ADD COLUMN IF NOT EXISTS contests_json json DEFAULT NULL;

DROP VIEW IF EXISTS api.event;
CREATE VIEW api.event AS
SELECT
  event_id,
  event_group_code,
  name,
  contact_user_id,
  contests_json,
  host_club_id,
  country_code,
  state_or_province,
  location_json,
  active,
  number_of_days,
  start_date,
  end_date,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."event"
WHERE active IS NOT FALSE;

GRANT SELECT ON api.event TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
