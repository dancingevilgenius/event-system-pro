-- Rename static_list WSDC_LEVELS to WSDC_SKILL_LEVELS.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/083_rename_wsdc_levels_static_list.sql

\connect event_system_pro

UPDATE public.static_list
SET list_code = 'WSDC_SKILL_LEVELS'
WHERE list_code = 'WSDC_LEVELS';

NOTIFY pgrst, 'reload schema';
