-- Audit human-initiated row changes on public.user (previously skipped).
-- Still skip session-only additional_info_json bumps (last-activity / login / logout).
-- Re-attach row audit triggers to all public tables except audit_log / audit_ignore.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/103_audit_user_human_actions.sql

\connect event_system_pro

-- Session / heartbeat keys inside user.additional_info_json that are not human edits.
CREATE OR REPLACE FUNCTION public.audit_user_session_info_keys()
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ARRAY[
    'last-activity',
    'last_login_at',
    'inactive_logout_at'
  ]::text[];
$$;

CREATE OR REPLACE FUNCTION public.audit_strip_user_session_info(p_info jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_key text;
  v_out jsonb;
BEGIN
  IF p_info IS NULL OR jsonb_typeof(p_info) <> 'object' THEN
    RETURN COALESCE(p_info, '{}'::jsonb);
  END IF;

  v_out := p_info;
  FOREACH v_key IN ARRAY public.audit_user_session_info_keys() LOOP
    v_out := v_out - v_key;
  END LOOP;

  RETURN v_out;
END;
$$;

-- True when an UPDATE only refreshed session/heartbeat fields (not a human edit).
CREATE OR REPLACE FUNCTION public.audit_is_user_session_only_update(p_old jsonb, p_new jsonb)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_changed text[];
  v_col text;
  v_allowed text[] := ARRAY[
    'additional_info_json',
    'modified_date',
    'modified_by'
  ];
BEGIN
  v_changed := public.audit_changed_columns(p_old, p_new);

  IF v_changed IS NULL OR cardinality(v_changed) = 0 THEN
    RETURN true;
  END IF;

  FOREACH v_col IN ARRAY v_changed LOOP
    IF NOT (v_col = ANY (v_allowed)) THEN
      RETURN false;
    END IF;
  END LOOP;

  -- If additional_info_json changed, only session keys may differ.
  IF 'additional_info_json' = ANY (v_changed) THEN
    IF public.audit_strip_user_session_info(p_old -> 'additional_info_json')
       IS DISTINCT FROM
       public.audit_strip_user_session_info(p_new -> 'additional_info_json') THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
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

  -- user: skip automated session/activity heartbeats; keep human edits (WSDC, password, etc.).
  IF p_table_name = 'user' AND p_op = 'UPDATE'
     AND public.audit_is_user_session_only_update(p_old, p_new) THEN
    RETURN true;
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

-- Attach triggers to every public table except the audit tables themselves.
DO $$
DECLARE
  r record;
  v_skip constant text[] := ARRAY[
    'audit_log',
    'audit_ignore'
  ];
BEGIN
  FOR r IN
    SELECT c.relname
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
