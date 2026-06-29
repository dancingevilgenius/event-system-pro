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
  more_json,
  created_by
)
VALUES
  -- Couples dance circuit (no dance-style names in titles)
  (
    'BRINDLEWICK_CLASSIC',
    'Brindlewick Classic',
    'Brindlewick',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'LARKSPUR_OPEN',
    'Larkspur Open',
    'Larkspur',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'MARIGLEN_INVITATIONAL',
    'Mariglen Invitational',
    'Mariglen',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'SELWICK_CONGRESS',
    'Selwick Congress',
    'Selwick',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'THORNBAY_COUPLES_CHAMPIONSHIP',
    'Thornbay Couples Championship',
    'Thornbay',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),

  -- Historical European martial arts / sword-fighting
  (
    'VELLGRIMM_LONGSWORD_OPEN',
    'Vellgrimm Longsword Open',
    'Vellgrimm',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'CINDERHOLT_HEMA_SYMPOSIUM',
    'Cinderholt HEMA Symposium',
    'Cinderholt',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'BRAMBLEGATE_RAPIER_CUP',
    'Bramblegate Rapier Cup',
    'Bramblegate',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'MOSSWICK_STEEL_ACADEMY_OPEN',
    'Mosswick Steel Academy Open',
    'Mosswick',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'HOLLOWFEN_BLADE_CONGRESS',
    'Hollowfen Blade Congress',
    'Hollowfen',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),

  -- Kart / oval racing
  (
    'RIVETON_KART_GRAND_PRIX',
    'Riveton Kart Grand Prix',
    'Riveton',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'GLIMMERWICK_SPRINT_CUP',
    'Glimmerwick Sprint Cup',
    'Glimmerwick',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'DRAKEWELL_OVAL_CLASSIC',
    'Drakewell Oval Classic',
    'Drakewell',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'QUARRYLANE_VELOCITY_200',
    'Quarrylane Velocity 200',
    'Quarrylane',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'FOXMERE_KART_INVITATIONAL',
    'Foxmere Kart Invitational',
    'Foxmere',
    '{"demo": true}'::jsonb,
    'c-agent'
  )
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name,
  more_json = EXCLUDED.more_json;
