-- Remove bad superhero seed usernames (dc/marvel collision suffixes, youngblood prefix,
-- wonderwomanwonderwoman, and any username containing digits).
-- Safe to re-run; re-apply 005_user_superheroes.sql afterward for replacements.

\connect event_system_pro

DELETE FROM public.attendee a
USING public."user" u
WHERE a.user_id = u.user_id
  AND u.email LIKE '%@superhero.com'
  AND (
    u.username = 'wonderwomanwonderwoman'
    OR u.username LIKE 'youngblood%'
    OR u.username ~ '\d'
    OR (
      u.username ~ '(?i)(dc|marvel)$' AND u.username NOT IN (
        'captainmarvel', 'msmarvel', 'bluemarvel', 'marvelgirl', 'marvelboy'
      )
    )
  );

DELETE FROM public."user"
WHERE email LIKE '%@superhero.com'
  AND (
    username = 'wonderwomanwonderwoman'
    OR username LIKE 'youngblood%'
    OR username ~ '\d'
    OR (
      username ~ '(?i)(dc|marvel)$' AND username NOT IN (
        'captainmarvel', 'msmarvel', 'bluemarvel', 'marvelgirl', 'marvelboy'
      )
    )
  );

SELECT COUNT(*) AS superhero_users_remaining
FROM public."user"
WHERE email LIKE '%@superhero.com';
