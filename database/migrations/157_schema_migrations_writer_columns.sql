-- Replace the migration-ledger functions that still insert the old applied_by column.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/157_schema_migrations_writer_columns.sql

\connect event_system_pro
CREATE OR REPLACE FUNCTION api.check_schema_migrations()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
DECLARE
  v_checked timestamptz := date_trunc('second', clock_timestamp());
  v_pending integer;
  v_applied integer;
BEGIN
  -- Detection only. Never executes catalog sql_body.
  INSERT INTO public.schema_migrations (filename, applied_at, applied_by_username, applied_by_name)
  SELECT c.filename, NULL, NULL, NULL
  FROM maintenance.schema_migration_catalog AS c
  WHERE maintenance.schema_migration_probe_passed(c.probe)
    AND NOT EXISTS (
      SELECT 1
      FROM public.schema_migrations AS s
      WHERE s.filename = c.filename
         OR s.filename = 'migrations/' || c.filename
    );

  SELECT
    COUNT(*) FILTER (WHERE NOT api.schema_migration_is_applied(c.filename)),
    COUNT(*) FILTER (WHERE api.schema_migration_is_applied(c.filename))
  INTO v_pending, v_applied
  FROM maintenance.schema_migration_catalog AS c;

  UPDATE maintenance.schema_migration_check
  SET
    checked_at = v_checked,
    pending_count = v_pending,
    applied_count = v_applied
  WHERE id = 1;

  RETURN json_build_object(
    'ok', true,
    'checked_at', v_checked,
    'pending_count', v_pending,
    'applied_count', v_applied
  );
END;
$fn$;

CREATE OR REPLACE FUNCTION api.list_schema_migrations()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
DECLARE
  v_check json;
  v_rows json;
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Admin role required.');
  END IF;

  v_check := api.check_schema_migrations();

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY NULLIF(x.number, '')::integer DESC, x.script DESC), '[]'::json)
  INTO v_rows
  FROM (
    SELECT
      c.script_number AS number,
      c.filename AS script,
      c.details,
      api.schema_migration_is_applied(c.filename) AS applied,
      s.applied_at,
      s.applied_by_username,
      s.applied_by_name
    FROM maintenance.schema_migration_catalog AS c
    LEFT JOIN LATERAL (
      SELECT sm.applied_at, sm.applied_by_username, sm.applied_by_name
      FROM public.schema_migrations AS sm
      WHERE sm.filename = c.filename
         OR sm.filename = 'migrations/' || c.filename
      ORDER BY sm.applied_at NULLS LAST
      LIMIT 1
    ) AS s ON true
  ) AS x;

  RETURN json_build_object(
    'ok', true,
    'checked_at', v_check -> 'checked_at',
    'pending_count', v_check -> 'pending_count',
    'applied_count', v_check -> 'applied_count',
    'migrations', v_rows
  );
END;
$fn$;

