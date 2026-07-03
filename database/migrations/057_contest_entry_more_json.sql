-- Rename contest_entry.additional_info -> more_json (align with event, attendee, governing_body).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/057_contest_entry_more_json.sql

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
      AND a.attname = 'additional_info'
      AND a.attnum > 0
      AND NOT a.attisdropped
  ) THEN
    ALTER TABLE public.contest_entry RENAME COLUMN additional_info TO more_json;
  END IF;
END $$;

DROP VIEW IF EXISTS api.contest_entry;

CREATE VIEW api.contest_entry AS
SELECT
  contest_entry_id,
  governing_body_code,
  contest_id,
  competitors_json,
  name,
  more_json,
  scratched,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.contest_entry;

GRANT SELECT ON api.contest_entry TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.contest_entry TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
