-- Fictional robot-combat event_group rows.
-- event_group_code is derived from full_name (uppercase words, underscores).
-- Safe to re-run (upserts names by code).
--
--   psql -U postgres -d event_system_pro -f database/seeds/009_event_group_robot.sql

\connect event_system_pro

INSERT INTO public.event_group (
  event_group_code,
  full_name,
  short_name,
  created_by
)
VALUES
  (
    'ROBOT_RIOT',
    'Robot Riot',
    'Robot Riot',
    'c-agent'
  ),
  (
    'SERVO_SLAM',
    'Servo Slam',
    'Servo Slam',
    'c-agent'
  ),
  (
    'RIVET_RUMBLE',
    'Rivet Rumble',
    'Rivet Rumble',
    'c-agent'
  ),
  (
    'CIRCUIT_CARNAGE',
    'Circuit Carnage',
    'Circuit Carnage',
    'c-agent'
  ),
  (
    'GASKET_GAUNTLET',
    'Gasket Gauntlet',
    'Gasket Gauntlet',
    'c-agent'
  )
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name;
