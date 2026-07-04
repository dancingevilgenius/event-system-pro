-- Copy secret_question_lu rows into a single static_list entry (SECRET_QUESTIONS).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/082_secret_questions_static_list.sql

\connect event_system_pro

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, created_by)
VALUES ('GLOBAL', 'Global', 'Global', 'c-agent')
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
SELECT
  'SECRET_QUESTIONS',
  'GLOBAL',
  'Secret questions for password recovery',
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'key', sq.secret_question_id::text,
          'label', trim(sq.question)
        )
        ORDER BY sq.secret_question_id
      )
      FROM public.secret_question_lu AS sq
    ),
    '[]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

NOTIFY pgrst, 'reload schema';
