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
  event_type_code,
  more_json,
  created_by
)
VALUES
  (
    'ROBOT_RIOT',
    'Robot Riot',
    'Robot Riot',
    'ROBOTICS_GENERAL',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'SERVO_SLAM',
    'Servo Slam',
    'Servo Slam',
    'ROBOTICS_GENERAL',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'RIVET_RUMBLE',
    'Rivet Rumble',
    'Rivet Rumble',
    'ROBOTICS_GENERAL',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'CIRCUIT_CARNAGE',
    'Circuit Carnage',
    'Circuit Carnage',
    'ROBOTICS_GENERAL',
    '{"demo": true}'::jsonb,
    'c-agent'
  ),
  (
    'GASKET_GAUNTLET',
    'Gasket Gauntlet',
    'Gasket Gauntlet',
    'ROBOTICS_GENERAL',
    '{"demo": true}'::jsonb,
    'c-agent'
  )
ON CONFLICT (event_group_code) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name,
  event_type_code = EXCLUDED.event_type_code,
  more_json = EXCLUDED.more_json;
