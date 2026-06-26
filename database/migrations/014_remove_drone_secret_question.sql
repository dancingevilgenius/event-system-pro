-- Remove obsolete secret question from secret_question_lu.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/014_remove_drone_secret_question.sql

\connect event_system_pro

DELETE FROM public.secret_question_lu
WHERE question = 'What did you name your first drone?';
