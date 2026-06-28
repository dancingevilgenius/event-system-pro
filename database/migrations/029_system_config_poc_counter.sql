-- POC: system_config counter row, API view, NOTIFY trigger, realtime service role.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/029_system_config_poc_counter.sql

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'realtime') THEN
    CREATE ROLE realtime LOGIN PASSWORD 'realtime_dev_password';
  END IF;
END $$;

GRANT CONNECT ON DATABASE event_system_pro TO realtime;
GRANT USAGE ON SCHEMA public TO realtime;
GRANT SELECT, UPDATE ON public.system_config TO realtime;

CREATE OR REPLACE VIEW api.system_config AS
SELECT
  system_config_id,
  label,
  value,
  active,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.system_config
WHERE active IS NOT FALSE;

GRANT SELECT ON api.system_config TO anon, authenticated;

INSERT INTO public.system_config (label, value, active, created_by)
SELECT 'poc_counter', '0', true, 'c-agent'
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_config WHERE label = 'poc_counter'
);

CREATE OR REPLACE FUNCTION public.notify_poc_counter_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.label = 'poc_counter'
     AND (TG_OP = 'INSERT' OR OLD.value IS DISTINCT FROM NEW.value) THEN
    PERFORM pg_notify('system_config_poc_counter', NEW.value);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS system_config_notify_poc_counter ON public.system_config;
CREATE TRIGGER system_config_notify_poc_counter
  AFTER INSERT OR UPDATE OF value ON public.system_config
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_poc_counter_change();

NOTIFY pgrst, 'reload schema';
