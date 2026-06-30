-- static_list: JSON lookup lists scoped to a governing body.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/048_static_list.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.static_list (
  list_code varchar(32) NOT NULL,
  governing_body_code varchar(32) NOT NULL,
  list_json json DEFAULT NULL,
  short_desc varchar(256) DEFAULT NULL,
  PRIMARY KEY (list_code),
  CONSTRAINT static_list_code_uq UNIQUE (list_code),
  CONSTRAINT fk_static_list_governing_body FOREIGN KEY (governing_body_code)
    REFERENCES public.governing_body (governing_body_code)
);

CREATE OR REPLACE VIEW api.static_list AS
SELECT
  list_code,
  governing_body_code,
  list_json,
  short_desc
FROM public.static_list;

GRANT SELECT ON api.static_list TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.static_list TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON api.static_list TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
