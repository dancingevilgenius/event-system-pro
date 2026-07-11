-- Save WSDC registry info to the user matching exact WSDC #, else exact first+last name.
-- Used by Admin /wsdc-find-dancer Confirm and Save (not "save to signed-in admin").
-- Run: psql -U postgres -d event_system_pro -f database/migrations/104_save_wsdc_for_matching_user.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.user_stored_wsdc_id(p_additional_info json)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public, api
AS $$
  SELECT api.normalize_wsdc_id(
    COALESCE(
      p_additional_info -> 'wsdc' ->> 'wsdc_id',
      p_additional_info -> 'wsdc' ->> 'dancer_wsdcid',
      p_additional_info ->> 'wsdc_id'
    )
  );
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
  v_result json;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to save WSDC info.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Only an admin can save WSDC info to a matching user account.'
    );
  END IF;

  v_wsdc_id := api.normalize_wsdc_id(p_wsdc_id);
  IF v_wsdc_id IS NULL AND p_wsdc_info IS NOT NULL THEN
    v_wsdc_id := api.normalize_wsdc_id(
      COALESCE(p_wsdc_info ->> 'wsdc_id', p_wsdc_info ->> 'dancer_wsdcid')
    );
  END IF;

  v_first := nullif(btrim(COALESCE(p_first_name, p_wsdc_info ->> 'dancer_first', '')), '');
  v_last := nullif(btrim(COALESCE(p_last_name, p_wsdc_info ->> 'dancer_last', '')), '');

  IF v_wsdc_id IS NULL AND (v_first IS NULL OR v_last IS NULL) THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'WSDC # or both first and last name are required to find a matching user.'
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
        'ok', false,
        'message', format(
          'Multiple user accounts already have WSDC #%s. Resolve duplicates before saving.',
          v_wsdc_id
        ),
        'match_count', v_match_count,
        'match_user_ids', to_json(v_match_ids)
      );
    END IF;
  END IF;

  -- 2) Else exact first + last name match (case-insensitive, trimmed).
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
        'ok', false,
        'message', format(
          'Multiple user accounts match the name %s %s. Match by unique WSDC # or resolve duplicates.',
          v_first,
          v_last
        ),
        'match_count', v_match_count,
        'match_user_ids', to_json(v_match_ids)
      );
    END IF;
  END IF;

  IF v_target_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'message', CASE
        WHEN v_wsdc_id IS NOT NULL AND v_first IS NOT NULL AND v_last IS NOT NULL THEN
          format(
            'No user account matches WSDC #%s or the name %s %s.',
            v_wsdc_id,
            v_first,
            v_last
          )
        WHEN v_wsdc_id IS NOT NULL THEN
          format('No user account matches WSDC #%s.', v_wsdc_id)
        ELSE
          format('No user account matches the name %s %s.', v_first, v_last)
      END
    );
  END IF;

  v_result := api.set_user_wsdc_id(v_target_id, v_wsdc_id, p_wsdc_info);

  IF coalesce((v_result ->> 'ok')::boolean, false) IS NOT TRUE THEN
    RETURN v_result;
  END IF;

  SELECT u.username,
         trim(concat_ws(' ', u.name_json ->> 'first', u.name_json ->> 'last'))
  INTO v_username, v_display
  FROM public."user" u
  WHERE u.user_id = v_target_id;

  RETURN json_build_object(
    'ok', true,
    'message', format(
      'WSDC info saved to %s (matched by %s).',
      COALESCE(NULLIF(v_display, ''), v_username, 'user ' || v_target_id::text),
      CASE v_match_by
        WHEN 'wsdc_id' THEN 'WSDC #'
        WHEN 'name' THEN 'first and last name'
        ELSE v_match_by
      END
    ),
    'user_id', v_target_id,
    'username', v_username,
    'display_name', NULLIF(v_display, ''),
    'match_by', v_match_by,
    'wsdc_id', v_result -> 'wsdc_id',
    'wsdc', v_result -> 'wsdc'
  );
END;
$$;

REVOKE ALL ON FUNCTION api.save_wsdc_for_matching_user(text, json, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.save_wsdc_for_matching_user(text, json, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION api.user_stored_wsdc_id(json) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
