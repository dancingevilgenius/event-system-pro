-- Audit log string timestamps keep seconds: Jul 11, 2026, 5:42:28 AM CDT.
-- Other readable timestamps stay at minute precision.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/170_audit_timestamp_seconds.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.format_audit_timestamp(p_ts timestamptz)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT to_char(
    date_trunc('second', p_ts),
    'FMMon FMDD, YYYY, FMHH12:MI:SS AM TZ'
  );
$$;

CREATE OR REPLACE FUNCTION public.audit_format_timestamptz_text(p_text text)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT api.format_audit_timestamp(date_trunc('second', p_text::timestamptz));
$$;

COMMENT ON FUNCTION api.format_audit_timestamp(timestamptz) IS
  'Readable audit timestamp with seconds, for audit_log JSON payloads.';
