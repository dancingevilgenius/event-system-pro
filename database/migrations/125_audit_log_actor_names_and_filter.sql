-- Store actor first/last names on audit_log and expose filter dropdown options.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/125_audit_log_actor_names_and_filter.sql

\connect event_system_pro

ALTER TABLE public.audit_log
  ADD COLUMN IF NOT EXISTS actor_first_name varchar(128) NULL,
  ADD COLUMN IF NOT EXISTS actor_last_name varchar(128) NULL;

UPDATE public.audit_log al
SET
  actor_first_name = NULLIF(trim(u.name_json ->> 'first'), ''),
  actor_last_name = NULLIF(trim(u.name_json ->> 'last'), '')
FROM public."user" u
WHERE al.actor_user_id = u.user_id
  AND al.actor_first_name IS NULL
  AND al.actor_last_name IS NULL;

UPDATE public.audit_log al
SET
  actor_user_id = COALESCE(al.actor_user_id, u.user_id),
  actor_first_name = COALESCE(al.actor_first_name, NULLIF(trim(u.name_json ->> 'first'), '')),
  actor_last_name = COALESCE(al.actor_last_name, NULLIF(trim(u.name_json ->> 'last'), ''))
FROM public."user" u
WHERE al.actor_user_id IS NULL
  AND al.actor_username IS NOT NULL
  AND lower(al.actor_username) = lower(u.username)
  AND al.actor_first_name IS NULL
  AND al.actor_last_name IS NULL;

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
  v_actor_first_name text;
  v_actor_last_name text;
  v_resolved_user_id bigint;
  v_audit_id bigint;
  v_now timestamptz;
BEGIN
  v_action := upper(trim(COALESCE(p_action, '')));
  IF v_action = '' THEN
    RAISE EXCEPTION 'audit action is required';
  END IF;

  v_now := date_trunc('second', CURRENT_TIMESTAMP);
  v_resolved_user_id := p_actor_user_id;

  v_actor_username := COALESCE(
    NULLIF(trim(p_actor_username), ''),
    api.resolve_audit_actor(NULL),
    CASE
      WHEN p_actor_user_id IS NOT NULL THEN 'user:' || p_actor_user_id::text
      ELSE NULL
    END,
    'system'
  );

  IF v_resolved_user_id IS NOT NULL THEN
    SELECT
      NULLIF(trim(u.name_json ->> 'first'), ''),
      NULLIF(trim(u.name_json ->> 'last'), '')
    INTO v_actor_first_name, v_actor_last_name
    FROM public."user" u
    WHERE u.user_id = v_resolved_user_id;
  ELSIF v_actor_username IS NOT NULL
        AND v_actor_username NOT IN ('system', 'maintenance') THEN
    SELECT
      u.user_id,
      NULLIF(trim(u.name_json ->> 'first'), ''),
      NULLIF(trim(u.name_json ->> 'last'), '')
    INTO v_resolved_user_id, v_actor_first_name, v_actor_last_name
    FROM public."user" u
    WHERE lower(u.username) = lower(v_actor_username)
    LIMIT 1;
  END IF;

  INSERT INTO public.audit_log (
    occurred_at,
    action,
    actor_user_id,
    actor_username,
    actor_first_name,
    actor_last_name,
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
    v_resolved_user_id,
    v_actor_username,
    v_actor_first_name,
    v_actor_last_name,
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

DROP VIEW IF EXISTS api.audit_log;

CREATE VIEW api.audit_log AS
SELECT
  audit_id,
  occurred_at,
  action,
  actor_user_id,
  actor_username,
  actor_first_name,
  actor_last_name,
  table_name,
  record_key,
  old_data,
  new_data,
  metadata,
  created_date,
  created_by,
  modified_date,
  modified_by
FROM public.audit_log;

GRANT SELECT ON api.audit_log TO authenticated;

CREATE OR REPLACE FUNCTION api.audit_log_filter_options()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;

  RETURN json_build_object(
    'tables', COALESCE(
      (
        SELECT json_agg(t.table_name ORDER BY t.table_name)
        FROM (
          SELECT DISTINCT table_name
          FROM public.audit_log
          WHERE table_name IS NOT NULL
        ) t
      ),
      '[]'::json
    ),
    'actions', COALESCE(
      (
        SELECT json_agg(a.action ORDER BY a.action)
        FROM (
          SELECT DISTINCT action
          FROM public.audit_log
        ) a
      ),
      '[]'::json
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION api.audit_log_filter_options() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.audit_log_filter_options() TO authenticated;

NOTIFY pgrst, 'reload schema';
