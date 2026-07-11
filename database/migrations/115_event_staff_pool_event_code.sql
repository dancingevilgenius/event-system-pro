-- Add event_code to event_staff_pool with FK to public."event"(event_code).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/115_event_staff_pool_event_code.sql

\connect event_system_pro

ALTER TABLE public.event_staff_pool
  ADD COLUMN IF NOT EXISTS event_code varchar(64) DEFAULT NULL;

UPDATE public.event_staff_pool AS esp
SET event_code = e.event_code
FROM public."event" AS e
WHERE esp.event_id = e.event_id
  AND esp.event_code IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'event_staff_pool_fk_event_code'
      AND conrelid = 'public.event_staff_pool'::regclass
  ) THEN
    ALTER TABLE public.event_staff_pool
      ADD CONSTRAINT event_staff_pool_fk_event_code FOREIGN KEY (event_code)
      REFERENCES public."event" (event_code) ON DELETE RESTRICT ON UPDATE RESTRICT;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS event_staff_pool_fk_event_code
  ON public.event_staff_pool (event_code);

DROP VIEW IF EXISTS api.event_staff_pool;

CREATE OR REPLACE VIEW api.event_staff_pool AS
SELECT
  event_staff_pool_id,
  event_id,
  event_code,
  event_group_code,
  head_judges_json,
  judges_json,
  volunteers_json,
  additional_staff_pools_json,
  contact_id,
  is_active,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_staff_pool;

GRANT SELECT ON api.event_staff_pool TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
