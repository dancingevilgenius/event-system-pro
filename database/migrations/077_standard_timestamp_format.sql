-- Standard readable timestamp: Jul 3, 2026, 2:56:58 PM CDT (no milliseconds).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/077_standard_timestamp_format.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.format_activity_timestamp(p_ts timestamptz)
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

CREATE OR REPLACE FUNCTION api.parse_activity_timestamp(p_text text)
RETURNS timestamptz
LANGUAGE plpgsql
STABLE
SET search_path = public, api
AS $$
DECLARE
  v_text text;
BEGIN
  v_text := btrim(p_text);

  IF v_text IS NULL OR v_text = '' THEN
    RETURN NULL;
  END IF;

  IF v_text ~ '^\d{4}-\d{2}-\d{2}' THEN
    RETURN date_trunc('second', v_text::timestamptz);
  END IF;

  IF v_text ~ ', [0-9]{1,2}:[0-9]{2}:[0-9]{2} [AP]M [A-Z]{2,5}$' THEN
    RETURN date_trunc(
      'second',
      to_timestamp(v_text, 'Mon DD, YYYY, HH12:MI:SS AM TZ')
    );
  END IF;

  IF v_text ~ ', [0-9]{1,2}:[0-9]{2}:[0-9]{2} [AP]M' THEN
    RETURN date_trunc(
      'second',
      to_timestamp(v_text, 'Mon DD, YYYY, HH12:MI:SS AM')
    );
  END IF;

  RETURN date_trunc(
    'second',
    to_timestamp(v_text, 'Month DD, YYYY "at" HH12:MI:SS AM')
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
