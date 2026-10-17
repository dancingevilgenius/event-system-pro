-- Store Quick Registration details on public."user".more_json.
-- created_with_quickreg, quickreg_pw, quickreg_created_by_name, quickreg_created_by_username.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/160_user_more_json_quickreg.sql

\connect event_system_pro

ALTER TABLE public."user"
  ADD COLUMN IF NOT EXISTS more_json jsonb DEFAULT NULL;

DROP FUNCTION IF EXISTS api._user_is_quick_registered(json);
DROP FUNCTION IF EXISTS api._user_is_staff_registered(text, json, json, json);

CREATE OR REPLACE FUNCTION api._user_is_quick_registered(
  p_more_json jsonb,
  p_additional_info json
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public, api
AS $$
  SELECT
    COALESCE((p_more_json ->> 'created_with_quickreg')::boolean, false)
    OR (
      p_additional_info IS NOT NULL
      AND jsonb_typeof(p_additional_info::jsonb -> 'quick_registration') = 'object'
    );
$$;

CREATE OR REPLACE FUNCTION api._user_is_staff_registered(
  p_email text,
  p_phone_numbers_json json,
  p_password_recovery_json json,
  p_additional_info_json json,
  p_more_json jsonb
)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT
    api._user_has_secret_questions(p_password_recovery_json)
    OR btrim(coalesce(p_email, '')) <> ''
    OR (
      json_typeof(p_phone_numbers_json) = 'array'
      AND EXISTS (
        SELECT 1
        FROM json_array_elements(p_phone_numbers_json) AS entry
        WHERE btrim(coalesce(entry ->> 'number', '')) <> ''
      )
    )
    OR api._user_is_quick_registered(p_more_json, p_additional_info_json);
$$;

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
    v_is_admin := false;
    v_username := NULL;

    IF v_first <> '' AND v_last <> '' THEN
      SELECT
        count(*) > 0,
        coalesce(bool_or(api._user_is_staff_registered(
          u.email,
          u.phone_numbers_json,
          u.password_recovery_json,
          u.additional_info_json,
          u.more_json
        )), false),
        coalesce(bool_or(EXISTS (
          SELECT 1
          FROM public.user_app_role r
          WHERE r.user_id = u.user_id
            AND r.role_code = 'ADMIN'
        )), false)
      INTO v_any, v_full, v_is_admin
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
        AND api._user_is_staff_registered(
          u.email,
          u.phone_numbers_json,
          u.password_recovery_json,
          u.additional_info_json,
          u.more_json
        )
      ORDER BY u.user_id
      LIMIT 1;
    END IF;

    v_matches := v_matches || jsonb_build_array(
      jsonb_build_object(
        'id', v_id,
        'status', v_status,
        'username', v_username,
        'is_admin', v_is_admin
      )
    );
  END LOOP;

  RETURN json_build_object(
    'ok', true,
    'matches', v_matches
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.quick_register_user(
  p_first_name text,
  p_last_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor text;
  v_actor_name text;
  v_first text;
  v_last text;
  v_password text;
  v_username text;
  v_n integer := 1;
  v_user_id bigint;
BEGIN
  IF api.current_user_id() IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'You are not signed in.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Admin role required.');
  END IF;

  v_actor := NULLIF(btrim(api.current_username()), '');
  IF v_actor IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'You are not signed in.');
  END IF;

  SELECT COALESCE(
    NULLIF(btrim(u.name_json ->> 'display'), ''),
    NULLIF(btrim(concat_ws(
      ' ',
      NULLIF(btrim(u.name_json ->> 'first'), ''),
      NULLIF(btrim(u.name_json ->> 'last'), '')
    )), ''),
    v_actor
  )
  INTO v_actor_name
  FROM public."user" u
  WHERE u.user_id = api.current_user_id();

  v_actor_name := COALESCE(v_actor_name, v_actor);

  v_first := btrim(coalesce(p_first_name, ''));
  v_last := btrim(coalesce(p_last_name, ''));
  IF v_first = '' OR v_last = '' THEN
    RETURN json_build_object('ok', false, 'message', 'First and last name are required.');
  END IF;

  v_password := lower(left(v_first, 1)) || lower(regexp_replace(v_last, '\s+', '', 'g'));
  IF length(v_password) < 2 OR length(v_password) > 64 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'That name cannot be used for Quick Registration.'
    );
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public."user" u
    WHERE coalesce(u.active, true)
      AND lower(btrim(coalesce(u.name_json ->> 'first', ''))) = lower(v_first)
      AND lower(btrim(coalesce(u.name_json ->> 'last', ''))) = lower(v_last)
  ) THEN
    RETURN json_build_object(
      'ok', false,
      'message', v_first || ' ' || v_last || ' already has an account.'
    );
  END IF;

  v_username := v_password;
  WHILE EXISTS (
    SELECT 1
    FROM public."user" u
    WHERE lower(u.username) = lower(v_username)
  ) LOOP
    v_n := v_n + 1;
    v_username := v_password || v_n::text;
    IF v_n > 99 OR length(v_username) > 64 THEN
      RETURN json_build_object(
        'ok', false,
        'message', 'Unable to choose a unique username.'
      );
    END IF;
  END LOOP;

  INSERT INTO public."user" (
    username,
    password_encrypted,
    name_json,
    email,
    phone_numbers_json,
    addresses_json,
    password_recovery_json,
    additional_info_json,
    more_json,
    active,
    created_by,
    modified_by,
    modified_date
  )
  VALUES (
    v_username,
    crypt(v_password, gen_salt('bf')),
    json_build_object(
      'prefix', NULL,
      'first', v_first,
      'middle', NULL,
      'last', v_last,
      'suffix', NULL,
      'display', v_first || ' ' || v_last
    ),
    NULL,
    '[]'::json,
    '[]'::json,
    '{}'::json,
    NULL,
    jsonb_build_object(
      'created_with_quickreg', true,
      'quickreg_pw', v_password,
      'quickreg_created_by_name', v_actor_name,
      'quickreg_created_by_username', v_actor
    ),
    TRUE,
    v_actor,
    NULL,
    NULL
  )
  RETURNING user_id INTO v_user_id;

  RETURN json_build_object(
    'ok', true,
    'message', 'Account created successfully.',
    'user_id', v_user_id,
    'username', v_username,
    'password', v_password
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'That username was just taken. Try again.'
    );
