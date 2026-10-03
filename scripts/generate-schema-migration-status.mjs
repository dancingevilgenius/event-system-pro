// Builds database/migrations/138_schema_migration_status.sql from the migration folder.
// Re-run after adding a migration file that should be part of the status catalog.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = join(repoRoot, 'database', 'migrations');
const outFile = join(migrationsDir, '138_schema_migration_status.sql');

const detailsOverride = {
  '096_ticket_sales.sql': 'ticket_sales table is missing.',
  '104_scheduler_role.sql': 'scheduler login role is missing.',
  '105_maintenance_job_runs.sql': 'maintenance.job_run table is missing.',
  '106_maintenance_job_definition.sql':
    'maintenance.job_definition and the scheduler functions are missing.',
  '107_poc_counter_scheduler.sql': 'api.poc_counter_tick() is missing.',
  '108_robot_riot_attendee_churn.sql': 'api.robot_riot_attendee_churn() is missing.',
  '109_robot_riot_attendee_churn_timed_window.sql':
    'api.start_robot_riot_attendee_churn() is missing.',
  '121_job_definition_is_enabled.sql': 'Enable and disable scheduled tasks is missing.',
  '122_set_scheduled_task_schedule.sql': 'Change a task schedule is missing.',
  '124_event_location_json_jsonb.sql': 'event.location_json is still varchar.',
  '126_system_config_value_jsonb.sql': 'system_config.value is still varchar.',
  '127_app_role_rename_event_director_manager.sql':
    'Roles are still EVENT_COORDINATOR and BALLROOM_COORDINATOR.',
  '128_admin_update_user.sql': 'api.admin_update_user() is missing.',
  '129_admin_update_user_email_phone.sql':
    'Email and phone updates on api.admin_update_user() are missing.',
  '131_set_scheduled_task_interval.sql': 'Change a task interval is missing.',
  '132_session_status_cron_only_inactivity.sql':
    'session_status still uses activity_expires_at.',
  '133_inactivity_idle_timeout_config.sql': 'Idle-timeout helpers are missing.',
  '134_user_cursor_rules_starred.sql': 'api.set_user_cursor_rules_starred() is missing.',
};

const probes = {
  '096_ticket_sales.sql': "to_regclass('public.ticket_sales') IS NOT NULL",
  '104_scheduler_role.sql': "EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'scheduler')",
  '105_maintenance_job_runs.sql': "to_regclass('maintenance.job_run') IS NOT NULL",
  '106_maintenance_job_definition.sql': "to_regclass('maintenance.job_definition') IS NOT NULL",
  '107_poc_counter_scheduler.sql': "to_regprocedure('api.poc_counter_tick()') IS NOT NULL",
  '108_robot_riot_attendee_churn.sql':
    "to_regprocedure('api.robot_riot_attendee_churn()') IS NOT NULL",
  '109_robot_riot_attendee_churn_timed_window.sql':
    "to_regprocedure('api.start_robot_riot_attendee_churn(integer)') IS NOT NULL",
  '121_job_definition_is_enabled.sql':
    "to_regprocedure('api.set_scheduled_task_enabled(text, boolean)') IS NOT NULL",
  '122_set_scheduled_task_schedule.sql':
    "to_regprocedure('api.set_scheduled_task_schedule(text, text, text)') IS NOT NULL",
  '124_event_location_json_jsonb.sql':
    "EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'event' AND column_name = 'location_json' AND udt_name = 'jsonb')",
  '126_system_config_value_jsonb.sql':
    "to_regprocedure('public.system_config_value_text(jsonb)') IS NOT NULL",
  '127_app_role_rename_event_director_manager.sql':
    "EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_app_role_role_code_check' AND pg_get_constraintdef(pg_constraint.oid) LIKE '%EVENT_DIRECTOR%')",
  '128_admin_update_user.sql':
    "to_regprocedure('api.admin_update_user(bigint, text, text, text, text)') IS NOT NULL OR to_regprocedure('api.admin_update_user(bigint, text, text, text, text, json, text)') IS NOT NULL",
  '129_admin_update_user_email_phone.sql':
    "to_regprocedure('api.admin_update_user(bigint, text, text, text, text, json, text)') IS NOT NULL",
  '131_set_scheduled_task_interval.sql':
    "to_regprocedure('api.set_scheduled_task_interval(text, integer, text)') IS NOT NULL",
  '132_session_status_cron_only_inactivity.sql':
    "EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'api' AND p.proname = 'session_status' AND position('activity_expires_at' in p.prosrc) = 0 AND position('user_session_is_active' in p.prosrc) > 0)",
  '133_inactivity_idle_timeout_config.sql':
    "to_regprocedure('api.inactivity_idle_timeout_seconds()') IS NOT NULL",
  '134_user_cursor_rules_starred.sql':
    "to_regprocedure('api.set_user_cursor_rules_starred(text[])') IS NOT NULL",
};

