-- event_group.event_type_code: optional key into static_list EVENT_TYPES.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/130_event_group_event_type_code.sql

\connect event_system_pro

ALTER TABLE public.event_group
  ADD COLUMN IF NOT EXISTS event_type_code varchar(32) DEFAULT NULL;

COMMENT ON COLUMN public.event_group.event_type_code IS
  'Optional EVENT_TYPES static_list key for this event group.';

-- Backfill demo groups by circuit.
UPDATE public.event_group
SET event_type_code = 'COUPLES_SWING'
WHERE event_group_code IN (
  'SWING_STATE_CLASSIC',
  'VERTEX_SWING_OPEN',
  'WILDCARD_SWING_INVITATIONAL',
  'JITTERBUG_JAMBOREE',
  'POWER_COUPLE_SWING_CHAMPIONSHIP'
)
  AND event_type_code IS NULL;

UPDATE public.event_group
SET event_type_code = 'SWORD_HEMA'
WHERE event_group_code IN (
  'VELLGRIMM_LONGSWORD_OPEN',
  'CINDERHOLT_HEMA_SYMPOSIUM',
  'BRAMBLEGATE_RAPIER_CUP',
  'MOSSWICK_STEEL_ACADEMY_OPEN',
  'HOLLOWFEN_BLADE_CONGRESS'
)
  AND event_type_code IS NULL;

UPDATE public.event_group
SET event_type_code = 'MOTORSPORTS_KART'
WHERE event_group_code IN (
  'RIVETON_KART_GRAND_PRIX',
  'GLIMMERWICK_SPRINT_CUP',
  'DRAKEWELL_OVAL_CLASSIC',
  'QUARRYLANE_VELOCITY_200',
  'FOXMERE_KART_INVITATIONAL'
)
  AND event_type_code IS NULL;

UPDATE public.event_group
SET event_type_code = 'ROBOTICS_GENERAL'
WHERE event_group_code IN (
  'ROBOT_RIOT',
  'SERVO_SLAM',
  'RIVET_RUMBLE',
  'CIRCUIT_CARNAGE',
  'GASKET_GAUNTLET'
)
  AND event_type_code IS NULL;

UPDATE public.event_group
SET event_type_code = 'SWORD_LIGHT_SABER'
WHERE event_group_code IN (
  'PORTLAND_PLASMA_PRIX',
  'CHICAGO_CHROME_CLASH',
  'STELLAR_SHOWDOWN',
  'NEON_NEXUS',
  'MERIDIAN_MELEE'
)
  AND event_type_code IS NULL;

DROP VIEW IF EXISTS api.event_group;

CREATE VIEW api.event_group AS
SELECT
  event_group_code,
  full_name,
  short_name,
  directors_json,
  event_type_code,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_group;

GRANT SELECT ON api.event_group TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
