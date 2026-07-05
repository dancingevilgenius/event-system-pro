-- Add next_receipt_seq to merchandise for per-event sales receipt numbering.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/092_event_merchandise_next_receipt_seq.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.merchandise;

ALTER TABLE public.merchandise
  ADD COLUMN IF NOT EXISTS next_receipt_seq integer NOT NULL DEFAULT 1;

ALTER TABLE public.merchandise
  DROP CONSTRAINT IF EXISTS merchandise_next_receipt_seq_positive;

ALTER TABLE public.merchandise
  ADD CONSTRAINT merchandise_next_receipt_seq_positive
  CHECK (next_receipt_seq >= 1 AND next_receipt_seq <= 99999);

COMMENT ON COLUMN public.merchandise.next_receipt_seq IS
  'Next receipt sequence to assign for this event (1-99999). Display as lpad(seq, 5, ''0'') appended to event_code.';

CREATE OR REPLACE VIEW api.merchandise AS
SELECT
  event_code,
  merchandise_json,
  next_receipt_seq,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.merchandise;

GRANT SELECT ON api.merchandise TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.merchandise TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.merchandise TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
