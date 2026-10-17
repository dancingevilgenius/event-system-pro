-- Quick Registration usernames start as the generated password.
-- When that username is taken, append 1, then 2, and so on (cgarcia1).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/165_quickreg_username_suffix.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api._next_quickreg_username(p_base text, p_reserved text[])
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, api
AS $$
DECLARE
  v_username text := p_base;
  v_n integer := 0;
BEGIN
  WHILE v_username = ANY(COALESCE(p_reserved, ARRAY[]::text[])) LOOP
    v_n := v_n + 1;
    IF v_n > 99 OR length(p_base) + length(v_n::text) > 64 THEN
      RETURN NULL;
    END IF;
    v_username := p_base || v_n::text;
  END LOOP;

  RETURN v_username;
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

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Admin role required.', 'people', '[]'::json);
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

REVOKE ALL ON FUNCTION api._next_quickreg_username(text, text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.preview_quick_register_usernames(json) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.preview_quick_register_usernames(json) TO authenticated;

NOTIFY pgrst, 'reload schema';
