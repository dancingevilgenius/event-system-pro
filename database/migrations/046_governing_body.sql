-- governing_body: lookup for dance/sport governing organizations.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/046_governing_body.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.governing_body (
  governing_body_code varchar(32) NOT NULL,
  long_name varchar(64) NOT NULL,
  short_name varchar(43) DEFAULT NULL,
  more_json json DEFAULT NULL,
  created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  modified_date TIMESTAMPTZ NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL,
  PRIMARY KEY (governing_body_code),
  CONSTRAINT governing_body_code_uq UNIQUE (governing_body_code)
);

DROP TRIGGER IF EXISTS trg_set_modified_audit ON public.governing_body;
CREATE TRIGGER trg_set_modified_audit
  BEFORE UPDATE ON public.governing_body
  FOR EACH ROW
  EXECUTE FUNCTION public.set_row_modified_audit();

CREATE OR REPLACE VIEW api.governing_body AS
SELECT
  governing_body_code,
  long_name,
  short_name,
  more_json,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.governing_body;

GRANT SELECT ON api.governing_body TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.governing_body TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.governing_body TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
