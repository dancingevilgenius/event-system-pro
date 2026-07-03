-- Configurable audit exclusions (table / row / column patterns).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/075_audit_ignore.sql

\connect event_system_pro

CREATE TABLE IF NOT EXISTS public.audit_ignore (
  audit_ignore_id serial PRIMARY KEY,
  table_name varchar(128) NOT NULL,
  ignore_columns text[] NOT NULL DEFAULT '{}',
  row_match jsonb NULL,
  ignore_all boolean NOT NULL DEFAULT false,
  note varchar(256) NULL,
  created_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL,
  modified_date timestamptz NULL DEFAULT NULL,
  modified_by varchar(128) NULL DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS audit_ignore_table_name_idx
  ON public.audit_ignore (table_name);

COMMENT ON TABLE public.audit_ignore IS
  'Skip row-audit events when UPDATE changes only ignore_columns (optional row_match). ignore_all skips every action for matching rows.';

COMMENT ON COLUMN public.audit_ignore.ignore_columns IS
  'Column names excluded from auditing when they are the only columns that changed on UPDATE.';

COMMENT ON COLUMN public.audit_ignore.row_match IS
  'Optional JSON object; all keys must match the row (e.g. {"label": "poc_counter"}). NULL matches any row in the table.';

CREATE OR REPLACE FUNCTION public.audit_row_matches(p_row jsonb, p_match jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT p_match IS NULL
    OR NOT EXISTS (
      SELECT 1
      FROM jsonb_each_text(p_match) e
      WHERE COALESCE(p_row ->> e.key, '') IS DISTINCT FROM e.value
    );
$$;

CREATE OR REPLACE FUNCTION public.audit_changed_columns(p_old jsonb, p_new jsonb)
RETURNS text[]
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_key text;
  v_changed text[] := ARRAY[]::text[];
  v_keys text[];
BEGIN
  SELECT array_agg(DISTINCT k)
  INTO v_keys
  FROM (
    SELECT jsonb_object_keys(COALESCE(p_old, '{}'::jsonb)) AS k
    UNION
    SELECT jsonb_object_keys(COALESCE(p_new, '{}'::jsonb)) AS k
  ) s;

  IF v_keys IS NULL THEN
    RETURN ARRAY[]::text[];
  END IF;

  FOREACH v_key IN ARRAY v_keys LOOP
    IF (p_old -> v_key) IS DISTINCT FROM (p_new -> v_key) THEN
      v_changed := array_append(v_changed, v_key);
    END IF;
  END LOOP;

  RETURN v_changed;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_should_skip_change(
  p_table_name text,
  p_op text,
  p_old jsonb,
  p_new jsonb
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_rule record;
  v_row jsonb;
  v_changed text[];
BEGIN
  IF p_op = 'DELETE' THEN
    v_row := p_old;
  ELSE
    v_row := p_new;
  END IF;

  v_changed := public.audit_changed_columns(p_old, p_new);

  FOR v_rule IN
    SELECT ignore_columns, row_match, ignore_all
    FROM public.audit_ignore
    WHERE table_name = p_table_name
  LOOP
    IF NOT public.audit_row_matches(v_row, v_rule.row_match) THEN
      CONTINUE;
    END IF;

    IF v_rule.ignore_all THEN
      RETURN true;
    END IF;

    IF p_op = 'UPDATE' AND v_changed <@ v_rule.ignore_columns THEN
      RETURN true;
    END IF;
  END LOOP;

  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_action text;
  v_old jsonb;
  v_new jsonb;
  v_record_key text;
  v_actor_user_id bigint;
BEGIN
  v_actor_user_id := api.current_user_id();

  IF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_old := to_jsonb(OLD);
    v_new := NULL;
    v_record_key := public.audit_row_record_key(TG_RELID, v_old);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_record_key := public.audit_row_record_key(TG_RELID, v_new);
  ELSE
    v_action := 'INSERT';
    v_old := NULL;
    v_new := to_jsonb(NEW);
    v_record_key := public.audit_row_record_key(TG_RELID, v_new);
  END IF;

  IF public.audit_should_skip_change(TG_TABLE_NAME, TG_OP, v_old, v_new) THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  PERFORM api.record_audit_event(
    p_action => v_action,
    p_actor_user_id => v_actor_user_id,
    p_table_name => TG_TABLE_NAME,
    p_record_key => v_record_key,
    p_old_data => v_old,
    p_new_data => v_new
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

INSERT INTO public.audit_ignore (table_name, ignore_columns, row_match, ignore_all, note, created_by)
SELECT
  'system_config',
  ARRAY['value', 'modified_date', 'modified_by'],
  '{"label": "poc_counter"}'::jsonb,
  true,
  'POC realtime counter increment (never row-audit this config row)',
  'c-agent'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.audit_ignore
  WHERE table_name = 'system_config'
    AND row_match = '{"label": "poc_counter"}'::jsonb
);

DROP TRIGGER IF EXISTS trg_audit_row_change ON public.audit_ignore;

NOTIFY pgrst, 'reload schema';
