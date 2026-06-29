-- Add contests_json to attendee (after event_id in api.attendee view).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/041_attendee_contests_json.sql

\connect event_system_pro

ALTER TABLE public.attendee
  ADD COLUMN IF NOT EXISTS contests_json json DEFAULT NULL;

DROP VIEW IF EXISTS api.attendee;
CREATE VIEW api.attendee AS
SELECT
  attendee_id,
  user_id,
  event_id,
  contests_json,
  competitor_id,
  volunteer_json,
  staff_json,
  notes_json,
  external_accounts_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.attendee;

GRANT SELECT ON api.attendee TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
