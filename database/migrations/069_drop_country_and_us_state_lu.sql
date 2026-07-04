-- Drop obsolete country_lu / us_state_lu lookup tables (replaced by static_list).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/069_drop_country_and_us_state_lu.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.country_lu;
DROP VIEW IF EXISTS api.us_state_lu;

DROP TABLE IF EXISTS public.country_lu CASCADE;
DROP TABLE IF EXISTS public.us_state_lu CASCADE;

NOTIFY pgrst, 'reload schema';
