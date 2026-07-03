-- Shorten four secret-question prompts.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/068_shorten_secret_questions.sql

\connect event_system_pro

UPDATE public.secret_question_lu
SET question = 'First name of your first kiss?'
WHERE secret_question_id = 11;

UPDATE public.secret_question_lu
SET question = 'Name of best friend in high school'
WHERE secret_question_id = 13;

UPDATE public.secret_question_lu
SET question = 'Town where your parents met?'
WHERE secret_question_id = 23;

UPDATE public.secret_question_lu
SET question = 'Name of your childhood toy?'
WHERE secret_question_id = 24;

NOTIFY pgrst, 'reload schema';
