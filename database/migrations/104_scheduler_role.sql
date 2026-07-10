-- Dedicated LOGIN role for the scheduler container (cron → maintenance RPCs).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/104_scheduler_role.sql

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maintenance') THEN
    CREATE ROLE maintenance NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'scheduler') THEN
    CREATE ROLE scheduler LOGIN PASSWORD 'scheduler_dev_password';
  END IF;
END $$;

GRANT CONNECT ON DATABASE event_system_pro TO scheduler;
GRANT USAGE ON SCHEMA api TO scheduler;
GRANT maintenance TO scheduler;

-- Ensure maintenance can still execute the scheduled RPCs (idempotent).
GRANT EXECUTE ON FUNCTION api.nightly_cleanup() TO maintenance;
GRANT EXECUTE ON FUNCTION api.inactivity_logout() TO maintenance;

-- Keep local/manual superuser runs working (postgres inherits maintenance).
GRANT maintenance TO postgres;
