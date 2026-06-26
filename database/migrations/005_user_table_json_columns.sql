-- Rework public."user": encrypted password column name, JSON columns, addresses_json.
-- Run as PostgreSQL superuser:
--   psql -U postgres -d event_system_pro -f database/migrations/005_user_table_json_columns.sql
--
-- Converts legacy varchar *_json fields to json. Invalid JSON in existing rows will fail the cast.

\connect event_system_pro

-- ---------------------------------------------------------------------------
-- Rename password column
-- ---------------------------------------------------------------------------

ALTER TABLE public."user" RENAME COLUMN password TO password_encrypted;

-- ---------------------------------------------------------------------------
-- phone_numbers -> phone_numbers_json (json)
-- ---------------------------------------------------------------------------

ALTER TABLE public."user" RENAME COLUMN phone_numbers TO phone_numbers_json;

ALTER TABLE public."user" ALTER COLUMN phone_numbers_json DROP DEFAULT;
ALTER TABLE public."user"
  ALTER COLUMN phone_numbers_json TYPE json
  USING CASE
    WHEN phone_numbers_json IS NULL OR btrim(phone_numbers_json) = '' THEN NULL
    ELSE phone_numbers_json::json
  END;

-- ---------------------------------------------------------------------------
-- Existing *_json columns: varchar -> json
-- ---------------------------------------------------------------------------

ALTER TABLE public."user" ALTER COLUMN name_json DROP DEFAULT;
ALTER TABLE public."user"
  ALTER COLUMN name_json TYPE json
  USING CASE
    WHEN name_json IS NULL OR btrim(name_json) = '' THEN NULL
    ELSE name_json::json
  END;

ALTER TABLE public."user" ALTER COLUMN social_media_json DROP DEFAULT;
ALTER TABLE public."user"
  ALTER COLUMN social_media_json TYPE json
  USING CASE
    WHEN social_media_json IS NULL OR btrim(social_media_json) = '' THEN NULL
    ELSE social_media_json::json
  END;

ALTER TABLE public."user" ALTER COLUMN volunteer_json DROP DEFAULT;
ALTER TABLE public."user"
  ALTER COLUMN volunteer_json TYPE json
  USING CASE
    WHEN volunteer_json IS NULL OR btrim(volunteer_json) = '' THEN NULL
    ELSE volunteer_json::json
  END;

ALTER TABLE public."user" ALTER COLUMN password_recovery_json DROP DEFAULT;
ALTER TABLE public."user"
  ALTER COLUMN password_recovery_json TYPE json
  USING CASE
    WHEN password_recovery_json IS NULL OR btrim(password_recovery_json) = '' THEN '{}'::json
    ELSE password_recovery_json::json
  END;

ALTER TABLE public."user" ALTER COLUMN additional_info_json DROP DEFAULT;
ALTER TABLE public."user"
  ALTER COLUMN additional_info_json TYPE json
  USING CASE
    WHEN additional_info_json IS NULL OR btrim(additional_info_json) = '' THEN NULL
    ELSE additional_info_json::json
  END;

-- ---------------------------------------------------------------------------
-- Remove location columns (moved into addresses_json)
-- ---------------------------------------------------------------------------

ALTER TABLE public."user" DROP COLUMN IF EXISTS country_code;
ALTER TABLE public."user" DROP COLUMN IF EXISTS state_or_province;

-- ---------------------------------------------------------------------------
-- New addresses column
-- ---------------------------------------------------------------------------

ALTER TABLE public."user"
  ADD COLUMN IF NOT EXISTS addresses_json json DEFAULT NULL;