CREATE OR REPLACE FUNCTION api.apply_schema_migration(p_filename text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
DECLARE
  v_filename text := btrim(COALESCE(p_filename, ''));
  v_row maintenance.schema_migration_catalog%ROWTYPE;
  v_blocker text;
  v_actor text;
  v_actor_name text;
  v_applied_at timestamptz;
  v_message text;
  v_detail text;
  v_hint text;
  v_sqlstate text;
BEGIN
  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Admin role required.');
  END IF;

  IF v_filename = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Migration script name is required.');
  END IF;

  SELECT *
  INTO v_row
  FROM maintenance.schema_migration_catalog AS c
  WHERE c.filename = v_filename;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'That migration script is not in the catalog.');
  END IF;

  IF api.schema_migration_is_applied(v_filename) THEN
    RETURN json_build_object('ok', true, 'message', 'That migration script is already applied.');
  END IF;

  SELECT c.filename
  INTO v_blocker
  FROM maintenance.schema_migration_catalog AS c
  WHERE c.sort_key < v_row.sort_key
    AND NOT api.schema_migration_is_applied(c.filename)
  ORDER BY c.sort_key
  LIMIT 1;

  IF v_blocker IS NOT NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Apply ' || v_blocker || ' first.'
    );
  END IF;

  IF v_row.sql_body IS NULL OR btrim(v_row.sql_body) = '' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'This script has no stored SQL to apply.'
    );
  END IF;

  BEGIN
    PERFORM maintenance.exec_sql_script(v_row.sql_body);
  EXCEPTION
    WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS
        v_message = MESSAGE_TEXT,
        v_detail = PG_EXCEPTION_DETAIL,
        v_hint = PG_EXCEPTION_HINT,
        v_sqlstate = RETURNED_SQLSTATE;

      RETURN json_build_object(
        'ok', false,
        'message', COALESCE(NULLIF(btrim(v_message), ''), 'Unable to apply ' || v_filename || '.'),
        'detail', NULLIF(btrim(COALESCE(v_detail, '')), ''),
        'hint', NULLIF(btrim(COALESCE(v_hint, '')), ''),
        'sqlstate', NULLIF(btrim(COALESCE(v_sqlstate, '')), '')
      );
  END;

  v_actor := COALESCE(
    NULLIF(btrim(api.current_username()), ''),
    NULLIF(btrim(api.resolve_audit_actor(NULL)), ''),
    'system'
  );
  v_applied_at := date_trunc('second', clock_timestamp());

  SELECT NULLIF(btrim(concat_ws(
    ' ',
    NULLIF(btrim(u.name_json ->> 'first'), ''),
    NULLIF(btrim(u.name_json ->> 'last'), '')
  )), '')
  INTO v_actor_name
  FROM public."user" AS u
  WHERE lower(u.username) = lower(v_actor)
  LIMIT 1;

  INSERT INTO public.schema_migrations (
    filename, applied_at, applied_by_username, applied_by_name
  )
  VALUES (v_filename, v_applied_at, v_actor, v_actor_name)
  ON CONFLICT (filename) DO UPDATE
  SET
    applied_at = COALESCE(public.schema_migrations.applied_at, EXCLUDED.applied_at),
    applied_by_username = COALESCE(public.schema_migrations.applied_by_username, EXCLUDED.applied_by_username),
    applied_by_name = COALESCE(public.schema_migrations.applied_by_name, EXCLUDED.applied_by_name);

  PERFORM api.record_audit_event(
    p_action => 'MIGRATION_APPLIED',
    p_actor_user_id => api.current_user_id(),
    p_actor_username => v_actor,
    p_table_name => 'schema_migrations',
    p_record_key => v_filename,
    p_new_data => jsonb_build_object(
      'filename', v_filename,
      'script_number', v_row.script_number,
      'applied_at', to_jsonb(api.format_activity_timestamp(v_applied_at)),
      'applied_by_username', v_actor,
      'applied_by_name', v_actor_name
    ),
    p_metadata => jsonb_build_object(
      'details', v_row.details
    )
  );

  PERFORM api.check_schema_migrations();

  RETURN json_build_object(
    'ok', true,
    'message', v_filename || ' applied.',
    'applied_at', v_applied_at,
    'applied_by_username', v_actor,
    'applied_by_name', v_actor_name
  );
END;
$fn$;

CREATE OR REPLACE FUNCTION api.upsert_schema_migration_script(
  p_filename text,
  p_details text,
  p_sql_body text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
DECLARE
  v_filename text := btrim(COALESCE(p_filename, ''));
  v_number text;
BEGIN
  IF v_filename !~ '^[0-9].+\.sql$' THEN
    RETURN json_build_object('ok', false, 'message', 'Invalid migration script name.');
  END IF;

  v_number := substring(v_filename FROM '^([0-9]+)');

  INSERT INTO maintenance.schema_migration_catalog (
    filename, script_number, details, probe, sql_body, sort_key, created_by
  ) VALUES (
    v_filename,
    v_number,
    COALESCE(NULLIF(btrim(p_details), ''), 'No description in the script header.'),
    'false',
    NULLIF(btrim(p_sql_body), ''),
    v_filename,
    'maintenance'
  )
  ON CONFLICT (filename) DO UPDATE
  SET
    sql_body = COALESCE(EXCLUDED.sql_body, maintenance.schema_migration_catalog.sql_body),
    modified_date = CURRENT_TIMESTAMP,
    modified_by = 'maintenance'
  WHERE NOT api.schema_migration_is_applied(maintenance.schema_migration_catalog.filename);

  RETURN json_build_object('ok', true, 'filename', v_filename);
END;
$fn$;

REVOKE ALL ON FUNCTION api.schema_migration_is_applied(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.check_schema_migrations() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.list_schema_migrations() FROM PUBLIC;
REVOKE ALL ON FUNCTION api.apply_schema_migration(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.upsert_schema_migration_script(text, text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.check_schema_migrations() TO authenticated;
GRANT EXECUTE ON FUNCTION api.list_schema_migrations() TO authenticated;
GRANT EXECUTE ON FUNCTION api.apply_schema_migration(text) TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maintenance') THEN
    GRANT EXECUTE ON FUNCTION api.check_schema_migrations() TO maintenance;
    GRANT EXECUTE ON FUNCTION api.upsert_schema_migration_script(text, text, text) TO maintenance;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
