-- A staff name is fully registered only when the user row has an email or a phone number.
-- A user row with neither stays partial (outlined thumb). Quick Registration does not count as full.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/163_staff_registered_email_or_phone.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api._user_is_staff_registered(
  p_email text,
  p_phone_numbers_json json,
  p_password_recovery_json json,
  p_additional_info_json json
)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT
    btrim(coalesce(p_email, '')) <> ''
    OR (
      json_typeof(p_phone_numbers_json) = 'array'
      AND EXISTS (
        SELECT 1
        FROM json_array_elements(p_phone_numbers_json) AS entry
        WHERE btrim(coalesce(entry ->> 'number', '')) <> ''
      )
    );
$$;

NOTIFY pgrst, 'reload schema';
