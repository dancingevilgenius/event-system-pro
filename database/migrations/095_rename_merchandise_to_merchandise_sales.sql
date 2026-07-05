-- Rename merchandise table and API view to merchandise_sales (upgrade from 094).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/095_rename_merchandise_to_merchandise_sales.sql

\connect event_system_pro

DO $$
BEGIN
  IF to_regclass('public.merchandise') IS NOT NULL
     AND to_regclass('public.merchandise_sales') IS NULL THEN
    DROP VIEW IF EXISTS api.merchandise;
    ALTER TABLE public.merchandise RENAME TO merchandise_sales;

    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'merchandise_fk_event'
        AND conrelid = 'public.merchandise_sales'::regclass
    ) THEN
      ALTER TABLE public.merchandise_sales
        RENAME CONSTRAINT merchandise_fk_event TO merchandise_sales_fk_event;
    END IF;

    IF EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'merchandise_next_receipt_seq_positive'
        AND conrelid = 'public.merchandise_sales'::regclass
    ) THEN
      ALTER TABLE public.merchandise_sales
        RENAME CONSTRAINT merchandise_next_receipt_seq_positive
        TO merchandise_sales_next_receipt_seq_positive;
    END IF;
  END IF;
END
$$;

DROP VIEW IF EXISTS api.merchandise;
DROP VIEW IF EXISTS api.merchandise_sales;

CREATE OR REPLACE VIEW api.merchandise_sales AS
SELECT
  event_code,
  merchandise_json,
  next_receipt_seq,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.merchandise_sales;

GRANT SELECT ON api.merchandise_sales TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.merchandise_sales TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.merchandise_sales TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
