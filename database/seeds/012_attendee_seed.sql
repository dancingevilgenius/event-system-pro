-- Demo attendee seed: calls api.generate_demo_attendees() (same logic as Admin "Generate Attendees").
-- Reserves attendee_id 1–3000; safe to re-run; does not touch attendee_id > 3000.
--
--   psql -U postgres -d event_system_pro -f database/seeds/012_attendee_seed.sql

\connect event_system_pro

SELECT api.generate_demo_attendees_core();
