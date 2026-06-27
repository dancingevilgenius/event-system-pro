-- Fictional event_group rows for dance, HEMA, and kart/racing mock data.
-- event_group_code is derived from full_name (uppercase words, underscores).
-- Safe to re-run (upserts names by code).
--
--   psql -U postgres -d event_system_pro -f database/seeds/008_event_group_fictional.sql

\connect event_system_pro

INSERT INTO public.event_group (
  event_group_code,
  full_name,
  short_name,
  additional_info_json,
  created_by
)
VALUES
  -- Couples dance circuit (no dance-style names in titles)
  (
    'BRINDLEWICK_CLASSIC',
    'Brindlewick Classic',
    'Brindlewick',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'LARKSPUR_OPEN',
    'Larkspur Open',
    'Larkspur',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'MARIGLEN_INVITATIONAL',
    'Mariglen Invitational',
    'Mariglen',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'SELWICK_CONGRESS',
    'Selwick Congress',
    'Selwick',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'THORNBAY_COUPLES_CHAMPIONSHIP',
    'Thornbay Couples Championship',
    'Thornbay',
    '{"is_demo": true}'::json,
    'c-agent'
  ),

  -- Historical European martial arts / sword-fighting
  (
    'VELLGRIMM_LONGSWORD_OPEN',
    'Vellgrimm Longsword Open',
    'Vellgrimm',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'CINDERHOLT_HEMA_SYMPOSIUM',
    'Cinderholt HEMA Symposium',
    'Cinderholt',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'BRAMBLEGATE_RAPIER_CUP',
    'Bramblegate Rapier Cup',
    'Bramblegate',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'MOSSWICK_STEEL_ACADEMY_OPEN',
    'Mosswick Steel Academy Open',
    'Mosswick',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'HOLLOWFEN_BLADE_CONGRESS',
    'Hollowfen Blade Congress',
    'Hollowfen',
    '{"is_demo": true}'::json,
    'c-agent'
  ),

  -- Kart / oval racing
  (
    'RIVETON_KART_GRAND_PRIX',
    'Riveton Kart Grand Prix',
    'Riveton',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'GLIMMERWICK_SPRINT_CUP',
    'Glimmerwick Sprint Cup',
    'Glimmerwick',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'DRAKEWELL_OVAL_CLASSIC',
    'Drakewell Oval Classic',
    'Drakewell',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'QUARRYLANE_VELOCITY_200',
    'Quarrylane Velocity 200',
    'Quarrylane',
    '{"is_demo": true}'::json,
    'c-agent'
  ),
  (
    'FOXMERE_KART_INVITATIONAL',
    'Foxmere Kart Invitational',
    'Foxmere',
    '{"is_demo": true}'::json,
    'c-agent'
  )
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name,
  additional_info_json = EXCLUDED.additional_info_json;
