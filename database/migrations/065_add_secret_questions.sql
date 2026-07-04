-- Add 11 secret questions (IDs 13 and 15–24) for a 24-question pool.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/065_add_secret_questions.sql

\connect event_system_pro

INSERT INTO public.secret_question_lu (secret_question_id, question)
OVERRIDING SYSTEM VALUE
VALUES
  (13, 'What was the name of your best friend in high school?'),
  (15, 'What was the name of your elementary school?'),
  (16, 'What was your childhood nickname?'),
  (17, 'What was the make and model of your first car?'),
  (18, 'What was the name of your first employer?'),
  (19, 'What was the first concert you attended?'),
  (20, 'What was your favorite food as a child?'),
  (21, 'What was the name of your favorite teacher?'),
  (22, 'What was the first album you bought?'),
  (23, 'What is the name of the town where your parents met?'),
  (24, 'What was the name of your first stuffed animal or toy?')
ON CONFLICT (secret_question_id) DO UPDATE
SET
  question = EXCLUDED.question,
  modified_date = CURRENT_TIMESTAMP,
  modified_by = 'c-agent';

SELECT setval(
  pg_get_serial_sequence('public.secret_question_lu', 'secret_question_id'),
  COALESCE((SELECT MAX(secret_question_id) FROM public.secret_question_lu), 1)
);

NOTIFY pgrst, 'reload schema';
