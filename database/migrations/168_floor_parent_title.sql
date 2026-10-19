-- Store the Floor Parent home-button title on user.additional_info_json.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/168_floor_parent_title.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.set_floor_parent_title(p_title text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_actor_username text;
  v_title text;
  v_info jsonb;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to save your floor title.');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public."user" u
    WHERE u.user_id = v_actor_id
      AND u.active IS NOT FALSE
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'User not found.');
  END IF;

  v_title := btrim(COALESCE(p_title, ''));
  IF v_title NOT IN ('Floor Parent', 'Floor Mom', 'Floor Dad') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Choose Floor Parent, Floor Mom, or Floor Dad.'
    );
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

  v_info := v_info || jsonb_build_object('floor_parent_title', v_title);

  UPDATE public."user" u
  SET
    additional_info_json = v_info::json,
    modified_by = v_actor_username,
    modified_date = CURRENT_TIMESTAMP
  WHERE u.user_id = v_actor_id;

  RETURN json_build_object(
    'ok', true,
    'message', 'Floor title saved.',
    'user_id', v_actor_id,
    'floor_parent_title', v_title
  );
END;
$$;

REVOKE ALL ON FUNCTION api.set_floor_parent_title(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.set_floor_parent_title(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
