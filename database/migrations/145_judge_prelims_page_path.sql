-- Point the prelims coaching lesson at /judge-prelims.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/145_judge_prelims_page_path.sql

\connect event_system_pro

UPDATE public.training_instructions
SET
  page_path = '/judge-prelims',
  steps_json = jsonb_set(steps_json, '{page}', to_jsonb('/judge-prelims'::text)),
  modified_by = 'c-agent',
  modified_date = CURRENT_TIMESTAMP
WHERE instruction_code = 'PRELIMS_MARKS'
  AND (
    page_path = '/prelims'
    OR steps_json->>'page' = '/prelims'
  );
