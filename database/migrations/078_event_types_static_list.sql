-- Copy event_type_lu rows into a single static_list entry (EVENT_TYPES).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/078_event_types_static_list.sql

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, created_by)
VALUES ('GLOBAL', 'Global', 'Global', 'c-agent')
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
SELECT
  'EVENT_TYPES',
  'GLOBAL',
  'Competition and event type definitions',
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'key', trim(e.event_type_code),
          'label', initcap(replace(lower(trim(e.event_type_code)), '_', ' ')),
          'major-group', e.description_json->>'major_group',
          'minor-group', e.description_json->>'minor_group',
          'description', e.description_json->>'description',
          'min-persons-per-entry', (e.description_json->>'min_persons_per_entry')::int,
          'max-persons-per-entry', (e.description_json->>'max_persons_per_entry')::int
        )
        ORDER BY e.event_type_code
      )
      FROM public.event_type_lu AS e
    ),
    '[]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

NOTIFY pgrst, 'reload schema';
