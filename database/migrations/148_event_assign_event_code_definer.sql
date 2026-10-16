-- Let signed-in users insert events. The event-code trigger reads public.event,
-- which authenticated cannot select, so inserts failed with permission denied.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/148_event_assign_event_code_definer.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.event_assign_event_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_base_code varchar(64);
BEGIN
  IF NEW.event_code IS NOT NULL AND btrim(NEW.event_code) <> '' THEN
    NEW.event_code := left(upper(btrim(NEW.event_code)), 64);
    RETURN NEW;
  END IF;

  v_base_code := public.derive_event_code(NEW.event_group_code, NEW.start_date);

  IF NEW.event_id IS NOT NULL THEN
    NEW.event_code := left(v_base_code, 64);
    IF EXISTS (
      SELECT 1
      FROM public."event" AS e
      WHERE e.event_code = NEW.event_code
        AND e.event_id IS DISTINCT FROM NEW.event_id
    ) THEN
      NEW.event_code := left(v_base_code || '_' || NEW.event_id::text, 64);
    END IF;
  ELSE
    NEW.event_code := v_base_code;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.event_assign_event_code() FROM PUBLIC;

NOTIFY pgrst, 'reload schema';
