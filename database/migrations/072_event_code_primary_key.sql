-- Add event_code (varchar 64, unique) as the new primary key on public."event".
-- event_code = event_group_code + YYYY + MMM from start_date (UTC).
-- event_id remains a surrogate identity column with a unique constraint for existing FKs.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/072_event_code_primary_key.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.derive_event_code(
  p_event_group_code text,
  p_start_date timestamptz
)
RETURNS varchar(64)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT left(
    upper(btrim(coalesce(nullif(p_event_group_code, ''), 'EVENT')))
    || '_'
    || coalesce(to_char(timezone('UTC', p_start_date), 'YYYY'), '0000')
    || '_'
    || coalesce(upper(to_char(timezone('UTC', p_start_date), 'Mon')), 'UNK'),
    64
  );
$$;

DROP VIEW IF EXISTS api.event;

ALTER TABLE public."event"
  ADD COLUMN IF NOT EXISTS event_code varchar(64);

UPDATE public."event"
SET event_code = 'TMP_' || event_id::text;

WITH base AS (
  SELECT
    e.event_id,
    public.derive_event_code(e.event_group_code, e.start_date) AS base_code
  FROM public."event" AS e
),
numbered AS (
  SELECT
    event_id,
    base_code,
    row_number() OVER (PARTITION BY base_code ORDER BY event_id) AS rn
  FROM base
)
UPDATE public."event" AS e
SET event_code = left(
  CASE
    WHEN n.rn = 1 THEN n.base_code
    ELSE n.base_code || '_' || e.event_id::text
  END,
  64
)
FROM numbered AS n
WHERE e.event_id = n.event_id;

ALTER TABLE public."event"
  ALTER COLUMN event_code SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'event_event_id_unique'
      AND conrelid = 'public.event'::regclass
  ) THEN
    ALTER TABLE public."event"
      ADD CONSTRAINT event_event_id_unique UNIQUE (event_id);
  END IF;
END $$;

ALTER TABLE public."event"
  DROP CONSTRAINT IF EXISTS event_pkey;

ALTER TABLE public."event"
  ADD CONSTRAINT event_pkey PRIMARY KEY (event_code);

CREATE OR REPLACE FUNCTION public.event_assign_event_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_base_code varchar(64);
BEGIN
  IF NEW.event_code IS NOT NULL AND btrim(NEW.event_code) <> '' THEN
    NEW.event_code := left(upper(btrim(NEW.event_code)), 64);
    RETURN NEW;
  END IF;

  v_base_code := public.derive_event_code(NEW.event_group_code, NEW.start_date);

  IF NEW.event_id IS NOT NULL THEN
    NEW.event_code := left(v_base_code, 64);
    IF EXISTS (
      SELECT 1
      FROM public."event" AS e
      WHERE e.event_code = NEW.event_code
        AND e.event_id IS DISTINCT FROM NEW.event_id
    ) THEN
      NEW.event_code := left(v_base_code || '_' || NEW.event_id::text, 64);
    END IF;
  ELSE
    NEW.event_code := v_base_code;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_assign_event_code ON public."event";
CREATE TRIGGER trg_event_assign_event_code
  BEFORE INSERT OR UPDATE OF event_group_code, start_date, event_code
  ON public."event"
  FOR EACH ROW
  EXECUTE FUNCTION public.event_assign_event_code();

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
