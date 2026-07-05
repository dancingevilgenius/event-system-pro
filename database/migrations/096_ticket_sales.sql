-- ticket_sales: passes and workshops purchased for an event (1:1 with event via event_code).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/096_ticket_sales.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.ticket_sales (
  event_code varchar(64) NOT NULL,
  sale_json json DEFAULT NULL,
  user_id bigint NULL DEFAULT NULL,
  created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL,
  PRIMARY KEY (event_code),
  CONSTRAINT ticket_sales_fk_event FOREIGN KEY (event_code)
    REFERENCES public."event" (event_code) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ticket_sales_fk_user FOREIGN KEY (user_id)
    REFERENCES public."user" (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE INDEX IF NOT EXISTS ticket_sales_fk_user ON public.ticket_sales (user_id);

COMMENT ON TABLE public.ticket_sales IS
  'Pass and workshop purchases for an event; sale_json holds purchase details.';

COMMENT ON COLUMN public.ticket_sales.user_id IS
  'Associated purchaser user when applicable (user is a reserved SQL keyword).';

DROP TRIGGER IF EXISTS trg_set_modified_audit ON public.ticket_sales;
CREATE TRIGGER trg_set_modified_audit
  BEFORE UPDATE ON public.ticket_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.set_row_modified_audit();

DROP TRIGGER IF EXISTS trg_audit_row_change ON public.ticket_sales;
CREATE TRIGGER trg_audit_row_change
  AFTER INSERT OR UPDATE OR DELETE ON public.ticket_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_row_change();

CREATE OR REPLACE VIEW api.ticket_sales AS
SELECT
  event_code,
  sale_json,
  user_id,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.ticket_sales;

GRANT SELECT ON api.ticket_sales TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ticket_sales TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.ticket_sales TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
