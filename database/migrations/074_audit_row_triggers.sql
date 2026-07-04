-- Row-level CRUD audit triggers -> audit_log (via api.record_audit_event).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/074_audit_row_triggers.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.audit_row_record_key(p_relid regclass, p_row jsonb)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT string_agg(
        format('%s=%s', a.attname, COALESCE(p_row ->> a.attname, '')),
        ', ' ORDER BY array_position(i.indkey::smallint[], a.attnum)
      )
      FROM pg_index i
      JOIN pg_attribute a
        ON a.attrelid = i.indrelid
       AND a.attnum = ANY (i.indkey)
       AND a.attnum > 0
       AND NOT a.attisdropped
      WHERE i.indrelid = p_relid
        AND i.indisprimary
    ),
    left(p_row::text, 512)
  );
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

DO $$
DECLARE
  r record;
  v_skip constant text[] := ARRAY[
    'audit_log',
    'user'
  ];
BEGIN
  FOR r IN
    SELECT c.oid, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND NOT (c.relname = ANY (v_skip))
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_audit_row_change ON %I.%I',
      'public',
      r.relname
    );
    EXECUTE format(
      'CREATE TRIGGER trg_audit_row_change
         AFTER INSERT OR UPDATE OR DELETE ON %I.%I
         FOR EACH ROW
         EXECUTE FUNCTION public.audit_row_change()',
      'public',
      r.relname
    );
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
