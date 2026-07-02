-- Copy us_state_lu rows into a single static_list entry (US_STATES).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/051_us_states_static_list.sql

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, created_by)
VALUES ('US', 'United States', 'US', 'c-agent')
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
SELECT
  'US_STATES',
  'US',
  'United States states and territories',
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'key', trim(s.code),
          'label', s.name
        )
        ORDER BY s.id
      )
      FROM public.us_state_lu AS s
    ),
    '[]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

NOTIFY pgrst, 'reload schema';
