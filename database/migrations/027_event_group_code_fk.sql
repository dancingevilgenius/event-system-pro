-- Rename event.fight_event_group_code -> event_group_code and add FK to event_group.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/027_event_group_code_fk.sql

\connect event_system_pro

UPDATE public."event"
SET fight_event_group_code = btrim(fight_event_group_code)
WHERE fight_event_group_code IS NOT NULL
  AND fight_event_group_code <> btrim(fight_event_group_code);

DROP VIEW IF EXISTS api.event;

ALTER TABLE public."event"
  RENAME COLUMN fight_event_group_code TO event_group_code;

ALTER TABLE public."event"
  ADD CONSTRAINT fk_event_event_group
  FOREIGN KEY (event_group_code)
  REFERENCES public.event_group (event_group_code);

CREATE VIEW api.event AS
SELECT
  event_id,
  event_group_code,
  name,
  contact_user_id,
  host_charter_id,
  country_code,
  state_or_province,
  location_json,
  active,
  number_of_days,
  start_date,
  end_date,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."event"
WHERE active IS NOT FALSE;

GRANT SELECT ON api.event TO anon, authenticated;