function dollarQuote(value, preferredTag) {
  let tag = preferredTag;
  let n = 0;
  while (value.includes(`$${tag}$`)) {
    n += 1;
    tag = `${preferredTag}${n}`;
  }
  return `$${tag}$${value}$${tag}$`;
}

function firstComment(sql) {
  for (const line of sql.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) {
      return trimmed.replace(/^--\s*/, '').trim();
    }
    if (trimmed === '' || trimmed.startsWith('\\')) {
      continue;
    }
    break;
  }
  return 'No description in the script header.';
}

function sqlBody(sql) {
  const stripped = sql
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !/^\s*\\/.test(line))
    .join('\n')
    .trim();
  return stripped;
}

const files = readdirSync(migrationsDir)
  .filter((name) => /^\d+.+\.sql$/.test(name) && name !== '138_schema_migration_status.sql')
  .sort();

const rows = files.map((filename) => {
  const raw = readFileSync(join(migrationsDir, filename), 'utf8');
  const number = filename.match(/^(\d+)/)?.[1] ?? '';
  const pending = Object.hasOwn(probes, filename);
  return {
    filename,
    number,
    details: detailsOverride[filename] ?? firstComment(raw),
    probe: probes[filename] ?? 'true',
    sqlBody: pending ? sqlBody(raw) : null,
  };
});

const inserts = rows
  .map((row) => {
    const bodySql = row.sqlBody === null ? 'NULL' : dollarQuote(row.sqlBody, 'sqlbody');
    return `INSERT INTO maintenance.schema_migration_catalog (
  filename, script_number, details, probe, sql_body, sort_key, created_by
) VALUES (
  ${dollarQuote(row.filename, 'fn')},
  ${dollarQuote(row.number, 'num')},
  ${dollarQuote(row.details, 'details')},
  ${dollarQuote(row.probe, 'probe')},
  ${bodySql},
  ${dollarQuote(row.filename, 'sort')},
  'c-agent'
);`;
  })
  .join('\n\n');

