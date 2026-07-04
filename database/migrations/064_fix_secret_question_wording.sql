-- Fix spelling/grammar in secret_question_lu prompts.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/064_fix_secret_question_wording.sql

\connect event_system_pro

UPDATE public.secret_question_lu
SET question = 'What was the name of your pet as a child?'
WHERE secret_question_id = 4;

UPDATE public.secret_question_lu
SET question = 'What is your guilty pleasure?'
WHERE secret_question_id = 12;

UPDATE public.secret_question_lu
SET question = 'You have 99 problems. What ain''t one of them?'
WHERE secret_question_id = 14;

NOTIFY pgrst, 'reload schema';
