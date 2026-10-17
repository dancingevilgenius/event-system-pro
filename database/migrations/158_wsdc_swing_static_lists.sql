-- Insert WSDC swing division and skill-level static lists when they are missing.
-- Migrations 083 and 086 only rename older codes. Production does not run dev seeds,
-- so those lists were never created on eventsystem.pro.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/158_wsdc_swing_static_lists.sql

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, more_json, created_by)
VALUES (
  'WSDC',
  'World Swing Dance Council',
  'WSDC',
  '{"website": "https://worldsdc.com", "facebook": "https://www.facebook.com/worldswingdc", "discord": ""}'::json,
  'c-agent'
)
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES
  (
    'WSDC_SWING_DIVISIONS',
    'WSDC',
    'List of competition events that might appear at a swing dance',
    '[
      {"key": "JNJ", "label": "Jack and Jill"},
      {"key": "SS", "label": "Strictly Swing"},
      {"key": "ROU_CLASSIC", "label": "Classic Routine"},
      {"key": "ROU_SHOWCASE", "label": "Showcase Routine"},
      {"key": "CUSTOM", "label": "Custom"}
    ]'::json
  ),
  (
    'WSDC_SKILL_LEVELS',
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
      {"key": "YAM", "label": "Young America", "min-age": -1, "max-age": 12},
      {"key": "AAM", "label": "All-American", "min-age": -1, "max-age": -1},
      {"key": "CUSTOM", "label": "Custom", "min-age": -1, "max-age": -1}
    ]'::json
  )
ON CONFLICT (list_code) DO NOTHING;

NOTIFY pgrst, 'reload schema';
