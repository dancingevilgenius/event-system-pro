-- competitor.user_id -> public."user"(user_id)
-- Run: psql -U postgres -d event_system_pro -f database/migrations/007_competitor_user_id_fk.sql
--
-- Fails if any competitor.user_id value does not exist in "user".user_id (except NULL).

\connect event_system_pro

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'competitor'
      AND constraint_name = 'competitor_fk_user'
  ) THEN
    ALTER TABLE public.competitor
      ADD CONSTRAINT competitor_fk_user
      FOREIGN KEY (user_id) REFERENCES public."user" (user_id)
      ON DELETE RESTRICT ON UPDATE RESTRICT;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS fk_competitor_user_id ON public.competitor (user_id);
