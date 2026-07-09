-- Upgrade: event_merchandise -> merchandise (between legacy 091–092 and 095).
-- Fresh installs: 091 creates merchandise_sales directly; this migration is a no-op.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/094_rename_event_merchandise_to_merchandise.sql

\connect event_system_pro

DO $$
BEGIN
  IF to_regclass('public.event_merchandise') IS NOT NULL
     AND to_regclass('public.merchandise') IS NULL THEN
    DROP VIEW IF EXISTS api.event_merchandise;
    ALTER TABLE public.event_merchandise RENAME TO merchandise;

    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'event_merchandise_fk_event'
        AND conrelid = 'public.merchandise'::regclass
    ) THEN
      ALTER TABLE public.merchandise
        RENAME CONSTRAINT event_merchandise_fk_event TO merchandise_fk_event;
    END IF;

    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'event_merchandise_next_receipt_seq_positive'
        AND conrelid = 'public.merchandise'::regclass
    ) THEN
      ALTER TABLE public.merchandise
        RENAME CONSTRAINT event_merchandise_next_receipt_seq_positive
        TO merchandise_next_receipt_seq_positive;
    END IF;
  END IF;
END
$$;

DROP VIEW IF EXISTS api.event_merchandise;
DROP VIEW IF EXISTS api.merchandise;

DO $$
BEGIN
  IF to_regclass('public.merchandise') IS NULL THEN
    RAISE NOTICE '094: public.merchandise not present; skipping api.merchandise view.';
    RETURN;
  END IF;

  EXECUTE $sql$
    CREATE OR REPLACE VIEW api.merchandise AS
    SELECT
      event_code,
      merchandise_json,
      next_receipt_seq,
      created_date,
      created_by,
      modified_date,
      modified_by
    FROM public.merchandise
  $sql$;

  GRANT SELECT ON api.merchandise TO anon, authenticated;
  GRANT INSERT, UPDATE, DELETE ON public.merchandise TO anon, authenticated;
  GRANT INSERT, UPDATE, DELETE ON api.merchandise TO anon, authenticated;
END
$$;

NOTIFY pgrst, 'reload schema';
