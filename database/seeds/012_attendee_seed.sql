-- Demo attendee seed: calls api.generate_demo_attendees_core() (same logic as Admin "Generate Attendees").
-- After migration 098 this covers every demo event in current_year and current_year - 1
-- (dance, HEMA, kart, robot/Robot Riot, etc.) at 200 attendees per event.
-- Safe to re-run; does not touch attendee_id above the reserved range.
--
-- Note: existing environments that already applied this file under the older
-- "prefer dance / exclude robot+kart" generator need 017_attendee_seed_include_robot_kart.sql
-- (or Admin → Generate Attendees) to pick up Robot Riot rows.
--
--   psql -U postgres -d event_system_pro -f database/seeds/012_attendee_seed.sql

\connect event_system_pro

SELECT api.generate_demo_attendees_core();
