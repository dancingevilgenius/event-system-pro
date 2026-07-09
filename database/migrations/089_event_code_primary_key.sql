-- Add event_code (varchar 64, unique) as the new primary key on public."event".
-- event_code = event_group_code + YYYY + MMM from start_date (UTC).
-- event_id remains a surrogate identity column with a unique constraint for existing FKs.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/089_event_code_primary_key.sql

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

-- Populate event_code only when still migrating off event_id PK (skip on retry after partial run).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_index i
    JOIN pg_attribute a
      ON a.attrelid = i.indrelid
     AND a.attnum = i.indkey[0]
    WHERE i.indrelid = 'public.event'::regclass
      AND i.indisprimary
      AND a.attname = 'event_code'
  ) THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public."event"
    WHERE event_code IS NULL
       OR btrim(event_code) = ''
       OR event_code LIKE 'TMP_%'
  ) THEN
    RETURN;
  END IF;

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
END $$;

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

-- Move PK from event_id to event_code. FKs on event_id must be dropped first, then
-- reattached to event_event_id_unique (baseline keeps event_id as the FK target).
DO $$
DECLARE
  pk_col name;
BEGIN
  SELECT a.attname
  INTO pk_col
  FROM pg_index i
  JOIN pg_attribute a
    ON a.attrelid = i.indrelid
   AND a.attnum = i.indkey[0]
  WHERE i.indrelid = 'public.event'::regclass
    AND i.indisprimary
  LIMIT 1;

  IF pk_col = 'event_code' THEN
    RAISE NOTICE '089: primary key already on event_code; skipping PK swap.';
    RETURN;
  END IF;

  ALTER TABLE public.contest DROP CONSTRAINT IF EXISTS contest_ibfk_1;
  ALTER TABLE public.judging_panel DROP CONSTRAINT IF EXISTS judging_panel_fk_event;
  ALTER TABLE public.competitor DROP CONSTRAINT IF EXISTS competitor_fk_event;
  ALTER TABLE public.attendee DROP CONSTRAINT IF EXISTS attendee_fk_event;
  ALTER TABLE public.contest_heat DROP CONSTRAINT IF EXISTS heat_fk_event;
  ALTER TABLE public.event_staff_pool DROP CONSTRAINT IF EXISTS event_staff_pool_fk_event;

  ALTER TABLE public."event" DROP CONSTRAINT IF EXISTS event_pkey;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.event'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public."event"
      ADD CONSTRAINT event_pkey PRIMARY KEY (event_code);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contest_ibfk_1'
  ) THEN
    ALTER TABLE public.contest
      ADD CONSTRAINT contest_ibfk_1 FOREIGN KEY (event_id)
      REFERENCES public."event" (event_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'judging_panel_fk_event'
  ) THEN
    ALTER TABLE public.judging_panel
      ADD CONSTRAINT judging_panel_fk_event FOREIGN KEY (event_id)
      REFERENCES public."event" (event_id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'competitor_fk_event'
  ) THEN
    ALTER TABLE public.competitor
      ADD CONSTRAINT competitor_fk_event FOREIGN KEY (event_id)
      REFERENCES public."event" (event_id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendee_fk_event'
  ) THEN
    ALTER TABLE public.attendee
      ADD CONSTRAINT attendee_fk_event FOREIGN KEY (event_id)
      REFERENCES public."event" (event_id) ON DELETE RESTRICT ON UPDATE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'heat_fk_event'
  ) THEN
    ALTER TABLE public.contest_heat
      ADD CONSTRAINT heat_fk_event FOREIGN KEY (event_id)
      REFERENCES public."event" (event_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_staff_pool_fk_event'
  ) THEN
    ALTER TABLE public.event_staff_pool
      ADD CONSTRAINT event_staff_pool_fk_event FOREIGN KEY (event_id)
      REFERENCES public."event" (event_id) ON DELETE RESTRICT;
  END IF;
END $$;

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
