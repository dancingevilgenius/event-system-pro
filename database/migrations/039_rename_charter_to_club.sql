-- Rename charter table to club and event.host_charter_id to host_club_id.
-- Idempotent: safe on fresh installs that already use club / host_club_id.
--
-- Run: psql -U postgres -d event_system_pro -f database/migrations/039_rename_charter_to_club.sql

\connect event_system_pro

DO $$
BEGIN
  IF to_regclass('public.charter') IS NOT NULL AND to_regclass('public.club') IS NULL THEN
    ALTER TABLE public.charter RENAME TO club;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'event'
      AND column_name = 'host_charter_id'
  ) THEN
    ALTER TABLE public."event" RENAME COLUMN host_charter_id TO host_club_id;
  END IF;
END $$;

DROP VIEW IF EXISTS api.event;
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
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."event"
WHERE active IS NOT FALSE;

GRANT SELECT ON api.event TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
