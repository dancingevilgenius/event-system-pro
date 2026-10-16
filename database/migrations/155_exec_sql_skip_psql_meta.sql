-- Skip psql meta-commands such as \connect when Apply runs a stored migration script.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/155_exec_sql_skip_psql_meta.sql

\connect event_system_pro
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

  v_sql := replace(p_sql, E'\r\n', E'\n');
  v_sql := replace(v_sql, E'\r', E'\n');
  -- psql meta-commands such as \connect are not SQL.
  v_sql := regexp_replace(v_sql, E'(^|\n)[ \t]*\\\\[^\n]*', E'\\1', 'g');
  v_len := length(v_sql);

  WHILE v_i <= v_len LOOP
    v_c := substr(v_sql, v_i, 1);

    IF v_in_line THEN
      IF v_c = E'\n' THEN
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
      v_tag := substring(substr(v_sql, v_i) FROM '^\$[A-Za-z0-9_]*\$');
      IF v_tag IS NOT NULL THEN
        v_dollar := v_tag;
        v_i := v_i + length(v_tag);
        CONTINUE;
      END IF;
    END IF;

    IF v_c = ';' THEN
      v_stmt := btrim(substr(v_sql, v_start, v_i - v_start));
      IF v_stmt <> '' AND v_stmt !~ '^(\s|--[^\n]*|\n)*$' THEN
        IF v_stmt ~* '^\s*(select|values|table|show)\y' THEN
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
  IF v_stmt <> '' AND v_stmt !~ '^(\s|--[^\n]*|\n)*$' THEN
    IF v_stmt ~* '^\s*(select|values|table|show)\y' THEN
      EXECUTE 'SELECT COUNT(*) FROM (' || v_stmt || ') AS _mig_discard' INTO v_discard;
    ELSE
      EXECUTE v_stmt;
    END IF;
  END IF;
END;
$fn$;

NOTIFY pgrst, 'reload schema';
