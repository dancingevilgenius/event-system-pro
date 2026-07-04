-- Seed static_list SECRET_QUESTIONS (password-recovery question pool).
-- Safe to re-run (upserts by list_code).

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, created_by)
VALUES ('GLOBAL', 'Global', 'Global', 'c-agent')
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES (
  'SECRET_QUESTIONS',
  'GLOBAL',
  'Secret questions for password recovery',
  $secret_questions$
[
  {"key": "1", "label": "Favorite place to visit as a child?"},
  {"key": "2", "label": "Favorite actor?"},
  {"key": "3", "label": "Favorite musician?"},
  {"key": "4", "label": "Name of your pet as a child?"},
  {"key": "5", "label": "In what city were you born?"},
  {"key": "6", "label": "Favorite movie?"},
  {"key": "7", "label": "What street did you grow up on?"},
  {"key": "8", "label": "Color of your first car?"},
  {"key": "9", "label": "Father's middle name?"},
  {"key": "10", "label": "Mother's maiden name?"},
  {"key": "11", "label": "First name of your first kiss?"},
  {"key": "12", "label": "Guilty pleasure?"},
  {"key": "13", "label": "Name of best friend in high school"},
  {"key": "14", "label": "You have 99 problems. What ain't one of them?"},
  {"key": "15", "label": "Name of your elementary school?"},
  {"key": "16", "label": "Childhood nickname?"},
  {"key": "17", "label": "Make and model of your first car?"},
  {"key": "18", "label": "Name of your first employer?"},
  {"key": "19", "label": "First concert you attended?"},
  {"key": "20", "label": "Favorite food as a child?"},
  {"key": "21", "label": "Name of your favorite teacher?"},
  {"key": "22", "label": "First album you bought?"},
  {"key": "23", "label": "Town where your parents met?"},
  {"key": "24", "label": "Name of your childhood toy?"}
]
$secret_questions$::json
)
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;
