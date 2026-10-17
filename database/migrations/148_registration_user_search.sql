-- Registration desk search: non-demo users by first and/or last name.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/148_registration_user_search.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.search_registration_users(
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_first text;
  v_last text;
  v_first_pat text;
  v_last_pat text;
  v_users json;
  v_count integer;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'You are not signed in.',
      'users', '[]'::json
    );
  END IF;

  IF NOT (api.has_app_role('REGISTRATION') OR api.has_app_role('ADMIN')) THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Registration role required.',
      'users', '[]'::json
    );
  END IF;

  v_first := nullif(btrim(COALESCE(p_first_name, '')), '');
  v_last := nullif(btrim(COALESCE(p_last_name, '')), '');

  IF v_first IS NULL AND v_last IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Enter a first name and/or last name to search.',
      'users', '[]'::json
    );
  END IF;

  v_first_pat := CASE
    WHEN v_first IS NULL THEN NULL
    ELSE '%' || replace(replace(replace(v_first, '\', '\\'), '%', '\%'), '_', '\_') || '%'
  END;
  v_last_pat := CASE
    WHEN v_last IS NULL THEN NULL
    ELSE '%' || replace(replace(replace(v_last, '\', '\\'), '%', '\%'), '_', '\_') || '%'
  END;

  SELECT COALESCE(json_agg(row_to_json(s) ORDER BY s.last_name, s.first_name, s.email), '[]'::json),
         COUNT(*)::integer
  INTO v_users, v_count
  FROM (
    SELECT
      btrim(COALESCE(u.username, '')) AS username,
      btrim(COALESCE(u.name_json ->> 'first', '')) AS first_name,
      btrim(COALESCE(u.name_json ->> 'last', '')) AS last_name,
      upper(left(btrim(COALESCE(
        CASE
          WHEN json_typeof(u.addresses_json) = 'array'
            THEN u.addresses_json -> 0 ->> 'state_or_province'
          WHEN json_typeof(u.addresses_json) = 'object'
            THEN u.addresses_json ->> 'state_or_province'
          ELSE NULL
        END,
        ''
      )), 2)) AS state,
      btrim(COALESCE(u.email, '')) AS email
    FROM public."user" AS u
    WHERE (v_first_pat IS NULL OR COALESCE(u.name_json ->> 'first', '') ILIKE v_first_pat ESCAPE '\')
      AND (v_last_pat IS NULL OR COALESCE(u.name_json ->> 'last', '') ILIKE v_last_pat ESCAPE '\')
      AND lower(btrim(COALESCE(u.additional_info_json ->> 'demo', ''))) <> 'true'
      AND COALESCE(u.email, '') NOT ILIKE '%@superhero.com'
      AND COALESCE(u.username, '') NOT ILIKE 'demo\_%' ESCAPE '\'
    ORDER BY 2, 1, 4
    LIMIT 101
  ) AS s;

  IF v_count > 100 THEN
    SELECT COALESCE(json_agg(elem ORDER BY elem ->> 'last_name', elem ->> 'first_name', elem ->> 'email'), '[]'::json)
    INTO v_users
    FROM (
      SELECT elem
      FROM json_array_elements(v_users) WITH ORDINALITY AS rows(elem, ord)
      WHERE ord <= 100
    ) AS limited;
  END IF;

  RETURN json_build_object(
    'ok', true,
    'truncated', v_count > 100,
    'users', COALESCE(v_users, '[]'::json)
  );
END;
$$;

REVOKE ALL ON FUNCTION api.search_registration_users(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.search_registration_users(text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
