-- Add motorsports kart event type and refresh EVENT_TYPES static_list.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/079_motorsports_kart_event_type.sql

\connect event_system_pro

INSERT INTO public.event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'MOTORSPORTS_KART',
  '{
    "major_group": "motorsports",
    "minor_group": "kart",
    "description": "Wheel-to-wheel kart racing on dedicated sprint circuits or full-size tracks. Drivers compete in lightweight open-wheel karts through practice, qualifying, heats, and finals. Classes are commonly defined by age, engine package, and weight, with results based on finishing position, consistency, or fastest lap depending on the event format.",
    "min_persons_per_entry": 1,
    "max_persons_per_entry": 20
  }'::jsonb,
  'c-agent'
)
ON CONFLICT (event_type_code) DO UPDATE SET
  description_json = EXCLUDED.description_json,
  modified_date = date_trunc('second', CURRENT_TIMESTAMP),
  modified_by = 'c-agent';

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