END;
$$;

UPDATE public."user" AS u
SET more_json = jsonb_build_object(
  'created_with_quickreg', true,
  'quickreg_pw',
    lower(left(btrim(coalesce(u.name_json ->> 'first', '')), 1))
    || lower(regexp_replace(btrim(coalesce(u.name_json ->> 'last', '')), '\s+', '', 'g')),
  'quickreg_created_by_username', NULLIF(btrim(u.created_by), ''),
  'quickreg_created_by_name', COALESCE(
    (
      SELECT COALESCE(
        NULLIF(btrim(c.name_json ->> 'display'), ''),
        NULLIF(btrim(concat_ws(
          ' ',
          NULLIF(btrim(c.name_json ->> 'first'), ''),
          NULLIF(btrim(c.name_json ->> 'last'), '')
        )), '')
      )
      FROM public."user" AS c
      WHERE lower(c.username) = lower(btrim(u.created_by))
      LIMIT 1
    ),
    NULLIF(btrim(u.created_by), '')
  )
)
WHERE u.additional_info_json IS NOT NULL
  AND jsonb_typeof(u.additional_info_json::jsonb -> 'quick_registration') = 'object'
  AND COALESCE((u.more_json ->> 'created_with_quickreg')::boolean, false) IS NOT TRUE;

REVOKE ALL ON FUNCTION api._user_is_quick_registered(jsonb, json) FROM PUBLIC;
REVOKE ALL ON FUNCTION api._user_is_staff_registered(text, json, json, json, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.lookup_staff_registration(json) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.quick_register_user(text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.lookup_staff_registration(json) TO authenticated;
GRANT EXECUTE ON FUNCTION api.quick_register_user(text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
