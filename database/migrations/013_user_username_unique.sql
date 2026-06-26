-- Enforce unique usernames on public."user".
-- Run: psql -U postgres -d event_system_pro -f database/migrations/013_user_username_unique.sql

\connect event_system_pro

DO $$
DECLARE
  v_dup_groups integer;
  v_dup_rows integer;
BEGIN
  SELECT COUNT(*)::integer, COALESCE(SUM(cnt - 1), 0)::integer
  INTO v_dup_groups, v_dup_rows
  FROM (
    SELECT COUNT(*) AS cnt
    FROM public."user"
    GROUP BY username
    HAVING COUNT(*) > 1
  ) d;

  IF v_dup_groups > 0 THEN
    RAISE EXCEPTION 'Cannot add unique username constraint: % duplicate username group(s), % extra row(s)',
      v_dup_groups, v_dup_rows;
  END IF;
END $$;

ALTER TABLE public."user"
  ADD CONSTRAINT user_username_unique UNIQUE (username);
