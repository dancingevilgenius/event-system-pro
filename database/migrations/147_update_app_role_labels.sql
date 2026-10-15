-- Admin RPC to replace app_role.more_json.Labels.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/147_update_app_role_labels.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.update_app_role_labels(
  p_role_code text,
  p_labels text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_user_id bigint;
  v_actor_username text;
  v_role_code text;
  v_labels text[];
  v_more jsonb;
BEGIN
  v_actor_user_id := api.current_user_id();

  IF v_actor_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'You are not signed in.'
    );
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Admin role required.'
    );
  END IF;

  v_role_code := trim(COALESCE(p_role_code, ''));

  IF v_role_code = '' THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Role code is required.'
    );
  END IF;

  SELECT COALESCE(array_agg(label ORDER BY ordinality), ARRAY[]::text[])
  INTO v_labels
  FROM (
    SELECT trim(entry) AS label, ordinality
    FROM unnest(COALESCE(p_labels, ARRAY[]::text[])) WITH ORDINALITY AS parts(entry, ordinality)
  ) AS labeled
  WHERE label <> '';

  IF v_labels IS NULL OR cardinality(v_labels) = 0 THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Enter at least one label.'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.app_role
    WHERE role_code = v_role_code
  ) THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Role not found.'
    );
  END IF;

  SELECT u.username
  INTO v_actor_username
  FROM public."user" u
  WHERE u.user_id = v_actor_user_id
    AND u.active IS NOT FALSE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Account not found.'
    );
  END IF;

  SELECT COALESCE(more_json, '{}'::jsonb)
  INTO v_more
  FROM public.app_role
  WHERE role_code = v_role_code;

  v_more := jsonb_set(v_more, '{Labels}', to_jsonb(v_labels), true);

  PERFORM api.set_audit_actor(v_actor_username);

  UPDATE public.app_role
  SET
    more_json = v_more,
    modified_by = v_actor_username,
    modified_date = CURRENT_TIMESTAMP
  WHERE role_code = v_role_code;

  RETURN json_build_object(
    'ok', true,
    'message', 'Role labels saved.',
    'role_code', v_role_code,
    'labels', to_jsonb(v_labels)
  );
END;
$$;

REVOKE ALL ON FUNCTION api.update_app_role_labels(text, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.update_app_role_labels(text, text[]) TO authenticated;

NOTIFY pgrst, 'reload schema';
