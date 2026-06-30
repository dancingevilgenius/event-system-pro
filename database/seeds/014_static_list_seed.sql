-- Seed static_list lookup rows (dev / demo).
-- Safe to re-run (upserts by list_code).

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
      {"key": "NEW", "label": "Newcomer"},
      {"key": "NOV", "label": "Novice"},
      {"key": "INT", "label": "Intermediate"},
      {"key": "ADV", "label": "Advanced"},
      {"key": "ALL", "label": "All-Star"},
      {"key": "CHA", "label": "Champion"},
      {"key": "INV", "label": "Invitational"},
      {"key": "SOP", "label": "Sophisticated"},
      {"key": "MAS", "label": "Masters"},
      {"key": "JUN", "label": "Juniors"},
      {"key": "YAM", "label": "Young America"}
    ]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;
