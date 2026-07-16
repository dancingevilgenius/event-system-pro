-- Fictional event_group rows for dance, HEMA, and kart/racing mock data.
-- event_group_code is derived from full_name (uppercase words, underscores).
-- Safe to re-run (upserts names by code).
--
--   psql -U postgres -d event_system_pro -f database/seeds/008_event_group_fictional.sql

\connect event_system_pro

-- Retire superseded dance group codes before upserting current swing demo names.
DELETE FROM public.attendee
WHERE event_id IN (
  SELECT event_id FROM public."event"
  WHERE event_group_code IN (
    'BRINDLEWICK_CLASSIC',
    'LARKSPUR_OPEN',
    'MARIGLEN_INVITATIONAL',
    'SELWICK_CONGRESS',
    'LINDY_LOOP_CLASSIC',
    'CHARLESTON_CIRCUIT_OPEN',
    'BALBOA_BASH_INVITATIONAL',
    'THORNBAY_COUPLES_CHAMPIONSHIP'
  )
);

DELETE FROM public."event"
WHERE event_group_code IN (
  'BRINDLEWICK_CLASSIC',
  'LARKSPUR_OPEN',
  'MARIGLEN_INVITATIONAL',
  'SELWICK_CONGRESS',
  'LINDY_LOOP_CLASSIC',
  'CHARLESTON_CIRCUIT_OPEN',
  'BALBOA_BASH_INVITATIONAL',
  'THORNBAY_COUPLES_CHAMPIONSHIP'
);

DELETE FROM public.event_group
WHERE event_group_code IN (
  'BRINDLEWICK_CLASSIC',
  'LARKSPUR_OPEN',
  'MARIGLEN_INVITATIONAL',
  'SELWICK_CONGRESS',
  'LINDY_LOOP_CLASSIC',
  'CHARLESTON_CIRCUIT_OPEN',
  'BALBOA_BASH_INVITATIONAL',
  'THORNBAY_COUPLES_CHAMPIONSHIP'
);

INSERT INTO public.event_group (
  event_group_code,
  full_name,
  short_name,
  event_type_code,
  more_json,
  created_by
)
VALUES
  -- Swing / couples dance circuit
  (
    'SWING_STATE_CLASSIC',
    'Swing State Classic',
    'Swing State',
    'COUPLES_SWING',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'VERTEX_SWING_OPEN',
    'Vertex Swing Open',
    'Vertex Swing',
    'COUPLES_SWING',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'WILDCARD_SWING_INVITATIONAL',
    'Wildcard Swing Invitational',
    'Wildcard Swing',
    'COUPLES_SWING',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'JITTERBUG_JAMBOREE',
    'Jitterbug Jamboree',
    'Jitterbug Jamboree',
    'COUPLES_SWING',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'POWER_COUPLE_SWING_CHAMPIONSHIP',
    'Power Couple Swing Championship',
    'Power Couple',
    'COUPLES_SWING',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),

  -- Historical European martial arts / sword-fighting
  (
    'VELLGRIMM_LONGSWORD_OPEN',
    'Vellgrimm Longsword Open',
    'Vellgrimm',
    'SWORD_HEMA',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'CINDERHOLT_HEMA_SYMPOSIUM',
    'Cinderholt HEMA Symposium',
    'Cinderholt',
    'SWORD_HEMA',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'BRAMBLEGATE_RAPIER_CUP',
    'Bramblegate Rapier Cup',
    'Bramblegate',
    'SWORD_HEMA',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'MOSSWICK_STEEL_ACADEMY_OPEN',
    'Mosswick Steel Academy Open',
    'Mosswick',
    'SWORD_HEMA',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'HOLLOWFEN_BLADE_CONGRESS',
    'Hollowfen Blade Congress',
    'Hollowfen',
    'SWORD_HEMA',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),

  -- Kart / oval racing
  (
    'RIVETON_KART_GRAND_PRIX',
    'Riveton Kart Grand Prix',
    'Riveton',
    'MOTORSPORTS_KART',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'GLIMMERWICK_SPRINT_CUP',
    'Glimmerwick Sprint Cup',
    'Glimmerwick',
    'MOTORSPORTS_KART',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'DRAKEWELL_OVAL_CLASSIC',
    'Drakewell Oval Classic',
    'Drakewell',
    'MOTORSPORTS_KART',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'QUARRYLANE_VELOCITY_200',
    'Quarrylane Velocity 200',
    'Quarrylane',
    'MOTORSPORTS_KART',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'FOXMERE_KART_INVITATIONAL',
    'Foxmere Kart Invitational',
    'Foxmere',
    'MOTORSPORTS_KART',
    '{"demo": true}'::jsonb,
    'c-agent'
  )
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name,
  event_type_code = EXCLUDED.event_type_code,
  more_json = EXCLUDED.more_json;
