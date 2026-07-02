-- Copy country_lu rows into a single static_list entry (COUNTRIES).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/052_countries_static_list.sql

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, created_by)
VALUES ('GLOBAL', 'Global', 'Global', 'c-agent')
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
SELECT
  'COUNTRIES',
  'GLOBAL',
  'Countries and territories',
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'key', trim(c.iso3),
          'label', c.long_name
        )
        ORDER BY c.long_name
      )
      FROM public.country_lu AS c
      WHERE c.iso3 IS NOT NULL
    ),
    '[]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

NOTIFY pgrst, 'reload schema';
