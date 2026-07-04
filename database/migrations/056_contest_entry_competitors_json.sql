-- Rename contest_entry.competitor_list -> competitors_json (upgrade from pre-055 schema).
-- Fresh installs: 055_contest_entry.sql already uses competitors_json; this is a no-op.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/056_contest_entry_competitors_json.sql

\connect event_system_pro

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'contest_entry'
      AND a.attname = 'competitor_list'
      AND a.attnum > 0
      AND NOT a.attisdropped
  ) THEN
    ALTER TABLE public.contest_entry RENAME COLUMN competitor_list TO competitors_json;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
