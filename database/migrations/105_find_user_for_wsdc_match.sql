-- Lookup ESP user for a WSDC dancer (exact WSDC #, else exact first+last).
-- Used to enable/disable Confirm and Save on /wsdc-find-dancer.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/105_find_user_for_wsdc_match.sql

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
         trim(concat_ws(' ', u.name_json ->> 'first', u.name_json ->> 'last'))
  INTO v_username, v_display
  FROM public."user" u
  WHERE u.user_id = v_target_id;

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
    'last_name', v_last
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.save_wsdc_for_matching_user(
  p_wsdc_id text,
  p_wsdc_info json DEFAULT NULL,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_wsdc_id text;
  v_first text;
  v_last text;
  v_find json;
  v_target_id bigint;
  v_match_by text;
  v_username text;
  v_display text;
  v_result json;
BEGIN
  v_wsdc_id := api.normalize_wsdc_id(p_wsdc_id);
  IF v_wsdc_id IS NULL AND p_wsdc_info IS NOT NULL THEN
    v_wsdc_id := api.normalize_wsdc_id(
      COALESCE(p_wsdc_info ->> 'wsdc_id', p_wsdc_info ->> 'dancer_wsdcid')
    );
  END IF;

  v_first := nullif(btrim(COALESCE(p_first_name, p_wsdc_info ->> 'dancer_first', '')), '');
  v_last := nullif(btrim(COALESCE(p_last_name, p_wsdc_info ->> 'dancer_last', '')), '');

  v_find := api.find_user_for_wsdc_match(v_wsdc_id, v_first, v_last);

  IF coalesce((v_find ->> 'ok')::boolean, false) IS NOT TRUE THEN
    RETURN v_find;
  END IF;

  IF coalesce((v_find ->> 'matched')::boolean, false) IS NOT TRUE THEN
    IF coalesce((v_find ->> 'ambiguous')::boolean, false) THEN
      RETURN json_build_object(
        'ok', false,
        'message', v_find ->> 'message',
        'match_count', v_find -> 'match_count',
        'match_user_ids', v_find -> 'match_user_ids'
      );
    END IF;

    RETURN json_build_object(
      'ok', false,
      'message', CASE
        WHEN v_first IS NOT NULL AND v_last IS NOT NULL THEN
          format(
            'World Swing Dance Council dancer found for %s %s.  They do not have an account in Event System Pro.',
            v_first,
            v_last
          )
        WHEN v_wsdc_id IS NOT NULL THEN
          format('No user account matches WSDC #%s.', v_wsdc_id)
        ELSE
          'No matching user account found.'
      END
    );
  END IF;

  v_target_id := (v_find ->> 'user_id')::bigint;
  v_match_by := v_find ->> 'match_by';
  v_result := api.set_user_wsdc_id(v_target_id, v_wsdc_id, p_wsdc_info);

  IF coalesce((v_result ->> 'ok')::boolean, false) IS NOT TRUE THEN
    RETURN v_result;
  END IF;

  v_username := v_find ->> 'username';
  v_display := nullif(v_find ->> 'display_name', '');

  RETURN json_build_object(
    'ok', true,
    'message', format(
      'WSDC info saved to %s (matched by %s).',
      COALESCE(v_display, v_username, 'user ' || v_target_id::text),
      CASE v_match_by
        WHEN 'wsdc_id' THEN 'WSDC #'
        WHEN 'name' THEN 'first and last name'
        ELSE v_match_by
      END
    ),
    'user_id', v_target_id,
    'username', v_username,
    'display_name', v_display,
    'match_by', v_match_by,
    'wsdc_id', v_result -> 'wsdc_id',
    'wsdc', v_result -> 'wsdc'
  );
END;
$$;

REVOKE ALL ON FUNCTION api.find_user_for_wsdc_match(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.find_user_for_wsdc_match(text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
