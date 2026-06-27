CREATE EXTENSION IF NOT EXISTS pgcrypto;
UPDATE public."user"
SET password_encrypted = crypt('ChangeMeOnFirstLogin!', gen_salt('bf'))
WHERE username = 'dancingevilgenius';
