-- Rename fight_event_staff -> event_staff_pool; rename key columns; add additional_staff_pools_json.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/030_rename_event_staff_pool.sql

\connect event_system_pro

ALTER TABLE IF EXISTS public.fight_event_staff RENAME TO event_staff_pool;

ALTER TABLE public.event_staff_pool
  RENAME COLUMN fight_staff_id TO event_staff_pool_id;

ALTER TABLE public.event_staff_pool
  RENAME COLUMN fight_event_id TO event_id;

ALTER TABLE public.event_staff_pool
  RENAME COLUMN fight_directors_json TO head_judges_json;

ALTER TABLE public.event_staff_pool
  ADD COLUMN IF NOT EXISTS additional_staff_pools_json json DEFAULT NULL;

ALTER TABLE public.event_staff_pool
  RENAME CONSTRAINT fight_event_staff_fk_event TO event_staff_pool_fk_event;

ALTER INDEX IF EXISTS fight_event_staff_fk_event
  RENAME TO event_staff_pool_fk_event;

ALTER INDEX IF EXISTS fight_event_staff_pkey
  RENAME TO event_staff_pool_pkey;

CREATE OR REPLACE VIEW api.event_staff_pool AS
SELECT
  event_staff_pool_id,
  event_id,
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
GRANT INSERT, UPDATE, DELETE ON public.event_staff_pool TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
