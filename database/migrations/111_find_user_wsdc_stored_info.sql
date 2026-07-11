-- Return existing stored WSDC info when matching a user for Find Dancer.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/111_find_user_wsdc_stored_info.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.find_user_for_wsdc_match(
  p_wsdc_id text DEFAULT NULL,
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
  v_wsdc_id text;
  v_first text;
  v_last text;
  v_match_ids bigint[];
  v_match_count integer;
  v_target_id bigint;
  v_match_by text;
  v_username text;
  v_display text;
  v_stored jsonb;
  v_stored_first text;
  v_stored_updated text;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'matched', false, 'message', 'Sign in to look up a matching user.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'matched', false,
      'message', 'Only an admin can look up users for WSDC save.'
    );
  END IF;

  v_wsdc_id := api.normalize_wsdc_id(p_wsdc_id);
  v_first := nullif(btrim(COALESCE(p_first_name, '')), '');
  v_last := nullif(btrim(COALESCE(p_last_name, '')), '');

  IF v_wsdc_id IS NULL AND (v_first IS NULL OR v_last IS NULL) THEN
    RETURN json_build_object(
      'ok', true,
      'matched', false,
      'match_count', 0,
      'message', 'WSDC # or both first and last name are required.'
    );
  END IF;

  -- 1) Prefer exact stored WSDC # match.
  IF v_wsdc_id IS NOT NULL THEN
    SELECT coalesce(array_agg(u.user_id ORDER BY u.user_id), ARRAY[]::bigint[])
    INTO v_match_ids
    FROM public."user" u
    WHERE u.active IS NOT FALSE
      AND api.user_stored_wsdc_id(u.additional_info_json) = v_wsdc_id;

    v_match_count := coalesce(cardinality(v_match_ids), 0);

    IF v_match_count = 1 THEN
      v_target_id := v_match_ids[1];
      v_match_by := 'wsdc_id';
    ELSIF v_match_count > 1 THEN
      RETURN json_build_object(
        'ok', true,
        'matched', false,
        'ambiguous', true,
        'match_count', v_match_count,
        'match_user_ids', to_json(v_match_ids),
        'match_by', 'wsdc_id',
        'message', format(
          'Multiple user accounts already have WSDC #%s. Resolve duplicates before saving.',
          v_wsdc_id
        )
      );
    END IF;
  END IF;

  -- 2) Else exact first + last name match.
  IF v_target_id IS NULL AND v_first IS NOT NULL AND v_last IS NOT NULL THEN
    SELECT coalesce(array_agg(u.user_id ORDER BY u.user_id), ARRAY[]::bigint[])
    INTO v_match_ids
    FROM public."user" u
    WHERE u.active IS NOT FALSE
      AND lower(btrim(COALESCE(u.name_json ->> 'first', ''))) = lower(v_first)
      AND lower(btrim(COALESCE(u.name_json ->> 'last', ''))) = lower(v_last);

    v_match_count := coalesce(cardinality(v_match_ids), 0);

    IF v_match_count = 1 THEN
      v_target_id := v_match_ids[1];
      v_match_by := 'name';
    ELSIF v_match_count > 1 THEN
      RETURN json_build_object(
        'ok', true,
        'matched', false,
        'ambiguous', true,
        'match_count', v_match_count,
        'match_user_ids', to_json(v_match_ids),
        'match_by', 'name',
        'message', format(
          'Multiple user accounts match the name %s %s. Match by unique WSDC # or resolve duplicates.',
          v_first,
          v_last
        )
      );
    END IF;
  END IF;

  IF v_target_id IS NULL THEN
    RETURN json_build_object(
      'ok', true,
      'matched', false,
      'match_count', 0,
      'wsdc_id', v_wsdc_id,
      'first_name', v_first,
      'last_name', v_last
    );
  END IF;

  SELECT u.username,
         trim(concat_ws(' ', u.name_json ->> 'first', u.name_json ->> 'last')),
         CASE
           WHEN jsonb_typeof(COALESCE(u.additional_info_json, '{}'::json)::jsonb -> 'wsdc') = 'object'
             THEN COALESCE(u.additional_info_json, '{}'::json)::jsonb -> 'wsdc'
           ELSE NULL
         END
  INTO v_username, v_display, v_stored
  FROM public."user" u
  WHERE u.user_id = v_target_id;

  IF v_stored IS NOT NULL THEN
    v_stored_first := nullif(btrim(COALESCE(v_stored ->> 'dancer_first', '')), '');
    IF v_stored_first IS NULL THEN
      v_stored_first := nullif(btrim(split_part(COALESCE(v_display, ''), ' ', 1)), '');
    END IF;
    v_stored_updated := nullif(btrim(COALESCE(v_stored ->> 'last_update_datetime', '')), '');
  END IF;

  RETURN json_build_object(
    'ok', true,
    'matched', true,
    'match_count', 1,
    'user_id', v_target_id,
    'username', v_username,
    'display_name', NULLIF(v_display, ''),
    'match_by', v_match_by,
    'wsdc_id', v_wsdc_id,
    'first_name', v_first,
    'last_name', v_last,
    'has_stored_wsdc', v_stored IS NOT NULL,
    'stored_dancer_first', v_stored_first,
    'stored_last_update_datetime', v_stored_updated
  );
END;
$$;

REVOKE ALL ON FUNCTION api.find_user_for_wsdc_match(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.find_user_for_wsdc_match(text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
