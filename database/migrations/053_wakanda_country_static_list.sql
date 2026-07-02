-- Add Wakanda to the COUNTRIES static_list row.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/053_wakanda_country_static_list.sql

\connect event_system_pro

UPDATE public.static_list
SET list_json = (
  SELECT json_agg(entry ORDER BY entry->>'label')
  FROM json_array_elements(
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM json_array_elements(COALESCE(list_json, '[]'::json)) AS existing
        WHERE existing->>'key' = 'WAK'
      )
      THEN COALESCE(list_json, '[]'::json)
      ELSE (
        COALESCE(list_json::jsonb, '[]'::jsonb)
        || '{"key": "WAK", "label": "Wakanda"}'::jsonb
      )::json
    END
  ) AS entry
)
WHERE list_code = 'COUNTRIES';

NOTIFY pgrst, 'reload schema';
