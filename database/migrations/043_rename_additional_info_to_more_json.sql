-- Rename additional_info_json -> more_json on event_group, event, attendee.
-- Rename JSON key is_demo -> demo in those columns.
--
-- Run: psql -U postgres -d event_system_pro -f database/migrations/043_rename_additional_info_to_more_json.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.attendee;
DROP VIEW IF EXISTS api.event;
DROP VIEW IF EXISTS api.event_group;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'event_group' AND column_name = 'additional_info_json'
  ) THEN
    ALTER TABLE public.event_group RENAME COLUMN additional_info_json TO more_json;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'event' AND column_name = 'additional_info_json'
  ) THEN
    ALTER TABLE public."event" RENAME COLUMN additional_info_json TO more_json;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'attendee' AND column_name = 'additional_info_json'
  ) THEN
    ALTER TABLE public.attendee RENAME COLUMN additional_info_json TO more_json;
  END IF;
END $$;

UPDATE public.event_group
SET more_json = (COALESCE(more_json, '{}'::jsonb) - 'is_demo')
  || jsonb_build_object(
    'demo', COALESCE((more_json->>'is_demo')::boolean, (more_json->>'demo')::boolean, false)
  )
WHERE more_json ? 'is_demo';

UPDATE public."event"
SET more_json = (COALESCE(more_json, '{}'::jsonb) - 'is_demo')
  || jsonb_build_object(
    'demo', COALESCE((more_json->>'is_demo')::boolean, (more_json->>'demo')::boolean, false)
  )
WHERE more_json ? 'is_demo';

UPDATE public.attendee
SET more_json = (COALESCE(more_json, '{}'::jsonb) - 'is_demo')
  || jsonb_build_object(
    'demo', COALESCE((more_json->>'is_demo')::boolean, (more_json->>'demo')::boolean, false)
  )
WHERE more_json ? 'is_demo';

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

CREATE OR REPLACE FUNCTION api.nightly_cleanup()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_shifted integer;
BEGIN
  PERFORM api.set_audit_actor('maintenance');

  UPDATE public."event" AS e
  SET
    start_date = e.start_date + INTERVAL '1 day',
    end_date = e.end_date + INTERVAL '1 day'
  FROM public.event_group AS g
  WHERE e.event_group_code = g.event_group_code
    AND COALESCE((g.more_json->>'demo')::boolean, false) = true
    AND e.start_date IS NOT NULL
    AND e.end_date IS NOT NULL;

  GET DIAGNOSTICS v_shifted = ROW_COUNT;

  RETURN json_build_object(
    'ok', true,
    'demo_events_shifted', v_shifted
  );
END;
$$;

REVOKE ALL ON FUNCTION api.nightly_cleanup() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.nightly_cleanup() TO maintenance;
GRANT maintenance TO postgres;

NOTIFY pgrst, 'reload schema';
