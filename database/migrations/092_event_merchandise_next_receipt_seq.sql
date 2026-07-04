-- Add next_receipt_seq to event_merchandise for per-event sales receipt numbering.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/092_event_merchandise_next_receipt_seq.sql

\connect event_system_pro

DROP VIEW IF EXISTS api.event_merchandise;

ALTER TABLE public.event_merchandise
  ADD COLUMN IF NOT EXISTS next_receipt_seq integer NOT NULL DEFAULT 1;

ALTER TABLE public.event_merchandise
  DROP CONSTRAINT IF EXISTS event_merchandise_next_receipt_seq_positive;

ALTER TABLE public.event_merchandise
  ADD CONSTRAINT event_merchandise_next_receipt_seq_positive
  CHECK (next_receipt_seq >= 1 AND next_receipt_seq <= 99999);

COMMENT ON COLUMN public.event_merchandise.next_receipt_seq IS
  'Next receipt sequence to assign for this event (1-99999). Display as lpad(seq, 5, ''0'') appended to event_code.';

CREATE OR REPLACE VIEW api.event_merchandise AS
SELECT
  event_code,
  merchandise_json,
  next_receipt_seq,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.event_merchandise;

GRANT SELECT ON api.event_merchandise TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.event_merchandise TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.event_merchandise TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
