-- Admin Open Judge Tabs: sign in each judge assigned to one contest.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/171_open_contest_judge_tabs.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.open_contest_judge_tabs(
  p_event_id bigint,
  p_contest_key text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_actor text;
  v_key text;
  v_more jsonb;
  v_people jsonb;
  v_item jsonb;
  v_contest_id bigint;
  v_staff_text text;
  v_staff_json jsonb;
  v_panel jsonb;
  v_judges jsonb := '[]'::jsonb;
  v_judge jsonb;
  v_staff_id text;
  v_person jsonb;
  v_first text;
  v_last text;
  v_name text;
  v_user_id bigint;
  v_match_ids bigint[];
  v_judge_match_ids bigint[];
  v_ambiguous boolean;
  v_display text;
  v_seen_users bigint[] := ARRAY[]::bigint[];
  v_user public."user"%ROWTYPE;
  v_roles json;
  v_role_codes text[];
  v_secret text;
  v_token text;
  v_now timestamptz;
  v_formatted text;
  v_sessions jsonb := '[]'::jsonb;
  v_skipped jsonb := '[]'::jsonb;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to open judge tabs.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Only an admin can open judge tabs.'
    );
  END IF;

  v_key := btrim(COALESCE(p_contest_key, ''));

  IF p_event_id IS NULL OR p_event_id <= 0 OR v_key = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Choose an event and a contest.');
  END IF;

  SELECT COALESCE(e.more_json::jsonb, '{}'::jsonb)
  INTO v_more
  FROM public."event" AS e
  WHERE e.event_id = p_event_id;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'message', 'Event was not found.');
  END IF;

  v_people := CASE
    WHEN jsonb_typeof(v_more #> '{staff,people}') = 'array' THEN v_more #> '{staff,people}'
    ELSE '[]'::jsonb
  END;

  IF v_key LIKE 'table:%' AND substring(v_key FROM 7) ~ '^[0-9]+$' THEN
    v_contest_id := substring(v_key FROM 7)::bigint;
  ELSE
    SELECT item
    INTO v_item
    FROM jsonb_array_elements(
      CASE
        WHEN jsonb_typeof(v_more #> '{contests,items}') = 'array' THEN v_more #> '{contests,items}'
        ELSE '[]'::jsonb
      END
    ) AS found(item)
    WHERE btrim(COALESCE(item ->> 'id', '')) = v_key
    LIMIT 1;
  END IF;

  IF v_item IS NULL AND v_contest_id IS NULL AND v_key ~ '^[0-9]+$' THEN
    v_contest_id := v_key::bigint;
  END IF;

  IF v_item IS NOT NULL THEN
    v_staff_id := nullif(btrim(v_item ->> 'head_judge_staff_id'), '');
    IF v_staff_id IS NOT NULL THEN
      v_judges := v_judges || jsonb_build_array(jsonb_build_object('staff_id', v_staff_id));
    END IF;

    IF jsonb_typeof(v_item -> 'scoring_judge_staff_ids') = 'array' THEN
      FOR v_staff_id IN
        SELECT btrim(entry)
        FROM jsonb_array_elements_text(v_item -> 'scoring_judge_staff_ids') AS listed(entry)
      LOOP
        IF v_staff_id IS NOT NULL
           AND v_staff_id <> ''
           AND NOT EXISTS (
             SELECT 1
             FROM jsonb_array_elements(v_judges) AS existing(judge)
             WHERE judge ->> 'staff_id' = v_staff_id
           ) THEN
          v_judges := v_judges || jsonb_build_array(jsonb_build_object('staff_id', v_staff_id));
        END IF;
      END LOOP;
    END IF;
  ELSIF v_contest_id IS NOT NULL THEN
    SELECT c.staff_json::text
    INTO v_staff_text
    FROM public.contest AS c
    WHERE c.contest_id = v_contest_id
      AND c.event_id = p_event_id;

    IF NOT FOUND THEN
      RETURN json_build_object('ok', false, 'message', 'Contest was not found.');
    END IF;

    v_staff_json := '[]'::jsonb;
    IF v_staff_text IS NOT NULL AND pg_input_is_valid(btrim(v_staff_text), 'jsonb') THEN
      v_staff_json := btrim(v_staff_text)::jsonb;
    END IF;

    IF jsonb_typeof(v_staff_json) = 'array' THEN
      FOR v_judge IN
        SELECT entry
        FROM jsonb_array_elements(v_staff_json) AS listed(entry)
      LOOP
        IF jsonb_typeof(v_judge) <> 'object' THEN
          CONTINUE;
        END IF;

        IF NOT (
          upper(btrim(COALESCE(v_judge ->> 'primary_role_code', v_judge ->> 'role', v_judge ->> 'role_code', '')))
            IN ('JUDGE', 'HEAD_JUDGE')
          OR upper(btrim(COALESCE(v_judge ->> 'secondary_role_code', ''))) IN ('JUDGE', 'HEAD_JUDGE')
        ) THEN
          CONTINUE;
        END IF;

        v_staff_id := nullif(btrim(COALESCE(v_judge ->> 'id', v_judge ->> 'staff_id', '')), '');
        IF v_staff_id IS NULL THEN
          CONTINUE;
        END IF;

        v_judges := v_judges || jsonb_build_array(jsonb_build_object(
          'staff_id', v_staff_id,
          'user_id', nullif(btrim(COALESCE(v_judge ->> 'user_id', '')), ''),
          'first', COALESCE(v_judge ->> 'first_name', v_judge ->> 'firstname', ''),
          'last', COALESCE(v_judge ->> 'last_name', v_judge ->> 'lastname', '')
        ));
      END LOOP;
    END IF;

    SELECT COALESCE(jsonb_agg(entry), '[]'::jsonb)
    INTO v_panel
    FROM public.judging_panel AS panel
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE
        WHEN jsonb_typeof(panel.judges_json) = 'array' THEN panel.judges_json
        ELSE '[]'::jsonb
      END
    ) AS listed(entry)
    WHERE panel.contest_id = v_contest_id
      AND panel.event_id = p_event_id;

    FOR v_judge IN
      SELECT entry
      FROM jsonb_array_elements(COALESCE(v_panel, '[]'::jsonb)) AS listed(entry)
    LOOP
      IF jsonb_typeof(v_judge) = 'string' THEN
        v_staff_id := nullif(btrim(v_judge #>> '{}'), '');
        IF v_staff_id IS NOT NULL THEN
          v_judges := v_judges || jsonb_build_array(jsonb_build_object('staff_id', v_staff_id));
        END IF;
      ELSIF jsonb_typeof(v_judge) = 'object' THEN
        v_judges := v_judges || jsonb_build_array(jsonb_build_object(
          'staff_id', nullif(btrim(COALESCE(
            v_judge ->> 'staff_id',
            v_judge ->> 'id',
            v_judge ->> 'judge_id',
            ''
          )), ''),
          'user_id', nullif(btrim(COALESCE(v_judge ->> 'user_id', '')), ''),
          'first', COALESCE(v_judge ->> 'firstname', v_judge ->> 'first_name', v_judge ->> 'first', ''),
          'last', COALESCE(v_judge ->> 'lastname', v_judge ->> 'last_name', v_judge ->> 'last', ''),
          'name', COALESCE(v_judge ->> 'name', '')
        ));
      END IF;
    END LOOP;
  ELSE
    RETURN json_build_object('ok', false, 'message', 'Contest was not found.');
  END IF;

  v_secret := current_setting('app.jwt_secret', true);
  IF v_secret IS NULL OR btrim(v_secret) = '' THEN
    RETURN json_build_object('ok', false, 'message', 'Judge sign-in is not configured.');
  END IF;

  v_actor := COALESCE(nullif(btrim(api.current_username()), ''), 'admin');

  FOR v_judge IN
    SELECT entry
    FROM jsonb_array_elements(v_judges) AS listed(entry)
  LOOP
    v_user_id := NULL;
    v_ambiguous := false;
    v_staff_id := nullif(btrim(COALESCE(v_judge ->> 'staff_id', '')), '');
    v_first := btrim(COALESCE(v_judge ->> 'first', ''));
    v_last := btrim(COALESCE(v_judge ->> 'last', ''));
    v_name := btrim(COALESCE(v_judge ->> 'name', ''));
    v_person := NULL;

    IF v_first = '' AND v_last = '' AND position(' ' IN v_name) > 0 THEN
      v_first := split_part(v_name, ' ', 1);
      v_last := btrim(substring(v_name FROM position(' ' IN v_name) + 1));
    END IF;

    IF COALESCE(v_judge ->> 'user_id', '') ~ '^[0-9]+$' THEN
      v_user_id := (v_judge ->> 'user_id')::bigint;
    END IF;

    IF v_staff_id IS NOT NULL THEN
      SELECT person
      INTO v_person
      FROM jsonb_array_elements(v_people) AS listed(person)
      WHERE btrim(COALESCE(person ->> 'id', '')) = v_staff_id
      LIMIT 1;
    END IF;

    IF v_person IS NOT NULL THEN
      IF v_user_id IS NULL AND COALESCE(v_person ->> 'user_id', '') ~ '^[0-9]+$' THEN
        v_user_id := (v_person ->> 'user_id')::bigint;
      END IF;
      IF v_first = '' THEN
        v_first := btrim(COALESCE(v_person ->> 'first_name', v_person ->> 'firstname', ''));
      END IF;
      IF v_last = '' THEN
        v_last := btrim(COALESCE(v_person ->> 'last_name', v_person ->> 'lastname', ''));
      END IF;
    END IF;

    IF v_user_id IS NULL THEN
      SELECT (pool_judge ->> 'user_id')::bigint
      INTO v_user_id
      FROM public.event_staff_pool AS esp
      CROSS JOIN LATERAL jsonb_array_elements(
        CASE
          WHEN jsonb_typeof(esp.judges_json) = 'array' THEN esp.judges_json
          ELSE '[]'::jsonb
        END
      ) AS pool(pool_judge)
      WHERE esp.event_id = p_event_id
        AND COALESCE(pool_judge ->> 'user_id', '') ~ '^[0-9]+$'
        AND (
          (v_staff_id IS NOT NULL AND pool_judge ->> 'user_id' = v_staff_id)
          OR (
            v_first <> ''
            AND v_last <> ''
            AND lower(btrim(COALESCE(pool_judge ->> 'firstname', ''))) = lower(v_first)
            AND lower(btrim(COALESCE(pool_judge ->> 'lastname', ''))) = lower(v_last)
          )
        )
      ORDER BY (pool_judge ->> 'user_id')::bigint
      LIMIT 1;
    END IF;

    IF v_user_id IS NOT NULL AND NOT EXISTS (
      SELECT 1
      FROM public."user" AS account
      WHERE account.user_id = v_user_id
        AND COALESCE(account.active, true)
    ) THEN
      v_user_id := NULL;
    END IF;

    IF v_user_id IS NULL AND v_first <> '' AND v_last <> '' THEN
      SELECT array_agg(account.user_id ORDER BY account.user_id)
      INTO v_match_ids
      FROM public."user" AS account
      WHERE COALESCE(account.active, true)
        AND lower(btrim(COALESCE(account.name_json ->> 'first', ''))) = lower(v_first)
        AND lower(btrim(COALESCE(account.name_json ->> 'last', ''))) = lower(v_last);

      IF v_match_ids IS NOT NULL AND cardinality(v_match_ids) = 1 THEN
        v_user_id := v_match_ids[1];
      ELSIF v_match_ids IS NOT NULL AND cardinality(v_match_ids) > 1 THEN
        SELECT array_agg(DISTINCT account.user_id ORDER BY account.user_id)
        INTO v_judge_match_ids
        FROM public."user" AS account
        JOIN public.user_app_role AS role
          ON role.user_id = account.user_id
        WHERE account.user_id = ANY (v_match_ids)
          AND role.role_code IN ('JUDGE', 'HEAD_JUDGE');

        IF v_judge_match_ids IS NOT NULL AND cardinality(v_judge_match_ids) = 1 THEN
          v_user_id := v_judge_match_ids[1];
        ELSE
          v_ambiguous := true;
        END IF;
      END IF;
    END IF;

    v_display := btrim(v_first || ' ' || v_last);
    IF v_display = '' THEN
      v_display := COALESCE(nullif(v_name, ''), 'Judge');
    END IF;

    IF v_ambiguous THEN
      v_skipped := v_skipped || jsonb_build_array(jsonb_build_object(
        'name', v_display,
        'reason', 'More than one user account matches this judge.'
      ));
      CONTINUE;
    END IF;

    IF v_user_id IS NULL THEN
      v_skipped := v_skipped || jsonb_build_array(jsonb_build_object(
        'name', v_display,
        'reason', 'No user account matches this judge.'
      ));
      CONTINUE;
    END IF;

    IF v_user_id = ANY (v_seen_users) THEN
      CONTINUE;
    END IF;

    SELECT *
    INTO v_user
    FROM public."user" AS account
    WHERE account.user_id = v_user_id
      AND COALESCE(account.active, true);

    IF NOT FOUND THEN
      v_skipped := v_skipped || jsonb_build_array(jsonb_build_object(
        'name', v_display,
        'reason', 'No user account matches this judge.'
      ));
      CONTINUE;
    END IF;

    SELECT COALESCE(json_agg(role.role_code ORDER BY role.role_code), '[]'::json)
    INTO v_roles
    FROM public.user_app_role AS role
    WHERE role.user_id = v_user.user_id;

    SELECT COALESCE(array_agg(role.role_code ORDER BY role.role_code), ARRAY[]::text[])
    INTO v_role_codes
    FROM public.user_app_role AS role
    WHERE role.user_id = v_user.user_id;

    v_now := api.activity_timestamp();
    v_formatted := api.format_activity_timestamp(date_trunc('minute', v_now));
    PERFORM api.set_audit_actor(v_user.username);

    UPDATE public."user"
    SET additional_info_json = (
      (COALESCE(additional_info_json, '{}'::json)::jsonb - 'inactive_logout_at')
      || jsonb_build_object(
        'last_login_at', to_jsonb(v_formatted),
        'last-activity', to_jsonb(v_formatted)
      )
    )::json
    WHERE user_id = v_user.user_id;

    PERFORM api.record_audit_event(
      p_action => 'LOGIN',
      p_actor_user_id => v_user.user_id,
      p_actor_username => v_user.username,
      p_table_name => 'user',
      p_record_key => v_user.user_id::text,
      p_metadata => jsonb_build_object(
        'identifier', v_user.username,
        'roles', to_jsonb(v_role_codes),
        'source', 'open_judge_tabs',
        'opened_by_user_id', v_actor_id,
        'opened_by_username', v_actor,
        'event_id', p_event_id,
        'contest_key', v_key
      )
    );

    v_token := api.sign_jwt_hs256(
      json_build_object(
        'role', 'authenticated',
        'sub', v_user.user_id::text,
        'username', v_user.username,
        'app_roles', to_jsonb(v_role_codes)
      ),
      v_secret
    );

    IF v_token IS NULL OR btrim(v_token) = '' THEN
      v_skipped := v_skipped || jsonb_build_array(jsonb_build_object(
        'name', v_display,
        'reason', 'Unable to sign this judge in.'
      ));
      CONTINUE;
    END IF;

    v_seen_users := v_seen_users || v_user_id;
    v_sessions := v_sessions || jsonb_build_array(jsonb_build_object(
      'ok', true,
      'user_id', v_user.user_id,
      'username', v_user.username,
      'email', COALESCE(v_user.email, ''),
      'roles', v_roles::jsonb,
      'token', v_token
    ));
  END LOOP;

  RETURN json_build_object(
    'ok', true,
    'sessions', v_sessions,
    'skipped', v_skipped
  );
END;
$$;

REVOKE ALL ON FUNCTION api.open_contest_judge_tabs(bigint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.open_contest_judge_tabs(bigint, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
