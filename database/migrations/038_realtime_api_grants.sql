-- Realtime counter updates set modified_by explicitly; skip JWT audit lookup for them.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/038_realtime_api_grants.sql

\connect event_system_pro

GRANT USAGE ON SCHEMA api TO realtime;

CREATE OR REPLACE FUNCTION public.set_row_modified_audit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, api
AS $$
DECLARE
  v_actor text;
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.modified_by IS NOT NULL
     AND btrim(NEW.modified_by) <> '' THEN
    IF NEW.modified_date IS NULL THEN
      NEW.modified_date := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
  END IF;

  v_actor := api.resolve_audit_actor(NULL);
  IF v_actor IS NOT NULL THEN
    NEW.modified_by := v_actor;
    NEW.modified_date := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;
