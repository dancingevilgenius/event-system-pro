-- Let Registration desk staff Quick Register and look up registration status.
-- Same access as the Registration home button: ADMIN, the REGISTRATION app role,
-- or event staff with REGISTRATION on an event in the registration window.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/167_registration_quick_register_access.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.actor_may_quick_register()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
  SELECT api.current_user_id() IS NOT NULL
    AND (
      api.has_app_role('ADMIN')
      OR api.has_app_role('REGISTRATION')
      OR api.user_has_event_registration_role(api.current_user_id())
    );
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

  IF NOT api.actor_may_quick_register() THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Registration role required.',
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

CREATE OR REPLACE FUNCTION api.preview_quick_register_usernames(p_people json)
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
  v_base text;
  v_username text;
  v_reserved text[];
  v_people jsonb := '[]'::jsonb;
BEGIN
  IF api.current_user_id() IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'You are not signed in.', 'people', '[]'::json);
  END IF;

  IF NOT api.actor_may_quick_register() THEN
    RETURN json_build_object('ok', false, 'message', 'Registration role required.', 'people', '[]'::json);
  END IF;

  SELECT COALESCE(array_agg(lower(u.username)), ARRAY[]::text[])
  INTO v_reserved
  FROM public."user" u
  WHERE u.username IS NOT NULL
    AND btrim(u.username) <> '';

  FOR v_person IN
    SELECT value
    FROM json_array_elements(coalesce(p_people, '[]'::json))
  LOOP
    v_id := coalesce(v_person ->> 'id', '');
    v_first := btrim(coalesce(v_person ->> 'first_name', ''));
    v_last := btrim(coalesce(v_person ->> 'last_name', ''));
    v_base := lower(left(v_first, 1)) || lower(regexp_replace(v_last, '\s+', '', 'g'));

    IF v_first = '' OR v_last = '' OR length(v_base) < 2 OR length(v_base) > 64 THEN
      v_people := v_people || jsonb_build_array(jsonb_build_object(
        'id', v_id,
        'first_name', v_first,
        'last_name', v_last,
        'ok', false,
        'message', 'That name cannot be used for Quick Registration.'
      ));
      CONTINUE;
    END IF;

    IF EXISTS (
      SELECT 1
      FROM public."user" u
      WHERE coalesce(u.active, true)
        AND lower(btrim(coalesce(u.name_json ->> 'first', ''))) = lower(v_first)
        AND lower(btrim(coalesce(u.name_json ->> 'last', ''))) = lower(v_last)
    ) THEN
      v_people := v_people || jsonb_build_array(jsonb_build_object(
        'id', v_id,
        'first_name', v_first,
        'last_name', v_last,
        'ok', false,
        'message', v_first || ' ' || v_last || ' already has an account.'
      ));
      CONTINUE;
    END IF;

    v_username := api._next_quickreg_username(v_base, v_reserved);
    IF v_username IS NULL THEN
      v_people := v_people || jsonb_build_array(jsonb_build_object(
        'id', v_id,
        'first_name', v_first,
        'last_name', v_last,
        'ok', false,
        'message', 'Unable to choose a unique username.'
      ));
      CONTINUE;
    END IF;

    v_reserved := v_reserved || lower(v_username);
    v_people := v_people || jsonb_build_array(jsonb_build_object(
      'id', v_id,
      'first_name', v_first,
      'last_name', v_last,
      'ok', true,
      'base_username', v_base,
      'username', v_username,
      'incremented', v_username <> v_base
    ));
  END LOOP;

  RETURN json_build_object('ok', true, 'people', v_people);
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
  v_reserved text[];
  v_user_id bigint;
BEGIN
  IF api.current_user_id() IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'You are not signed in.');
  END IF;

  IF NOT api.actor_may_quick_register() THEN
    RETURN json_build_object('ok', false, 'message', 'Registration role required.');
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

  SELECT COALESCE(array_agg(lower(u.username)), ARRAY[]::text[])
  INTO v_reserved
  FROM public."user" u
  WHERE u.username IS NOT NULL
    AND btrim(u.username) <> '';

  v_username := api._next_quickreg_username(v_password, v_reserved);
  IF v_username IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Unable to choose a unique username.'
    );
  END IF;

  INSERT INTO public."user" (
    username,
    password_encrypted,
    name_json,
    email,
    phone_numbers_json,
    addresses_json,
    password_recovery_json,
    additional_info_json,
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
    json_build_object(
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
    'password', v_password,
    'base_username', v_password,
    'username_incremented', v_username <> v_password
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'That username was just taken. Try again.'
    );
END;
$$;

REVOKE ALL ON FUNCTION api.actor_may_quick_register() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.actor_may_quick_register() TO authenticated;

NOTIFY pgrst, 'reload schema';
