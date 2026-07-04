-- Drop obsolete skill_level_lu lookup table (replaced by static_list WSDC_SKILL_LEVELS).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/085_drop_skill_level_lu.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.skill_level_lu;

DROP TABLE IF EXISTS public.skill_level_lu CASCADE;

NOTIFY pgrst, 'reload schema';
