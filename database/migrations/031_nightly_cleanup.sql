-- Nightly maintenance: shift demo event dates forward one day.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/031_nightly_cleanup.sql

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maintenance') THEN
    CREATE ROLE maintenance NOLOGIN;
  END IF;
END $$;

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
