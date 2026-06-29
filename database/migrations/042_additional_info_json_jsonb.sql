-- event_group/event/attendee more_json (jsonb); propagate demo from event_group onto event rows.
--
-- Run: psql -U postgres -d event_system_pro -f database/migrations/042_additional_info_json_jsonb.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.attendee;
DROP VIEW IF EXISTS api.event;
DROP VIEW IF EXISTS api.event_group;

ALTER TABLE public.event_group
  ALTER COLUMN more_json TYPE jsonb
  USING more_json::jsonb;

ALTER TABLE public."event"
  ADD COLUMN IF NOT EXISTS more_json jsonb DEFAULT NULL;

UPDATE public."event" AS e
SET more_json = jsonb_build_object(
  'demo', COALESCE((g.more_json->>'demo')::boolean, false)
)
FROM public.event_group AS g
WHERE e.event_group_code = g.event_group_code;

ALTER TABLE public.attendee
  ADD COLUMN IF NOT EXISTS more_json jsonb DEFAULT NULL;

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

CREATE VIEW api.event AS
SELECT
  event_id,
  event_group_code,
  name,
  contact_user_id,
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
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.attendee;

GRANT SELECT ON api.event_group, api.event, api.attendee TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
