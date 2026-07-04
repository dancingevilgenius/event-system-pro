-- Human-readable, second-precision timestamps in audit_log payloads.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/076_audit_timestamp_format.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION public.audit_is_timestamptz_text(p_text text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT p_text ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}';
$$;

CREATE OR REPLACE FUNCTION public.audit_format_timestamptz_text(p_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public, api
AS $$
  SELECT api.format_activity_timestamp(date_trunc('second', p_text::timestamptz));
$$;

CREATE OR REPLACE FUNCTION public.audit_format_json_timestamps(p_value jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, api
AS $$
DECLARE
  v_key text;
  v_result jsonb;
  v_arr jsonb := '[]'::jsonb;
  v_i integer;
  v_text text;
BEGIN
  IF p_value IS NULL OR jsonb_typeof(p_value) = 'null' THEN
    RETURN p_value;
  END IF;

  IF jsonb_typeof(p_value) = 'string' THEN
    v_text := p_value #>> '{}';
    IF public.audit_is_timestamptz_text(v_text) THEN
      RETURN to_jsonb(public.audit_format_timestamptz_text(v_text));
    END IF;
    RETURN p_value;
  END IF;

  IF jsonb_typeof(p_value) = 'array' THEN
    FOR v_i IN 0 .. jsonb_array_length(p_value) - 1 LOOP
      v_arr := v_arr || jsonb_build_array(public.audit_format_json_timestamps(p_value -> v_i));
    END LOOP;
    RETURN v_arr;
  END IF;

  IF jsonb_typeof(p_value) = 'object' THEN
    v_result := '{}'::jsonb;
    FOR v_key IN SELECT jsonb_object_keys(p_value) LOOP
      v_result := v_result || jsonb_build_object(
        v_key,
        public.audit_format_json_timestamps(p_value -> v_key)
      );
    END LOOP;
    RETURN v_result;
  END IF;

  RETURN p_value;
END;
$$;

CREATE OR REPLACE FUNCTION api.record_audit_event(
  p_action text,
  p_actor_user_id bigint DEFAULT NULL,
  p_actor_username text DEFAULT NULL,
  p_table_name text DEFAULT NULL,
  p_record_key text DEFAULT NULL,
  p_old_data jsonb DEFAULT NULL,
  p_new_data jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_action text;
  v_actor_username text;
  v_audit_id bigint;
  v_now timestamptz;
BEGIN
  v_action := upper(trim(COALESCE(p_action, '')));
  IF v_action = '' THEN
    RAISE EXCEPTION 'audit action is required';
  END IF;

  v_now := date_trunc('second', CURRENT_TIMESTAMP);

  v_actor_username := COALESCE(
    NULLIF(trim(p_actor_username), ''),
    api.resolve_audit_actor(NULL),
    CASE
      WHEN p_actor_user_id IS NOT NULL THEN 'user:' || p_actor_user_id::text
      ELSE NULL
    END,
    'system'
  );

  INSERT INTO public.audit_log (
    occurred_at,
    action,
    actor_user_id,
    actor_username,
    table_name,
    record_key,
    old_data,
    new_data,
    metadata,
    created_date,
    created_by
  ) VALUES (
    v_now,
    v_action,
    p_actor_user_id,
    v_actor_username,
    NULLIF(trim(p_table_name), ''),
    NULLIF(trim(p_record_key), ''),
    public.audit_format_json_timestamps(p_old_data),
    public.audit_format_json_timestamps(p_new_data),
    public.audit_format_json_timestamps(p_metadata),
    v_now,
    v_actor_username
  )
  RETURNING audit_id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$;

NOTIFY pgrst, 'reload schema';
