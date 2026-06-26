-- 200 Marvel and DC superhero seed users for local development.
-- Username and plaintext password are identical; password is bcrypt-hashed on insert.
-- Safe to re-run: skips rows when username already exists.
--
--   psql -U postgres -d event_system_pro -f database/seeds/005_user_superheroes.sql

\connect event_system_pro

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'superman',
  crypt('superman', gen_salt('bf')),
  '{"prefix": null, "first": "Clark", "middle": null, "last": "Kent", "suffix": null, "display": "Clark Kent"}'::json,
  'superman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000000", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "344 Clinton St", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10000", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'superman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'batman',
  crypt('batman', gen_salt('bf')),
  '{"prefix": null, "first": "Bruce", "middle": null, "last": "Wayne", "suffix": null, "display": "Bruce Wayne"}'::json,
  'batman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000001", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "1007 Mountain Drive", "line2": null, "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10001", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'batman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'wonderwoman',
  crypt('wonderwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Diana", "middle": null, "last": "Prince", "suffix": null, "display": "Diana Prince"}'::json,
  'wonderwoman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000002", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "1600 Pennsylvania Ave NW", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10002", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wonderwoman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'flash',
  crypt('flash', gen_salt('bf')),
  '{"prefix": null, "first": "Barry", "middle": null, "last": "Allen", "suffix": null, "display": "Barry Allen"}'::json,
  'flash@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000003", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "2121 Main St", "line2": null, "city": "Central City", "state_or_province": "MO", "postal_code": "10003", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'flash'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'greenlantern',
  crypt('greenlantern', gen_salt('bf')),
  '{"prefix": null, "first": "Hal", "middle": null, "last": "Jordan", "suffix": null, "display": "Hal Jordan"}'::json,
  'greenlantern@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000004", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "1200 Coast Blvd", "line2": null, "city": "Coast City", "state_or_province": "CA", "postal_code": "10004", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'greenlantern'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'aquaman',
  crypt('aquaman', gen_salt('bf')),
  '{"prefix": null, "first": "Arthur", "middle": null, "last": "Curry", "suffix": null, "display": "Arthur Curry"}'::json,
  'aquaman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000005", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "green"}'::json,
  '[{"label": "home", "line1": "Atlantean Embassy", "line2": null, "city": "Atlantis", "state_or_province": "FL", "postal_code": "10005", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'aquaman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'cyborg',
  crypt('cyborg', gen_salt('bf')),
  '{"prefix": null, "first": "Victor", "middle": null, "last": "Stone", "suffix": null, "display": "Victor Stone"}'::json,
  'cyborg@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000006", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "red"}'::json,
  '[{"label": "home", "line1": "106 Hero Lane", "line2": null, "city": "Detroit", "state_or_province": "MI", "postal_code": "10006", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cyborg'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'shazam',
  crypt('shazam', gen_salt('bf')),
  '{"prefix": null, "first": "Billy", "middle": null, "last": "Batson", "suffix": null, "display": "Billy Batson"}'::json,
  'shazam@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000007", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "107 Hero Lane", "line2": null, "city": "Fawcett City", "state_or_province": "IN", "postal_code": "10007", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shazam'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'robin',
  crypt('robin', gen_salt('bf')),
  '{"prefix": null, "first": "Dick", "middle": null, "last": "Grayson", "suffix": null, "display": "Dick Grayson"}'::json,
  'robin@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000008", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "green"}'::json,
  '[{"label": "home", "line1": "108 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10008", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'robin'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'nightwing',
  crypt('nightwing', gen_salt('bf')),
  '{"prefix": null, "first": "Dick", "middle": null, "last": "Grayson", "suffix": null, "display": "Dick Grayson"}'::json,
  'nightwing@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000009", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "1 Bludhaven Pier", "line2": null, "city": "Bludhaven", "state_or_province": "NJ", "postal_code": "10009", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nightwing'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'batgirl',
  crypt('batgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Barbara", "middle": null, "last": "Gordon", "suffix": null, "display": "Barbara Gordon"}'::json,
  'batgirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000010", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "110 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10010", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'batgirl'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'supergirl',
  crypt('supergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Kara", "middle": null, "last": "Zor-El", "suffix": null, "display": "Kara Zor-El"}'::json,
  'supergirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000011", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "111 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10011", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'supergirl'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'greenarrow',
  crypt('greenarrow', gen_salt('bf')),
  '{"prefix": null, "first": "Oliver", "middle": null, "last": "Queen", "suffix": null, "display": "Oliver Queen"}'::json,
  'greenarrow@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000012", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "1401 Starling Ave", "line2": null, "city": "Star City", "state_or_province": "WA", "postal_code": "10012", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'greenarrow'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blackcanary',
  crypt('blackcanary', gen_salt('bf')),
  '{"prefix": null, "first": "Dinah", "middle": null, "last": "Lance", "suffix": null, "display": "Dinah Lance"}'::json,
  'blackcanary@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000013", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "113 Hero Lane", "line2": "Star City HQ", "city": "Star City", "state_or_province": "WA", "postal_code": "10013", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackcanary'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'martianmanhunter',
  crypt('martianmanhunter', gen_salt('bf')),
  '{"prefix": null, "first": "J''onn", "middle": null, "last": "J''onzz", "suffix": null, "display": "J''onn J''onzz"}'::json,
  'martianmanhunter@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000014", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "114 Hero Lane", "line2": null, "city": "Middleton", "state_or_province": "CO", "postal_code": "10014", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'martianmanhunter'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'hawkman',
  crypt('hawkman', gen_salt('bf')),
  '{"prefix": null, "first": "Carter", "middle": null, "last": "Hall", "suffix": null, "display": "Carter Hall"}'::json,
  'hawkman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000015", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "115 Hero Lane", "line2": null, "city": "St. Roch", "state_or_province": "LA", "postal_code": "10015", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hawkman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'hawkgirl',
  crypt('hawkgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Shayera", "middle": null, "last": "Hol", "suffix": null, "display": "Shayera Hol"}'::json,
  'hawkgirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000016", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "116 Hero Lane", "line2": null, "city": "St. Roch", "state_or_province": "LA", "postal_code": "10016", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hawkgirl'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'zatanna',
  crypt('zatanna', gen_salt('bf')),
  '{"prefix": null, "first": "Zatanna", "middle": null, "last": "Zatara", "suffix": null, "display": "Zatanna Zatara"}'::json,
  'zatanna@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000017", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "117 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10017", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'zatanna'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'constantine',
  crypt('constantine', gen_salt('bf')),
  '{"prefix": null, "first": "John", "middle": null, "last": "Constantine", "suffix": null, "display": "John Constantine"}'::json,
  'constantine@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000018", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "beige", "color2": "black"}'::json,
  '[{"label": "home", "line1": "118 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10018", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'constantine'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'raven',
  crypt('raven', gen_salt('bf')),
  '{"prefix": null, "first": "Rachel", "middle": null, "last": "Roth", "suffix": null, "display": "Rachel Roth"}'::json,
  'raven@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000019", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "indigo", "color2": "black"}'::json,
  '[{"label": "home", "line1": "119 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10019", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'raven'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'starfire',
  crypt('starfire', gen_salt('bf')),
  '{"prefix": null, "first": "Koriand''r", "middle": null, "last": "Andr", "suffix": null, "display": "Koriand''r Andr"}'::json,
  'starfire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000020", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "120 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10020", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'starfire'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'beastboy',
  crypt('beastboy', gen_salt('bf')),
  '{"prefix": null, "first": "Garfield", "middle": null, "last": "Logan", "suffix": null, "display": "Garfield Logan"}'::json,
  'beastboy@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000021", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "121 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10021", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'beastboy'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'redhood',
  crypt('redhood', gen_salt('bf')),
  '{"prefix": null, "first": "Jason", "middle": null, "last": "Todd", "suffix": null, "display": "Jason Todd"}'::json,
  'redhood@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000022", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "122 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10022", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'redhood'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'harleyquinn',
  crypt('harleyquinn', gen_salt('bf')),
  '{"prefix": null, "first": "Harleen", "middle": null, "last": "Quinzel", "suffix": null, "display": "Harleen Quinzel"}'::json,
  'harleyquinn@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000023", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "123 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10023", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'harleyquinn'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'joker',
  crypt('joker', gen_salt('bf')),
  '{"prefix": null, "first": "Jack", "middle": null, "last": "Napier", "suffix": null, "display": "Jack Napier"}'::json,
  'joker@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000024", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "green"}'::json,
  '[{"label": "home", "line1": "124 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10024", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'joker'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'catwoman',
  crypt('catwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Selina", "middle": null, "last": "Kyle", "suffix": null, "display": "Selina Kyle"}'::json,
  'catwoman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000025", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "125 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10025", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'catwoman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'poisonivy',
  crypt('poisonivy', gen_salt('bf')),
  '{"prefix": null, "first": "Pamela", "middle": null, "last": "Isley", "suffix": null, "display": "Pamela Isley"}'::json,
  'poisonivy@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000026", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "126 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10026", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'poisonivy'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'twoface',
  crypt('twoface', gen_salt('bf')),
  '{"prefix": null, "first": "Harvey", "middle": null, "last": "Dent", "suffix": null, "display": "Harvey Dent"}'::json,
  'twoface@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000027", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "127 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10027", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'twoface'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'riddler',
  crypt('riddler', gen_salt('bf')),
  '{"prefix": null, "first": "Edward", "middle": null, "last": "Nygma", "suffix": null, "display": "Edward Nygma"}'::json,
  'riddler@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000028", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "128 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10028", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'riddler'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'scarecrow',
  crypt('scarecrow', gen_salt('bf')),
  '{"prefix": null, "first": "Jonathan", "middle": null, "last": "Crane", "suffix": null, "display": "Jonathan Crane"}'::json,
  'scarecrow@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000029", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "129 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10029", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'scarecrow'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'bane',
  crypt('bane', gen_salt('bf')),
  '{"prefix": null, "first": "Antonio", "middle": null, "last": "Daggett", "suffix": null, "display": "Antonio Daggett"}'::json,
  'bane@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000030", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "green"}'::json,
  '[{"label": "home", "line1": "130 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10030", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bane'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'darkseid',
  crypt('darkseid', gen_salt('bf')),
  '{"prefix": null, "first": "Uxas", "middle": null, "last": "Darkseid", "suffix": null, "display": "Uxas Darkseid"}'::json,
  'darkseid@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000031", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "131 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10031", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'darkseid'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'brainiac',
  crypt('brainiac', gen_salt('bf')),
  '{"prefix": null, "first": "Vril", "middle": null, "last": "Dox", "suffix": null, "display": "Vril Dox"}'::json,
  'brainiac@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000032", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "132 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10032", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'brainiac'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'lexluthor',
  crypt('lexluthor', gen_salt('bf')),
  '{"prefix": null, "first": "Alexander", "middle": null, "last": "Luthor", "suffix": null, "display": "Alexander Luthor"}'::json,
  'lexluthor@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000033", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "green"}'::json,
  '[{"label": "home", "line1": "LexCorp Plaza", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10033", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lexluthor'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'deathstroke',
  crypt('deathstroke', gen_salt('bf')),
  '{"prefix": null, "first": "Slade", "middle": null, "last": "Wilson", "suffix": null, "display": "Slade Wilson"}'::json,
  'deathstroke@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000034", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "black"}'::json,
  '[{"label": "home", "line1": "134 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10034", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'deathstroke'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blackadam',
  crypt('blackadam', gen_salt('bf')),
  '{"prefix": null, "first": "Teth", "middle": null, "last": "Adam", "suffix": null, "display": "Teth Adam"}'::json,
  'blackadam@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000035", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "135 Hero Lane", "line2": null, "city": "Kahndaq", "state_or_province": "IL", "postal_code": "10035", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackadam'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'captaincold',
  crypt('captaincold', gen_salt('bf')),
  '{"prefix": null, "first": "Leonard", "middle": null, "last": "Snart", "suffix": null, "display": "Leonard Snart"}'::json,
  'captaincold@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000036", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "136 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10036", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'captaincold'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'reverseflash',
  crypt('reverseflash', gen_salt('bf')),
  '{"prefix": null, "first": "Eobard", "middle": null, "last": "Thawne", "suffix": null, "display": "Eobard Thawne"}'::json,
  'reverseflash@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000037", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "red"}'::json,
  '[{"label": "home", "line1": "137 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10037", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'reverseflash'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'kidflash',
  crypt('kidflash', gen_salt('bf')),
  '{"prefix": null, "first": "Wally", "middle": null, "last": "West", "suffix": null, "display": "Wally West"}'::json,
  'kidflash@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000038", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "138 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10038", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kidflash'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'bluebeetle',
  crypt('bluebeetle', gen_salt('bf')),
  '{"prefix": null, "first": "Jaime", "middle": null, "last": "Reyes", "suffix": null, "display": "Jaime Reyes"}'::json,
  'bluebeetle@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000039", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "139 Hero Lane", "line2": null, "city": "El Paso", "state_or_province": "TX", "postal_code": "10039", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bluebeetle'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'boostergold',
  crypt('boostergold', gen_salt('bf')),
  '{"prefix": null, "first": "Michael", "middle": null, "last": "Carter", "suffix": null, "display": "Michael Carter"}'::json,
  'boostergold@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000040", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "140 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10040", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'boostergold'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'question',
  crypt('question', gen_salt('bf')),
  '{"prefix": null, "first": "Vic", "middle": null, "last": "Sage", "suffix": null, "display": "Vic Sage"}'::json,
  'question@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000041", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "141 Hero Lane", "line2": null, "city": "Hub City", "state_or_province": "IL", "postal_code": "10041", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'question'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'phantomstranger',
  crypt('phantomstranger', gen_salt('bf')),
  '{"prefix": null, "first": "Jim", "middle": null, "last": "Corrigan", "suffix": null, "display": "Jim Corrigan"}'::json,
  'phantomstranger@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000042", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "142 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10042", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'phantomstranger'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'deadman',
  crypt('deadman', gen_salt('bf')),
  '{"prefix": null, "first": "Boston", "middle": null, "last": "Brand", "suffix": null, "display": "Boston Brand"}'::json,
  'deadman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000043", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "143 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10043", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'deadman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'swampthing',
  crypt('swampthing', gen_salt('bf')),
  '{"prefix": null, "first": "Alec", "middle": null, "last": "Holland", "suffix": null, "display": "Alec Holland"}'::json,
  'swampthing@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000044", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "144 Hero Lane", "line2": null, "city": "New Orleans", "state_or_province": "LA", "postal_code": "10044", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'swampthing'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'spectre',
  crypt('spectre', gen_salt('bf')),
  '{"prefix": null, "first": "Jim", "middle": null, "last": "Corrigan", "suffix": null, "display": "Jim Corrigan"}'::json,
  'spectre@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000045", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "green"}'::json,
  '[{"label": "home", "line1": "145 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10045", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spectre'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'doctorfate',
  crypt('doctorfate', gen_salt('bf')),
  '{"prefix": null, "first": "Kent", "middle": null, "last": "Nelson", "suffix": null, "display": "Kent Nelson"}'::json,
  'doctorfate@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000046", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "146 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10046", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'doctorfate'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'mistermiracle',
  crypt('mistermiracle', gen_salt('bf')),
  '{"prefix": null, "first": "Scott", "middle": null, "last": "Free", "suffix": null, "display": "Scott Free"}'::json,
  'mistermiracle@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000047", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "147 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10047", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mistermiracle'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'bigbarda',
  crypt('bigbarda', gen_salt('bf')),
  '{"prefix": null, "first": "Barda", "middle": null, "last": "Free", "suffix": null, "display": "Barda Free"}'::json,
  'bigbarda@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000048", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "148 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10048", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bigbarda'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'orion',
  crypt('orion', gen_salt('bf')),
  '{"prefix": null, "first": "Orion", "middle": null, "last": "New Genesis", "suffix": null, "display": "Orion New Genesis"}'::json,
  'orion@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000049", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "149 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10049", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'orion'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'lobo',
  crypt('lobo', gen_salt('bf')),
  '{"prefix": null, "first": "Lobo", "middle": null, "last": "Czarnia", "suffix": null, "display": "Lobo Czarnia"}'::json,
  'lobo@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000050", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "150 Hero Lane", "line2": null, "city": "Las Vegas", "state_or_province": "NV", "postal_code": "10050", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lobo'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'static',
  crypt('static', gen_salt('bf')),
  '{"prefix": null, "first": "Virgil", "middle": null, "last": "Hawkins", "suffix": null, "display": "Virgil Hawkins"}'::json,
  'static@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000051", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "151 Hero Lane", "line2": null, "city": "Dakota City", "state_or_province": "MO", "postal_code": "10051", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'static'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blacklightning',
  crypt('blacklightning', gen_salt('bf')),
  '{"prefix": null, "first": "Jefferson", "middle": null, "last": "Pierce", "suffix": null, "display": "Jefferson Pierce"}'::json,
  'blacklightning@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000052", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "152 Hero Lane", "line2": null, "city": "Freeland", "state_or_province": "MD", "postal_code": "10052", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blacklightning'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'vixen',
  crypt('vixen', gen_salt('bf')),
  '{"prefix": null, "first": "Mari", "middle": null, "last": "McCabe", "suffix": null, "display": "Mari McCabe"}'::json,
  'vixen@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000053", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "153 Hero Lane", "line2": null, "city": "Detroit", "state_or_province": "MI", "postal_code": "10053", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'vixen'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'firestorm',
  crypt('firestorm', gen_salt('bf')),
  '{"prefix": null, "first": "Ronnie", "middle": null, "last": "Raymond", "suffix": null, "display": "Ronnie Raymond"}'::json,
  'firestorm@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000054", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "154 Hero Lane", "line2": null, "city": "Pittsburgh", "state_or_province": "PA", "postal_code": "10054", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'firestorm'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'atom',
  crypt('atom', gen_salt('bf')),
  '{"prefix": null, "first": "Ray", "middle": null, "last": "Palmer", "suffix": null, "display": "Ray Palmer"}'::json,
  'atom@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000055", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "155 Hero Lane", "line2": null, "city": "Ivy Town", "state_or_province": "CT", "postal_code": "10055", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'atom'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'stargirl',
  crypt('stargirl', gen_salt('bf')),
  '{"prefix": null, "first": "Courtney", "middle": null, "last": "Whitmore", "suffix": null, "display": "Courtney Whitmore"}'::json,
  'stargirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000056", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "156 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10056", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'stargirl'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'drmidnite',
  crypt('drmidnite', gen_salt('bf')),
  '{"prefix": null, "first": "Charles", "middle": null, "last": "McNider", "suffix": null, "display": "Charles McNider"}'::json,
  'drmidnite@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000057", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "157 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10057", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'drmidnite'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'sandman',
  crypt('sandman', gen_salt('bf')),
  '{"prefix": null, "first": "Wesley", "middle": null, "last": "Dodds", "suffix": null, "display": "Wesley Dodds"}'::json,
  'sandman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000058", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "158 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10058", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sandman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'wildcat',
  crypt('wildcat', gen_salt('bf')),
  '{"prefix": null, "first": "Ted", "middle": null, "last": "Grant", "suffix": null, "display": "Ted Grant"}'::json,
  'wildcat@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000059", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "159 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10059", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wildcat'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'hourman',
  crypt('hourman', gen_salt('bf')),
  '{"prefix": null, "first": "Rex", "middle": null, "last": "Tyler", "suffix": null, "display": "Rex Tyler"}'::json,
  'hourman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000060", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "160 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10060", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hourman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'doctormidnite',
  crypt('doctormidnite', gen_salt('bf')),
  '{"prefix": null, "first": "Pieter", "middle": null, "last": "Cross", "suffix": null, "display": "Pieter Cross"}'::json,
  'doctormidnite@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000061", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "161 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10061", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'doctormidnite'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'redtornado',
  crypt('redtornado', gen_salt('bf')),
  '{"prefix": null, "first": "John", "middle": null, "last": "Smith", "suffix": null, "display": "John Smith"}'::json,
  'redtornado@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000062", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "162 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10062", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'redtornado'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'plasticman',
  crypt('plasticman', gen_salt('bf')),
  '{"prefix": null, "first": "Patrick", "middle": null, "last": "O''Brian", "suffix": null, "display": "Patrick O''Brian"}'::json,
  'plasticman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000063", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "163 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10063", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'plasticman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'elongatedman',
  crypt('elongatedman', gen_salt('bf')),
  '{"prefix": null, "first": "Ralph", "middle": null, "last": "Dibny", "suffix": null, "display": "Ralph Dibny"}'::json,
  'elongatedman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000064", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "164 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10064", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'elongatedman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'metamorpho',
  crypt('metamorpho', gen_salt('bf')),
  '{"prefix": null, "first": "Rex", "middle": null, "last": "Mason", "suffix": null, "display": "Rex Mason"}'::json,
  'metamorpho@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000065", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "165 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10065", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'metamorpho'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'doompatrolrobotman',
  crypt('doompatrolrobotman', gen_salt('bf')),
  '{"prefix": null, "first": "Cliff", "middle": null, "last": "Steele", "suffix": null, "display": "Cliff Steele"}'::json,
  'doompatrolrobotman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000066", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "166 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10066", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'doompatrolrobotman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'negativeman',
  crypt('negativeman', gen_salt('bf')),
  '{"prefix": null, "first": "Larry", "middle": null, "last": "Trainor", "suffix": null, "display": "Larry Trainor"}'::json,
  'negativeman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000067", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "167 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10067", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'negativeman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'crazyjane',
  crypt('crazyjane', gen_salt('bf')),
  '{"prefix": null, "first": "Kay", "middle": null, "last": "Challis", "suffix": null, "display": "Kay Challis"}'::json,
  'crazyjane@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000068", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "168 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10068", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'crazyjane'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'animalman',
  crypt('animalman', gen_salt('bf')),
  '{"prefix": null, "first": "Buddy", "middle": null, "last": "Baker", "suffix": null, "display": "Buddy Baker"}'::json,
  'animalman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000069", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "169 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10069", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'animalman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'kamandi',
  crypt('kamandi', gen_salt('bf')),
  '{"prefix": null, "first": "Kamandi", "middle": null, "last": "Last Boy", "suffix": null, "display": "Kamandi Last Boy"}'::json,
  'kamandi@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000070", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "170 Hero Lane", "line2": null, "city": "Command D", "state_or_province": "NY", "postal_code": "10070", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kamandi'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'jonahhex',
  crypt('jonahhex', gen_salt('bf')),
  '{"prefix": null, "first": "Jonah", "middle": null, "last": "Hex", "suffix": null, "display": "Jonah Hex"}'::json,
  'jonahhex@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000071", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "171 Hero Lane", "line2": null, "city": "Confederate Territory", "state_or_province": "TX", "postal_code": "10071", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jonahhex'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'lucifermorningstar',
  crypt('lucifermorningstar', gen_salt('bf')),
  '{"prefix": null, "first": "Lucifer", "middle": null, "last": "Morningstar", "suffix": null, "display": "Lucifer Morningstar"}'::json,
  'lucifermorningstar@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000072", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "172 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10072", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lucifermorningstar'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'deadshot',
  crypt('deadshot', gen_salt('bf')),
  '{"prefix": null, "first": "Floyd", "middle": null, "last": "Lawton", "suffix": null, "display": "Floyd Lawton"}'::json,
  'deadshot@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000073", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "173 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10073", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'deadshot'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'captainboomerang',
  crypt('captainboomerang', gen_salt('bf')),
  '{"prefix": null, "first": "George", "middle": null, "last": "Harkness", "suffix": null, "display": "George Harkness"}'::json,
  'captainboomerang@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000074", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "174 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10074", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'captainboomerang'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'enchantress',
  crypt('enchantress', gen_salt('bf')),
  '{"prefix": null, "first": "June", "middle": null, "last": "Moone", "suffix": null, "display": "June Moone"}'::json,
  'enchantress@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000075", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "175 Hero Lane", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10075", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'enchantress'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'killerfrost',
  crypt('killerfrost', gen_salt('bf')),
  '{"prefix": null, "first": "Caitlin", "middle": null, "last": "Snow", "suffix": null, "display": "Caitlin Snow"}'::json,
  'killerfrost@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000076", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "176 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10076", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'killerfrost'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'fire',
  crypt('fire', gen_salt('bf')),
  '{"prefix": null, "first": "Beatriz", "middle": null, "last": "da Costa", "suffix": null, "display": "Beatriz da Costa"}'::json,
  'fire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000077", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "177 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10077", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'fire'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'ice',
  crypt('ice', gen_salt('bf')),
  '{"prefix": null, "first": "Tora", "middle": null, "last": "Olafsdotter", "suffix": null, "display": "Tora Olafsdotter"}'::json,
  'ice@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000078", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "178 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10078", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ice'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'powergirl',
  crypt('powergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Kara", "middle": null, "last": "Zor-L", "suffix": null, "display": "Kara Zor-L"}'::json,
  'powergirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000079", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "179 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10079", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'powergirl'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'huntress',
  crypt('huntress', gen_salt('bf')),
  '{"prefix": null, "first": "Helena", "middle": null, "last": "Bertinelli", "suffix": null, "display": "Helena Bertinelli"}'::json,
  'huntress@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000080", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "180 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10080", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'huntress'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'batwoman',
  crypt('batwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Kate", "middle": null, "last": "Kane", "suffix": null, "display": "Kate Kane"}'::json,
  'batwoman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000081", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "181 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10081", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'batwoman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'reneree',
  crypt('reneree', gen_salt('bf')),
  '{"prefix": null, "first": "Renee", "middle": null, "last": "Montoya", "suffix": null, "display": "Renee Montoya"}'::json,
  'reneree@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000082", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "black"}'::json,
  '[{"label": "home", "line1": "182 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10082", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'reneree'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'oracle',
  crypt('oracle', gen_salt('bf')),
  '{"prefix": null, "first": "Barbara", "middle": null, "last": "Gordon", "suffix": null, "display": "Barbara Gordon"}'::json,
  'oracle@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000083", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "183 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10083", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'oracle'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'timdrake',
  crypt('timdrake', gen_salt('bf')),
  '{"prefix": null, "first": "Tim", "middle": null, "last": "Drake", "suffix": null, "display": "Tim Drake"}'::json,
  'timdrake@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000084", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "184 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10084", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'timdrake'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'damianwayne',
  crypt('damianwayne', gen_salt('bf')),
  '{"prefix": null, "first": "Damian", "middle": null, "last": "Wayne", "suffix": null, "display": "Damian Wayne"}'::json,
  'damianwayne@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000085", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "185 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10085", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'damianwayne'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'stephaniebrown',
  crypt('stephaniebrown', gen_salt('bf')),
  '{"prefix": null, "first": "Stephanie", "middle": null, "last": "Brown", "suffix": null, "display": "Stephanie Brown"}'::json,
  'stephaniebrown@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000086", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "186 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10086", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'stephaniebrown'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'cassandracain',
  crypt('cassandracain', gen_salt('bf')),
  '{"prefix": null, "first": "Cassandra", "middle": null, "last": "Cain", "suffix": null, "display": "Cassandra Cain"}'::json,
  'cassandracain@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000087", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "187 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10087", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cassandracain'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blackmanta',
  crypt('blackmanta', gen_salt('bf')),
  '{"prefix": null, "first": "David", "middle": null, "last": "Hyde", "suffix": null, "display": "David Hyde"}'::json,
  'blackmanta@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000088", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "188 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10088", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackmanta'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'oceanmaster',
  crypt('oceanmaster', gen_salt('bf')),
  '{"prefix": null, "first": "Orm", "middle": null, "last": "Curry", "suffix": null, "display": "Orm Curry"}'::json,
  'oceanmaster@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000089", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "189 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10089", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'oceanmaster'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'sinestro',
  crypt('sinestro', gen_salt('bf')),
  '{"prefix": null, "first": "Thaal", "middle": null, "last": "Sinestro", "suffix": null, "display": "Thaal Sinestro"}'::json,
  'sinestro@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000090", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "190 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10090", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sinestro'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'atrocitus',
  crypt('atrocitus', gen_salt('bf')),
  '{"prefix": null, "first": "Atrocitus", "middle": null, "last": "Rage", "suffix": null, "display": "Atrocitus Rage"}'::json,
  'atrocitus@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000091", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "191 Hero Lane", "line2": null, "city": "Ysmault", "state_or_province": "NV", "postal_code": "10091", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'atrocitus'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'saintwalker',
  crypt('saintwalker', gen_salt('bf')),
  '{"prefix": null, "first": "Bro''Dee", "middle": null, "last": "Walker", "suffix": null, "display": "Bro''Dee Walker"}'::json,
  'saintwalker@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000092", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "192 Hero Lane", "line2": null, "city": "Odym", "state_or_province": "CO", "postal_code": "10092", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'saintwalker'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'starsapphire',
  crypt('starsapphire', gen_salt('bf')),
  '{"prefix": null, "first": "Carol", "middle": null, "last": "Ferris", "suffix": null, "display": "Carol Ferris"}'::json,
  'starsapphire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000093", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "violet", "color2": "white"}'::json,
  '[{"label": "home", "line1": "193 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10093", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'starsapphire'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'lobohunter',
  crypt('lobohunter', gen_salt('bf')),
  '{"prefix": null, "first": "Lobo", "middle": null, "last": "Hunter", "suffix": null, "display": "Lobo Hunter"}'::json,
  'lobohunter@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000094", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "194 Hero Lane", "line2": null, "city": "Las Vegas", "state_or_province": "NV", "postal_code": "10094", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lobohunter'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'grannygoodness',
  crypt('grannygoodness', gen_salt('bf')),
  '{"prefix": null, "first": "Granny", "middle": null, "last": "Goodness", "suffix": null, "display": "Granny Goodness"}'::json,
  'grannygoodness@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000095", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "195 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10095", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'grannygoodness'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'steppenwolf',
  crypt('steppenwolf', gen_salt('bf')),
  '{"prefix": null, "first": "Steppen", "middle": null, "last": "Wolf", "suffix": null, "display": "Steppen Wolf"}'::json,
  'steppenwolf@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000096", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "196 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10096", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'steppenwolf'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'parademon',
  crypt('parademon', gen_salt('bf')),
  '{"prefix": null, "first": "Parademon", "middle": null, "last": "Apokolips", "suffix": null, "display": "Parademon Apokolips"}'::json,
  'parademon@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000097", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "red"}'::json,
  '[{"label": "home", "line1": "197 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10097", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'parademon'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'ironman',
  crypt('ironman', gen_salt('bf')),
  '{"prefix": null, "first": "Tony", "middle": null, "last": "Stark", "suffix": null, "display": "Tony Stark"}'::json,
  'ironman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000098", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "10880 Malibu Point", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10098", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ironman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'captainamerica',
  crypt('captainamerica', gen_salt('bf')),
  '{"prefix": null, "first": "Steve", "middle": null, "last": "Rogers", "suffix": null, "display": "Steve Rogers"}'::json,
  'captainamerica@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000099", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "569 Leaman Pl", "line2": null, "city": "Brooklyn", "state_or_province": "NY", "postal_code": "10099", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'captainamerica'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'spiderman',
  crypt('spiderman', gen_salt('bf')),
  '{"prefix": null, "first": "Peter", "middle": null, "last": "Parker", "suffix": null, "display": "Peter Parker"}'::json,
  'spiderman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000100", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "20 Ingram St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10100", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spiderman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'hulk',
  crypt('hulk', gen_salt('bf')),
  '{"prefix": null, "first": "Bruce", "middle": null, "last": "Banner", "suffix": null, "display": "Bruce Banner"}'::json,
  'hulk@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000101", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "201 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10101", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hulk'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'thor',
  crypt('thor', gen_salt('bf')),
  '{"prefix": null, "first": "Donald", "middle": null, "last": "Blake", "suffix": null, "display": "Donald Blake"}'::json,
  'thor@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000102", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "202 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10102", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'thor'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blackwidow',
  crypt('blackwidow', gen_salt('bf')),
  '{"prefix": null, "first": "Natasha", "middle": null, "last": "Romanoff", "suffix": null, "display": "Natasha Romanoff"}'::json,
  'blackwidow@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000103", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "203 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10103", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackwidow'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'hawkeye',
  crypt('hawkeye', gen_salt('bf')),
  '{"prefix": null, "first": "Clint", "middle": null, "last": "Barton", "suffix": null, "display": "Clint Barton"}'::json,
  'hawkeye@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000104", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "204 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10104", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hawkeye'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'scarletwitch',
  crypt('scarletwitch', gen_salt('bf')),
  '{"prefix": null, "first": "Wanda", "middle": null, "last": "Maximoff", "suffix": null, "display": "Wanda Maximoff"}'::json,
  'scarletwitch@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000105", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "205 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10105", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'scarletwitch'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'vision',
  crypt('vision', gen_salt('bf')),
  '{"prefix": null, "first": "Victor", "middle": null, "last": "Shade", "suffix": null, "display": "Victor Shade"}'::json,
  'vision@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000106", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "green"}'::json,
  '[{"label": "home", "line1": "206 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10106", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'vision'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'falcon',
  crypt('falcon', gen_salt('bf')),
  '{"prefix": null, "first": "Sam", "middle": null, "last": "Wilson", "suffix": null, "display": "Sam Wilson"}'::json,
  'falcon@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000107", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "207 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10107", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'falcon'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'wintersoldier',
  crypt('wintersoldier', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Buchanan", "suffix": null, "display": "James Buchanan"}'::json,
  'wintersoldier@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000108", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "208 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10108", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wintersoldier'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'antman',
  crypt('antman', gen_salt('bf')),
  '{"prefix": null, "first": "Scott", "middle": null, "last": "Lang", "suffix": null, "display": "Scott Lang"}'::json,
  'antman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000109", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "209 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10109", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'antman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'wasp',
  crypt('wasp', gen_salt('bf')),
  '{"prefix": null, "first": "Hope", "middle": null, "last": "van Dyne", "suffix": null, "display": "Hope van Dyne"}'::json,
  'wasp@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000110", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "210 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10110", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wasp'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blackpanther',
  crypt('blackpanther', gen_salt('bf')),
  '{"prefix": null, "first": "T''Challa", "middle": null, "last": "Udaku", "suffix": null, "display": "T''Challa Udaku"}'::json,
  'blackpanther@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000111", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "Royal Palace", "line2": null, "city": "Wakanda", "state_or_province": "GA", "postal_code": "10111", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackpanther'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'doctorstrange',
  crypt('doctorstrange', gen_salt('bf')),
  '{"prefix": null, "first": "Stephen", "middle": null, "last": "Strange", "suffix": null, "display": "Stephen Strange"}'::json,
  'doctorstrange@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000112", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "177A Bleecker St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10112", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'doctorstrange'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'captainmarvel',
  crypt('captainmarvel', gen_salt('bf')),
  '{"prefix": null, "first": "Carol", "middle": null, "last": "Danvers", "suffix": null, "display": "Carol Danvers"}'::json,
  'captainmarvel@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000113", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "213 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10113", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'captainmarvel'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'msmarvel',
  crypt('msmarvel', gen_salt('bf')),
  '{"prefix": null, "first": "Kamala", "middle": null, "last": "Khan", "suffix": null, "display": "Kamala Khan"}'::json,
  'msmarvel@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000114", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "214 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10114", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'msmarvel'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'shehulk',
  crypt('shehulk', gen_salt('bf')),
  '{"prefix": null, "first": "Jennifer", "middle": null, "last": "Walters", "suffix": null, "display": "Jennifer Walters"}'::json,
  'shehulk@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000115", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "215 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10115", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shehulk'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'daredevil',
  crypt('daredevil', gen_salt('bf')),
  '{"prefix": null, "first": "Matt", "middle": null, "last": "Murdock", "suffix": null, "display": "Matt Murdock"}'::json,
  'daredevil@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000116", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "250 W 57th St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10116", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'daredevil'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'punisher',
  crypt('punisher', gen_salt('bf')),
  '{"prefix": null, "first": "Frank", "middle": null, "last": "Castle", "suffix": null, "display": "Frank Castle"}'::json,
  'punisher@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000117", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "123 Hell''s Kitchen Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10117", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'punisher'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'lukecage',
  crypt('lukecage', gen_salt('bf')),
  '{"prefix": null, "first": "Carl", "middle": null, "last": "Lucas", "suffix": null, "display": "Carl Lucas"}'::json,
  'lukecage@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000118", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "218 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10118", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lukecage'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'ironfist',
  crypt('ironfist', gen_salt('bf')),
  '{"prefix": null, "first": "Danny", "middle": null, "last": "Rand", "suffix": null, "display": "Danny Rand"}'::json,
  'ironfist@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000119", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "219 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10119", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ironfist'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'jessicajones',
  crypt('jessicajones', gen_salt('bf')),
  '{"prefix": null, "first": "Jessica", "middle": null, "last": "Jones", "suffix": null, "display": "Jessica Jones"}'::json,
  'jessicajones@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000120", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "white"}'::json,
  '[{"label": "home", "line1": "220 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10120", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jessicajones'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'ghostrider',
  crypt('ghostrider', gen_salt('bf')),
  '{"prefix": null, "first": "Johnny", "middle": null, "last": "Blaze", "suffix": null, "display": "Johnny Blaze"}'::json,
  'ghostrider@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000121", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "221 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10121", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ghostrider'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'silversurfer',
  crypt('silversurfer', gen_salt('bf')),
  '{"prefix": null, "first": "Norrin", "middle": null, "last": "Radd", "suffix": null, "display": "Norrin Radd"}'::json,
  'silversurfer@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000122", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "black"}'::json,
  '[{"label": "home", "line1": "222 Hero Lane", "line2": null, "city": "Knowhere", "state_or_province": "NV", "postal_code": "10122", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'silversurfer'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'fantasticfourmr',
  crypt('fantasticfourmr', gen_salt('bf')),
  '{"prefix": null, "first": "Reed", "middle": null, "last": "Richards", "suffix": null, "display": "Reed Richards"}'::json,
  'fantasticfourmr@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000123", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "42nd St and Madison Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10123", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'fantasticfourmr'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'invisiblewoman',
  crypt('invisiblewoman', gen_salt('bf')),
  '{"prefix": null, "first": "Susan", "middle": null, "last": "Storm", "suffix": null, "display": "Susan Storm"}'::json,
  'invisiblewoman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000124", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "224 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10124", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'invisiblewoman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'humantorch',
  crypt('humantorch', gen_salt('bf')),
  '{"prefix": null, "first": "Johnny", "middle": null, "last": "Storm", "suffix": null, "display": "Johnny Storm"}'::json,
  'humantorch@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000125", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "225 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10125", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'humantorch'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'thething',
  crypt('thething', gen_salt('bf')),
  '{"prefix": null, "first": "Benjamin", "middle": null, "last": "Grimm", "suffix": null, "display": "Benjamin Grimm"}'::json,
  'thething@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000126", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "226 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10126", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'thething'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'deadpool',
  crypt('deadpool', gen_salt('bf')),
  '{"prefix": null, "first": "Wade", "middle": null, "last": "Wilson", "suffix": null, "display": "Wade Wilson"}'::json,
  'deadpool@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000127", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "227 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10127", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'deadpool'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'wolverine',
  crypt('wolverine', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Howlett", "suffix": null, "display": "James Howlett"}'::json,
  'wolverine@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000128", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "228 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10128", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wolverine'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'storm',
  crypt('storm', gen_salt('bf')),
  '{"prefix": null, "first": "Ororo", "middle": null, "last": "Munroe", "suffix": null, "display": "Ororo Munroe"}'::json,
  'storm@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000129", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "229 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10129", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'storm'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'cyclops',
  crypt('cyclops', gen_salt('bf')),
  '{"prefix": null, "first": "Scott", "middle": null, "last": "Summers", "suffix": null, "display": "Scott Summers"}'::json,
  'cyclops@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000130", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "230 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10130", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cyclops'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'jeangrey',
  crypt('jeangrey', gen_salt('bf')),
  '{"prefix": null, "first": "Jean", "middle": null, "last": "Grey", "suffix": null, "display": "Jean Grey"}'::json,
  'jeangrey@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000131", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "green"}'::json,
  '[{"label": "home", "line1": "231 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10131", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jeangrey'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'professorx',
  crypt('professorx', gen_salt('bf')),
  '{"prefix": null, "first": "Charles", "middle": null, "last": "Xavier", "suffix": null, "display": "Charles Xavier"}'::json,
  'professorx@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000132", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "1407 Graymalkin Ln", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10132", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'professorx'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'magneto',
  crypt('magneto', gen_salt('bf')),
  '{"prefix": null, "first": "Max", "middle": null, "last": "Eisenhardt", "suffix": null, "display": "Max Eisenhardt"}'::json,
  'magneto@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000133", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "233 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10133", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'magneto'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'rogue',
  crypt('rogue', gen_salt('bf')),
  '{"prefix": null, "first": "Anna Marie", "middle": null, "last": "LeBeau", "suffix": null, "display": "Anna Marie LeBeau"}'::json,
  'rogue@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000134", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "234 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10134", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rogue'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'gambit',
  crypt('gambit', gen_salt('bf')),
  '{"prefix": null, "first": "Remy", "middle": null, "last": "LeBeau", "suffix": null, "display": "Remy LeBeau"}'::json,
  'gambit@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000135", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "235 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10135", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'gambit'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'nightcrawler',
  crypt('nightcrawler', gen_salt('bf')),
  '{"prefix": null, "first": "Kurt", "middle": null, "last": "Wagner", "suffix": null, "display": "Kurt Wagner"}'::json,
  'nightcrawler@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000136", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "236 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10136", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nightcrawler'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'colossus',
  crypt('colossus', gen_salt('bf')),
  '{"prefix": null, "first": "Piotr", "middle": null, "last": "Rasputin", "suffix": null, "display": "Piotr Rasputin"}'::json,
  'colossus@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000137", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "237 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10137", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'colossus'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'iceman',
  crypt('iceman', gen_salt('bf')),
  '{"prefix": null, "first": "Bobby", "middle": null, "last": "Drake", "suffix": null, "display": "Bobby Drake"}'::json,
  'iceman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000138", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "238 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10138", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'iceman'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'beast',
  crypt('beast', gen_salt('bf')),
  '{"prefix": null, "first": "Henry", "middle": null, "last": "McCoy", "suffix": null, "display": "Henry McCoy"}'::json,
  'beast@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000139", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "239 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10139", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'beast'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'kittypryde',
  crypt('kittypryde', gen_salt('bf')),
  '{"prefix": null, "first": "Katherine", "middle": null, "last": "Pryde", "suffix": null, "display": "Katherine Pryde"}'::json,
  'kittypryde@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000140", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "240 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10140", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kittypryde'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'jubilee',
  crypt('jubilee', gen_salt('bf')),
  '{"prefix": null, "first": "Jubilation", "middle": null, "last": "Lee", "suffix": null, "display": "Jubilation Lee"}'::json,
  'jubilee@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000141", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "241 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10141", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jubilee'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'psylocke',
  crypt('psylocke', gen_salt('bf')),
  '{"prefix": null, "first": "Elizabeth", "middle": null, "last": "Braddock", "suffix": null, "display": "Elizabeth Braddock"}'::json,
  'psylocke@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000142", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "242 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10142", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'psylocke'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'cable',
  crypt('cable', gen_salt('bf')),
  '{"prefix": null, "first": "Nathan", "middle": null, "last": "Summers", "suffix": null, "display": "Nathan Summers"}'::json,
  'cable@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000143", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "243 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10143", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cable'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'domino',
  crypt('domino', gen_salt('bf')),
  '{"prefix": null, "first": "Neena", "middle": null, "last": "Thurman", "suffix": null, "display": "Neena Thurman"}'::json,
  'domino@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000144", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "244 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10144", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'domino'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'cablegirl',
  crypt('cablegirl', gen_salt('bf')),
  '{"prefix": null, "first": "Hope", "middle": null, "last": "Summers", "suffix": null, "display": "Hope Summers"}'::json,
  'cablegirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000145", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "245 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10145", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cablegirl'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'x23',
  crypt('x23', gen_salt('bf')),
  '{"prefix": null, "first": "Laura", "middle": null, "last": "Kinney", "suffix": null, "display": "Laura Kinney"}'::json,
  'x23@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000146", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "246 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10146", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'x23'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'dazzler',
  crypt('dazzler', gen_salt('bf')),
  '{"prefix": null, "first": "Alison", "middle": null, "last": "Blaire", "suffix": null, "display": "Alison Blaire"}'::json,
  'dazzler@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000147", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "247 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10147", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'dazzler'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'bishop',
  crypt('bishop', gen_salt('bf')),
  '{"prefix": null, "first": "Lucas", "middle": null, "last": "Bishop", "suffix": null, "display": "Lucas Bishop"}'::json,
  'bishop@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000148", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "248 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10148", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bishop'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'sunspot',
  crypt('sunspot', gen_salt('bf')),
  '{"prefix": null, "first": "Roberto", "middle": null, "last": "da Costa", "suffix": null, "display": "Roberto da Costa"}'::json,
  'sunspot@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000149", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "249 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10149", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sunspot'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'magik',
  crypt('magik', gen_salt('bf')),
  '{"prefix": null, "first": "Illyana", "middle": null, "last": "Rasputin", "suffix": null, "display": "Illyana Rasputin"}'::json,
  'magik@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000150", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "black"}'::json,
  '[{"label": "home", "line1": "250 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10150", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'magik'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'namor',
  crypt('namor', gen_salt('bf')),
  '{"prefix": null, "first": "Namor", "middle": null, "last": "McKenzie", "suffix": null, "display": "Namor McKenzie"}'::json,
  'namor@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000151", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "251 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10151", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'namor'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'sentry',
  crypt('sentry', gen_salt('bf')),
  '{"prefix": null, "first": "Robert", "middle": null, "last": "Reynolds", "suffix": null, "display": "Robert Reynolds"}'::json,
  'sentry@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000152", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "252 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10152", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sentry'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'moonknight',
  crypt('moonknight', gen_salt('bf')),
  '{"prefix": null, "first": "Marc", "middle": null, "last": "Spector", "suffix": null, "display": "Marc Spector"}'::json,
  'moonknight@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000153", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "253 Hero Lane", "line2": null, "city": "Chicago", "state_or_province": "IL", "postal_code": "10153", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'moonknight'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'blade',
  crypt('blade', gen_salt('bf')),
  '{"prefix": null, "first": "Eric", "middle": null, "last": "Brooks", "suffix": null, "display": "Eric Brooks"}'::json,
  'blade@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000154", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "254 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10154", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blade'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'ghostspider',
  crypt('ghostspider', gen_salt('bf')),
  '{"prefix": null, "first": "Gwen", "middle": null, "last": "Stacy", "suffix": null, "display": "Gwen Stacy"}'::json,
  'ghostspider@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000155", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "255 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10155", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ghostspider'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'milesmorales',
  crypt('milesmorales', gen_salt('bf')),
  '{"prefix": null, "first": "Miles", "middle": null, "last": "Morales", "suffix": null, "display": "Miles Morales"}'::json,
  'milesmorales@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000156", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "256 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10156", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'milesmorales'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'venom',
  crypt('venom', gen_salt('bf')),
  '{"prefix": null, "first": "Eddie", "middle": null, "last": "Brock", "suffix": null, "display": "Eddie Brock"}'::json,
  'venom@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000157", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "257 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10157", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'venom'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'greengoblin',
  crypt('greengoblin', gen_salt('bf')),
  '{"prefix": null, "first": "Norman", "middle": null, "last": "Osborn", "suffix": null, "display": "Norman Osborn"}'::json,
  'greengoblin@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000158", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "258 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10158", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'greengoblin'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'doctoroctopus',
  crypt('doctoroctopus', gen_salt('bf')),
  '{"prefix": null, "first": "Otto", "middle": null, "last": "Octavius", "suffix": null, "display": "Otto Octavius"}'::json,
  'doctoroctopus@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000159", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "259 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10159", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'doctoroctopus'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'lizard',
  crypt('lizard', gen_salt('bf')),
  '{"prefix": null, "first": "Curt", "middle": null, "last": "Connors", "suffix": null, "display": "Curt Connors"}'::json,
  'lizard@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000160", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "260 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10160", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lizard'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'kingpin',
  crypt('kingpin', gen_salt('bf')),
  '{"prefix": null, "first": "Wilson", "middle": null, "last": "Fisk", "suffix": null, "display": "Wilson Fisk"}'::json,
  'kingpin@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000161", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "black"}'::json,
  '[{"label": "home", "line1": "261 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10161", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kingpin'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'electro',
  crypt('electro', gen_salt('bf')),
  '{"prefix": null, "first": "Max", "middle": null, "last": "Dillon", "suffix": null, "display": "Max Dillon"}'::json,
  'electro@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000162", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "262 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10162", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'electro'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'vulture',
  crypt('vulture', gen_salt('bf')),
  '{"prefix": null, "first": "Adrian", "middle": null, "last": "Toomes", "suffix": null, "display": "Adrian Toomes"}'::json,
  'vulture@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000163", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "263 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10163", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'vulture'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'mysterio',
  crypt('mysterio', gen_salt('bf')),
  '{"prefix": null, "first": "Quentin", "middle": null, "last": "Beck", "suffix": null, "display": "Quentin Beck"}'::json,
  'mysterio@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000164", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "264 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10164", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mysterio'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'rhino',
  crypt('rhino', gen_salt('bf')),
  '{"prefix": null, "first": "Aleksei", "middle": null, "last": "Sytsevich", "suffix": null, "display": "Aleksei Sytsevich"}'::json,
  'rhino@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000165", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "white"}'::json,
  '[{"label": "home", "line1": "265 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10165", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rhino'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'shocker',
  crypt('shocker', gen_salt('bf')),
  '{"prefix": null, "first": "Herman", "middle": null, "last": "Schultz", "suffix": null, "display": "Herman Schultz"}'::json,
  'shocker@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000166", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "266 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10166", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shocker'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'scorpion',
  crypt('scorpion', gen_salt('bf')),
  '{"prefix": null, "first": "Mac", "middle": null, "last": "Gargan", "suffix": null, "display": "Mac Gargan"}'::json,
  'scorpion@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000167", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "267 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10167", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'scorpion'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'kraven',
  crypt('kraven', gen_salt('bf')),
  '{"prefix": null, "first": "Sergei", "middle": null, "last": "Kravinoff", "suffix": null, "display": "Sergei Kravinoff"}'::json,
  'kraven@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000168", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "268 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10168", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kraven'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'morbius',
  crypt('morbius', gen_salt('bf')),
  '{"prefix": null, "first": "Michael", "middle": null, "last": "Morbius", "suffix": null, "display": "Michael Morbius"}'::json,
  'morbius@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000169", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "269 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10169", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'morbius'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'nova',
  crypt('nova', gen_salt('bf')),
  '{"prefix": null, "first": "Richard", "middle": null, "last": "Rider", "suffix": null, "display": "Richard Rider"}'::json,
  'nova@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000170", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "black"}'::json,
  '[{"label": "home", "line1": "270 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10170", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nova'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'starlord',
  crypt('starlord', gen_salt('bf')),
  '{"prefix": null, "first": "Peter", "middle": null, "last": "Quill", "suffix": null, "display": "Peter Quill"}'::json,
  'starlord@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000171", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "271 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10171", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'starlord'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'gamora',
  crypt('gamora', gen_salt('bf')),
  '{"prefix": null, "first": "Gamora", "middle": null, "last": "Zen Whoberi", "suffix": null, "display": "Gamora Zen Whoberi"}'::json,
  'gamora@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000172", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "272 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10172", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'gamora'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'drax',
  crypt('drax', gen_salt('bf')),
  '{"prefix": null, "first": "Drax", "middle": null, "last": "Destroyer", "suffix": null, "display": "Drax Destroyer"}'::json,
  'drax@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000173", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "273 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10173", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'drax'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'rocket',
  crypt('rocket', gen_salt('bf')),
  '{"prefix": null, "first": "Rocket", "middle": null, "last": "Raccoon", "suffix": null, "display": "Rocket Raccoon"}'::json,
  'rocket@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000174", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "274 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10174", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rocket'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'groot',
  crypt('groot', gen_salt('bf')),
  '{"prefix": null, "first": "Groot", "middle": null, "last": "Tree", "suffix": null, "display": "Groot Tree"}'::json,
  'groot@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000175", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "green"}'::json,
  '[{"label": "home", "line1": "275 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10175", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'groot'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'mantis',
  crypt('mantis', gen_salt('bf')),
  '{"prefix": null, "first": "Mantis", "middle": null, "last": "Brandt", "suffix": null, "display": "Mantis Brandt"}'::json,
  'mantis@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000176", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "276 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10176", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mantis'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'nebula',
  crypt('nebula', gen_salt('bf')),
  '{"prefix": null, "first": "Nebula", "middle": null, "last": "Titan", "suffix": null, "display": "Nebula Titan"}'::json,
  'nebula@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000177", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "277 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10177", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nebula'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'yondu',
  crypt('yondu', gen_salt('bf')),
  '{"prefix": null, "first": "Yondu", "middle": null, "last": "Udonta", "suffix": null, "display": "Yondu Udonta"}'::json,
  'yondu@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000178", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "278 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10178", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'yondu'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'adamwarlock',
  crypt('adamwarlock', gen_salt('bf')),
  '{"prefix": null, "first": "Adam", "middle": null, "last": "Warlock", "suffix": null, "display": "Adam Warlock"}'::json,
  'adamwarlock@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000179", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "279 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10179", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'adamwarlock'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'thanos',
  crypt('thanos', gen_salt('bf')),
  '{"prefix": null, "first": "Thanos", "middle": null, "last": "Titan", "suffix": null, "display": "Thanos Titan"}'::json,
  'thanos@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000180", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "280 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10180", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'thanos'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'loki',
  crypt('loki', gen_salt('bf')),
  '{"prefix": null, "first": "Loki", "middle": null, "last": "Laufeyson", "suffix": null, "display": "Loki Laufeyson"}'::json,
  'loki@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000181", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "281 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10181", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'loki'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'hela',
  crypt('hela', gen_salt('bf')),
  '{"prefix": null, "first": "Hela", "middle": null, "last": "Asgard", "suffix": null, "display": "Hela Asgard"}'::json,
  'hela@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000182", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "green"}'::json,
  '[{"label": "home", "line1": "282 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10182", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hela'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'valkyrie',
  crypt('valkyrie', gen_salt('bf')),
  '{"prefix": null, "first": "Brunnhilde", "middle": null, "last": "Valkyrie", "suffix": null, "display": "Brunnhilde Valkyrie"}'::json,
  'valkyrie@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000183", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "283 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10183", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'valkyrie'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'korg',
  crypt('korg', gen_salt('bf')),
  '{"prefix": null, "first": "Korg", "middle": null, "last": "Kronan", "suffix": null, "display": "Korg Kronan"}'::json,
  'korg@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000184", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "284 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10184", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'korg'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'miek',
  crypt('miek', gen_salt('bf')),
  '{"prefix": null, "first": "Miek", "middle": null, "last": "Sakaar", "suffix": null, "display": "Miek Sakaar"}'::json,
  'miek@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000185", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "red"}'::json,
  '[{"label": "home", "line1": "285 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10185", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'miek'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'shuri',
  crypt('shuri', gen_salt('bf')),
  '{"prefix": null, "first": "Shuri", "middle": null, "last": "Udaku", "suffix": null, "display": "Shuri Udaku"}'::json,
  'shuri@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000186", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "286 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10186", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shuri'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'okoye',
  crypt('okoye', gen_salt('bf')),
  '{"prefix": null, "first": "Okoye", "middle": null, "last": "Dora Milaje", "suffix": null, "display": "Okoye Dora Milaje"}'::json,
  'okoye@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000187", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "287 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10187", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'okoye'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'killmonger',
  crypt('killmonger', gen_salt('bf')),
  '{"prefix": null, "first": "Erik", "middle": null, "last": "Stevens", "suffix": null, "display": "Erik Stevens"}'::json,
  'killmonger@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000188", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "288 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10188", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'killmonger'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'mysterio2',
  crypt('mysterio2', gen_salt('bf')),
  '{"prefix": null, "first": "Quentin", "middle": null, "last": "Beck", "suffix": null, "display": "Quentin Beck"}'::json,
  'mysterio2@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000189", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "green"}'::json,
  '[{"label": "home", "line1": "289 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10189", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mysterio2'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'warmachine',
  crypt('warmachine', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Rhodes", "suffix": null, "display": "James Rhodes"}'::json,
  'warmachine@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000190", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "290 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10190", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'warmachine'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'pepperpotts',
  crypt('pepperpotts', gen_salt('bf')),
  '{"prefix": null, "first": "Virginia", "middle": null, "last": "Potts", "suffix": null, "display": "Virginia Potts"}'::json,
  'pepperpotts@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000191", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "291 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10191", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'pepperpotts'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'nickfury',
  crypt('nickfury', gen_salt('bf')),
  '{"prefix": null, "first": "Nicholas", "middle": null, "last": "Fury", "suffix": null, "display": "Nicholas Fury"}'::json,
  'nickfury@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000192", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "292 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10192", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nickfury'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'agentcoulson',
  crypt('agentcoulson', gen_salt('bf')),
  '{"prefix": null, "first": "Phil", "middle": null, "last": "Coulson", "suffix": null, "display": "Phil Coulson"}'::json,
  'agentcoulson@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000193", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "293 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10193", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'agentcoulson'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'mariahill',
  crypt('mariahill', gen_salt('bf')),
  '{"prefix": null, "first": "Maria", "middle": null, "last": "Hill", "suffix": null, "display": "Maria Hill"}'::json,
  'mariahill@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000194", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "294 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10194", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mariahill'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'sharoncarter',
  crypt('sharoncarter', gen_salt('bf')),
  '{"prefix": null, "first": "Sharon", "middle": null, "last": "Carter", "suffix": null, "display": "Sharon Carter"}'::json,
  'sharoncarter@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000195", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "295 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10195", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sharoncarter'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'buckybarnes',
  crypt('buckybarnes', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Barnes", "suffix": null, "display": "James Barnes"}'::json,
  'buckybarnes@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000196", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "296 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10196", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'buckybarnes'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'quicksilver',
  crypt('quicksilver', gen_salt('bf')),
  '{"prefix": null, "first": "Pietro", "middle": null, "last": "Maximoff", "suffix": null, "display": "Pietro Maximoff"}'::json,
  'quicksilver@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000197", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "297 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10197", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'quicksilver'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'scarletspider',
  crypt('scarletspider', gen_salt('bf')),
  '{"prefix": null, "first": "Ben", "middle": null, "last": "Reilly", "suffix": null, "display": "Ben Reilly"}'::json,
  'scarletspider@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000198", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "298 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10198", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'scarletspider'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  updated_by
)
SELECT
  'spiderwoman',
  crypt('spiderwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Jessica", "middle": null, "last": "Drew", "suffix": null, "display": "Jessica Drew"}'::json,
  'spiderwoman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000199", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "299 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10199", "country_code": "USA"}]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spiderwoman'
);

SELECT COUNT(*) AS superhero_seed_users
FROM public."user"
WHERE email LIKE '%@superhero.example.com';
