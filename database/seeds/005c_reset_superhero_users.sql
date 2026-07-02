-- Reset superhero seed users to match 005_user_superheroes.sql exactly (1000 rows).
-- 1) psql -U postgres -d event_system_pro -f database/seeds/005b_cleanup_bad_superhero_usernames.sql  (optional upgrade)
-- 2) Delete all @superhero.com users + linked attendees, then re-run 005_user_superheroes.sql

\connect event_system_pro

DELETE FROM public.attendee a
USING public."user" u
WHERE a.user_id = u.user_id
  AND u.email LIKE '%@superhero.com';

DELETE FROM public."user"
WHERE email LIKE '%@superhero.com';
