-- Store admin-starred Cursor rule ids on user.additional_info_json->'cursor_rules_starred'.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/134_user_cursor_rules_starred.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.set_user_cursor_rules_starred(p_starred text[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_actor_username text;
  v_info jsonb;
  v_starred jsonb;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to save starred Cursor rules.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object('ok', false, 'message', 'Admin role required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public."user" u
    WHERE u.user_id = v_actor_id
      AND u.active IS NOT FALSE
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'User not found.');
  END IF;

  v_actor_username := api.resolve_audit_actor(NULL);

  IF v_actor_username IS NULL THEN
    SELECT u.username
    INTO v_actor_username
    FROM public."user" u
    WHERE u.user_id = v_actor_id;
  END IF;

  PERFORM api.set_audit_actor(v_actor_username);

  SELECT COALESCE(u.additional_info_json, '{}'::json)::jsonb
  INTO v_info
  FROM public."user" u
  WHERE u.user_id = v_actor_id;

  IF p_starred IS NULL OR cardinality(p_starred) = 0 THEN
    v_info := v_info - 'cursor_rules_starred';
  ELSE
    SELECT COALESCE(jsonb_agg(to_jsonb(trim(s))), '[]'::jsonb)
    INTO v_starred
    FROM unnest(p_starred) AS s
    WHERE trim(s) <> '';

    IF v_starred = '[]'::jsonb THEN
      v_info := v_info - 'cursor_rules_starred';
    ELSE
      v_info := v_info || jsonb_build_object('cursor_rules_starred', v_starred);
    END IF;
  END IF;

  UPDATE public."user" u
  SET
    additional_info_json = CASE
      WHEN v_info = '{}'::jsonb THEN NULL
      ELSE v_info::json
    END,
    modified_by = v_actor_username,
    modified_date = CURRENT_TIMESTAMP
  WHERE u.user_id = v_actor_id;

  RETURN json_build_object(
    'ok', true,
    'message', 'Starred Cursor rules saved.',
    'user_id', v_actor_id,
    'cursor_rules_starred', COALESCE(v_info -> 'cursor_rules_starred', '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION api.set_user_cursor_rules_starred(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.set_user_cursor_rules_starred(text[]) TO authenticated;

NOTIFY pgrst, 'reload schema';
