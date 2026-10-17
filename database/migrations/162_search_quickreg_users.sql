-- Admin search of Quick Registration accounts by first and/or last name.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/162_search_quickreg_users.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.search_quickreg_users(
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
  v_first text;
  v_last text;
  v_first_pat text;
  v_last_pat text;
  v_users json;
  v_count integer;
BEGIN
  IF api.current_user_id() IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'You are not signed in.',
      'users', '[]'::json
    );
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.',
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

  SELECT COALESCE(
    json_agg(row_to_json(s) ORDER BY s.last_name, s.first_name, s.username),
    '[]'::json
  ),
  COUNT(*)::integer
  INTO v_users, v_count
  FROM (
    SELECT
      btrim(COALESCE(u.name_json ->> 'first', '')) AS first_name,
      btrim(COALESCE(u.name_json ->> 'last', '')) AS last_name,
      btrim(COALESCE(u.username, '')) AS username,
      btrim(COALESCE(u.additional_info_json::jsonb ->> 'quickreg_pw', '')) AS quickreg_pw,
      btrim(COALESCE(creator.name_json ->> 'first', '')) AS created_by_first,
      btrim(COALESCE(creator.name_json ->> 'last', '')) AS created_by_last,
      btrim(COALESCE(u.additional_info_json::jsonb ->> 'quickreg_created_by_name', '')) AS created_by_name,
      btrim(COALESCE(u.additional_info_json::jsonb ->> 'quickreg_created_by_username', '')) AS created_by_username,
      u.created_date AS created_date
    FROM public."user" AS u
    LEFT JOIN public."user" AS creator
      ON lower(creator.username) = lower(btrim(u.additional_info_json::jsonb ->> 'quickreg_created_by_username'))
    WHERE COALESCE((u.additional_info_json::jsonb ->> 'created_with_quickreg')::boolean, false)
      AND (v_first_pat IS NULL OR COALESCE(u.name_json ->> 'first', '') ILIKE v_first_pat ESCAPE '\')
      AND (v_last_pat IS NULL OR COALESCE(u.name_json ->> 'last', '') ILIKE v_last_pat ESCAPE '\')
    ORDER BY 2, 1, 3
    LIMIT 101
  ) AS s;

  IF v_count > 100 THEN
    SELECT COALESCE(
      json_agg(elem ORDER BY elem ->> 'last_name', elem ->> 'first_name', elem ->> 'username'),
      '[]'::json
    )
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

REVOKE ALL ON FUNCTION api.search_quickreg_users(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.search_quickreg_users(text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
