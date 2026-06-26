-- Fix public."user" *_json columns left as varchar after 005 (default cast error).
-- Safe to re-run: only alters columns that are still character varying.
--
--   psql -U postgres -d event_system_pro -f database/migrations/006_user_json_column_type_fix.sql

\connect event_system_pro

DO $$
DECLARE
  col record;
BEGIN
  FOR col IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user'
      AND column_name LIKE '%json'
      AND data_type IN ('character varying', 'text')
    ORDER BY ordinal_position
  LOOP
    EXECUTE format(
      'ALTER TABLE public."user" ALTER COLUMN %I DROP DEFAULT',
      col.column_name
    );

    IF col.column_name = 'password_recovery_json' THEN
      EXECUTE format(
        $sql$
        ALTER TABLE public."user"
          ALTER COLUMN %I TYPE json
          USING CASE
            WHEN %I IS NULL OR btrim(%I) = '' THEN '{}'::json
            ELSE %I::json
          END
        $sql$,
        col.column_name, col.column_name, col.column_name, col.column_name
      );
    ELSE
      EXECUTE format(
        $sql$
        ALTER TABLE public."user"
          ALTER COLUMN %I TYPE json
          USING CASE
            WHEN %I IS NULL OR btrim(%I) = '' THEN NULL
            ELSE %I::json
          END
        $sql$,
        col.column_name, col.column_name, col.column_name, col.column_name
      );
    END IF;

    RAISE NOTICE 'Converted public."user".% to json', col.column_name;
  END LOOP;
END
$$;
