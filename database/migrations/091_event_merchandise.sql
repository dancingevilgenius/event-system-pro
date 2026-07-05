-- merchandise_sales: per-event merchandise catalog and receipt counter (1:1 with event via event_code).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/091_event_merchandise.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.merchandise_sales (
  event_code varchar(64) NOT NULL,
  merchandise_json json DEFAULT NULL,
  created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL,
  PRIMARY KEY (event_code),
  CONSTRAINT merchandise_sales_fk_event FOREIGN KEY (event_code)
    REFERENCES public."event" (event_code) ON DELETE RESTRICT ON UPDATE RESTRICT
);

DROP TRIGGER IF EXISTS trg_set_modified_audit ON public.merchandise_sales;
CREATE TRIGGER trg_set_modified_audit
  BEFORE UPDATE ON public.merchandise_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.set_row_modified_audit();

DROP TRIGGER IF EXISTS trg_audit_row_change ON public.merchandise_sales;
CREATE TRIGGER trg_audit_row_change
  AFTER INSERT OR UPDATE OR DELETE ON public.merchandise_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_row_change();

CREATE OR REPLACE VIEW api.merchandise_sales AS
SELECT
  event_code,
  merchandise_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.merchandise_sales;

GRANT SELECT ON api.merchandise_sales TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.merchandise_sales TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.merchandise_sales TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
