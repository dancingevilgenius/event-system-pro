-- Seed static_list lookup rows (dev / demo).
-- Safe to re-run (upserts by list_code).
-- min-age / max-age use integer -1 for not applicable (N/A).

\connect event_system_pro

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES
  (
    'WSDC_SWING_EVENTS',
    'WSDC',
    'List of competition events that might appear at a swing dance',
    '[
      {"key": "JNJ", "label": "Jack and Jill"},
      {"key": "SS", "label": "Strictly Swing"},
      {"key": "ROU_CLASSIC", "label": "Classic Routine"},
      {"key": "ROU_SHOWCASE", "label": "Showcase Routine"}
    ]'::json
  ),
  (
    'WSDC_LEVELS',
    'WSDC',
    'Ability or age levels to further describe a swing contest',
    '[
      {"key": "NEW", "label": "Newcomer", "min-age": -1, "max-age": -1},
      {"key": "NOV", "label": "Novice", "min-age": -1, "max-age": -1},
      {"key": "INT", "label": "Intermediate", "min-age": -1, "max-age": -1},
      {"key": "ADV", "label": "Advanced", "min-age": -1, "max-age": -1},
      {"key": "ALL", "label": "All-Star", "min-age": -1, "max-age": -1},
      {"key": "OPE", "label": "Open", "min-age": -1, "max-age": -1},
      {"key": "CHA", "label": "Champion", "min-age": -1, "max-age": -1},
      {"key": "INV", "label": "Invitational", "min-age": -1, "max-age": -1},
      {"key": "SOP", "label": "Sophisticated", "min-age": 35, "max-age": -1},
      {"key": "MAS", "label": "Masters", "min-age": 50, "max-age": -1},
      {"key": "JUN", "label": "Juniors", "min-age": -1, "max-age": 18},
      {"key": "YAM", "label": "Young America", "min-age": -1, "max-age": 12}
    ]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
SELECT
  'US_STATES',
  'US',
  'United States states and territories',
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'key', trim(s.code),
          'label', s.name
        )
        ORDER BY s.id
      )
      FROM public.us_state_lu AS s
    ),
    '[]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

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
