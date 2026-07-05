-- Legacy migration placeholder; inventory seed lives in database/seeds/016_merchandise_pos_demo.sql.
-- Re-run manually if needed:
--   psql -U postgres -d event_system_pro -f database/seeds/016_merchandise_pos_demo.sql

\connect event_system_pro

-- No-op: data is seeded after fictional events via dev.manifest.
