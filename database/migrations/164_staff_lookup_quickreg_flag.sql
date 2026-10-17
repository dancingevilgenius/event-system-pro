-- Tell staff lookup which matches were created with Quick Registration.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/164_staff_lookup_quickreg_flag.sql

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
  v_quickreg boolean;
  v_is_admin boolean;
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
    v_quickreg := false;
    v_is_admin := false;
    v_username := NULL;

    IF v_first <> '' AND v_last <> '' THEN
      SELECT
        count(*) > 0,
        coalesce(bool_or(api._user_is_staff_registered(
          u.email,
          u.phone_numbers_json,
          u.password_recovery_json,
          u.additional_info_json
        )), false),
        coalesce(bool_or(api._user_is_quick_registered(u.additional_info_json)), false),
        coalesce(bool_or(EXISTS (
          SELECT 1
          FROM public.user_app_role r
          WHERE r.user_id = u.user_id
            AND r.role_code = 'ADMIN'
        )), false)
      INTO v_any, v_full, v_quickreg, v_is_admin
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

    IF v_full OR v_quickreg THEN
      SELECT u.username, EXISTS (
        SELECT 1
        FROM public.user_app_role r
        WHERE r.user_id = u.user_id
          AND r.role_code = 'ADMIN'
      )
      INTO v_username, v_is_admin
      FROM public."user" u
      WHERE coalesce(u.active, true)
        AND lower(btrim(coalesce(u.name_json ->> 'first', ''))) = lower(v_first)
        AND lower(btrim(coalesce(u.name_json ->> 'last', ''))) = lower(v_last)
        AND CASE
          WHEN v_full THEN api._user_is_staff_registered(
            u.email,
            u.phone_numbers_json,
            u.password_recovery_json,
            u.additional_info_json
          )
          ELSE api._user_is_quick_registered(u.additional_info_json)
        END
      ORDER BY u.user_id
      LIMIT 1;
    END IF;

    v_matches := v_matches || jsonb_build_array(
      jsonb_build_object(
        'id', v_id,
        'status', v_status,
        'username', v_username,
        'is_admin', v_is_admin,
        'quickreg', v_quickreg AND NOT v_full
      )
    );
  END LOOP;

  RETURN json_build_object(
    'ok', true,
    'matches', v_matches
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