const sql = `-- Nightly migration-script check and admin Apply support.
-- Catalog rows are generated by scripts/generate-schema-migration-status.mjs.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/138_schema_migration_status.sql

\\connect event_system_pro

CREATE SCHEMA IF NOT EXISTS maintenance;

CREATE TABLE IF NOT EXISTS public.schema_migrations (
  filename text PRIMARY KEY,
  applied_at timestamptz NULL DEFAULT now(),
  applied_by varchar(128) NULL
);

ALTER TABLE public.schema_migrations
  ADD COLUMN IF NOT EXISTS applied_by varchar(128) NULL;

ALTER TABLE public.schema_migrations
  ALTER COLUMN applied_at DROP NOT NULL;

COMMENT ON TABLE public.schema_migrations IS
  'Ledger of migration scripts recorded as applied. applied_at and applied_by are null when the original run was not recorded.';

CREATE TABLE IF NOT EXISTS maintenance.schema_migration_catalog (
  filename text PRIMARY KEY,
  script_number text NOT NULL,
  details text NOT NULL,
  probe text NOT NULL DEFAULT 'true',
  sql_body text NULL,
  sort_key text NOT NULL,
  created_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(128) NOT NULL DEFAULT 'c-agent',
  modified_date timestamptz NULL,
  modified_by varchar(128) NULL
);

COMMENT ON TABLE maintenance.schema_migration_catalog IS
  'Known database/migrations scripts, a boolean SQL probe, and the script text used by Apply.';

CREATE TABLE IF NOT EXISTS maintenance.schema_migration_check (
  id integer PRIMARY KEY DEFAULT 1,
  checked_at timestamptz NULL,
  pending_count integer NOT NULL DEFAULT 0,
  applied_count integer NOT NULL DEFAULT 0,
  CONSTRAINT schema_migration_check_singleton CHECK (id = 1)
);

INSERT INTO maintenance.schema_migration_check (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION maintenance.schema_migration_probe_passed(p_probe text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
DECLARE
  v_ok boolean;
BEGIN
  IF p_probe IS NULL OR btrim(p_probe) = '' THEN
    RETURN false;
  END IF;

  EXECUTE 'SELECT (' || p_probe || ')' INTO v_ok;
  RETURN COALESCE(v_ok, false);
END;
$fn$;

CREATE OR REPLACE FUNCTION maintenance.exec_sql_script(p_sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
DECLARE
  v_sql text;
  v_len integer;
  v_i integer := 1;
  v_start integer := 1;
  v_c text;
  v_tag text;
  v_dollar text;
  v_stmt text;
  v_in_line boolean := false;
  v_in_block boolean := false;
  v_in_quote boolean := false;
  v_discard bigint;
BEGIN
  IF p_sql IS NULL OR btrim(p_sql) = '' THEN
    RETURN;
  END IF;

  v_sql := replace(p_sql, E'\\r\\n', E'\\n');
  v_sql := replace(v_sql, E'\\r', E'\\n');
  v_len := length(v_sql);

  WHILE v_i <= v_len LOOP
    v_c := substr(v_sql, v_i, 1);

    IF v_in_line THEN
      IF v_c = E'\\n' THEN
        v_in_line := false;
      END IF;
      v_i := v_i + 1;
      CONTINUE;
    END IF;

    IF v_in_block THEN
      IF v_c = '*' AND substr(v_sql, v_i + 1, 1) = '/' THEN
        v_in_block := false;
        v_i := v_i + 2;
        CONTINUE;
      END IF;
      v_i := v_i + 1;
      CONTINUE;
    END IF;

    IF v_dollar IS NOT NULL THEN
      IF substr(v_sql, v_i, length(v_dollar)) = v_dollar THEN
        v_i := v_i + length(v_dollar);
        v_dollar := NULL;
        CONTINUE;
      END IF;
      v_i := v_i + 1;
      CONTINUE;
    END IF;

    IF v_in_quote THEN
      IF v_c = '''' THEN
        IF substr(v_sql, v_i + 1, 1) = '''' THEN
          v_i := v_i + 2;
          CONTINUE;
        END IF;
        v_in_quote := false;
      END IF;
      v_i := v_i + 1;
      CONTINUE;
    END IF;

    IF v_c = '-' AND substr(v_sql, v_i + 1, 1) = '-' THEN
      v_in_line := true;
      v_i := v_i + 2;
      CONTINUE;
    END IF;

    IF v_c = '/' AND substr(v_sql, v_i + 1, 1) = '*' THEN
      v_in_block := true;
      v_i := v_i + 2;
      CONTINUE;
    END IF;

    IF v_c = '''' THEN
      v_in_quote := true;
      v_i := v_i + 1;
      CONTINUE;
    END IF;

    IF v_c = '$' THEN
      v_tag := substring(substr(v_sql, v_i) FROM '^\\$[A-Za-z0-9_]*\\$');
      IF v_tag IS NOT NULL THEN
        v_dollar := v_tag;
        v_i := v_i + length(v_tag);
        CONTINUE;
      END IF;
    END IF;

    IF v_c = ';' THEN
      v_stmt := btrim(substr(v_sql, v_start, v_i - v_start));
      IF v_stmt <> '' AND v_stmt !~ '^(\\s|--[^\\n]*|\\n)*$' THEN
        IF v_stmt ~* '^\\s*(select|values|table|show)\\y' THEN
          EXECUTE 'SELECT COUNT(*) FROM (' || v_stmt || ') AS _mig_discard' INTO v_discard;
        ELSE
          EXECUTE v_stmt;
        END IF;
      END IF;
      v_start := v_i + 1;
    END IF;

    v_i := v_i + 1;
  END LOOP;

  v_stmt := btrim(substr(v_sql, v_start));
  IF v_stmt <> '' AND v_stmt !~ '^(\\s|--[^\\n]*|\\n)*$' THEN
    IF v_stmt ~* '^\\s*(select|values|table|show)\\y' THEN
      EXECUTE 'SELECT COUNT(*) FROM (' || v_stmt || ') AS _mig_discard' INTO v_discard;
    ELSE
      EXECUTE v_stmt;
    END IF;
  END IF;
END;
$fn$;

REVOKE ALL ON FUNCTION maintenance.schema_migration_probe_passed(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION maintenance.exec_sql_script(text) FROM PUBLIC;

CREATE OR REPLACE FUNCTION api.schema_migration_is_applied(p_filename text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, api, maintenance, pg_catalog
AS $fn$
  SELECT
    maintenance.schema_migration_probe_passed(c.probe)
    OR EXISTS (
      SELECT 1
      FROM public.schema_migrations AS s
      WHERE s.filename = c.filename
         OR s.filename = 'migrations/' || c.filename
    )
  FROM maintenance.schema_migration_catalog AS c
  WHERE c.filename = p_filename;
$fn$;

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
  INSERT INTO public.schema_migrations (filename, applied_at, applied_by)
  SELECT c.filename, NULL, NULL
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

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.script), '[]'::json)
  INTO v_rows
  FROM (
    SELECT
      c.script_number AS number,
      c.filename AS script,
      c.details,
      api.schema_migration_is_applied(c.filename) AS applied,
      s.applied_at,
      s.applied_by
    FROM maintenance.schema_migration_catalog AS c
    LEFT JOIN LATERAL (
      SELECT sm.applied_at, sm.applied_by
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

  INSERT INTO public.schema_migrations (filename, applied_at, applied_by)
  VALUES (v_filename, v_applied_at, v_actor)
  ON CONFLICT (filename) DO UPDATE
  SET
    applied_at = COALESCE(public.schema_migrations.applied_at, EXCLUDED.applied_at),
    applied_by = COALESCE(public.schema_migrations.applied_by, EXCLUDED.applied_by);

  PERFORM api.check_schema_migrations();

  RETURN json_build_object(
    'ok', true,
    'message', v_filename || ' applied.',
    'applied_at', v_applied_at,
    'applied_by', v_actor
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
  IF v_filename !~ '^[0-9].+\\.sql$' THEN
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

TRUNCATE maintenance.schema_migration_catalog;

${inserts}

INSERT INTO maintenance.schema_migration_catalog (
  filename, script_number, details, probe, sql_body, sort_key, created_by
) VALUES (
  '138_schema_migration_status.sql',
  '138',
  'Nightly check that compares migration scripts with the database.',
  'to_regprocedure(''api.list_schema_migrations()'') IS NOT NULL',
  NULL,
  '138_schema_migration_status.sql',
  'c-agent'
);

SELECT api.check_schema_migrations();

INSERT INTO public.schema_migrations (filename, applied_at, applied_by)
VALUES (
  '138_schema_migration_status.sql',
  date_trunc('second', clock_timestamp()),
  'c-agent'
)
ON CONFLICT (filename) DO UPDATE
SET
  applied_at = COALESCE(public.schema_migrations.applied_at, EXCLUDED.applied_at),
  applied_by = COALESCE(public.schema_migrations.applied_by, EXCLUDED.applied_by);

DO $$
BEGIN
  IF to_regclass('maintenance.job_definition') IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'maintenance'
      AND table_name = 'job_definition'
      AND column_name = 'is_enabled'
  ) THEN
    INSERT INTO maintenance.job_definition (
      job_name, rpc_schema, rpc_name, schedule_cron, is_enabled,
      stale_after_interval, description, created_by
    ) VALUES (
      'check_schema_migrations',
      'api',
      'check_schema_migrations',
      '0 0 * * *',
      true,
      INTERVAL '25 hours',
      'Record which database/migrations scripts are not applied. Does not run them.',
      'c-agent'
    )
    ON CONFLICT (job_name) DO UPDATE
    SET
      rpc_schema = EXCLUDED.rpc_schema,
      rpc_name = EXCLUDED.rpc_name,
      schedule_cron = EXCLUDED.schedule_cron,
      is_enabled = EXCLUDED.is_enabled,
      stale_after_interval = EXCLUDED.stale_after_interval,
      description = EXCLUDED.description,
      modified_date = CURRENT_TIMESTAMP,
      modified_by = 'c-agent';
  ELSIF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'maintenance'
      AND table_name = 'job_definition'
      AND column_name = 'enabled'
  ) THEN
    INSERT INTO maintenance.job_definition (
      job_name, rpc_schema, rpc_name, schedule_cron, enabled,
      stale_after_interval, description, created_by
    ) VALUES (
      'check_schema_migrations',
      'api',
      'check_schema_migrations',
      '0 0 * * *',
      true,
      INTERVAL '25 hours',
      'Record which database/migrations scripts are not applied. Does not run them.',
      'c-agent'
    )
    ON CONFLICT (job_name) DO UPDATE
    SET
      rpc_schema = EXCLUDED.rpc_schema,
      rpc_name = EXCLUDED.rpc_name,
      schedule_cron = EXCLUDED.schedule_cron,
      enabled = EXCLUDED.enabled,
      stale_after_interval = EXCLUDED.stale_after_interval,
      description = EXCLUDED.description,
      modified_date = CURRENT_TIMESTAMP,
      modified_by = 'c-agent';
  END IF;
END $$;

DO $probe$
BEGIN
  PERFORM maintenance.exec_sql_script($sample$
    CREATE TEMP TABLE schema_migration_exec_probe (n int);
    INSERT INTO schema_migration_exec_probe VALUES (1);
    DROP TABLE schema_migration_exec_probe;
  $sample$);
END
$probe$;

NOTIFY pgrst, 'reload schema';
`;

writeFileSync(outFile, sql);
console.log(`Wrote ${outFile} (${rows.length} catalog scripts, ${sql.length} bytes)`);
