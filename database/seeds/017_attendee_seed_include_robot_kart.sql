-- Refresh demo attendees for ALL demo events in current_year and current_year - 1
-- (dance, HEMA, kart, robot, etc.) via api.generate_demo_attendees_core().
--
-- Why a separate seed: older deploys applied 012_attendee_seed.sql when
-- generate_demo_attendees_core() still excluded ROBOT_RIOT / kart groups
-- (migration 045 era). schema_seeds skips already-applied files, so 012 will
-- not re-run. This file is new in the manifest and re-generates attendees
-- under the post-098 rules (includes Robot Riot 2025/2026 when those years
-- are in the demo window).
--
-- Safe to re-run; same reserved-range behavior as Admin "Generate Attendees".
--
--   psql -U postgres -d event_system_pro -f database/seeds/017_attendee_seed_include_robot_kart.sql

\connect event_system_pro

SELECT api.generate_demo_attendees_core();
