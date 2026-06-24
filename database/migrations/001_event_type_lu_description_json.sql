-- event_type_lu: description (varchar) -> description_json (jsonb)

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'event_type_lu'
      AND column_name = 'description'
  ) THEN
    ALTER TABLE event_type_lu RENAME COLUMN description TO description_json;
    ALTER TABLE event_type_lu ALTER COLUMN description_json DROP DEFAULT;
    ALTER TABLE event_type_lu
      ALTER COLUMN description_json TYPE JSONB
      USING CASE
        WHEN description_json IS NULL THEN NULL
        ELSE description_json::jsonb
      END;
  END IF;
END $$;
