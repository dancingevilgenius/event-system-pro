-- Add CUSTOM entries to WSDC swing division and skill level static lists.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/087_wsdc_custom_static_list_entries.sql

\connect event_system_pro

UPDATE public.static_list
SET list_json = (
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM json_array_elements(COALESCE(list_json, '[]'::json)) AS existing
      WHERE existing->>'key' = 'CUSTOM'
    )
    THEN list_json
    ELSE (
      COALESCE(list_json::jsonb, '[]'::jsonb)
      || '{"key": "CUSTOM", "label": "Custom"}'::jsonb
    )::json
  END
)
WHERE list_code = 'WSDC_SWING_DIVISIONS';

UPDATE public.static_list
SET list_json = (
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM json_array_elements(COALESCE(list_json, '[]'::json)) AS existing
      WHERE existing->>'key' = 'CUSTOM'
    )
    THEN list_json
    ELSE (
      COALESCE(list_json::jsonb, '[]'::jsonb)
      || '{"key": "CUSTOM", "label": "Custom", "min-age": -1, "max-age": -1}'::jsonb
    )::json
  END
)
WHERE list_code = 'WSDC_SKILL_LEVELS';

NOTIFY pgrst, 'reload schema';
