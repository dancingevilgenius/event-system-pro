-- Rename prelims coaching copy from Maybe to Alternate.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/140_prelims_alternate_label.sql

\connect event_system_pro

UPDATE public.training_instructions
SET steps_json = replace(steps_json::text, 'Maybe', 'Alternate')::jsonb
WHERE instruction_code = 'PRELIMS_MARKS'
  AND position('Maybe' in steps_json::text) > 0;
