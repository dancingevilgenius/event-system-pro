-- Event judging pool RPCs and judges_json jsonb for event_staff_pool.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/116_event_judging_pool_rpc.sql

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'event_staff_pool'
      AND column_name = 'judges_json'
      AND udt_name <> 'jsonb'
  ) THEN
    ALTER TABLE public.event_staff_pool
      ALTER COLUMN judges_json DROP DEFAULT;

    ALTER TABLE public.event_staff_pool
      ALTER COLUMN judges_json TYPE jsonb
      USING (
        CASE
          WHEN judges_json IS NULL OR btrim(judges_json::text) = '' THEN '[]'::jsonb
          WHEN pg_input_is_valid(btrim(judges_json::text), 'jsonb')
            THEN btrim(judges_json::text)::jsonb
          ELSE '[]'::jsonb
        END
      );
  END IF;
END
$$;

ALTER TABLE public.event_staff_pool
  ALTER COLUMN judges_json SET DEFAULT '[]'::jsonb;

ALTER TABLE public.event_staff_pool
  ALTER COLUMN modified_by DROP NOT NULL;

CREATE OR REPLACE FUNCTION api.get_event_judging_pool(p_event_code text)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_event_code text;
  v_judges jsonb;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to view the judging pool.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Only an admin can view the event judging pool.'
    );
  END IF;

  v_event_code := nullif(upper(btrim(COALESCE(p_event_code, ''))), '');

  IF v_event_code IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Event code is required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public."event" AS e
    WHERE e.event_code = v_event_code
  ) THEN
    RETURN json_build_object('ok', false, 'message', 'Event was not found.');
  END IF;

  SELECT coalesce(esp.judges_json, '[]'::jsonb)
  INTO v_judges
  FROM public.event_staff_pool AS esp
  WHERE esp.event_code = v_event_code
  ORDER BY esp.event_staff_pool_id
  LIMIT 1;

  RETURN json_build_object(
    'ok', true,
    'event_code', v_event_code,
    'judges', coalesce(v_judges, '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION api.save_event_judging_pool(
  p_event_code text,
  p_judges json DEFAULT '[]'::json
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, api
AS $$
DECLARE
  v_actor_id bigint;
  v_actor text;
  v_event_code text;
  v_event_id bigint;
  v_event_group_code text;
  v_judges jsonb;
  v_pool_id integer;
BEGIN
  v_actor_id := api.current_user_id();

  IF v_actor_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Sign in to save the judging pool.');
  END IF;

  IF NOT api.has_app_role('ADMIN') THEN
    RETURN json_build_object(
      'ok', false,
      'message', 'Only an admin can save the event judging pool.'
    );
  END IF;

  v_event_code := nullif(upper(btrim(COALESCE(p_event_code, ''))), '');

  IF v_event_code IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Event code is required.');
  END IF;

  SELECT e.event_id, e.event_group_code
  INTO v_event_id, v_event_group_code
  FROM public."event" AS e
  WHERE e.event_code = v_event_code;

  IF v_event_id IS NULL THEN
    RETURN json_build_object('ok', false, 'message', 'Event was not found.');
  END IF;

  IF p_judges IS NULL OR json_typeof(p_judges) <> 'array' THEN
    RETURN json_build_object('ok', false, 'message', 'Judges must be a JSON array.');
  END IF;

  v_judges := coalesce(p_judges::jsonb, '[]'::jsonb);

  v_actor := coalesce(nullif(btrim(api.current_username()), ''), 'admin');
  PERFORM api.set_audit_actor(v_actor);

  SELECT esp.event_staff_pool_id
  INTO v_pool_id
  FROM public.event_staff_pool AS esp
  WHERE esp.event_code = v_event_code
  ORDER BY esp.event_staff_pool_id
  LIMIT 1;

  IF v_pool_id IS NULL THEN
    INSERT INTO public.event_staff_pool (
      event_id,
      event_code,
      event_group_code,
      judges_json,
      is_active,
      created_by
    )
    VALUES (
      v_event_id,
      v_event_code,
      v_event_group_code,
      v_judges,
      1,
      v_actor
    );
  ELSE
    UPDATE public.event_staff_pool AS esp
    SET
      event_id = v_event_id,
      event_group_code = v_event_group_code,
      judges_json = v_judges,
      modified_by = v_actor,
      modified_date = CURRENT_TIMESTAMP
    WHERE esp.event_staff_pool_id = v_pool_id;
  END IF;

  RETURN json_build_object(
    'ok', true,
    'message', 'Judging pool saved.',
    'event_code', v_event_code,
    'judges', v_judges
  );
END;
$$;

REVOKE ALL ON FUNCTION api.get_event_judging_pool(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.get_event_judging_pool(text) TO authenticated;

REVOKE ALL ON FUNCTION api.save_event_judging_pool(text, json) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION api.save_event_judging_pool(text, json) TO authenticated;

NOTIFY pgrst, 'reload schema';
