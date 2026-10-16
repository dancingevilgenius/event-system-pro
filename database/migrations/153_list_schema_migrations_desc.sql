-- List /migrations rows with the largest script number first.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/153_list_schema_migrations_desc.sql

\connect event_system_pro

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

  SELECT COALESCE(
    json_agg(
      row_to_json(x)
      ORDER BY NULLIF(x.number, '')::integer DESC, x.script DESC
    ),
    '[]'::json
  )
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

NOTIFY pgrst, 'reload schema';
