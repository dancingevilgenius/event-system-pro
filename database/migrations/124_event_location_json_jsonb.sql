-- Convert public.event.location_json from varchar to jsonb so audit trail
-- (to_jsonb(row)) stores a nested object instead of an escaped JSON string.
-- Also unwrap location_json string values already recorded in audit_log.
-- Safe to re-run: only alters the column when it is not already jsonb.
--
--   psql -U postgres -d event_system_pro -f database/migrations/124_event_location_json_jsonb.sql

-- Drop dependent view before any column type change.
-- (migrate.sh already connects to the target database; no \connect.)
DROP VIEW IF EXISTS api.event;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'event'
      AND column_name = 'location_json'
      AND udt_name <> 'jsonb'
  ) THEN
    -- Defaults on varchar (e.g. NULL/'{}') cannot auto-cast to jsonb.
    EXECUTE $sql$
      ALTER TABLE public."event"
        ALTER COLUMN location_json DROP DEFAULT
    $sql$;

    EXECUTE $sql$
      ALTER TABLE public."event"
        ALTER COLUMN location_json TYPE jsonb
        USING (
          CASE
            WHEN location_json IS NULL OR btrim(location_json::text) = '' THEN NULL
            WHEN NOT pg_input_is_valid(btrim(location_json::text), 'jsonb') THEN NULL
            WHEN jsonb_typeof(btrim(location_json::text)::jsonb) = 'string'
              AND pg_input_is_valid(btrim(location_json::text)::jsonb #>> '{}', 'jsonb')
              THEN (btrim(location_json::text)::jsonb #>> '{}')::jsonb
            ELSE btrim(location_json::text)::jsonb
          END
        )
    $sql$;
  END IF;
END
$$;

-- Historical audit rows captured varchar location_json as a JSON string
-- (extra escape characters in the UI). Promote those values to objects.
UPDATE public.audit_log AS a
SET
  old_data = CASE
    WHEN a.old_data IS NOT NULL
      AND jsonb_typeof(a.old_data -> 'location_json') = 'string'
      AND pg_input_is_valid(a.old_data ->> 'location_json', 'jsonb')
    THEN jsonb_set(
      a.old_data,
      '{location_json}',
      (a.old_data ->> 'location_json')::jsonb
    )
    ELSE a.old_data
  END,
  new_data = CASE
    WHEN a.new_data IS NOT NULL
      AND jsonb_typeof(a.new_data -> 'location_json') = 'string'
      AND pg_input_is_valid(a.new_data ->> 'location_json', 'jsonb')
    THEN jsonb_set(
      a.new_data,
      '{location_json}',
      (a.new_data ->> 'location_json')::jsonb
    )
    ELSE a.new_data
  END
WHERE a.table_name = 'event'
  AND (
    (
      a.old_data IS NOT NULL
      AND jsonb_typeof(a.old_data -> 'location_json') = 'string'
      AND pg_input_is_valid(a.old_data ->> 'location_json', 'jsonb')
    )
    OR (
      a.new_data IS NOT NULL
      AND jsonb_typeof(a.new_data -> 'location_json') = 'string'
      AND pg_input_is_valid(a.new_data ->> 'location_json', 'jsonb')
    )
  );

CREATE VIEW api.event AS
SELECT
  event_code,
  event_id,
  event_group_code,
  name,
  contact_user_id,
  host_club_id,
  country_code,
  state_or_province,
  location_json,
  active,
  number_of_days,
  start_date,
  end_date,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public."event"
WHERE active IS NOT FALSE;

GRANT SELECT ON api.event TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
