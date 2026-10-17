-- Home Registration button for event staff, not only the REGISTRATION app role.
-- A staff person with REGISTRATION as primary or secondary role qualifies while
-- their event is in progress, or starts within the next 24 hours.
-- A null end date stays current through the end of the start calendar day
-- in America/Chicago (single-day events).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/166_registration_home_staff_access.sql

\connect event_system_pro

CREATE OR REPLACE FUNCTION api.event_in_registration_window(
  p_start timestamptz,
  p_end timestamptz,
  p_now timestamptz DEFAULT clock_timestamp()
)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public, api
AS $$
  SELECT p_start IS NOT NULL
    AND (
      (
        p_start > p_now
        AND p_start <= p_now + INTERVAL '24 hours'
      )
      OR (
        p_start <= p_now
        AND (
          (p_end IS NOT NULL AND p_now <= p_end)
          OR (
            p_end IS NULL
            AND p_now < (
              date_trunc('day', p_start AT TIME ZONE 'America/Chicago') + INTERVAL '1 day'
            ) AT TIME ZONE 'America/Chicago'
          )
        )
      )
    );
$$;

CREATE OR REPLACE FUNCTION api.staff_person_has_role(p_person jsonb, p_role text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public, api
AS $$
  SELECT upper(btrim(coalesce(
           p_person ->> 'primary_role_code',
           p_person ->> 'primaryRoleCode',
           ''
         ))) = upper(btrim(coalesce(p_role, '')))
      OR upper(btrim(coalesce(
           p_person ->> 'secondary_role_code',
           p_person ->> 'secondaryRoleCode',
           ''
         ))) = upper(btrim(coalesce(p_role, '')));
$$;

-- Match user_id when the staff row stores it. Otherwise username or first+last name.
CREATE OR REPLACE FUNCTION api.staff_person_matches_user(
  p_person jsonb,
  p_user_id bigint,
  p_username text,
  p_first_name text,
  p_last_name text
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public, api
AS $$
  SELECT CASE
    WHEN coalesce(
      nullif(btrim(p_person ->> 'user_id'), ''),
      nullif(btrim(p_person ->> 'userId'), '')
    ) IS NOT NULL THEN
      coalesce(
        nullif(btrim(p_person ->> 'user_id'), ''),
        nullif(btrim(p_person ->> 'userId'), '')
      ) = p_user_id::text
    ELSE
      (
        nullif(btrim(coalesce(p_person ->> 'username', '')), '') IS NOT NULL
        AND lower(btrim(p_person ->> 'username')) = lower(btrim(coalesce(p_username, '')))
      )
      OR (
        btrim(coalesce(p_first_name, '')) <> ''
        AND btrim(coalesce(p_last_name, '')) <> ''
        AND lower(btrim(coalesce(p_person ->> 'first_name', p_person ->> 'firstName', '')))
          = lower(btrim(p_first_name))
        AND lower(btrim(coalesce(p_person ->> 'last_name', p_person ->> 'lastName', '')))
          = lower(btrim(p_last_name))
      )
  END;
$$;

CREATE OR REPLACE FUNCTION api.user_has_event_registration_role(p_user_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public."user" AS u
    JOIN public.event AS e
      ON e.active IS NOT FALSE
     AND api.event_in_registration_window(e.start_date, e.end_date)
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE
        WHEN jsonb_typeof(e.more_json #> '{staff,people}') = 'array'
          THEN e.more_json #> '{staff,people}'
        ELSE '[]'::jsonb
      END
    ) AS person
    WHERE u.user_id = p_user_id
      AND u.active IS NOT FALSE
      AND api.staff_person_has_role(person, 'REGISTRATION')
      AND api.staff_person_matches_user(
        person,
        u.user_id,
        u.username,
        u.name_json ->> 'first',
        u.name_json ->> 'last'
      )
  );
$$;

CREATE OR REPLACE FUNCTION api.registration_home_access()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_user_id bigint;
BEGIN
  v_user_id := api.current_user_id();

  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'allowed', false,
      'message', 'You are not signed in.'
    );
  END IF;

  RETURN json_build_object(
    'ok', true,
    'allowed',
      api.has_app_role('REGISTRATION')
      OR api.has_app_role('ADMIN')
      OR api.user_has_event_registration_role(v_user_id)
  );
END;
$$;

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

  IF NOT (
    api.has_app_role('REGISTRATION')
    OR api.has_app_role('ADMIN')
    OR api.user_has_event_registration_role(v_actor_id)
  ) THEN
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

REVOKE ALL ON FUNCTION api.event_in_registration_window(timestamptz, timestamptz, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.staff_person_has_role(jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.staff_person_matches_user(jsonb, bigint, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.user_has_event_registration_role(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION api.registration_home_access() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION api.registration_home_access() TO authenticated;

NOTIFY pgrst, 'reload schema';
