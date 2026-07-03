-- Store shortened secret-question prompts in secret_question_lu.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/067_secret_question_truncated_text.sql

\connect event_system_pro

UPDATE public.secret_question_lu SET question = 'Favorite place to visit as a child?' WHERE secret_question_id = 1;
UPDATE public.secret_question_lu SET question = 'Favorite actor?' WHERE secret_question_id = 2;
UPDATE public.secret_question_lu SET question = 'Favorite musician?' WHERE secret_question_id = 3;
UPDATE public.secret_question_lu SET question = 'Name of your pet as a child?' WHERE secret_question_id = 4;
UPDATE public.secret_question_lu SET question = 'In what city were you born?' WHERE secret_question_id = 5;
UPDATE public.secret_question_lu SET question = 'Favorite movie?' WHERE secret_question_id = 6;
UPDATE public.secret_question_lu SET question = 'What street did you grow up on?' WHERE secret_question_id = 7;
UPDATE public.secret_question_lu SET question = 'Color of your first car?' WHERE secret_question_id = 8;
UPDATE public.secret_question_lu SET question = 'Father''s middle name?' WHERE secret_question_id = 9;
UPDATE public.secret_question_lu SET question = 'Mother''s maiden name?' WHERE secret_question_id = 10;
UPDATE public.secret_question_lu SET question = 'First name of the first person you kissed?' WHERE secret_question_id = 11;
UPDATE public.secret_question_lu SET question = 'Guilty pleasure?' WHERE secret_question_id = 12;
UPDATE public.secret_question_lu SET question = 'Name of your best friend in high school?' WHERE secret_question_id = 13;
UPDATE public.secret_question_lu SET question = 'You have 99 problems. What ain''t one of them?' WHERE secret_question_id = 14;
UPDATE public.secret_question_lu SET question = 'Name of your elementary school?' WHERE secret_question_id = 15;
UPDATE public.secret_question_lu SET question = 'Childhood nickname?' WHERE secret_question_id = 16;
UPDATE public.secret_question_lu SET question = 'Make and model of your first car?' WHERE secret_question_id = 17;
UPDATE public.secret_question_lu SET question = 'Name of your first employer?' WHERE secret_question_id = 18;
UPDATE public.secret_question_lu SET question = 'First concert you attended?' WHERE secret_question_id = 19;
UPDATE public.secret_question_lu SET question = 'Favorite food as a child?' WHERE secret_question_id = 20;
UPDATE public.secret_question_lu SET question = 'Name of your favorite teacher?' WHERE secret_question_id = 21;
UPDATE public.secret_question_lu SET question = 'First album you bought?' WHERE secret_question_id = 22;
UPDATE public.secret_question_lu SET question = 'Name of the town where your parents met?' WHERE secret_question_id = 23;
UPDATE public.secret_question_lu SET question = 'Name of your first stuffed animal or toy?' WHERE secret_question_id = 24;

NOTIFY pgrst, 'reload schema';
