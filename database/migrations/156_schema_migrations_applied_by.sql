-- The migration ledger on older databases has filename and applied_at only.
-- list_schema_migrations reads applied_by_username, so add the missing columns.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/156_schema_migrations_applied_by.sql

\connect event_system_pro

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'schema_migrations'
      AND column_name = 'applied_by'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'schema_migrations'
      AND column_name = 'applied_by_username'
  ) THEN
    ALTER TABLE public.schema_migrations
      RENAME COLUMN applied_by TO applied_by_username;
  END IF;
END $$;

ALTER TABLE public.schema_migrations
  ADD COLUMN IF NOT EXISTS applied_by_username varchar(128) NULL;

ALTER TABLE public.schema_migrations
  ADD COLUMN IF NOT EXISTS applied_by_name varchar(256) NULL;

ALTER TABLE public.schema_migrations
  ALTER COLUMN applied_at DROP NOT NULL;
