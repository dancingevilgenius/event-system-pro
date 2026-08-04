-- Add TSL competition divisions static_list (key/label, same shape as WSDC_SWING_DIVISIONS).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/135_tsl_divisions_static_list.sql

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, more_json, created_by)
VALUES (
  'TSL',
  'The Saber Legion',
  'TSL',
  '{"website": "https://www.thesaberlegion.com", "facebook": "https://www.facebook.com/thesaberlegion", "discord": ""}'::json,
  'c-agent'
)
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES (
  'TSL_DIVISIONS',
  'TSL',
  'List of competition divisions that might appear at a TSL saber event',
  '[
    {"key": "STD", "label": "Standard"},
    {"key": "EXO", "label": "Exotics"},
    {"key": "UNI", "label": "Unity"},
    {"key": "WOM", "label": "Womens"},
    {"key": "MAS", "label": "Masters"},
    {"key": "TAG", "label": "Tag Teams"}
  ]'::json
)
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

NOTIFY pgrst, 'reload schema';
