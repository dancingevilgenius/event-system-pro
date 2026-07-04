-- Drop obsolete event_type_lu lookup table (replaced by static_list EVENT_TYPES).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/081_drop_event_type_lu.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.event_type_lu;

DROP TABLE IF EXISTS public.event_type_lu CASCADE;

NOTIFY pgrst, 'reload schema';
