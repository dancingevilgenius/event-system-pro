-- Staff rows on create-event look up an existing user by first and last name.
-- The result says whether that user looks fully registered or only name-matched.
-- Answer hashes stay in the database.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/149_lookup_staff_registration.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.lookup_staff_registration(p_people json)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_person json;
  v_id text;
  v_first text;
  v_last text;
  v_any boolean;
  v_full boolean;
  v_status text;
  v_username text;
  v_matches jsonb := '[]'::jsonb;
BEGIN
  IF api.current_user_id() IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'You are not signed in.',
      'matches', '[]'::json
    );
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.',
      'matches', '[]'::json
    );
  END IF;

  FOR v_person IN
    SELECT value
    FROM json_array_elements(coalesce(p_people, '[]'::json))
  LOOP
    v_id := coalesce(v_person ->> 'id', '');
    v_first := btrim(coalesce(v_person ->> 'first_name', ''));
    v_last := btrim(coalesce(v_person ->> 'last_name', ''));
    v_any := false;
    v_full := false;
    v_username := NULL;

    IF v_first <> '' AND v_last <> '' THEN
      SELECT
        count(*) > 0,
        coalesce(bool_or(
          api._user_has_secret_questions(u.password_recovery_json)
          OR btrim(coalesce(u.email, '')) <> ''
          OR (
            json_typeof(u.phone_numbers_json) = 'array'
            AND EXISTS (
              SELECT 1
              FROM json_array_elements(u.phone_numbers_json) AS entry
              WHERE btrim(coalesce(entry ->> 'number', '')) <> ''
            )
          )
        ), false)
      INTO v_any, v_full
      FROM public."user" u
      WHERE coalesce(u.active, true)
        AND lower(btrim(coalesce(u.name_json ->> 'first', ''))) = lower(v_first)
        AND lower(btrim(coalesce(u.name_json ->> 'last', ''))) = lower(v_last);
    END IF;

    v_status := CASE
      WHEN v_full THEN 'registered'
      WHEN v_any THEN 'partial'
      ELSE 'none'
    END;

    IF v_full THEN
      SELECT u.username
      INTO v_username
      FROM public."user" u
      WHERE coalesce(u.active, true)
        AND lower(btrim(coalesce(u.name_json ->> 'first', ''))) = lower(v_first)
        AND lower(btrim(coalesce(u.name_json ->> 'last', ''))) = lower(v_last)
        AND (
          api._user_has_secret_questions(u.password_recovery_json)
          OR btrim(coalesce(u.email, '')) <> ''
          OR (
            json_typeof(u.phone_numbers_json) = 'array'
            AND EXISTS (
              SELECT 1
              FROM json_array_elements(u.phone_numbers_json) AS entry
              WHERE btrim(coalesce(entry ->> 'number', '')) <> ''
            )
          )
        )
      ORDER BY u.user_id
      LIMIT 1;
    END IF;

    v_matches := v_matches || jsonb_build_array(
      jsonb_build_object(
        'id', v_id,
        'status', v_status,
        'username', v_username
      )
    );
  END LOOP;

  RETURN json_build_object(
    'ok', true,
    'matches', v_matches
  );
END;
$$;

REVOKE ALL ON FUNCTION api.lookup_staff_registration(json) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.lookup_staff_registration(json) TO authenticated;

NOTIFY pgrst, 'reload schema';
