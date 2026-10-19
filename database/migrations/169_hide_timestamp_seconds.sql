-- Readable timestamps omit seconds: Jul 11, 2026, 5:42 AM CDT.
-- Older strings that still include seconds remain parseable.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/169_hide_timestamp_seconds.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.format_activity_timestamp(p_ts timestamptz)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT to_char(
    date_trunc('minute', p_ts),
    'FMMon FMDD, YYYY, FMHH12:MI AM TZ'
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

  IF v_text ~ ', [0-9]{1,2}:[0-9]{2} [AP]M [A-Z]{2,5}$' THEN
    RETURN date_trunc(
      'minute',
      to_timestamp(v_text, 'Mon DD, YYYY, HH12:MI AM TZ')
    );
  END IF;

  IF v_text ~ ', [0-9]{1,2}:[0-9]{2}:[0-9]{2} [AP]M' THEN
    RETURN date_trunc(
      'second',
      to_timestamp(v_text, 'Mon DD, YYYY, HH12:MI:SS AM')
    );
  END IF;

  IF v_text ~ ', [0-9]{1,2}:[0-9]{2} [AP]M' THEN
    RETURN date_trunc(
      'minute',
      to_timestamp(v_text, 'Mon DD, YYYY, HH12:MI AM')
    );
  END IF;

  IF v_text ~ '"at" [0-9]{1,2}:[0-9]{2}:[0-9]{2} [AP]M' THEN
    RETURN date_trunc(
      'second',
      to_timestamp(v_text, 'Month DD, YYYY "at" HH12:MI:SS AM')
    );
  END IF;

  RETURN date_trunc(
    'minute',
    to_timestamp(v_text, 'Month DD, YYYY "at" HH12:MI AM')
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
