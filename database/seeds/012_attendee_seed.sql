-- Demo attendee seed: calls api.generate_demo_attendees_core() (same logic as Admin "Generate Attendees").
-- Reserves attendee_id 1–N for all demo events in current_year and current_year - 1 (200 per event).
-- Safe to re-run; does not touch attendee_id above the reserved range.
--
--   psql -U postgres -d event_system_pro -f database/seeds/012_attendee_seed.sql

\connect event_system_pro

SELECT api.generate_demo_attendees_core();
