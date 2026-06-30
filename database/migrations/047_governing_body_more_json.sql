-- governing_body: social / web links in more_json.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/047_governing_body_more_json.sql

\connect event_system_pro

ALTER TABLE public.governing_body
  ADD COLUMN IF NOT EXISTS more_json json DEFAULT NULL;

DROP VIEW IF EXISTS api.governing_body;

CREATE VIEW api.governing_body AS
SELECT
  governing_body_code,
  long_name,
  short_name,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.governing_body;

GRANT SELECT ON api.governing_body TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.governing_body TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
