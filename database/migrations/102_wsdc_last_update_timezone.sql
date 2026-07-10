-- Append 3-letter timezone abbreviation to wsdc.last_update_datetime.
-- Example: July 20, 2026 8:00pm CDT
-- Run: psql -U postgres -d event_system_pro -f database/migrations/102_wsdc_last_update_timezone.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.format_wsdc_update_timestamp(p_ts timestamptz DEFAULT CURRENT_TIMESTAMP)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT
    to_char(date_trunc('minute', p_ts), 'FMMonth FMDD, YYYY FMHH12:MI')
    || lower(to_char(date_trunc('minute', p_ts), 'am'))
    || ' '
    || to_char(date_trunc('minute', p_ts), 'TZ');
$$;

NOTIFY pgrst, 'reload schema';
