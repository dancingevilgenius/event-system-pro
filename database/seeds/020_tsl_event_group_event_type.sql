-- Set EVENT_TYPES keys on legacy TSL event groups (and ensure demo circuits stay typed).
-- Safe to re-run. Complements seeds 008–010 / 018–019 which already set event_type_code on insert.
--
--   psql -U postgres -d event_system_pro -f database/seeds/020_tsl_event_group_event_type.sql

\connect event_system_pro

-- Baseline The Saber Legion groups (from evp_schema_postgresql.sql).
UPDATE public.event_group
SET
  event_type_code = 'SWORD_LIGHT_SABER',
  modified_by = 'c-agent',
  modified_date = date_trunc('second', CURRENT_TIMESTAMP)
WHERE event_group_code IN (
  'TSL_ARMAGEDDON',
  'TSL_AWAKENING',
  'TSL_BATTLEGROUND',
  'TSL_BATTLE_OF_CHAMPIONS',
  'TSL_BEAST_COAST_BRAWL',
  'TSL_CROSSROADS',
  'TSL_CRUSHXOTICA',
  'TSL_DARKWATCH',
  'TSL_FLORIDA_CUP',
  'TSL_MEXICO_OPEN',
  'TSL_RAGNAROK',
  'TSL_RESOLUTION',
  'TSL_SOUTHERN_CALIFORNIA',
  'TSL_STEAMPUNK',
  'TSL_SUNCRUSHER',
  'TSL_UNDERGROUND',
  'TSL_WIZARD_WORLD_CHICAGO',
  'TSL_WIZARD_WORLD_COLUMBUS',
  'TSL_WORLDS',
  'TSL_FICTIONAL_FRACAS'
)
  AND (event_type_code IS DISTINCT FROM 'SWORD_LIGHT_SABER');

-- Demo circuits (idempotent if 008–010 already applied).
UPDATE public.event_group
SET
  event_type_code = 'COUPLES_SWING',
  modified_by = 'c-agent',
  modified_date = date_trunc('second', CURRENT_TIMESTAMP)
WHERE event_group_code IN (
  'SWING_STATE_CLASSIC',
  'VERTEX_SWING_OPEN',
  'WILDCARD_SWING_INVITATIONAL',
  'JITTERBUG_JAMBOREE',
  'POWER_COUPLE_SWING_CHAMPIONSHIP'
)
  AND (event_type_code IS DISTINCT FROM 'COUPLES_SWING');

UPDATE public.event_group
SET
  event_type_code = 'SWORD_HEMA',
  modified_by = 'c-agent',
  modified_date = date_trunc('second', CURRENT_TIMESTAMP)
WHERE event_group_code IN (
  'VELLGRIMM_LONGSWORD_OPEN',
  'CINDERHOLT_HEMA_SYMPOSIUM',
  'BRAMBLEGATE_RAPIER_CUP',
  'MOSSWICK_STEEL_ACADEMY_OPEN',
  'HOLLOWFEN_BLADE_CONGRESS'
)
  AND (event_type_code IS DISTINCT FROM 'SWORD_HEMA');

UPDATE public.event_group
SET
  event_type_code = 'MOTORSPORTS_KART',
  modified_by = 'c-agent',
  modified_date = date_trunc('second', CURRENT_TIMESTAMP)
WHERE event_group_code IN (
  'RIVETON_KART_GRAND_PRIX',
  'GLIMMERWICK_SPRINT_CUP',
  'DRAKEWELL_OVAL_CLASSIC',
  'QUARRYLANE_VELOCITY_200',
  'FOXMERE_KART_INVITATIONAL'
)
  AND (event_type_code IS DISTINCT FROM 'MOTORSPORTS_KART');

UPDATE public.event_group
SET
  event_type_code = 'ROBOTICS_GENERAL',
  modified_by = 'c-agent',
  modified_date = date_trunc('second', CURRENT_TIMESTAMP)
WHERE event_group_code IN (
  'ROBOT_RIOT',
  'SERVO_SLAM',
  'RIVET_RUMBLE',
  'CIRCUIT_CARNAGE',
  'GASKET_GAUNTLET'
)
  AND (event_type_code IS DISTINCT FROM 'ROBOTICS_GENERAL');

UPDATE public.event_group
SET
  event_type_code = 'SWORD_LIGHT_SABER',
  modified_by = 'c-agent',
  modified_date = date_trunc('second', CURRENT_TIMESTAMP)
WHERE event_group_code IN (
  'PORTLAND_PLASMA_PRIX',
  'CHICAGO_CHROME_CLASH',
  'STELLAR_SHOWDOWN',
  'NEON_NEXUS',
  'MERIDIAN_MELEE'
)
  AND (event_type_code IS DISTINCT FROM 'SWORD_LIGHT_SABER');
