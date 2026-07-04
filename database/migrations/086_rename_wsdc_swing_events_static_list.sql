-- Rename static_list WSDC_SWING_EVENTS to WSDC_SWING_DIVISIONS.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/086_rename_wsdc_swing_events_static_list.sql

\connect event_system_pro

UPDATE public.static_list
SET list_code = 'WSDC_SWING_DIVISIONS'
WHERE list_code = 'WSDC_SWING_EVENTS';

NOTIFY pgrst, 'reload schema';
