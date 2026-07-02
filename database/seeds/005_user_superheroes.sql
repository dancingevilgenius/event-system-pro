-- Up to 1000 Marvel/DC/Image superhero seed users for local development.
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
  modified_by,
  modified_date
)
SELECT
  'superman',
  crypt('superman', gen_salt('bf')),
  '{"prefix": null, "first": "Clark", "middle": null, "last": "Kent", "suffix": null, "display": "Clark Kent"}'::json,
  'superman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000000", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "344 Clinton St", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10000", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'batman',
  crypt('batman', gen_salt('bf')),
  '{"prefix": null, "first": "Bruce", "middle": null, "last": "Wayne", "suffix": null, "display": "Bruce Wayne"}'::json,
  'batman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000001", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "1007 Mountain Drive", "line2": null, "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10001", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'wonderwoman',
  crypt('wonderwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Diana", "middle": null, "last": "Prince", "suffix": null, "display": "Diana Prince"}'::json,
  'wonderwoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000002", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "1600 Pennsylvania Ave NW", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10002", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'flash',
  crypt('flash', gen_salt('bf')),
  '{"prefix": null, "first": "Barry", "middle": null, "last": "Allen", "suffix": null, "display": "Barry Allen"}'::json,
  'flash@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000003", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "2121 Main St", "line2": null, "city": "Central City", "state_or_province": "MO", "postal_code": "10003", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'greenlantern',
  crypt('greenlantern', gen_salt('bf')),
  '{"prefix": null, "first": "Hal", "middle": null, "last": "Jordan", "suffix": null, "display": "Hal Jordan"}'::json,
  'greenlantern@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000004", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "1200 Coast Blvd", "line2": null, "city": "Coast City", "state_or_province": "CA", "postal_code": "10004", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'aquaman',
  crypt('aquaman', gen_salt('bf')),
  '{"prefix": null, "first": "Arthur", "middle": null, "last": "Curry", "suffix": null, "display": "Arthur Curry"}'::json,
  'aquaman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000005", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "green"}'::json,
  '[{"label": "home", "line1": "Atlantean Embassy", "line2": null, "city": "Atlantis", "state_or_province": "FL", "postal_code": "10005", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'cyborg',
  crypt('cyborg', gen_salt('bf')),
  '{"prefix": null, "first": "Victor", "middle": null, "last": "Stone", "suffix": null, "display": "Victor Stone"}'::json,
  'cyborg@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000006", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "red"}'::json,
  '[{"label": "home", "line1": "106 Hero Lane", "line2": null, "city": "Detroit", "state_or_province": "MI", "postal_code": "10006", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'shazam',
  crypt('shazam', gen_salt('bf')),
  '{"prefix": null, "first": "Billy", "middle": null, "last": "Batson", "suffix": null, "display": "Billy Batson"}'::json,
  'shazam@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000007", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "107 Hero Lane", "line2": null, "city": "Fawcett City", "state_or_province": "IN", "postal_code": "10007", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'robin',
  crypt('robin', gen_salt('bf')),
  '{"prefix": null, "first": "Dick", "middle": null, "last": "Grayson", "suffix": null, "display": "Dick Grayson"}'::json,
  'robin@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000008", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "green"}'::json,
  '[{"label": "home", "line1": "108 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10008", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'nightwing',
  crypt('nightwing', gen_salt('bf')),
  '{"prefix": null, "first": "Richard", "middle": null, "last": "Grayson", "suffix": null, "display": "Richard Grayson"}'::json,
  'nightwing@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000009", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "1 Bludhaven Pier", "line2": null, "city": "Bludhaven", "state_or_province": "NJ", "postal_code": "10009", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'batgirl',
  crypt('batgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Barbara", "middle": null, "last": "Gordon", "suffix": null, "display": "Barbara Gordon"}'::json,
  'batgirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000010", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "110 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10010", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'supergirl',
  crypt('supergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Kara", "middle": null, "last": "Zor-El", "suffix": null, "display": "Kara Zor-El"}'::json,
  'supergirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000011", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "111 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10011", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'greenarrow',
  crypt('greenarrow', gen_salt('bf')),
  '{"prefix": null, "first": "Oliver", "middle": null, "last": "Queen", "suffix": null, "display": "Oliver Queen"}'::json,
  'greenarrow@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000012", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "1401 Starling Ave", "line2": null, "city": "Star City", "state_or_province": "WA", "postal_code": "10012", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blackcanary',
  crypt('blackcanary', gen_salt('bf')),
  '{"prefix": null, "first": "Dinah", "middle": null, "last": "Lance", "suffix": null, "display": "Dinah Lance"}'::json,
  'blackcanary@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000013", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "113 Hero Lane", "line2": "Star City HQ", "city": "Star City", "state_or_province": "WA", "postal_code": "10013", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'martianmanhunter',
  crypt('martianmanhunter', gen_salt('bf')),
  '{"prefix": null, "first": "J''onn", "middle": null, "last": "J''onzz", "suffix": null, "display": "J''onn J''onzz"}'::json,
  'martianmanhunter@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000014", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "114 Hero Lane", "line2": null, "city": "Middleton", "state_or_province": "CO", "postal_code": "10014", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'hawkman',
  crypt('hawkman', gen_salt('bf')),
  '{"prefix": null, "first": "Carter", "middle": null, "last": "Hall", "suffix": null, "display": "Carter Hall"}'::json,
  'hawkman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000015", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "115 Hero Lane", "line2": null, "city": "St. Roch", "state_or_province": "LA", "postal_code": "10015", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'hawkgirl',
  crypt('hawkgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Shayera", "middle": null, "last": "Hol", "suffix": null, "display": "Shayera Hol"}'::json,
  'hawkgirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000016", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "116 Hero Lane", "line2": null, "city": "St. Roch", "state_or_province": "LA", "postal_code": "10016", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'zatanna',
  crypt('zatanna', gen_salt('bf')),
  '{"prefix": null, "first": "Zatanna", "middle": null, "last": "Zatara", "suffix": null, "display": "Zatanna Zatara"}'::json,
  'zatanna@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000017", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "117 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10017", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'constantine',
  crypt('constantine', gen_salt('bf')),
  '{"prefix": null, "first": "John", "middle": null, "last": "Constantine", "suffix": null, "display": "John Constantine"}'::json,
  'constantine@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000018", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "beige", "color2": "black"}'::json,
  '[{"label": "home", "line1": "118 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10018", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'raven',
  crypt('raven', gen_salt('bf')),
  '{"prefix": null, "first": "Rachel", "middle": null, "last": "Roth", "suffix": null, "display": "Rachel Roth"}'::json,
  'raven@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000019", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "indigo", "color2": "black"}'::json,
  '[{"label": "home", "line1": "119 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10019", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'starfire',
  crypt('starfire', gen_salt('bf')),
  '{"prefix": null, "first": "Koriand''r", "middle": null, "last": "Andr", "suffix": null, "display": "Koriand''r Andr"}'::json,
  'starfire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000020", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "120 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10020", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'beastboy',
  crypt('beastboy', gen_salt('bf')),
  '{"prefix": null, "first": "Garfield", "middle": null, "last": "Logan", "suffix": null, "display": "Garfield Logan"}'::json,
  'beastboy@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000021", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "121 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10021", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'redhood',
  crypt('redhood', gen_salt('bf')),
  '{"prefix": null, "first": "Jason", "middle": null, "last": "Todd", "suffix": null, "display": "Jason Todd"}'::json,
  'redhood@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000022", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "122 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10022", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'harleyquinn',
  crypt('harleyquinn', gen_salt('bf')),
  '{"prefix": null, "first": "Harleen", "middle": null, "last": "Quinzel", "suffix": null, "display": "Harleen Quinzel"}'::json,
  'harleyquinn@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000023", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "123 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10023", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'joker',
  crypt('joker', gen_salt('bf')),
  '{"prefix": null, "first": "Jack", "middle": null, "last": "Napier", "suffix": null, "display": "Jack Napier"}'::json,
  'joker@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000024", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "green"}'::json,
  '[{"label": "home", "line1": "124 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10024", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'catwoman',
  crypt('catwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Selina", "middle": null, "last": "Kyle", "suffix": null, "display": "Selina Kyle"}'::json,
  'catwoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000025", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "125 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10025", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'poisonivy',
  crypt('poisonivy', gen_salt('bf')),
  '{"prefix": null, "first": "Pamela", "middle": null, "last": "Isley", "suffix": null, "display": "Pamela Isley"}'::json,
  'poisonivy@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000026", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "126 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10026", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'twoface',
  crypt('twoface', gen_salt('bf')),
  '{"prefix": null, "first": "Harvey", "middle": null, "last": "Dent", "suffix": null, "display": "Harvey Dent"}'::json,
  'twoface@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000027", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "127 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10027", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'riddler',
  crypt('riddler', gen_salt('bf')),
  '{"prefix": null, "first": "Edward", "middle": null, "last": "Nygma", "suffix": null, "display": "Edward Nygma"}'::json,
  'riddler@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000028", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "128 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10028", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'scarecrow',
  crypt('scarecrow', gen_salt('bf')),
  '{"prefix": null, "first": "Jonathan", "middle": null, "last": "Crane", "suffix": null, "display": "Jonathan Crane"}'::json,
  'scarecrow@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000029", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "129 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10029", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'bane',
  crypt('bane', gen_salt('bf')),
  '{"prefix": null, "first": "Antonio", "middle": null, "last": "Daggett", "suffix": null, "display": "Antonio Daggett"}'::json,
  'bane@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000030", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "green"}'::json,
  '[{"label": "home", "line1": "130 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10030", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'darkseid',
  crypt('darkseid', gen_salt('bf')),
  '{"prefix": null, "first": "Uxas", "middle": null, "last": "Darkseid", "suffix": null, "display": "Uxas Darkseid"}'::json,
  'darkseid@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000031", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "131 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10031", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'brainiac',
  crypt('brainiac', gen_salt('bf')),
  '{"prefix": null, "first": "Vril", "middle": null, "last": "Dox", "suffix": null, "display": "Vril Dox"}'::json,
  'brainiac@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000032", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "132 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10032", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'lexluthor',
  crypt('lexluthor', gen_salt('bf')),
  '{"prefix": null, "first": "Alexander", "middle": null, "last": "Luthor", "suffix": null, "display": "Alexander Luthor"}'::json,
  'lexluthor@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000033", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "green"}'::json,
  '[{"label": "home", "line1": "LexCorp Plaza", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10033", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'deathstroke',
  crypt('deathstroke', gen_salt('bf')),
  '{"prefix": null, "first": "Slade", "middle": null, "last": "Wilson", "suffix": null, "display": "Slade Wilson"}'::json,
  'deathstroke@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000034", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "black"}'::json,
  '[{"label": "home", "line1": "134 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10034", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blackadam',
  crypt('blackadam', gen_salt('bf')),
  '{"prefix": null, "first": "Teth", "middle": null, "last": "Adam", "suffix": null, "display": "Teth Adam"}'::json,
  'blackadam@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000035", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "135 Hero Lane", "line2": null, "city": "Kahndaq", "state_or_province": "IL", "postal_code": "10035", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'captaincold',
  crypt('captaincold', gen_salt('bf')),
  '{"prefix": null, "first": "Leonard", "middle": null, "last": "Snart", "suffix": null, "display": "Leonard Snart"}'::json,
  'captaincold@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000036", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "136 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10036", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'reverseflash',
  crypt('reverseflash', gen_salt('bf')),
  '{"prefix": null, "first": "Eobard", "middle": null, "last": "Thawne", "suffix": null, "display": "Eobard Thawne"}'::json,
  'reverseflash@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000037", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "red"}'::json,
  '[{"label": "home", "line1": "137 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10037", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'kidflash',
  crypt('kidflash', gen_salt('bf')),
  '{"prefix": null, "first": "Wally", "middle": null, "last": "West", "suffix": null, "display": "Wally West"}'::json,
  'kidflash@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000038", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "138 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10038", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'bluebeetle',
  crypt('bluebeetle', gen_salt('bf')),
  '{"prefix": null, "first": "Jaime", "middle": null, "last": "Reyes", "suffix": null, "display": "Jaime Reyes"}'::json,
  'bluebeetle@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000039", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "139 Hero Lane", "line2": null, "city": "El Paso", "state_or_province": "TX", "postal_code": "10039", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'boostergold',
  crypt('boostergold', gen_salt('bf')),
  '{"prefix": null, "first": "Michael", "middle": null, "last": "Carter", "suffix": null, "display": "Michael Carter"}'::json,
  'boostergold@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000040", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "140 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10040", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'question',
  crypt('question', gen_salt('bf')),
  '{"prefix": null, "first": "Vic", "middle": null, "last": "Sage", "suffix": null, "display": "Vic Sage"}'::json,
  'question@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000041", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "141 Hero Lane", "line2": null, "city": "Hub City", "state_or_province": "IL", "postal_code": "10041", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'phantomstranger',
  crypt('phantomstranger', gen_salt('bf')),
  '{"prefix": null, "first": "Jim", "middle": null, "last": "Corrigan", "suffix": null, "display": "Jim Corrigan"}'::json,
  'phantomstranger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000042", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "142 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10042", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'deadman',
  crypt('deadman', gen_salt('bf')),
  '{"prefix": null, "first": "Boston", "middle": null, "last": "Brand", "suffix": null, "display": "Boston Brand"}'::json,
  'deadman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000043", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "143 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10043", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'swampthing',
  crypt('swampthing', gen_salt('bf')),
  '{"prefix": null, "first": "Alec", "middle": null, "last": "Holland", "suffix": null, "display": "Alec Holland"}'::json,
  'swampthing@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000044", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "144 Hero Lane", "line2": null, "city": "New Orleans", "state_or_province": "LA", "postal_code": "10044", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'spectre',
  crypt('spectre', gen_salt('bf')),
  '{"prefix": null, "first": "Crispus", "middle": null, "last": "Allen", "suffix": null, "display": "Crispus Allen"}'::json,
  'spectre@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000045", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "green"}'::json,
  '[{"label": "home", "line1": "145 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10045", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'doctorfate',
  crypt('doctorfate', gen_salt('bf')),
  '{"prefix": null, "first": "Kent", "middle": null, "last": "Nelson", "suffix": null, "display": "Kent Nelson"}'::json,
  'doctorfate@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000046", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "146 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10046", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'mistermiracle',
  crypt('mistermiracle', gen_salt('bf')),
  '{"prefix": null, "first": "Scott", "middle": null, "last": "Free", "suffix": null, "display": "Scott Free"}'::json,
  'mistermiracle@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000047", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "147 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10047", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'bigbarda',
  crypt('bigbarda', gen_salt('bf')),
  '{"prefix": null, "first": "Barda", "middle": null, "last": "Free", "suffix": null, "display": "Barda Free"}'::json,
  'bigbarda@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000048", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "148 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10048", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'orion',
  crypt('orion', gen_salt('bf')),
  '{"prefix": null, "first": "Orion", "middle": null, "last": "New Genesis", "suffix": null, "display": "Orion New Genesis"}'::json,
  'orion@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000049", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "149 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10049", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'lobo',
  crypt('lobo', gen_salt('bf')),
  '{"prefix": null, "first": "Lobo", "middle": null, "last": "Czarnia", "suffix": null, "display": "Lobo Czarnia"}'::json,
  'lobo@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000050", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "150 Hero Lane", "line2": null, "city": "Las Vegas", "state_or_province": "NV", "postal_code": "10050", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'static',
  crypt('static', gen_salt('bf')),
  '{"prefix": null, "first": "Virgil", "middle": null, "last": "Hawkins", "suffix": null, "display": "Virgil Hawkins"}'::json,
  'static@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000051", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "151 Hero Lane", "line2": null, "city": "Dakota City", "state_or_province": "MO", "postal_code": "10051", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blacklightning',
  crypt('blacklightning', gen_salt('bf')),
  '{"prefix": null, "first": "Jefferson", "middle": null, "last": "Pierce", "suffix": null, "display": "Jefferson Pierce"}'::json,
  'blacklightning@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000052", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "152 Hero Lane", "line2": null, "city": "Freeland", "state_or_province": "MD", "postal_code": "10052", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'vixen',
  crypt('vixen', gen_salt('bf')),
  '{"prefix": null, "first": "Mari", "middle": null, "last": "McCabe", "suffix": null, "display": "Mari McCabe"}'::json,
  'vixen@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000053", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "153 Hero Lane", "line2": null, "city": "Detroit", "state_or_province": "MI", "postal_code": "10053", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'firestorm',
  crypt('firestorm', gen_salt('bf')),
  '{"prefix": null, "first": "Ronnie", "middle": null, "last": "Raymond", "suffix": null, "display": "Ronnie Raymond"}'::json,
  'firestorm@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000054", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "154 Hero Lane", "line2": null, "city": "Pittsburgh", "state_or_province": "PA", "postal_code": "10054", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'atom',
  crypt('atom', gen_salt('bf')),
  '{"prefix": null, "first": "Ray", "middle": null, "last": "Palmer", "suffix": null, "display": "Ray Palmer"}'::json,
  'atom@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000055", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "155 Hero Lane", "line2": null, "city": "Ivy Town", "state_or_province": "CT", "postal_code": "10055", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'stargirl',
  crypt('stargirl', gen_salt('bf')),
  '{"prefix": null, "first": "Courtney", "middle": null, "last": "Whitmore", "suffix": null, "display": "Courtney Whitmore"}'::json,
  'stargirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000056", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "156 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10056", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'drmidnite',
  crypt('drmidnite', gen_salt('bf')),
  '{"prefix": null, "first": "Charles", "middle": null, "last": "McNider", "suffix": null, "display": "Charles McNider"}'::json,
  'drmidnite@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000057", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "157 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10057", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'sandman',
  crypt('sandman', gen_salt('bf')),
  '{"prefix": null, "first": "Wesley", "middle": null, "last": "Dodds", "suffix": null, "display": "Wesley Dodds"}'::json,
  'sandman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000058", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "158 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10058", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'wildcat',
  crypt('wildcat', gen_salt('bf')),
  '{"prefix": null, "first": "Ted", "middle": null, "last": "Grant", "suffix": null, "display": "Ted Grant"}'::json,
  'wildcat@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000059", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "159 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10059", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'hourman',
  crypt('hourman', gen_salt('bf')),
  '{"prefix": null, "first": "Rex", "middle": null, "last": "Tyler", "suffix": null, "display": "Rex Tyler"}'::json,
  'hourman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000060", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "160 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10060", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'doctormidnite',
  crypt('doctormidnite', gen_salt('bf')),
  '{"prefix": null, "first": "Pieter", "middle": null, "last": "Cross", "suffix": null, "display": "Pieter Cross"}'::json,
  'doctormidnite@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000061", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "161 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10061", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'redtornado',
  crypt('redtornado', gen_salt('bf')),
  '{"prefix": null, "first": "John", "middle": null, "last": "Smith", "suffix": null, "display": "John Smith"}'::json,
  'redtornado@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000062", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "162 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10062", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'plasticman',
  crypt('plasticman', gen_salt('bf')),
  '{"prefix": null, "first": "Patrick", "middle": null, "last": "O''Brian", "suffix": null, "display": "Patrick O''Brian"}'::json,
  'plasticman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000063", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "163 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10063", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'elongatedman',
  crypt('elongatedman', gen_salt('bf')),
  '{"prefix": null, "first": "Ralph", "middle": null, "last": "Dibny", "suffix": null, "display": "Ralph Dibny"}'::json,
  'elongatedman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000064", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "164 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10064", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'metamorpho',
  crypt('metamorpho', gen_salt('bf')),
  '{"prefix": null, "first": "Rex", "middle": null, "last": "Mason", "suffix": null, "display": "Rex Mason"}'::json,
  'metamorpho@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000065", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "165 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10065", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'doompatrolrobotman',
  crypt('doompatrolrobotman', gen_salt('bf')),
  '{"prefix": null, "first": "Cliff", "middle": null, "last": "Steele", "suffix": null, "display": "Cliff Steele"}'::json,
  'doompatrolrobotman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000066", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "166 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10066", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'negativeman',
  crypt('negativeman', gen_salt('bf')),
  '{"prefix": null, "first": "Larry", "middle": null, "last": "Trainor", "suffix": null, "display": "Larry Trainor"}'::json,
  'negativeman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000067", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "167 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10067", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'crazyjane',
  crypt('crazyjane', gen_salt('bf')),
  '{"prefix": null, "first": "Kay", "middle": null, "last": "Challis", "suffix": null, "display": "Kay Challis"}'::json,
  'crazyjane@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000068", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "168 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10068", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'animalman',
  crypt('animalman', gen_salt('bf')),
  '{"prefix": null, "first": "Buddy", "middle": null, "last": "Baker", "suffix": null, "display": "Buddy Baker"}'::json,
  'animalman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000069", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "169 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10069", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'kamandi',
  crypt('kamandi', gen_salt('bf')),
  '{"prefix": null, "first": "Kamandi", "middle": null, "last": "Last Boy", "suffix": null, "display": "Kamandi Last Boy"}'::json,
  'kamandi@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000070", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "170 Hero Lane", "line2": null, "city": "Command D", "state_or_province": "NY", "postal_code": "10070", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'deadshot',
  crypt('deadshot', gen_salt('bf')),
  '{"prefix": null, "first": "Floyd", "middle": null, "last": "Lawton", "suffix": null, "display": "Floyd Lawton"}'::json,
  'deadshot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000071", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "171 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10071", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'captainboomerang',
  crypt('captainboomerang', gen_salt('bf')),
  '{"prefix": null, "first": "George", "middle": null, "last": "Harkness", "suffix": null, "display": "George Harkness"}'::json,
  'captainboomerang@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000072", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "172 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10072", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'enchantress',
  crypt('enchantress', gen_salt('bf')),
  '{"prefix": null, "first": "June", "middle": null, "last": "Moone", "suffix": null, "display": "June Moone"}'::json,
  'enchantress@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000073", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "173 Hero Lane", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10073", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'killerfrost',
  crypt('killerfrost', gen_salt('bf')),
  '{"prefix": null, "first": "Caitlin", "middle": null, "last": "Snow", "suffix": null, "display": "Caitlin Snow"}'::json,
  'killerfrost@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000074", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "174 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10074", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'fire',
  crypt('fire', gen_salt('bf')),
  '{"prefix": null, "first": "Beatriz", "middle": null, "last": "da Costa", "suffix": null, "display": "Beatriz da Costa"}'::json,
  'fire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000075", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "175 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10075", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'ice',
  crypt('ice', gen_salt('bf')),
  '{"prefix": null, "first": "Tora", "middle": null, "last": "Olafsdotter", "suffix": null, "display": "Tora Olafsdotter"}'::json,
  'ice@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000076", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "176 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10076", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'powergirl',
  crypt('powergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Kara", "middle": null, "last": "Zor-L", "suffix": null, "display": "Kara Zor-L"}'::json,
  'powergirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000077", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "177 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10077", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'huntress',
  crypt('huntress', gen_salt('bf')),
  '{"prefix": null, "first": "Helena", "middle": null, "last": "Bertinelli", "suffix": null, "display": "Helena Bertinelli"}'::json,
  'huntress@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000078", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "178 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10078", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'batwoman',
  crypt('batwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Kate", "middle": null, "last": "Kane", "suffix": null, "display": "Kate Kane"}'::json,
  'batwoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000079", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "179 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10079", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'reneree',
  crypt('reneree', gen_salt('bf')),
  '{"prefix": null, "first": "Renee", "middle": null, "last": "Montoya", "suffix": null, "display": "Renee Montoya"}'::json,
  'reneree@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000080", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "black"}'::json,
  '[{"label": "home", "line1": "180 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10080", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'oracle',
  crypt('oracle', gen_salt('bf')),
  '{"prefix": null, "first": "Barbara", "middle": null, "last": "Rand", "suffix": null, "display": "Barbara Rand"}'::json,
  'oracle@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000081", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "181 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10081", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blackmanta',
  crypt('blackmanta', gen_salt('bf')),
  '{"prefix": null, "first": "David", "middle": null, "last": "Hyde", "suffix": null, "display": "David Hyde"}'::json,
  'blackmanta@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000082", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "182 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10082", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'oceanmaster',
  crypt('oceanmaster', gen_salt('bf')),
  '{"prefix": null, "first": "Orm", "middle": null, "last": "Curry", "suffix": null, "display": "Orm Curry"}'::json,
  'oceanmaster@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000083", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "183 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10083", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'sinestro',
  crypt('sinestro', gen_salt('bf')),
  '{"prefix": null, "first": "Thaal", "middle": null, "last": "Sinestro", "suffix": null, "display": "Thaal Sinestro"}'::json,
  'sinestro@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000084", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "184 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10084", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'atrocitus',
  crypt('atrocitus', gen_salt('bf')),
  '{"prefix": null, "first": "Atrocitus", "middle": null, "last": "Rage", "suffix": null, "display": "Atrocitus Rage"}'::json,
  'atrocitus@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000085", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "185 Hero Lane", "line2": null, "city": "Ysmault", "state_or_province": "NV", "postal_code": "10085", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'saintwalker',
  crypt('saintwalker', gen_salt('bf')),
  '{"prefix": null, "first": "Bro''Dee", "middle": null, "last": "Walker", "suffix": null, "display": "Bro''Dee Walker"}'::json,
  'saintwalker@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000086", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "186 Hero Lane", "line2": null, "city": "Odym", "state_or_province": "CO", "postal_code": "10086", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'starsapphire',
  crypt('starsapphire', gen_salt('bf')),
  '{"prefix": null, "first": "Carol", "middle": null, "last": "Ferris", "suffix": null, "display": "Carol Ferris"}'::json,
  'starsapphire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000087", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "violet", "color2": "white"}'::json,
  '[{"label": "home", "line1": "187 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10087", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'parademon',
  crypt('parademon', gen_salt('bf')),
  '{"prefix": null, "first": "Parademon", "middle": null, "last": "Apokolips", "suffix": null, "display": "Parademon Apokolips"}'::json,
  'parademon@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000088", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "red"}'::json,
  '[{"label": "home", "line1": "188 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10088", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'ironman',
  crypt('ironman', gen_salt('bf')),
  '{"prefix": null, "first": "Tony", "middle": null, "last": "Stark", "suffix": null, "display": "Tony Stark"}'::json,
  'ironman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000089", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "10880 Malibu Point", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10089", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'captainamerica',
  crypt('captainamerica', gen_salt('bf')),
  '{"prefix": null, "first": "Steve", "middle": null, "last": "Rogers", "suffix": null, "display": "Steve Rogers"}'::json,
  'captainamerica@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000090", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "569 Leaman Pl", "line2": null, "city": "Brooklyn", "state_or_province": "NY", "postal_code": "10090", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'spiderman',
  crypt('spiderman', gen_salt('bf')),
  '{"prefix": null, "first": "Peter", "middle": null, "last": "Parker", "suffix": null, "display": "Peter Parker"}'::json,
  'spiderman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000091", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "20 Ingram St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10091", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'hulk',
  crypt('hulk', gen_salt('bf')),
  '{"prefix": null, "first": "Bruce", "middle": null, "last": "Banner", "suffix": null, "display": "Bruce Banner"}'::json,
  'hulk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000092", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "192 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10092", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'thor',
  crypt('thor', gen_salt('bf')),
  '{"prefix": null, "first": "Donald", "middle": null, "last": "Blake", "suffix": null, "display": "Donald Blake"}'::json,
  'thor@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000093", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "193 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10093", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blackwidow',
  crypt('blackwidow', gen_salt('bf')),
  '{"prefix": null, "first": "Natasha", "middle": null, "last": "Romanoff", "suffix": null, "display": "Natasha Romanoff"}'::json,
  'blackwidow@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000094", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "194 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10094", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'hawkeye',
  crypt('hawkeye', gen_salt('bf')),
  '{"prefix": null, "first": "Clint", "middle": null, "last": "Barton", "suffix": null, "display": "Clint Barton"}'::json,
  'hawkeye@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000095", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "195 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10095", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'scarletwitch',
  crypt('scarletwitch', gen_salt('bf')),
  '{"prefix": null, "first": "Wanda", "middle": null, "last": "Maximoff", "suffix": null, "display": "Wanda Maximoff"}'::json,
  'scarletwitch@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000096", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "196 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10096", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'vision',
  crypt('vision', gen_salt('bf')),
  '{"prefix": null, "first": "Victor", "middle": null, "last": "Shade", "suffix": null, "display": "Victor Shade"}'::json,
  'vision@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000097", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "green"}'::json,
  '[{"label": "home", "line1": "197 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10097", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'falcon',
  crypt('falcon', gen_salt('bf')),
  '{"prefix": null, "first": "Sam", "middle": null, "last": "Wilson", "suffix": null, "display": "Sam Wilson"}'::json,
  'falcon@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000098", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "198 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10098", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'wintersoldier',
  crypt('wintersoldier', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Buchanan", "suffix": null, "display": "James Buchanan"}'::json,
  'wintersoldier@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000099", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "199 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10099", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'antman',
  crypt('antman', gen_salt('bf')),
  '{"prefix": null, "first": "Scott", "middle": null, "last": "Lang", "suffix": null, "display": "Scott Lang"}'::json,
  'antman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000100", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "200 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10100", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'wasp',
  crypt('wasp', gen_salt('bf')),
  '{"prefix": null, "first": "Hope", "middle": null, "last": "van Dyne", "suffix": null, "display": "Hope van Dyne"}'::json,
  'wasp@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000101", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "201 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10101", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blackpanther',
  crypt('blackpanther', gen_salt('bf')),
  '{"prefix": null, "first": "T''Challa", "middle": null, "last": "Udaku", "suffix": null, "display": "T''Challa Udaku"}'::json,
  'blackpanther@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000102", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "Royal Palace", "line2": null, "city": "Wakanda", "state_or_province": "GA", "postal_code": "10102", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'doctorstrange',
  crypt('doctorstrange', gen_salt('bf')),
  '{"prefix": null, "first": "Stephen", "middle": null, "last": "Strange", "suffix": null, "display": "Stephen Strange"}'::json,
  'doctorstrange@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000103", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "177A Bleecker St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10103", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'captainmarvel',
  crypt('captainmarvel', gen_salt('bf')),
  '{"prefix": null, "first": "Carol", "middle": null, "last": "Danvers", "suffix": null, "display": "Carol Danvers"}'::json,
  'captainmarvel@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000104", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "204 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10104", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'msmarvel',
  crypt('msmarvel', gen_salt('bf')),
  '{"prefix": null, "first": "Kamala", "middle": null, "last": "Khan", "suffix": null, "display": "Kamala Khan"}'::json,
  'msmarvel@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000105", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "205 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10105", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'shehulk',
  crypt('shehulk', gen_salt('bf')),
  '{"prefix": null, "first": "Jennifer", "middle": null, "last": "Walters", "suffix": null, "display": "Jennifer Walters"}'::json,
  'shehulk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000106", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "206 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10106", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'daredevil',
  crypt('daredevil', gen_salt('bf')),
  '{"prefix": null, "first": "Matt", "middle": null, "last": "Murdock", "suffix": null, "display": "Matt Murdock"}'::json,
  'daredevil@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000107", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "250 W 57th St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10107", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'punisher',
  crypt('punisher', gen_salt('bf')),
  '{"prefix": null, "first": "Frank", "middle": null, "last": "Castle", "suffix": null, "display": "Frank Castle"}'::json,
  'punisher@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000108", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "123 Hell''s Kitchen Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10108", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'lukecage',
  crypt('lukecage', gen_salt('bf')),
  '{"prefix": null, "first": "Carl", "middle": null, "last": "Lucas", "suffix": null, "display": "Carl Lucas"}'::json,
  'lukecage@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000109", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "209 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10109", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'ironfist',
  crypt('ironfist', gen_salt('bf')),
  '{"prefix": null, "first": "Danny", "middle": null, "last": "Rand", "suffix": null, "display": "Danny Rand"}'::json,
  'ironfist@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000110", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "210 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10110", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'ghostrider',
  crypt('ghostrider', gen_salt('bf')),
  '{"prefix": null, "first": "Johnny", "middle": null, "last": "Blaze", "suffix": null, "display": "Johnny Blaze"}'::json,
  'ghostrider@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000111", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "211 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10111", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'silversurfer',
  crypt('silversurfer', gen_salt('bf')),
  '{"prefix": null, "first": "Norrin", "middle": null, "last": "Radd", "suffix": null, "display": "Norrin Radd"}'::json,
  'silversurfer@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000112", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "black"}'::json,
  '[{"label": "home", "line1": "212 Hero Lane", "line2": null, "city": "Knowhere", "state_or_province": "NV", "postal_code": "10112", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'fantasticfourmr',
  crypt('fantasticfourmr', gen_salt('bf')),
  '{"prefix": null, "first": "Reed", "middle": null, "last": "Richards", "suffix": null, "display": "Reed Richards"}'::json,
  'fantasticfourmr@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000113", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "42nd St and Madison Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10113", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'invisiblewoman',
  crypt('invisiblewoman', gen_salt('bf')),
  '{"prefix": null, "first": "Susan", "middle": null, "last": "Storm", "suffix": null, "display": "Susan Storm"}'::json,
  'invisiblewoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000114", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "214 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10114", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'humantorch',
  crypt('humantorch', gen_salt('bf')),
  '{"prefix": null, "first": "Johnny", "middle": null, "last": "Storm", "suffix": null, "display": "Johnny Storm"}'::json,
  'humantorch@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000115", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "215 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10115", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'thething',
  crypt('thething', gen_salt('bf')),
  '{"prefix": null, "first": "Benjamin", "middle": null, "last": "Grimm", "suffix": null, "display": "Benjamin Grimm"}'::json,
  'thething@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000116", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "216 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10116", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'deadpool',
  crypt('deadpool', gen_salt('bf')),
  '{"prefix": null, "first": "Wade", "middle": null, "last": "Wilson", "suffix": null, "display": "Wade Wilson"}'::json,
  'deadpool@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000117", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "217 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10117", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'wolverine',
  crypt('wolverine', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Howlett", "suffix": null, "display": "James Howlett"}'::json,
  'wolverine@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000118", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "218 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10118", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'storm',
  crypt('storm', gen_salt('bf')),
  '{"prefix": null, "first": "Ororo", "middle": null, "last": "Munroe", "suffix": null, "display": "Ororo Munroe"}'::json,
  'storm@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000119", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "219 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10119", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'cyclops',
  crypt('cyclops', gen_salt('bf')),
  '{"prefix": null, "first": "Scott", "middle": null, "last": "Summers", "suffix": null, "display": "Scott Summers"}'::json,
  'cyclops@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000120", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "220 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10120", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'professorx',
  crypt('professorx', gen_salt('bf')),
  '{"prefix": null, "first": "Charles", "middle": null, "last": "Xavier", "suffix": null, "display": "Charles Xavier"}'::json,
  'professorx@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000121", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "1407 Graymalkin Ln", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10121", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'magneto',
  crypt('magneto', gen_salt('bf')),
  '{"prefix": null, "first": "Max", "middle": null, "last": "Eisenhardt", "suffix": null, "display": "Max Eisenhardt"}'::json,
  'magneto@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000122", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "222 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10122", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'rogue',
  crypt('rogue', gen_salt('bf')),
  '{"prefix": null, "first": "Anna Marie", "middle": null, "last": "LeBeau", "suffix": null, "display": "Anna Marie LeBeau"}'::json,
  'rogue@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000123", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "223 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10123", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'gambit',
  crypt('gambit', gen_salt('bf')),
  '{"prefix": null, "first": "Remy", "middle": null, "last": "LeBeau", "suffix": null, "display": "Remy LeBeau"}'::json,
  'gambit@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000124", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "224 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10124", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'nightcrawler',
  crypt('nightcrawler', gen_salt('bf')),
  '{"prefix": null, "first": "Kurt", "middle": null, "last": "Wagner", "suffix": null, "display": "Kurt Wagner"}'::json,
  'nightcrawler@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000125", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "225 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10125", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'colossus',
  crypt('colossus', gen_salt('bf')),
  '{"prefix": null, "first": "Piotr", "middle": null, "last": "Rasputin", "suffix": null, "display": "Piotr Rasputin"}'::json,
  'colossus@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000126", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "226 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10126", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'iceman',
  crypt('iceman', gen_salt('bf')),
  '{"prefix": null, "first": "Bobby", "middle": null, "last": "Drake", "suffix": null, "display": "Bobby Drake"}'::json,
  'iceman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000127", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "227 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10127", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'beast',
  crypt('beast', gen_salt('bf')),
  '{"prefix": null, "first": "Henry", "middle": null, "last": "McCoy", "suffix": null, "display": "Henry McCoy"}'::json,
  'beast@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000128", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "228 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10128", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'kittypryde',
  crypt('kittypryde', gen_salt('bf')),
  '{"prefix": null, "first": "Katherine", "middle": null, "last": "Pryde", "suffix": null, "display": "Katherine Pryde"}'::json,
  'kittypryde@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000129", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "229 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10129", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'jubilee',
  crypt('jubilee', gen_salt('bf')),
  '{"prefix": null, "first": "Jubilation", "middle": null, "last": "Lee", "suffix": null, "display": "Jubilation Lee"}'::json,
  'jubilee@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000130", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "230 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10130", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'psylocke',
  crypt('psylocke', gen_salt('bf')),
  '{"prefix": null, "first": "Elizabeth", "middle": null, "last": "Braddock", "suffix": null, "display": "Elizabeth Braddock"}'::json,
  'psylocke@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000131", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "231 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10131", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'cable',
  crypt('cable', gen_salt('bf')),
  '{"prefix": null, "first": "Nathan", "middle": null, "last": "Summers", "suffix": null, "display": "Nathan Summers"}'::json,
  'cable@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000132", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "232 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10132", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'domino',
  crypt('domino', gen_salt('bf')),
  '{"prefix": null, "first": "Neena", "middle": null, "last": "Thurman", "suffix": null, "display": "Neena Thurman"}'::json,
  'domino@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000133", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "233 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10133", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'cablegirl',
  crypt('cablegirl', gen_salt('bf')),
  '{"prefix": null, "first": "Hope", "middle": null, "last": "Summers", "suffix": null, "display": "Hope Summers"}'::json,
  'cablegirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000134", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "234 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10134", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'x23',
  crypt('x23', gen_salt('bf')),
  '{"prefix": null, "first": "Laura", "middle": null, "last": "Kinney", "suffix": null, "display": "Laura Kinney"}'::json,
  'x23@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000135", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "235 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10135", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'dazzler',
  crypt('dazzler', gen_salt('bf')),
  '{"prefix": null, "first": "Alison", "middle": null, "last": "Blaire", "suffix": null, "display": "Alison Blaire"}'::json,
  'dazzler@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000136", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "236 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10136", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'bishop',
  crypt('bishop', gen_salt('bf')),
  '{"prefix": null, "first": "Lucas", "middle": null, "last": "Bishop", "suffix": null, "display": "Lucas Bishop"}'::json,
  'bishop@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000137", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "237 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10137", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'sunspot',
  crypt('sunspot', gen_salt('bf')),
  '{"prefix": null, "first": "Roberto", "middle": null, "last": "da Costa", "suffix": null, "display": "Roberto da Costa"}'::json,
  'sunspot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000138", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "238 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10138", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'magik',
  crypt('magik', gen_salt('bf')),
  '{"prefix": null, "first": "Illyana", "middle": null, "last": "Rasputin", "suffix": null, "display": "Illyana Rasputin"}'::json,
  'magik@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000139", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "black"}'::json,
  '[{"label": "home", "line1": "239 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10139", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'namor',
  crypt('namor', gen_salt('bf')),
  '{"prefix": null, "first": "Namor", "middle": null, "last": "McKenzie", "suffix": null, "display": "Namor McKenzie"}'::json,
  'namor@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000140", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "240 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10140", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'sentry',
  crypt('sentry', gen_salt('bf')),
  '{"prefix": null, "first": "Robert", "middle": null, "last": "Reynolds", "suffix": null, "display": "Robert Reynolds"}'::json,
  'sentry@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000141", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "241 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10141", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'moonknight',
  crypt('moonknight', gen_salt('bf')),
  '{"prefix": null, "first": "Marc", "middle": null, "last": "Spector", "suffix": null, "display": "Marc Spector"}'::json,
  'moonknight@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000142", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "242 Hero Lane", "line2": null, "city": "Chicago", "state_or_province": "IL", "postal_code": "10142", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'blade',
  crypt('blade', gen_salt('bf')),
  '{"prefix": null, "first": "Eric", "middle": null, "last": "Brooks", "suffix": null, "display": "Eric Brooks"}'::json,
  'blade@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000143", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "243 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10143", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'ghostspider',
  crypt('ghostspider', gen_salt('bf')),
  '{"prefix": null, "first": "Gwen", "middle": null, "last": "Stacy", "suffix": null, "display": "Gwen Stacy"}'::json,
  'ghostspider@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000144", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "244 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10144", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'venom',
  crypt('venom', gen_salt('bf')),
  '{"prefix": null, "first": "Eddie", "middle": null, "last": "Brock", "suffix": null, "display": "Eddie Brock"}'::json,
  'venom@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000145", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "245 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10145", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'greengoblin',
  crypt('greengoblin', gen_salt('bf')),
  '{"prefix": null, "first": "Norman", "middle": null, "last": "Osborn", "suffix": null, "display": "Norman Osborn"}'::json,
  'greengoblin@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000146", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "246 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10146", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'doctoroctopus',
  crypt('doctoroctopus', gen_salt('bf')),
  '{"prefix": null, "first": "Otto", "middle": null, "last": "Octavius", "suffix": null, "display": "Otto Octavius"}'::json,
  'doctoroctopus@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000147", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "247 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10147", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'lizard',
  crypt('lizard', gen_salt('bf')),
  '{"prefix": null, "first": "Curt", "middle": null, "last": "Connors", "suffix": null, "display": "Curt Connors"}'::json,
  'lizard@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000148", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "248 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10148", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'kingpin',
  crypt('kingpin', gen_salt('bf')),
  '{"prefix": null, "first": "Wilson", "middle": null, "last": "Fisk", "suffix": null, "display": "Wilson Fisk"}'::json,
  'kingpin@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000149", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "black"}'::json,
  '[{"label": "home", "line1": "249 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10149", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'electro',
  crypt('electro', gen_salt('bf')),
  '{"prefix": null, "first": "Max", "middle": null, "last": "Dillon", "suffix": null, "display": "Max Dillon"}'::json,
  'electro@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000150", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "250 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10150", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'vulture',
  crypt('vulture', gen_salt('bf')),
  '{"prefix": null, "first": "Adrian", "middle": null, "last": "Toomes", "suffix": null, "display": "Adrian Toomes"}'::json,
  'vulture@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000151", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "251 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10151", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'mysterio',
  crypt('mysterio', gen_salt('bf')),
  '{"prefix": null, "first": "Quentin", "middle": null, "last": "Beck", "suffix": null, "display": "Quentin Beck"}'::json,
  'mysterio@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000152", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "252 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10152", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'rhino',
  crypt('rhino', gen_salt('bf')),
  '{"prefix": null, "first": "Aleksei", "middle": null, "last": "Sytsevich", "suffix": null, "display": "Aleksei Sytsevich"}'::json,
  'rhino@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000153", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "white"}'::json,
  '[{"label": "home", "line1": "253 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10153", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'shocker',
  crypt('shocker', gen_salt('bf')),
  '{"prefix": null, "first": "Herman", "middle": null, "last": "Schultz", "suffix": null, "display": "Herman Schultz"}'::json,
  'shocker@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000154", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "254 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10154", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'scorpion',
  crypt('scorpion', gen_salt('bf')),
  '{"prefix": null, "first": "Mac", "middle": null, "last": "Gargan", "suffix": null, "display": "Mac Gargan"}'::json,
  'scorpion@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000155", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "255 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10155", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'kraven',
  crypt('kraven', gen_salt('bf')),
  '{"prefix": null, "first": "Sergei", "middle": null, "last": "Kravinoff", "suffix": null, "display": "Sergei Kravinoff"}'::json,
  'kraven@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000156", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "256 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10156", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'morbius',
  crypt('morbius', gen_salt('bf')),
  '{"prefix": null, "first": "Michael", "middle": null, "last": "Morbius", "suffix": null, "display": "Michael Morbius"}'::json,
  'morbius@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000157", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "257 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10157", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'nova',
  crypt('nova', gen_salt('bf')),
  '{"prefix": null, "first": "Richard", "middle": null, "last": "Rider", "suffix": null, "display": "Richard Rider"}'::json,
  'nova@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000158", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "black"}'::json,
  '[{"label": "home", "line1": "258 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10158", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'starlord',
  crypt('starlord', gen_salt('bf')),
  '{"prefix": null, "first": "Peter", "middle": null, "last": "Quill", "suffix": null, "display": "Peter Quill"}'::json,
  'starlord@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000159", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "259 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10159", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'gamora',
  crypt('gamora', gen_salt('bf')),
  '{"prefix": null, "first": "Gamora", "middle": null, "last": "Zen Whoberi", "suffix": null, "display": "Gamora Zen Whoberi"}'::json,
  'gamora@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000160", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "260 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10160", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'drax',
  crypt('drax', gen_salt('bf')),
  '{"prefix": null, "first": "Drax", "middle": null, "last": "Destroyer", "suffix": null, "display": "Drax Destroyer"}'::json,
  'drax@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000161", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "red"}'::json,
  '[{"label": "home", "line1": "261 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10161", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'rocket',
  crypt('rocket', gen_salt('bf')),
  '{"prefix": null, "first": "Rocket", "middle": null, "last": "Raccoon", "suffix": null, "display": "Rocket Raccoon"}'::json,
  'rocket@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000162", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "262 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10162", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'groot',
  crypt('groot', gen_salt('bf')),
  '{"prefix": null, "first": "Groot", "middle": null, "last": "Tree", "suffix": null, "display": "Groot Tree"}'::json,
  'groot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000163", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "green"}'::json,
  '[{"label": "home", "line1": "263 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10163", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'mantis',
  crypt('mantis', gen_salt('bf')),
  '{"prefix": null, "first": "Mantis", "middle": null, "last": "Brandt", "suffix": null, "display": "Mantis Brandt"}'::json,
  'mantis@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000164", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "264 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10164", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'nebula',
  crypt('nebula', gen_salt('bf')),
  '{"prefix": null, "first": "Nebula", "middle": null, "last": "Titan", "suffix": null, "display": "Nebula Titan"}'::json,
  'nebula@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000165", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "265 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10165", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'yondu',
  crypt('yondu', gen_salt('bf')),
  '{"prefix": null, "first": "Yondu", "middle": null, "last": "Udonta", "suffix": null, "display": "Yondu Udonta"}'::json,
  'yondu@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000166", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "266 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10166", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'thanos',
  crypt('thanos', gen_salt('bf')),
  '{"prefix": null, "first": "Thanos", "middle": null, "last": "Titan", "suffix": null, "display": "Thanos Titan"}'::json,
  'thanos@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000167", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "267 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10167", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'loki',
  crypt('loki', gen_salt('bf')),
  '{"prefix": null, "first": "Loki", "middle": null, "last": "Laufeyson", "suffix": null, "display": "Loki Laufeyson"}'::json,
  'loki@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000168", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "268 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10168", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'hela',
  crypt('hela', gen_salt('bf')),
  '{"prefix": null, "first": "Hela", "middle": null, "last": "Asgard", "suffix": null, "display": "Hela Asgard"}'::json,
  'hela@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000169", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "green"}'::json,
  '[{"label": "home", "line1": "269 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10169", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'valkyrie',
  crypt('valkyrie', gen_salt('bf')),
  '{"prefix": null, "first": "Brunnhilde", "middle": null, "last": "Valkyrie", "suffix": null, "display": "Brunnhilde Valkyrie"}'::json,
  'valkyrie@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000170", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "270 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10170", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'korg',
  crypt('korg', gen_salt('bf')),
  '{"prefix": null, "first": "Korg", "middle": null, "last": "Kronan", "suffix": null, "display": "Korg Kronan"}'::json,
  'korg@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000171", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "271 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10171", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'miek',
  crypt('miek', gen_salt('bf')),
  '{"prefix": null, "first": "Miek", "middle": null, "last": "Sakaar", "suffix": null, "display": "Miek Sakaar"}'::json,
  'miek@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000172", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "red"}'::json,
  '[{"label": "home", "line1": "272 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10172", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'shuri',
  crypt('shuri', gen_salt('bf')),
  '{"prefix": null, "first": "Shuri", "middle": null, "last": "Udaku", "suffix": null, "display": "Shuri Udaku"}'::json,
  'shuri@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000173", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "273 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10173", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'okoye',
  crypt('okoye', gen_salt('bf')),
  '{"prefix": null, "first": "Okoye", "middle": null, "last": "Dora Milaje", "suffix": null, "display": "Okoye Dora Milaje"}'::json,
  'okoye@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000174", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "274 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10174", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'killmonger',
  crypt('killmonger', gen_salt('bf')),
  '{"prefix": null, "first": "Erik", "middle": null, "last": "Stevens", "suffix": null, "display": "Erik Stevens"}'::json,
  'killmonger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000175", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "275 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10175", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'mysterio2',
  crypt('mysterio2', gen_salt('bf')),
  '{"prefix": null, "first": "Ludwig", "middle": null, "last": "Ravelli", "suffix": null, "display": "Ludwig Ravelli"}'::json,
  'mysterio2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000176", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "green"}'::json,
  '[{"label": "home", "line1": "276 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10176", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'warmachine',
  crypt('warmachine', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Rhodes", "suffix": null, "display": "James Rhodes"}'::json,
  'warmachine@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000177", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "277 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10177", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'pepperpotts',
  crypt('pepperpotts', gen_salt('bf')),
  '{"prefix": null, "first": "Virginia", "middle": null, "last": "Potts", "suffix": null, "display": "Virginia Potts"}'::json,
  'pepperpotts@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000178", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "278 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10178", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'nickfury',
  crypt('nickfury', gen_salt('bf')),
  '{"prefix": null, "first": "Nicholas", "middle": null, "last": "Fury", "suffix": null, "display": "Nicholas Fury"}'::json,
  'nickfury@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000179", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "279 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10179", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'agentcoulson',
  crypt('agentcoulson', gen_salt('bf')),
  '{"prefix": null, "first": "Phil", "middle": null, "last": "Coulson", "suffix": null, "display": "Phil Coulson"}'::json,
  'agentcoulson@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000180", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "280 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10180", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'buckybarnes',
  crypt('buckybarnes', gen_salt('bf')),
  '{"prefix": null, "first": "James", "middle": null, "last": "Barnes", "suffix": null, "display": "James Barnes"}'::json,
  'buckybarnes@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000181", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "281 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10181", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'quicksilver',
  crypt('quicksilver', gen_salt('bf')),
  '{"prefix": null, "first": "Pietro", "middle": null, "last": "Maximoff", "suffix": null, "display": "Pietro Maximoff"}'::json,
  'quicksilver@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000182", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "282 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10182", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'scarletspider',
  crypt('scarletspider', gen_salt('bf')),
  '{"prefix": null, "first": "Ben", "middle": null, "last": "Reilly", "suffix": null, "display": "Ben Reilly"}'::json,
  'scarletspider@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000183", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "283 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10183", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

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
  modified_by,
  modified_date
)
SELECT
  'spiderwoman',
  crypt('spiderwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Jessica", "middle": null, "last": "Drew", "suffix": null, "display": "Jessica Drew"}'::json,
  'spiderwoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000184", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "284 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10184", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spiderwoman'
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
  modified_by,
  modified_date
)
SELECT
  'silk',
  crypt('silk', gen_salt('bf')),
  '{"prefix": null, "first": "Cindy", "middle": null, "last": "Moon", "suffix": null, "display": "Cindy Moon"}'::json,
  'silk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000185", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "285 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10185", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'silk'
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
  modified_by,
  modified_date
)
SELECT
  'moongirl',
  crypt('moongirl', gen_salt('bf')),
  '{"prefix": null, "first": "Lunella", "middle": null, "last": "Lafayette", "suffix": null, "display": "Lunella Lafayette"}'::json,
  'moongirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000186", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "286 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10186", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'moongirl'
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
  modified_by,
  modified_date
)
SELECT
  'ironheart',
  crypt('ironheart', gen_salt('bf')),
  '{"prefix": null, "first": "Riri", "middle": null, "last": "Williams", "suffix": null, "display": "Riri Williams"}'::json,
  'ironheart@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000187", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "287 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10187", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ironheart'
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
  modified_by,
  modified_date
)
SELECT
  'patriot',
  crypt('patriot', gen_salt('bf')),
  '{"prefix": null, "first": "Eli", "middle": null, "last": "Bradley", "suffix": null, "display": "Eli Bradley"}'::json,
  'patriot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000188", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "288 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10188", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'patriot'
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
  modified_by,
  modified_date
)
SELECT
  'yelena',
  crypt('yelena', gen_salt('bf')),
  '{"prefix": null, "first": "Yelena", "middle": null, "last": "Belova", "suffix": null, "display": "Yelena Belova"}'::json,
  'yelena@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000189", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "289 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10189", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'yelena'
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
  modified_by,
  modified_date
)
SELECT
  'redguardian',
  crypt('redguardian', gen_salt('bf')),
  '{"prefix": null, "first": "Alexei", "middle": null, "last": "Shostakov", "suffix": null, "display": "Alexei Shostakov"}'::json,
  'redguardian@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000190", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "290 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10190", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'redguardian'
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
  modified_by,
  modified_date
)
SELECT
  'taskmaster',
  crypt('taskmaster', gen_salt('bf')),
  '{"prefix": null, "first": "Tony", "middle": null, "last": "Masters", "suffix": null, "display": "Tony Masters"}'::json,
  'taskmaster@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000191", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "black"}'::json,
  '[{"label": "home", "line1": "291 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10191", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'taskmaster'
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
  modified_by,
  modified_date
)
SELECT
  'ultron',
  crypt('ultron', gen_salt('bf')),
  '{"prefix": null, "first": "Ultron", "middle": null, "last": "Prime", "suffix": null, "display": "Ultron Prime"}'::json,
  'ultron@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000192", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "292 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10192", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ultron'
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
  modified_by,
  modified_date
)
SELECT
  'vision2',
  crypt('vision2', gen_salt('bf')),
  '{"prefix": null, "first": "Vision", "middle": null, "last": "Android", "suffix": null, "display": "Vision Android"}'::json,
  'vision2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000193", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "293 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10193", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'vision2'
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
  modified_by,
  modified_date
)
SELECT
  'wong',
  crypt('wong', gen_salt('bf')),
  '{"prefix": null, "first": "Wong", "middle": null, "last": "Master", "suffix": null, "display": "Wong Master"}'::json,
  'wong@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000194", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "294 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10194", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wong'
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
  modified_by,
  modified_date
)
SELECT
  'mordo',
  crypt('mordo', gen_salt('bf')),
  '{"prefix": null, "first": "Karl", "middle": null, "last": "Mordo", "suffix": null, "display": "Karl Mordo"}'::json,
  'mordo@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000195", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "295 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10195", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mordo'
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
  modified_by,
  modified_date
)
SELECT
  'ghost',
  crypt('ghost', gen_salt('bf')),
  '{"prefix": null, "first": "Ava", "middle": null, "last": "Starr", "suffix": null, "display": "Ava Starr"}'::json,
  'ghost@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000196", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "296 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10196", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ghost'
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
  modified_by,
  modified_date
)
SELECT
  'yellowjacket',
  crypt('yellowjacket', gen_salt('bf')),
  '{"prefix": null, "first": "Darren", "middle": null, "last": "Cross", "suffix": null, "display": "Darren Cross"}'::json,
  'yellowjacket@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000197", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "297 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10197", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'yellowjacket'
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
  modified_by,
  modified_date
)
SELECT
  'stature',
  crypt('stature', gen_salt('bf')),
  '{"prefix": null, "first": "Cassie", "middle": null, "last": "Lang", "suffix": null, "display": "Cassie Lang"}'::json,
  'stature@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000198", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "298 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10198", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'stature'
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
  modified_by,
  modified_date
)
SELECT
  'wiccan',
  crypt('wiccan', gen_salt('bf')),
  '{"prefix": null, "first": "William", "middle": null, "last": "Kaplan", "suffix": null, "display": "William Kaplan"}'::json,
  'wiccan@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000199", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "299 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10199", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wiccan'
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
  modified_by,
  modified_date
)
SELECT
  'hulkling',
  crypt('hulkling', gen_salt('bf')),
  '{"prefix": null, "first": "Theodore", "middle": null, "last": "Altman", "suffix": null, "display": "Theodore Altman"}'::json,
  'hulkling@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000200", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "300 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10200", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hulkling'
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
  modified_by,
  modified_date
)
SELECT
  'speed',
  crypt('speed', gen_salt('bf')),
  '{"prefix": null, "first": "Thomas", "middle": null, "last": "Shepherd", "suffix": null, "display": "Thomas Shepherd"}'::json,
  'speed@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000201", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "301 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10201", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'speed'
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
  modified_by,
  modified_date
)
SELECT
  'northstar',
  crypt('northstar', gen_salt('bf')),
  '{"prefix": null, "first": "Jean-Paul", "middle": null, "last": "Beaubier", "suffix": null, "display": "Jean-Paul Beaubier"}'::json,
  'northstar@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000202", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "black"}'::json,
  '[{"label": "home", "line1": "302 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10202", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'northstar'
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
  modified_by,
  modified_date
)
SELECT
  'iceman2',
  crypt('iceman2', gen_salt('bf')),
  '{"prefix": null, "first": "Robert", "middle": null, "last": "Drake", "suffix": null, "display": "Robert Drake"}'::json,
  'iceman2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000203", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "303 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10203", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'iceman2'
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
  modified_by,
  modified_date
)
SELECT
  'squirrelgirl',
  crypt('squirrelgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Doreen", "middle": null, "last": "Green", "suffix": null, "display": "Doreen Green"}'::json,
  'squirrelgirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000204", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "304 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10204", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'squirrelgirl'
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
  modified_by,
  modified_date
)
SELECT
  'hellcat',
  crypt('hellcat', gen_salt('bf')),
  '{"prefix": null, "first": "Patsy", "middle": null, "last": "Walker", "suffix": null, "display": "Patsy Walker"}'::json,
  'hellcat@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000205", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "305 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10205", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hellcat'
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
  modified_by,
  modified_date
)
SELECT
  'whitetiger',
  crypt('whitetiger', gen_salt('bf')),
  '{"prefix": null, "first": "Ava", "middle": null, "last": "Ayala", "suffix": null, "display": "Ava Ayala"}'::json,
  'whitetiger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000206", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "black"}'::json,
  '[{"label": "home", "line1": "306 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10206", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'whitetiger'
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
  modified_by,
  modified_date
)
SELECT
  'ironlad',
  crypt('ironlad', gen_salt('bf')),
  '{"prefix": null, "first": "Nathaniel", "middle": null, "last": "Richards", "suffix": null, "display": "Nathaniel Richards"}'::json,
  'ironlad@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000207", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "307 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10207", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ironlad'
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
  modified_by,
  modified_date
)
SELECT
  'galactus',
  crypt('galactus', gen_salt('bf')),
  '{"prefix": null, "first": "Galan", "middle": null, "last": "Galactus", "suffix": null, "display": "Galan Galactus"}'::json,
  'galactus@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000208", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "308 Hero Lane", "line2": null, "city": "Worldship", "state_or_province": "NY", "postal_code": "10208", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'galactus'
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
  modified_by,
  modified_date
)
SELECT
  'dormammu',
  crypt('dormammu', gen_salt('bf')),
  '{"prefix": null, "first": "Dormammu", "middle": null, "last": "Dark", "suffix": null, "display": "Dormammu Dark"}'::json,
  'dormammu@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000209", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "309 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10209", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'dormammu'
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
  modified_by,
  modified_date
)
SELECT
  'ghostriderrobbie',
  crypt('ghostriderrobbie', gen_salt('bf')),
  '{"prefix": null, "first": "Robbie", "middle": null, "last": "Reyes", "suffix": null, "display": "Robbie Reyes"}'::json,
  'ghostriderrobbie@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000210", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "310 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10210", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ghostriderrobbie'
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
  modified_by,
  modified_date
)
SELECT
  'punisher2099',
  crypt('punisher2099', gen_salt('bf')),
  '{"prefix": null, "first": "Jake", "middle": null, "last": "Gallows", "suffix": null, "display": "Jake Gallows"}'::json,
  'punisher2099@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000211", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "311 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10211", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'punisher2099'
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
  modified_by,
  modified_date
)
SELECT
  'spiderpunk',
  crypt('spiderpunk', gen_salt('bf')),
  '{"prefix": null, "first": "Hobie", "middle": null, "last": "Brown", "suffix": null, "display": "Hobie Brown"}'::json,
  'spiderpunk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000212", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "312 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10212", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spiderpunk'
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
  modified_by,
  modified_date
)
SELECT
  'spideruk',
  crypt('spideruk', gen_salt('bf')),
  '{"prefix": null, "first": "William", "middle": null, "last": "Braddock", "suffix": null, "display": "William Braddock"}'::json,
  'spideruk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000213", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "313 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10213", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spideruk'
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
  modified_by,
  modified_date
)
SELECT
  'spiderham',
  crypt('spiderham', gen_salt('bf')),
  '{"prefix": null, "first": "Peter", "middle": null, "last": "Porker", "suffix": null, "display": "Peter Porker"}'::json,
  'spiderham@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000214", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "314 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10214", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spiderham'
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
  modified_by,
  modified_date
)
SELECT
  'sentry2',
  crypt('sentry2', gen_salt('bf')),
  '{"prefix": null, "first": "Bob", "middle": null, "last": "Reynolds", "suffix": null, "display": "Bob Reynolds"}'::json,
  'sentry2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000215", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "315 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10215", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sentry2'
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
  modified_by,
  modified_date
)
SELECT
  'bluemarvel',
  crypt('bluemarvel', gen_salt('bf')),
  '{"prefix": null, "first": "Adam", "middle": null, "last": "Brashear", "suffix": null, "display": "Adam Brashear"}'::json,
  'bluemarvel@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000216", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "316 Hero Lane", "line2": null, "city": "Maryland", "state_or_province": "MD", "postal_code": "10216", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bluemarvel'
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
  modified_by,
  modified_date
)
SELECT
  'spectrum',
  crypt('spectrum', gen_salt('bf')),
  '{"prefix": null, "first": "Monica", "middle": null, "last": "Rambeau", "suffix": null, "display": "Monica Rambeau"}'::json,
  'spectrum@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000217", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "317 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10217", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spectrum'
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
  modified_by,
  modified_date
)
SELECT
  'rogue2',
  crypt('rogue2', gen_salt('bf')),
  '{"prefix": null, "first": "Rogue", "middle": null, "last": "X-Men", "suffix": null, "display": "Rogue X-Men"}'::json,
  'rogue2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000218", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "green"}'::json,
  '[{"label": "home", "line1": "318 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10218", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rogue2'
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
  modified_by,
  modified_date
)
SELECT
  'mystique',
  crypt('mystique', gen_salt('bf')),
  '{"prefix": null, "first": "Raven", "middle": null, "last": "Darkholme", "suffix": null, "display": "Raven Darkholme"}'::json,
  'mystique@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000219", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "319 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10219", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mystique'
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
  modified_by,
  modified_date
)
SELECT
  'sabretooth',
  crypt('sabretooth', gen_salt('bf')),
  '{"prefix": null, "first": "Victor", "middle": null, "last": "Creed", "suffix": null, "display": "Victor Creed"}'::json,
  'sabretooth@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000220", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "320 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10220", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sabretooth'
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
  modified_by,
  modified_date
)
SELECT
  'omegared',
  crypt('omegared', gen_salt('bf')),
  '{"prefix": null, "first": "Arkady", "middle": null, "last": "Rossovich", "suffix": null, "display": "Arkady Rossovich"}'::json,
  'omegared@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000221", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "321 Hero Lane", "line2": null, "city": "Berlin", "state_or_province": "NH", "postal_code": "10221", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'omegared'
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
  modified_by,
  modified_date
)
SELECT
  'juggernaut',
  crypt('juggernaut', gen_salt('bf')),
  '{"prefix": null, "first": "Cain", "middle": null, "last": "Marko", "suffix": null, "display": "Cain Marko"}'::json,
  'juggernaut@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000222", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "322 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10222", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'juggernaut'
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
  modified_by,
  modified_date
)
SELECT
  'blob',
  crypt('blob', gen_salt('bf')),
  '{"prefix": null, "first": "Fred", "middle": null, "last": "Dukes", "suffix": null, "display": "Fred Dukes"}'::json,
  'blob@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000223", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "white"}'::json,
  '[{"label": "home", "line1": "323 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10223", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blob'
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
  modified_by,
  modified_date
)
SELECT
  'toad',
  crypt('toad', gen_salt('bf')),
  '{"prefix": null, "first": "Mortimer", "middle": null, "last": "Toynbee", "suffix": null, "display": "Mortimer Toynbee"}'::json,
  'toad@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000224", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "324 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10224", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'toad'
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
  modified_by,
  modified_date
)
SELECT
  'pyro',
  crypt('pyro', gen_salt('bf')),
  '{"prefix": null, "first": "St. John", "middle": null, "last": "Allerdyce", "suffix": null, "display": "St. John Allerdyce"}'::json,
  'pyro@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000225", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "325 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10225", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'pyro'
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
  modified_by,
  modified_date
)
SELECT
  'ladydeathstrike',
  crypt('ladydeathstrike', gen_salt('bf')),
  '{"prefix": null, "first": "Yuriko", "middle": null, "last": "Oyama", "suffix": null, "display": "Yuriko Oyama"}'::json,
  'ladydeathstrike@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000226", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "red"}'::json,
  '[{"label": "home", "line1": "326 Hero Lane", "line2": null, "city": "Osaka", "state_or_province": "HI", "postal_code": "10226", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ladydeathstrike'
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
  modified_by,
  modified_date
)
SELECT
  'omegasentinel',
  crypt('omegasentinel', gen_salt('bf')),
  '{"prefix": null, "first": "Karima", "middle": null, "last": "Shapandar", "suffix": null, "display": "Karima Shapandar"}'::json,
  'omegasentinel@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000227", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "327 Hero Lane", "line2": null, "city": "New Delhi", "state_or_province": "IN", "postal_code": "10227", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'omegasentinel'
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
  modified_by,
  modified_date
)
SELECT
  'sentinel',
  crypt('sentinel', gen_salt('bf')),
  '{"prefix": null, "first": "Sentinel", "middle": null, "last": "Prime", "suffix": null, "display": "Sentinel Prime"}'::json,
  'sentinel@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000228", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "328 Hero Lane", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10228", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sentinel'
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
  modified_by,
  modified_date
)
SELECT
  'hulkred',
  crypt('hulkred', gen_salt('bf')),
  '{"prefix": null, "first": "Thaddeus", "middle": null, "last": "Ross", "suffix": null, "display": "Thaddeus Ross"}'::json,
  'hulkred@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000229", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "329 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10229", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hulkred'
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
  modified_by,
  modified_date
)
SELECT
  'abomination',
  crypt('abomination', gen_salt('bf')),
  '{"prefix": null, "first": "Emil", "middle": null, "last": "Blonsky", "suffix": null, "display": "Emil Blonsky"}'::json,
  'abomination@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000230", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "330 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10230", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'abomination'
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
  modified_by,
  modified_date
)
SELECT
  'leader',
  crypt('leader', gen_salt('bf')),
  '{"prefix": null, "first": "Samuel", "middle": null, "last": "Sterns", "suffix": null, "display": "Samuel Sterns"}'::json,
  'leader@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000231", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "331 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10231", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'leader'
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
  modified_by,
  modified_date
)
SELECT
  'modok',
  crypt('modok', gen_salt('bf')),
  '{"prefix": null, "first": "George", "middle": null, "last": "Tarlton", "suffix": null, "display": "George Tarlton"}'::json,
  'modok@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000232", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "332 Hero Lane", "line2": null, "city": "Yorktown", "state_or_province": "NY", "postal_code": "10232", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'modok'
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
  modified_by,
  modified_date
)
SELECT
  'redskull',
  crypt('redskull', gen_salt('bf')),
  '{"prefix": null, "first": "Johann", "middle": null, "last": "Schmidt", "suffix": null, "display": "Johann Schmidt"}'::json,
  'redskull@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000233", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "333 Hero Lane", "line2": null, "city": "Exile Island", "state_or_province": "FL", "postal_code": "10233", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'redskull'
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
  modified_by,
  modified_date
)
SELECT
  'baronzemo',
  crypt('baronzemo', gen_salt('bf')),
  '{"prefix": null, "first": "Helmut", "middle": null, "last": "Zemo", "suffix": null, "display": "Helmut Zemo"}'::json,
  'baronzemo@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000234", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "334 Hero Lane", "line2": null, "city": "Sokovia", "state_or_province": "NY", "postal_code": "10234", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'baronzemo'
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
  modified_by,
  modified_date
)
SELECT
  'whiplash',
  crypt('whiplash', gen_salt('bf')),
  '{"prefix": null, "first": "Ivan", "middle": null, "last": "Vanko", "suffix": null, "display": "Ivan Vanko"}'::json,
  'whiplash@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000235", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "black"}'::json,
  '[{"label": "home", "line1": "335 Hero Lane", "line2": null, "city": "Moscow", "state_or_province": "ID", "postal_code": "10235", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'whiplash'
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
  modified_by,
  modified_date
)
SELECT
  'mandarin',
  crypt('mandarin', gen_salt('bf')),
  '{"prefix": null, "first": "Xin", "middle": null, "last": "Zhang", "suffix": null, "display": "Xin Zhang"}'::json,
  'mandarin@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000236", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "336 Hero Lane", "line2": null, "city": "Miami", "state_or_province": "FL", "postal_code": "10236", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mandarin'
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
  modified_by,
  modified_date
)
SELECT
  'clea',
  crypt('clea', gen_salt('bf')),
  '{"prefix": null, "first": "Clea", "middle": null, "last": "Strange", "suffix": null, "display": "Clea Strange"}'::json,
  'clea@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000237", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "337 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10237", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'clea'
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
  modified_by,
  modified_date
)
SELECT
  'hellstorm',
  crypt('hellstorm', gen_salt('bf')),
  '{"prefix": null, "first": "Daimon", "middle": null, "last": "Hellstrom", "suffix": null, "display": "Daimon Hellstrom"}'::json,
  'hellstorm@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000238", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "338 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10238", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hellstorm'
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
  modified_by,
  modified_date
)
SELECT
  'satana',
  crypt('satana', gen_salt('bf')),
  '{"prefix": null, "first": "Satana", "middle": null, "last": "Hellstrom", "suffix": null, "display": "Satana Hellstrom"}'::json,
  'satana@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000239", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "339 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10239", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'satana'
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
  modified_by,
  modified_date
)
SELECT
  'hellcat2',
  crypt('hellcat2', gen_salt('bf')),
  '{"prefix": null, "first": "Hellcat", "middle": null, "last": "Walker", "suffix": null, "display": "Hellcat Walker"}'::json,
  'hellcat2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000240", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "340 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10240", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hellcat2'
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
  modified_by,
  modified_date
)
SELECT
  'manthing',
  crypt('manthing', gen_salt('bf')),
  '{"prefix": null, "first": "Theodore", "middle": null, "last": "Sallis", "suffix": null, "display": "Theodore Sallis"}'::json,
  'manthing@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000241", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "341 Hero Lane", "line2": null, "city": "Everglades", "state_or_province": "FL", "postal_code": "10241", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'manthing'
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
  modified_by,
  modified_date
)
SELECT
  'invincible',
  crypt('invincible', gen_salt('bf')),
  '{"prefix": null, "first": "Mark", "middle": null, "last": "Grayson", "suffix": null, "display": "Mark Grayson"}'::json,
  'invincible@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000242", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "342 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10242", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'invincible'
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
  modified_by,
  modified_date
)
SELECT
  'atomeve',
  crypt('atomeve', gen_salt('bf')),
  '{"prefix": null, "first": "Samantha", "middle": null, "last": "Eve", "suffix": null, "display": "Samantha Eve"}'::json,
  'atomeve@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000243", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "white"}'::json,
  '[{"label": "home", "line1": "343 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10243", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'atomeve'
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
  modified_by,
  modified_date
)
SELECT
  'omniman',
  crypt('omniman', gen_salt('bf')),
  '{"prefix": null, "first": "Nolan", "middle": null, "last": "Grayson", "suffix": null, "display": "Nolan Grayson"}'::json,
  'omniman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000244", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "344 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10244", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'omniman'
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
  modified_by,
  modified_date
)
SELECT
  'robot',
  crypt('robot', gen_salt('bf')),
  '{"prefix": null, "first": "Rudolph", "middle": null, "last": "Connors", "suffix": null, "display": "Rudolph Connors"}'::json,
  'robot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000245", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "345 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10245", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'robot'
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
  modified_by,
  modified_date
)
SELECT
  'rexsplode',
  crypt('rexsplode', gen_salt('bf')),
  '{"prefix": null, "first": "Rex", "middle": null, "last": "Sloan", "suffix": null, "display": "Rex Sloan"}'::json,
  'rexsplode@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000246", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "346 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10246", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rexsplode'
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
  modified_by,
  modified_date
)
SELECT
  'duplikate',
  crypt('duplikate', gen_salt('bf')),
  '{"prefix": null, "first": "Kate", "middle": null, "last": "Cha", "suffix": null, "display": "Kate Cha"}'::json,
  'duplikate@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000247", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "347 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10247", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'duplikate'
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
  modified_by,
  modified_date
)
SELECT
  'monstergirl',
  crypt('monstergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Amanda", "middle": null, "last": "Young", "suffix": null, "display": "Amanda Young"}'::json,
  'monstergirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000248", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "348 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10248", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'monstergirl'
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
  modified_by,
  modified_date
)
SELECT
  'immortal',
  crypt('immortal', gen_salt('bf')),
  '{"prefix": null, "first": "Abraham", "middle": null, "last": "Lincoln", "suffix": null, "display": "Abraham Lincoln"}'::json,
  'immortal@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000249", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "349 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10249", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'immortal'
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
  modified_by,
  modified_date
)
SELECT
  'bulletproof',
  crypt('bulletproof', gen_salt('bf')),
  '{"prefix": null, "first": "Zandale", "middle": null, "last": "Randolph", "suffix": null, "display": "Zandale Randolph"}'::json,
  'bulletproof@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000250", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "350 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10250", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bulletproof'
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
  modified_by,
  modified_date
)
SELECT
  'blacksamson',
  crypt('blacksamson', gen_salt('bf')),
  '{"prefix": null, "first": "Marcus", "middle": null, "last": "Grimshaw", "suffix": null, "display": "Marcus Grimshaw"}'::json,
  'blacksamson@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000251", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "351 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10251", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blacksamson'
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
  modified_by,
  modified_date
)
SELECT
  'warwoman',
  crypt('warwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Holly", "middle": null, "last": "Winters", "suffix": null, "display": "Holly Winters"}'::json,
  'warwoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000252", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "352 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10252", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'warwoman'
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
  modified_by,
  modified_date
)
SELECT
  'shrinkray',
  crypt('shrinkray', gen_salt('bf')),
  '{"prefix": null, "first": "Rae", "middle": null, "last": "Murphy", "suffix": null, "display": "Rae Murphy"}'::json,
  'shrinkray@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000253", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "353 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10253", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shrinkray'
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
  modified_by,
  modified_date
)
SELECT
  'greenghost',
  crypt('greenghost', gen_salt('bf')),
  '{"prefix": null, "first": "Alana", "middle": null, "last": "Michaels", "suffix": null, "display": "Alana Michaels"}'::json,
  'greenghost@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000254", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "354 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10254", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'greenghost'
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
  modified_by,
  modified_date
)
SELECT
  'darkwing',
  crypt('darkwing', gen_salt('bf')),
  '{"prefix": null, "first": "Damien", "middle": null, "last": "Darkblood", "suffix": null, "display": "Damien Darkblood"}'::json,
  'darkwing@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000255", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "355 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10255", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'darkwing'
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
  modified_by,
  modified_date
)
SELECT
  'besttiger',
  crypt('besttiger', gen_salt('bf')),
  '{"prefix": null, "first": "Theo", "middle": null, "last": "Kane", "suffix": null, "display": "Theo Kane"}'::json,
  'besttiger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000256", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "black"}'::json,
  '[{"label": "home", "line1": "356 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10256", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'besttiger'
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
  modified_by,
  modified_date
)
SELECT
  'brit',
  crypt('brit', gen_salt('bf')),
  '{"prefix": null, "first": "Britt", "middle": null, "last": "Reid", "suffix": null, "display": "Britt Reid"}'::json,
  'brit@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000257", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "357 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10257", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'brit'
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
  modified_by,
  modified_date
)
SELECT
  'techjacket',
  crypt('techjacket', gen_salt('bf')),
  '{"prefix": null, "first": "Zack", "middle": null, "last": "Thompson", "suffix": null, "display": "Zack Thompson"}'::json,
  'techjacket@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000258", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "358 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10258", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'techjacket'
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
  modified_by,
  modified_date
)
SELECT
  'spawn',
  crypt('spawn', gen_salt('bf')),
  '{"prefix": null, "first": "Al", "middle": null, "last": "Simmons", "suffix": null, "display": "Al Simmons"}'::json,
  'spawn@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000259", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "359 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10259", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spawn'
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
  modified_by,
  modified_date
)
SELECT
  'witchblade',
  crypt('witchblade', gen_salt('bf')),
  '{"prefix": null, "first": "Sara", "middle": null, "last": "Pezzini", "suffix": null, "display": "Sara Pezzini"}'::json,
  'witchblade@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000260", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "black"}'::json,
  '[{"label": "home", "line1": "360 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10260", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'witchblade'
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
  modified_by,
  modified_date
)
SELECT
  'darkness',
  crypt('darkness', gen_salt('bf')),
  '{"prefix": null, "first": "Jackie", "middle": null, "last": "Estacado", "suffix": null, "display": "Jackie Estacado"}'::json,
  'darkness@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000261", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "361 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10261", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'darkness'
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
  modified_by,
  modified_date
)
SELECT
  'savagedragon',
  crypt('savagedragon', gen_salt('bf')),
  '{"prefix": null, "first": "Malcolm", "middle": null, "last": "Dragon", "suffix": null, "display": "Malcolm Dragon"}'::json,
  'savagedragon@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000262", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "362 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10262", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'savagedragon'
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
  modified_by,
  modified_date
)
SELECT
  'shadowhawk',
  crypt('shadowhawk', gen_salt('bf')),
  '{"prefix": null, "first": "Paul", "middle": null, "last": "Johnstone", "suffix": null, "display": "Paul Johnstone"}'::json,
  'shadowhawk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000263", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "363 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10263", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shadowhawk'
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
  modified_by,
  modified_date
)
SELECT
  'youngbloodshaft',
  crypt('youngbloodshaft', gen_salt('bf')),
  '{"prefix": null, "first": "Richard", "middle": null, "last": "Olmstead", "suffix": null, "display": "Richard Olmstead"}'::json,
  'youngbloodshaft@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000264", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "364 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10264", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngbloodshaft'
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
  modified_by,
  modified_date
)
SELECT
  'youngbloodchapel',
  crypt('youngbloodchapel', gen_salt('bf')),
  '{"prefix": null, "first": "Bruce", "middle": null, "last": "Stinson", "suffix": null, "display": "Bruce Stinson"}'::json,
  'youngbloodchapel@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000265", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "365 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10265", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngbloodchapel'
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
  modified_by,
  modified_date
)
SELECT
  'youngbloodbadrock',
  crypt('youngbloodbadrock', gen_salt('bf')),
  '{"prefix": null, "first": "Thomas", "middle": null, "last": "Jr", "suffix": null, "display": "Thomas Jr"}'::json,
  'youngbloodbadrock@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000266", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "366 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10266", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngbloodbadrock'
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
  modified_by,
  modified_date
)
SELECT
  'youngbloodvogue',
  crypt('youngbloodvogue', gen_salt('bf')),
  '{"prefix": null, "first": "Nikki", "middle": null, "last": "Doyle", "suffix": null, "display": "Nikki Doyle"}'::json,
  'youngbloodvogue@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000267", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "367 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10267", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngbloodvogue'
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
  modified_by,
  modified_date
)
SELECT
  'youngblooddiehard',
  crypt('youngblooddiehard', gen_salt('bf')),
  '{"prefix": null, "first": "Lyle", "middle": null, "last": "Kane", "suffix": null, "display": "Lyle Kane"}'::json,
  'youngblooddiehard@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000268", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "368 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10268", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngblooddiehard'
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
  modified_by,
  modified_date
)
SELECT
  'youngbloodcombat',
  crypt('youngbloodcombat', gen_salt('bf')),
  '{"prefix": null, "first": "Jamie", "middle": null, "last": "Sanchez", "suffix": null, "display": "Jamie Sanchez"}'::json,
  'youngbloodcombat@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000269", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "369 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10269", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngbloodcombat'
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
  modified_by,
  modified_date
)
SELECT
  'youngbloodriptide',
  crypt('youngbloodriptide', gen_salt('bf')),
  '{"prefix": null, "first": "Rita", "middle": null, "last": "Delaney", "suffix": null, "display": "Rita Delaney"}'::json,
  'youngbloodriptide@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000270", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "370 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10270", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'youngbloodriptide'
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
  modified_by,
  modified_date
)
SELECT
  'supreme',
  crypt('supreme', gen_salt('bf')),
  '{"prefix": null, "first": "Ethan", "middle": null, "last": "Crane", "suffix": null, "display": "Ethan Crane"}'::json,
  'supreme@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000271", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "371 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10271", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'supreme'
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
  modified_by,
  modified_date
)
SELECT
  'glory',
  crypt('glory', gen_salt('bf')),
  '{"prefix": null, "first": "Gloriana", "middle": null, "last": "Demeter", "suffix": null, "display": "Gloriana Demeter"}'::json,
  'glory@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000272", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "372 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10272", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'glory'
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
  modified_by,
  modified_date
)
SELECT
  'bloodstrikefourplay',
  crypt('bloodstrikefourplay', gen_salt('bf')),
  '{"prefix": null, "first": "Avril", "middle": null, "last": "Graham", "suffix": null, "display": "Avril Graham"}'::json,
  'bloodstrikefourplay@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000273", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "373 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10273", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bloodstrikefourplay'
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
  modified_by,
  modified_date
)
SELECT
  'bloodstrikecabot',
  crypt('bloodstrikecabot', gen_salt('bf')),
  '{"prefix": null, "first": "Cabbot", "middle": null, "last": "Stone", "suffix": null, "display": "Cabbot Stone"}'::json,
  'bloodstrikecabot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000274", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "black"}'::json,
  '[{"label": "home", "line1": "374 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10274", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bloodstrikecabot'
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
  modified_by,
  modified_date
)
SELECT
  'prophet',
  crypt('prophet', gen_salt('bf')),
  '{"prefix": null, "first": "John", "middle": null, "last": "Prophet", "suffix": null, "display": "John Prophet"}'::json,
  'prophet@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000275", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "green"}'::json,
  '[{"label": "home", "line1": "375 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10275", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'prophet'
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
  modified_by,
  modified_date
)
SELECT
  'brigadebattlestone',
  crypt('brigadebattlestone', gen_salt('bf')),
  '{"prefix": null, "first": "Stony", "middle": null, "last": "Briggs", "suffix": null, "display": "Stony Briggs"}'::json,
  'brigadebattlestone@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000276", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "376 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10276", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'brigadebattlestone'
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
  modified_by,
  modified_date
)
SELECT
  'brigadeseahawk',
  crypt('brigadeseahawk', gen_salt('bf')),
  '{"prefix": null, "first": "Kayo", "middle": null, "last": "Tanaka", "suffix": null, "display": "Kayo Tanaka"}'::json,
  'brigadeseahawk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000277", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "377 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10277", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'brigadeseahawk'
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
  modified_by,
  modified_date
)
SELECT
  'firebreather',
  crypt('firebreather', gen_salt('bf')),
  '{"prefix": null, "first": "Duncan", "middle": null, "last": "Rosenblatt", "suffix": null, "display": "Duncan Rosenblatt"}'::json,
  'firebreather@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000278", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "378 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10278", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'firebreather'
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
  modified_by,
  modified_date
)
SELECT
  'noblecausesdocnoble',
  crypt('noblecausesdocnoble', gen_salt('bf')),
  '{"prefix": null, "first": "Doc", "middle": null, "last": "Noble", "suffix": null, "display": "Doc Noble"}'::json,
  'noblecausesdocnoble@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000279", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "379 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10279", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'noblecausesdocnoble'
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
  modified_by,
  modified_date
)
SELECT
  'noblecausesrace',
  crypt('noblecausesrace', gen_salt('bf')),
  '{"prefix": null, "first": "Race", "middle": null, "last": "Noble", "suffix": null, "display": "Race Noble"}'::json,
  'noblecausesrace@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000280", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "380 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10280", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'noblecausesrace'
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
  modified_by,
  modified_date
)
SELECT
  'noblecauseszephyr',
  crypt('noblecauseszephyr', gen_salt('bf')),
  '{"prefix": null, "first": "Zephyr", "middle": null, "last": "Noble", "suffix": null, "display": "Zephyr Noble"}'::json,
  'noblecauseszephyr@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000281", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "381 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10281", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'noblecauseszephyr'
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
  modified_by,
  modified_date
)
SELECT
  'noblecausesfrost',
  crypt('noblecausesfrost', gen_salt('bf')),
  '{"prefix": null, "first": "Frost", "middle": null, "last": "Noble", "suffix": null, "display": "Frost Noble"}'::json,
  'noblecausesfrost@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000282", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "cyan", "color2": "white"}'::json,
  '[{"label": "home", "line1": "382 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10282", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'noblecausesfrost'
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
  modified_by,
  modified_date
)
SELECT
  'noblecausesgaia',
  crypt('noblecausesgaia', gen_salt('bf')),
  '{"prefix": null, "first": "Gaia", "middle": null, "last": "Noble", "suffix": null, "display": "Gaia Noble"}'::json,
  'noblecausesgaia@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000283", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "383 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10283", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'noblecausesgaia'
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
  modified_by,
  modified_date
)
SELECT
  'noblecausesrusty',
  crypt('noblecausesrusty', gen_salt('bf')),
  '{"prefix": null, "first": "Rusty", "middle": null, "last": "Noble", "suffix": null, "display": "Rusty Noble"}'::json,
  'noblecausesrusty@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000284", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "384 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10284", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'noblecausesrusty'
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
  modified_by,
  modified_date
)
SELECT
  'radiantblack',
  crypt('radiantblack', gen_salt('bf')),
  '{"prefix": null, "first": "Nathan", "middle": null, "last": "Burnett", "suffix": null, "display": "Nathan Burnett"}'::json,
  'radiantblack@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000285", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "385 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10285", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'radiantblack'
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
  modified_by,
  modified_date
)
SELECT
  'radiantred',
  crypt('radiantred', gen_salt('bf')),
  '{"prefix": null, "first": "Satomi", "middle": null, "last": "Sone", "suffix": null, "display": "Satomi Sone"}'::json,
  'radiantred@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000286", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "386 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10286", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'radiantred'
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
  modified_by,
  modified_date
)
SELECT
  'radiantpink',
  crypt('radiantpink', gen_salt('bf')),
  '{"prefix": null, "first": "Eva", "middle": null, "last": "Reyes", "suffix": null, "display": "Eva Reyes"}'::json,
  'radiantpink@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000287", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "white"}'::json,
  '[{"label": "home", "line1": "387 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10287", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'radiantpink'
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
  modified_by,
  modified_date
)
SELECT
  'radiantyellow',
  crypt('radiantyellow', gen_salt('bf')),
  '{"prefix": null, "first": "Wendell", "middle": null, "last": "Walters", "suffix": null, "display": "Wendell Walters"}'::json,
  'radiantyellow@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000288", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "388 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10288", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'radiantyellow'
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
  modified_by,
  modified_date
)
SELECT
  'roguesun',
  crypt('roguesun', gen_salt('bf')),
  '{"prefix": null, "first": "Dylan", "middle": null, "last": "Siegel", "suffix": null, "display": "Dylan Siegel"}'::json,
  'roguesun@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000289", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "red"}'::json,
  '[{"label": "home", "line1": "389 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10289", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'roguesun'
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
  modified_by,
  modified_date
)
SELECT
  'infernogirlred',
  crypt('infernogirlred', gen_salt('bf')),
  '{"prefix": null, "first": "Cami", "middle": null, "last": "Ridge", "suffix": null, "display": "Cami Ridge"}'::json,
  'infernogirlred@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000290", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "390 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10290", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'infernogirlred'
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
  modified_by,
  modified_date
)
SELECT
  'deadlucky',
  crypt('deadlucky', gen_salt('bf')),
  '{"prefix": null, "first": "Bibi", "middle": null, "last": "Lopez", "suffix": null, "display": "Bibi Lopez"}'::json,
  'deadlucky@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000291", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "391 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10291", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'deadlucky'
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
  modified_by,
  modified_date
)
SELECT
  'supermassive',
  crypt('supermassive', gen_salt('bf')),
  '{"prefix": null, "first": "Maya", "middle": null, "last": "King", "suffix": null, "display": "Maya King"}'::json,
  'supermassive@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000292", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "392 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10292", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'supermassive'
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
  modified_by,
  modified_date
)
SELECT
  'geiger',
  crypt('geiger', gen_salt('bf')),
  '{"prefix": null, "first": "Tariq", "middle": null, "last": "Geiger", "suffix": null, "display": "Tariq Geiger"}'::json,
  'geiger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000293", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "393 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10293", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'geiger'
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
  modified_by,
  modified_date
)
SELECT
  'junkyardjoe',
  crypt('junkyardjoe', gen_salt('bf')),
  '{"prefix": null, "first": "Joseph", "middle": null, "last": "Mason", "suffix": null, "display": "Joseph Mason"}'::json,
  'junkyardjoe@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000294", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "gray", "color2": "green"}'::json,
  '[{"label": "home", "line1": "394 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10294", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'junkyardjoe'
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
  modified_by,
  modified_date
)
SELECT
  'redcoat',
  crypt('redcoat', gen_salt('bf')),
  '{"prefix": null, "first": "Simon", "middle": null, "last": "Pure", "suffix": null, "display": "Simon Pure"}'::json,
  'redcoat@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000295", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "395 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10295", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'redcoat'
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
  modified_by,
  modified_date
)
SELECT
  'voidrivalk',
  crypt('voidrivalk', gen_salt('bf')),
  '{"prefix": null, "first": "Tara", "middle": null, "last": "Rivalk", "suffix": null, "display": "Tara Rivalk"}'::json,
  'voidrivalk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000296", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "violet"}'::json,
  '[{"label": "home", "line1": "396 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10296", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'voidrivalk'
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
  modified_by,
  modified_date
)
SELECT
  'wolfman',
  crypt('wolfman', gen_salt('bf')),
  '{"prefix": null, "first": "Gary", "middle": null, "last": "Hampton", "suffix": null, "display": "Gary Hampton"}'::json,
  'wolfman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000297", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "brown", "color2": "black"}'::json,
  '[{"label": "home", "line1": "397 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10297", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wolfman'
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
  modified_by,
  modified_date
)
SELECT
  'guardinglobe',
  crypt('guardinglobe', gen_salt('bf')),
  '{"prefix": null, "first": "Britney", "middle": null, "last": "Cho", "suffix": null, "display": "Britney Cho"}'::json,
  'guardinglobe@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000298", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "398 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10298", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'guardinglobe'
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
  modified_by,
  modified_date
)
SELECT
  'velocity',
  crypt('velocity', gen_salt('bf')),
  '{"prefix": null, "first": "Carin", "middle": null, "last": "Taylor", "suffix": null, "display": "Carin Taylor"}'::json,
  'velocity@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000299", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "399 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10299", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'velocity'
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
  modified_by,
  modified_date
)
SELECT
  'cyblade',
  crypt('cyblade', gen_salt('bf')),
  '{"prefix": null, "first": "Stryk", "middle": null, "last": "Velocity", "suffix": null, "display": "Stryk Velocity"}'::json,
  'cyblade@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000300", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "400 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10300", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cyblade'
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
  modified_by,
  modified_date
)
SELECT
  'ripclaw',
  crypt('ripclaw', gen_salt('bf')),
  '{"prefix": null, "first": "William", "middle": null, "last": "Talbot", "suffix": null, "display": "William Talbot"}'::json,
  'ripclaw@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000301", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "401 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10301", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ripclaw'
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
  modified_by,
  modified_date
)
SELECT
  'grifter',
  crypt('grifter', gen_salt('bf')),
  '{"prefix": null, "first": "Cole", "middle": null, "last": "Cash", "suffix": null, "display": "Cole Cash"}'::json,
  'grifter@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000302", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "402 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10302", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'grifter'
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
  modified_by,
  modified_date
)
SELECT
  'zealot',
  crypt('zealot', gen_salt('bf')),
  '{"prefix": null, "first": "Lady", "middle": null, "last": "Zannah", "suffix": null, "display": "Lady Zannah"}'::json,
  'zealot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000303", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "403 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10303", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'zealot'
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
  modified_by,
  modified_date
)
SELECT
  'voodoo',
  crypt('voodoo', gen_salt('bf')),
  '{"prefix": null, "first": "Priscilla", "middle": null, "last": "Kitaen", "suffix": null, "display": "Priscilla Kitaen"}'::json,
  'voodoo@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000304", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "404 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10304", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'voodoo'
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
  modified_by,
  modified_date
)
SELECT
  'maul',
  crypt('maul', gen_salt('bf')),
  '{"prefix": null, "first": "Jeremy", "middle": null, "last": "Stone", "suffix": null, "display": "Jeremy Stone"}'::json,
  'maul@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000305", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "405 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10305", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'maul'
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
  modified_by,
  modified_date
)
SELECT
  'spartan',
  crypt('spartan', gen_salt('bf')),
  '{"prefix": null, "first": "Yohn", "middle": null, "last": "Kall", "suffix": null, "display": "Yohn Kall"}'::json,
  'spartan@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000306", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "406 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10306", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spartan'
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
  modified_by,
  modified_date
)
SELECT
  'warblade',
  crypt('warblade', gen_salt('bf')),
  '{"prefix": null, "first": "Michael", "middle": null, "last": "Cray", "suffix": null, "display": "Michael Cray"}'::json,
  'warblade@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000307", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "407 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10307", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'warblade'
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
  modified_by,
  modified_date
)
SELECT
  'fairchild',
  crypt('fairchild', gen_salt('bf')),
  '{"prefix": null, "first": "Caitlin", "middle": null, "last": "Fairchild", "suffix": null, "display": "Caitlin Fairchild"}'::json,
  'fairchild@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000308", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "408 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10308", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'fairchild'
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
  modified_by,
  modified_date
)
SELECT
  'burnout',
  crypt('burnout', gen_salt('bf')),
  '{"prefix": null, "first": "Bobby", "middle": null, "last": "Lane", "suffix": null, "display": "Bobby Lane"}'::json,
  'burnout@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000309", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "orange", "color2": "red"}'::json,
  '[{"label": "home", "line1": "409 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10309", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'burnout'
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
  modified_by,
  modified_date
)
SELECT
  'rainmaker',
  crypt('rainmaker', gen_salt('bf')),
  '{"prefix": null, "first": "Sarah", "middle": null, "last": "Rainmaker", "suffix": null, "display": "Sarah Rainmaker"}'::json,
  'rainmaker@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000310", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "green"}'::json,
  '[{"label": "home", "line1": "410 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10310", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rainmaker'
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
  modified_by,
  modified_date
)
SELECT
  'freefall',
  crypt('freefall', gen_salt('bf')),
  '{"prefix": null, "first": "Roxy", "middle": null, "last": "Spaulding", "suffix": null, "display": "Roxy Spaulding"}'::json,
  'freefall@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000311", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "411 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10311", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'freefall'
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
  modified_by,
  modified_date
)
SELECT
  'boon',
  crypt('boon', gen_salt('bf')),
  '{"prefix": null, "first": "Jeremy", "middle": null, "last": "Boon", "suffix": null, "display": "Jeremy Boon"}'::json,
  'boon@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000312", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "412 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10312", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'boon'
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
  modified_by,
  modified_date
)
SELECT
  'newmen',
  crypt('newmen', gen_salt('bf')),
  '{"prefix": null, "first": "Nicholas", "middle": null, "last": "Neman", "suffix": null, "display": "Nicholas Neman"}'::json,
  'newmen@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000313", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "413 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10313", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'newmen'
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
  modified_by,
  modified_date
)
SELECT
  'kickass',
  crypt('kickass', gen_salt('bf')),
  '{"prefix": null, "first": "Dave", "middle": null, "last": "Lizewski", "suffix": null, "display": "Dave Lizewski"}'::json,
  'kickass@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000314", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "414 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10314", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kickass'
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
  modified_by,
  modified_date
)
SELECT
  'hitgirl',
  crypt('hitgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Mindy", "middle": null, "last": "Macready", "suffix": null, "display": "Mindy Macready"}'::json,
  'hitgirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000315", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "415 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10315", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hitgirl'
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
  modified_by,
  modified_date
)
SELECT
  'nemesis',
  crypt('nemesis', gen_salt('bf')),
  '{"prefix": null, "first": "Matt", "middle": null, "last": "Anderson", "suffix": null, "display": "Matt Anderson"}'::json,
  'nemesis@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000316", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "black"}'::json,
  '[{"label": "home", "line1": "416 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10316", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nemesis'
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
  modified_by,
  modified_date
)
SELECT
  'kingsman',
  crypt('kingsman', gen_salt('bf')),
  '{"prefix": null, "first": "Gary", "middle": null, "last": "Unwin", "suffix": null, "display": "Gary Unwin"}'::json,
  'kingsman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000317", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "black"}'::json,
  '[{"label": "home", "line1": "417 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10317", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kingsman'
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
  modified_by,
  modified_date
)
SELECT
  'chrononaut',
  crypt('chrononaut', gen_salt('bf')),
  '{"prefix": null, "first": "Corbin", "middle": null, "last": "Quinn", "suffix": null, "display": "Corbin Quinn"}'::json,
  'chrononaut@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000318", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "blue", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "418 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10318", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'chrononaut'
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
  modified_by,
  modified_date
)
SELECT
  'reborn',
  crypt('reborn', gen_salt('bf')),
  '{"prefix": null, "first": "Bonnie", "middle": null, "last": "Black", "suffix": null, "display": "Bonnie Black"}'::json,
  'reborn@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000319", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "419 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10319", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'reborn'
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
  modified_by,
  modified_date
)
SELECT
  'skyboundrogue',
  crypt('skyboundrogue', gen_salt('bf')),
  '{"prefix": null, "first": "Tyler", "middle": null, "last": "Wells", "suffix": null, "display": "Tyler Wells"}'::json,
  'skyboundrogue@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000320", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Image superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "teal", "color2": "black"}'::json,
  '[{"label": "home", "line1": "420 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10320", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'skyboundrogue'
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
  modified_by,
  modified_date
)
SELECT
  'talialghul',
  crypt('talialghul', gen_salt('bf')),
  '{"prefix": null, "first": "Talia", "middle": null, "last": "al Ghul", "suffix": null, "display": "Talia al Ghul"}'::json,
  'talialghul@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000321", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "421 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10321", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'talialghul'
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
  modified_by,
  modified_date
)
SELECT
  'nyssalghul',
  crypt('nyssalghul', gen_salt('bf')),
  '{"prefix": null, "first": "Nyssa", "middle": null, "last": "al Ghul", "suffix": null, "display": "Nyssa al Ghul"}'::json,
  'nyssalghul@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000322", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "green"}'::json,
  '[{"label": "home", "line1": "422 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10322", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nyssalghul'
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
  modified_by,
  modified_date
)
SELECT
  'cheetah',
  crypt('cheetah', gen_salt('bf')),
  '{"prefix": null, "first": "Barbara", "middle": null, "last": "Minerva", "suffix": null, "display": "Barbara Minerva"}'::json,
  'cheetah@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000323", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "423 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10323", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cheetah'
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
  modified_by,
  modified_date
)
SELECT
  'silverbanshee',
  crypt('silverbanshee', gen_salt('bf')),
  '{"prefix": null, "first": "Siobhan", "middle": null, "last": "McDougal", "suffix": null, "display": "Siobhan McDougal"}'::json,
  'silverbanshee@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000324", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "green"}'::json,
  '[{"label": "home", "line1": "424 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10324", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'silverbanshee'
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
  modified_by,
  modified_date
)
SELECT
  'livewire',
  crypt('livewire', gen_salt('bf')),
  '{"prefix": null, "first": "Leslie", "middle": null, "last": "Willis", "suffix": null, "display": "Leslie Willis"}'::json,
  'livewire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000325", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "425 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10325", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'livewire'
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
  modified_by,
  modified_date
)
SELECT
  'giganta',
  crypt('giganta', gen_salt('bf')),
  '{"prefix": null, "first": "Doris", "middle": null, "last": "Zeul", "suffix": null, "display": "Doris Zeul"}'::json,
  'giganta@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000326", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "426 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10326", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'giganta'
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
  modified_by,
  modified_date
)
SELECT
  'maxima',
  crypt('maxima', gen_salt('bf')),
  '{"prefix": null, "first": "Maxima", "middle": null, "last": "Almerac", "suffix": null, "display": "Maxima Almerac"}'::json,
  'maxima@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000327", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "427 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10327", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'maxima'
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
  modified_by,
  modified_date
)
SELECT
  'thunder',
  crypt('thunder', gen_salt('bf')),
  '{"prefix": null, "first": "Anissa", "middle": null, "last": "Pierce", "suffix": null, "display": "Anissa Pierce"}'::json,
  'thunder@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000328", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "428 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10328", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'thunder'
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
  modified_by,
  modified_date
)
SELECT
  'lightning',
  crypt('lightning', gen_salt('bf')),
  '{"prefix": null, "first": "Jennifer", "middle": null, "last": "Pierce", "suffix": null, "display": "Jennifer Pierce"}'::json,
  'lightning@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000329", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "white"}'::json,
  '[{"label": "home", "line1": "429 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10329", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lightning'
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
  modified_by,
  modified_date
)
SELECT
  'mera',
  crypt('mera', gen_salt('bf')),
  '{"prefix": null, "first": "Mera", "middle": null, "last": "Curry", "suffix": null, "display": "Mera Curry"}'::json,
  'mera@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000330", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "430 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10330", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mera'
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
  modified_by,
  modified_date
)
SELECT
  'ravager',
  crypt('ravager', gen_salt('bf')),
  '{"prefix": null, "first": "Rose", "middle": null, "last": "Wilson", "suffix": null, "display": "Rose Wilson"}'::json,
  'ravager@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000331", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "431 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10331", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ravager'
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
  modified_by,
  modified_date
)
SELECT
  'cheshire',
  crypt('cheshire', gen_salt('bf')),
  '{"prefix": null, "first": "Jade", "middle": null, "last": "Nguyen", "suffix": null, "display": "Jade Nguyen"}'::json,
  'cheshire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000332", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "432 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10332", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cheshire'
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
  modified_by,
  modified_date
)
SELECT
  'tarantula',
  crypt('tarantula', gen_salt('bf')),
  '{"prefix": null, "first": "Catalina", "middle": null, "last": "Flores", "suffix": null, "display": "Catalina Flores"}'::json,
  'tarantula@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000333", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "black"}'::json,
  '[{"label": "home", "line1": "433 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10333", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'tarantula'
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
  modified_by,
  modified_date
)
SELECT
  'circe',
  crypt('circe', gen_salt('bf')),
  '{"prefix": null, "first": "Circe", "middle": null, "last": "Aeaea", "suffix": null, "display": "Circe Aeaea"}'::json,
  'circe@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000334", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "434 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10334", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'circe'
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
  modified_by,
  modified_date
)
SELECT
  'blackalice',
  crypt('blackalice', gen_salt('bf')),
  '{"prefix": null, "first": "Lori", "middle": null, "last": "Zechlin", "suffix": null, "display": "Lori Zechlin"}'::json,
  'blackalice@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000335", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "435 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10335", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackalice'
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
  modified_by,
  modified_date
)
SELECT
  'amethyst',
  crypt('amethyst', gen_salt('bf')),
  '{"prefix": null, "first": "Amy", "middle": null, "last": "Winston", "suffix": null, "display": "Amy Winston"}'::json,
  'amethyst@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000336", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "436 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10336", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'amethyst'
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
  modified_by,
  modified_date
)
SELECT
  'nubia',
  crypt('nubia', gen_salt('bf')),
  '{"prefix": null, "first": "Nubia", "middle": null, "last": "Themyscira", "suffix": null, "display": "Nubia Themyscira"}'::json,
  'nubia@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000337", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "437 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10337", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nubia'
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
  modified_by,
  modified_date
)
SELECT
  'katana',
  crypt('katana', gen_salt('bf')),
  '{"prefix": null, "first": "Tatsu", "middle": null, "last": "Yamashiro", "suffix": null, "display": "Tatsu Yamashiro"}'::json,
  'katana@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000338", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "438 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10338", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'katana'
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
  modified_by,
  modified_date
)
SELECT
  'ladyshiva',
  crypt('ladyshiva', gen_salt('bf')),
  '{"prefix": null, "first": "Sandra", "middle": null, "last": "Wu-San", "suffix": null, "display": "Sandra Wu-San"}'::json,
  'ladyshiva@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000339", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "439 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10339", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ladyshiva'
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
  modified_by,
  modified_date
)
SELECT
  'jade',
  crypt('jade', gen_salt('bf')),
  '{"prefix": null, "first": "Jennifer", "middle": null, "last": "Hayden", "suffix": null, "display": "Jennifer Hayden"}'::json,
  'jade@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000340", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "440 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10340", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jade'
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
  modified_by,
  modified_date
)
SELECT
  'hawkwoman',
  crypt('hawkwoman', gen_salt('bf')),
  '{"prefix": null, "first": "Shiera", "middle": null, "last": "Hall", "suffix": null, "display": "Shiera Hall"}'::json,
  'hawkwoman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000341", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "441 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10341", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hawkwoman'
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
  modified_by,
  modified_date
)
SELECT
  'goldenglider',
  crypt('goldenglider', gen_salt('bf')),
  '{"prefix": null, "first": "Lisa", "middle": null, "last": "Snart", "suffix": null, "display": "Lisa Snart"}'::json,
  'goldenglider@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000342", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "white"}'::json,
  '[{"label": "home", "line1": "442 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10342", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'goldenglider'
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
  modified_by,
  modified_date
)
SELECT
  'empress',
  crypt('empress', gen_salt('bf')),
  '{"prefix": null, "first": "Anita", "middle": null, "last": "Fite", "suffix": null, "display": "Anita Fite"}'::json,
  'empress@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000343", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "443 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10343", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'empress'
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
  modified_by,
  modified_date
)
SELECT
  'gypsy',
  crypt('gypsy', gen_salt('bf')),
  '{"prefix": null, "first": "Cindy", "middle": null, "last": "Reynolds", "suffix": null, "display": "Cindy Reynolds"}'::json,
  'gypsy@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000344", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "444 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10344", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'gypsy'
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
  modified_by,
  modified_date
)
SELECT
  'dawnstar',
  crypt('dawnstar', gen_salt('bf')),
  '{"prefix": null, "first": "Dawnstar", "middle": null, "last": "Rimbor", "suffix": null, "display": "Dawnstar Rimbor"}'::json,
  'dawnstar@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000345", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "445 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10345", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'dawnstar'
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
  modified_by,
  modified_date
)
SELECT
  'tinya',
  crypt('tinya', gen_salt('bf')),
  '{"prefix": null, "first": "Tinya", "middle": null, "last": "Wazzo", "suffix": null, "display": "Tinya Wazzo"}'::json,
  'tinya@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000346", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "white"}'::json,
  '[{"label": "home", "line1": "446 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10346", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'tinya'
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
  modified_by,
  modified_date
)
SELECT
  'luornu',
  crypt('luornu', gen_salt('bf')),
  '{"prefix": null, "first": "Luornu", "middle": null, "last": "Durgo", "suffix": null, "display": "Luornu Durgo"}'::json,
  'luornu@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000347", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "447 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10347", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'luornu'
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
  modified_by,
  modified_date
)
SELECT
  'blackfire',
  crypt('blackfire', gen_salt('bf')),
  '{"prefix": null, "first": "Komand''r", "middle": null, "last": "Tamaran", "suffix": null, "display": "Komand''r Tamaran"}'::json,
  'blackfire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000348", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "448 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10348", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackfire'
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
  modified_by,
  modified_date
)
SELECT
  'missmartian',
  crypt('missmartian', gen_salt('bf')),
  '{"prefix": null, "first": "M''gann", "middle": null, "last": "M''orzz", "suffix": null, "display": "M''gann M''orzz"}'::json,
  'missmartian@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000349", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "449 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10349", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'missmartian'
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
  modified_by,
  modified_date
)
SELECT
  'wondergirl',
  crypt('wondergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Cassie", "middle": null, "last": "Sandsmark", "suffix": null, "display": "Cassie Sandsmark"}'::json,
  'wondergirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000350", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "450 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10350", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wondergirl'
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
  modified_by,
  modified_date
)
SELECT
  'jinx',
  crypt('jinx', gen_salt('bf')),
  '{"prefix": null, "first": "Jinx", "middle": null, "last": "LeBlanc", "suffix": null, "display": "Jinx LeBlanc"}'::json,
  'jinx@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000351", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "black"}'::json,
  '[{"label": "home", "line1": "451 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10351", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jinx'
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
  modified_by,
  modified_date
)
SELECT
  'arella',
  crypt('arella', gen_salt('bf')),
  '{"prefix": null, "first": "Angela", "middle": null, "last": "Roth", "suffix": null, "display": "Angela Roth"}'::json,
  'arella@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000352", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "indigo", "color2": "black"}'::json,
  '[{"label": "home", "line1": "452 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10352", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'arella'
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
  modified_by,
  modified_date
)
SELECT
  'mazikeen',
  crypt('mazikeen', gen_salt('bf')),
  '{"prefix": null, "first": "Mazikeen", "middle": null, "last": "Hell", "suffix": null, "display": "Mazikeen Hell"}'::json,
  'mazikeen@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000353", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "453 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10353", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mazikeen'
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
  modified_by,
  modified_date
)
SELECT
  'knockout',
  crypt('knockout', gen_salt('bf')),
  '{"prefix": null, "first": "Knockout", "middle": null, "last": "Apokolips", "suffix": null, "display": "Knockout Apokolips"}'::json,
  'knockout@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000354", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "454 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10354", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'knockout'
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
  modified_by,
  modified_date
)
SELECT
  'fury',
  crypt('fury', gen_salt('bf')),
  '{"prefix": null, "first": "Helena", "middle": null, "last": "Kosmatos", "suffix": null, "display": "Helena Kosmatos"}'::json,
  'fury@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000355", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "455 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10355", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'fury'
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
  modified_by,
  modified_date
)
SELECT
  'cyclone',
  crypt('cyclone', gen_salt('bf')),
  '{"prefix": null, "first": "Maxine", "middle": null, "last": "Hunkel", "suffix": null, "display": "Maxine Hunkel"}'::json,
  'cyclone@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000356", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "456 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10356", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cyclone'
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
  modified_by,
  modified_date
)
SELECT
  'phantomlady',
  crypt('phantomlady', gen_salt('bf')),
  '{"prefix": null, "first": "Jennifer", "middle": null, "last": "Knight", "suffix": null, "display": "Jennifer Knight"}'::json,
  'phantomlady@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000357", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "457 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10357", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'phantomlady'
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
  modified_by,
  modified_date
)
SELECT
  'terra',
  crypt('terra', gen_salt('bf')),
  '{"prefix": null, "first": "Tara", "middle": null, "last": "Markov", "suffix": null, "display": "Tara Markov"}'::json,
  'terra@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000358", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "green"}'::json,
  '[{"label": "home", "line1": "458 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10358", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'terra'
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
  modified_by,
  modified_date
)
SELECT
  'artemis',
  crypt('artemis', gen_salt('bf')),
  '{"prefix": null, "first": "Artemis", "middle": null, "last": "Crock", "suffix": null, "display": "Artemis Crock"}'::json,
  'artemis@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000359", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "459 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10359", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'artemis'
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
  modified_by,
  modified_date
)
SELECT
  'spitfire',
  crypt('spitfire', gen_salt('bf')),
  '{"prefix": null, "first": "Jacqueline", "middle": null, "last": "Falsworth", "suffix": null, "display": "Jacqueline Falsworth"}'::json,
  'spitfire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000360", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "460 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10360", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spitfire'
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
  modified_by,
  modified_date
)
SELECT
  'maryjane',
  crypt('maryjane', gen_salt('bf')),
  '{"prefix": null, "first": "Mary", "middle": null, "last": "Watson", "suffix": null, "display": "Mary Watson"}'::json,
  'maryjane@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000361", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "461 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10361", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'maryjane'
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
  modified_by,
  modified_date
)
SELECT
  'gwenpool',
  crypt('gwenpool', gen_salt('bf')),
  '{"prefix": null, "first": "Gwen", "middle": null, "last": "Poole", "suffix": null, "display": "Gwen Poole"}'::json,
  'gwenpool@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000362", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "white"}'::json,
  '[{"label": "home", "line1": "462 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10362", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'gwenpool'
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
  modified_by,
  modified_date
)
SELECT
  'elektra',
  crypt('elektra', gen_salt('bf')),
  '{"prefix": null, "first": "Elektra", "middle": null, "last": "Natchios", "suffix": null, "display": "Elektra Natchios"}'::json,
  'elektra@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000363", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "463 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10363", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'elektra'
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
  modified_by,
  modified_date
)
SELECT
  'medusa',
  crypt('medusa', gen_salt('bf')),
  '{"prefix": null, "first": "Medusalith", "middle": null, "last": "Amaquelin", "suffix": null, "display": "Medusalith Amaquelin"}'::json,
  'medusa@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000364", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "464 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10364", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'medusa'
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
  modified_by,
  modified_date
)
SELECT
  'crystal',
  crypt('crystal', gen_salt('bf')),
  '{"prefix": null, "first": "Crystal", "middle": null, "last": "Amaquelin", "suffix": null, "display": "Crystal Amaquelin"}'::json,
  'crystal@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000365", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "465 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10365", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'crystal'
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
  modified_by,
  modified_date
)
SELECT
  'sif',
  crypt('sif', gen_salt('bf')),
  '{"prefix": null, "first": "Sif", "middle": null, "last": "Asgard", "suffix": null, "display": "Sif Asgard"}'::json,
  'sif@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000366", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "466 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10366", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sif'
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
  modified_by,
  modified_date
)
SELECT
  'amora',
  crypt('amora', gen_salt('bf')),
  '{"prefix": null, "first": "Amora", "middle": null, "last": "Enchantress", "suffix": null, "display": "Amora Enchantress"}'::json,
  'amora@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000367", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "467 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10367", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'amora'
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
  modified_by,
  modified_date
)
SELECT
  'lorelei',
  crypt('lorelei', gen_salt('bf')),
  '{"prefix": null, "first": "Lorelei", "middle": null, "last": "Asgard", "suffix": null, "display": "Lorelei Asgard"}'::json,
  'lorelei@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000368", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "green"}'::json,
  '[{"label": "home", "line1": "468 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10368", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lorelei'
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
  modified_by,
  modified_date
)
SELECT
  'namora',
  crypt('namora', gen_salt('bf')),
  '{"prefix": null, "first": "Namora", "middle": null, "last": "McKenzie", "suffix": null, "display": "Namora McKenzie"}'::json,
  'namora@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000369", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "469 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10369", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'namora'
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
  modified_by,
  modified_date
)
SELECT
  'namorita',
  crypt('namorita', gen_salt('bf')),
  '{"prefix": null, "first": "Namorita", "middle": null, "last": "Prentiss", "suffix": null, "display": "Namorita Prentiss"}'::json,
  'namorita@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000370", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "green"}'::json,
  '[{"label": "home", "line1": "470 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10370", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'namorita'
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
  modified_by,
  modified_date
)
SELECT
  'singularity',
  crypt('singularity', gen_salt('bf')),
  '{"prefix": null, "first": "Singularity", "middle": null, "last": "Cosmos", "suffix": null, "display": "Singularity Cosmos"}'::json,
  'singularity@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000371", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "471 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10371", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'singularity'
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
  modified_by,
  modified_date
)
SELECT
  'gertyorkes',
  crypt('gertyorkes', gen_salt('bf')),
  '{"prefix": null, "first": "Gertrude", "middle": null, "last": "Yorkes", "suffix": null, "display": "Gertrude Yorkes"}'::json,
  'gertyorkes@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000372", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "472 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10372", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'gertyorkes'
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
  modified_by,
  modified_date
)
SELECT
  'pixie',
  crypt('pixie', gen_salt('bf')),
  '{"prefix": null, "first": "Megan", "middle": null, "last": "Gwynn", "suffix": null, "display": "Megan Gwynn"}'::json,
  'pixie@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000373", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "473 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10373", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'pixie'
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
  modified_by,
  modified_date
)
SELECT
  'armor',
  crypt('armor', gen_salt('bf')),
  '{"prefix": null, "first": "Hisako", "middle": null, "last": "Ichiki", "suffix": null, "display": "Hisako Ichiki"}'::json,
  'armor@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000374", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "474 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10374", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'armor'
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
  modified_by,
  modified_date
)
SELECT
  'blink',
  crypt('blink', gen_salt('bf')),
  '{"prefix": null, "first": "Clarice", "middle": null, "last": "Ferguson", "suffix": null, "display": "Clarice Ferguson"}'::json,
  'blink@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000375", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "475 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10375", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blink'
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
  modified_by,
  modified_date
)
SELECT
  'polaris',
  crypt('polaris', gen_salt('bf')),
  '{"prefix": null, "first": "Lorna", "middle": null, "last": "Dane", "suffix": null, "display": "Lorna Dane"}'::json,
  'polaris@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000376", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "476 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10376", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'polaris'
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
  modified_by,
  modified_date
)
SELECT
  'boomboom',
  crypt('boomboom', gen_salt('bf')),
  '{"prefix": null, "first": "Tabitha", "middle": null, "last": "Smith", "suffix": null, "display": "Tabitha Smith"}'::json,
  'boomboom@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000377", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "477 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10377", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'boomboom'
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
  modified_by,
  modified_date
)
SELECT
  'siryn',
  crypt('siryn', gen_salt('bf')),
  '{"prefix": null, "first": "Theresa", "middle": null, "last": "Cassidy", "suffix": null, "display": "Theresa Cassidy"}'::json,
  'siryn@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000378", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "478 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10378", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'siryn'
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
  modified_by,
  modified_date
)
SELECT
  'moira',
  crypt('moira', gen_salt('bf')),
  '{"prefix": null, "first": "Moira", "middle": null, "last": "MacTaggert", "suffix": null, "display": "Moira MacTaggert"}'::json,
  'moira@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000379", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "479 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10379", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'moira'
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
  modified_by,
  modified_date
)
SELECT
  'marrow',
  crypt('marrow', gen_salt('bf')),
  '{"prefix": null, "first": "Sarah", "middle": null, "last": "Rushman", "suffix": null, "display": "Sarah Rushman"}'::json,
  'marrow@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000380", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "480 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10380", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'marrow'
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
  modified_by,
  modified_date
)
SELECT
  'husk',
  crypt('husk', gen_salt('bf')),
  '{"prefix": null, "first": "Paige", "middle": null, "last": "Guthrie", "suffix": null, "display": "Paige Guthrie"}'::json,
  'husk@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000381", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "481 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10381", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'husk'
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
  modified_by,
  modified_date
)
SELECT
  'surge',
  crypt('surge', gen_salt('bf')),
  '{"prefix": null, "first": "Noriko", "middle": null, "last": "Ashida", "suffix": null, "display": "Noriko Ashida"}'::json,
  'surge@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000382", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "482 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10382", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'surge'
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
  modified_by,
  modified_date
)
SELECT
  'winddancer',
  crypt('winddancer', gen_salt('bf')),
  '{"prefix": null, "first": "Sofia", "middle": null, "last": "Mantega", "suffix": null, "display": "Sofia Mantega"}'::json,
  'winddancer@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000383", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "483 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10383", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'winddancer'
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
  modified_by,
  modified_date
)
SELECT
  'honeybadger',
  crypt('honeybadger', gen_salt('bf')),
  '{"prefix": null, "first": "Gabrielle", "middle": null, "last": "Kinney", "suffix": null, "display": "Gabrielle Kinney"}'::json,
  'honeybadger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000384", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "484 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10384", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'honeybadger'
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
  modified_by,
  modified_date
)
SELECT
  'mania',
  crypt('mania', gen_salt('bf')),
  '{"prefix": null, "first": "Andi", "middle": null, "last": "Benton", "suffix": null, "display": "Andi Benton"}'::json,
  'mania@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000385", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "485 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10385", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mania'
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
  modified_by,
  modified_date
)
SELECT
  'silversable',
  crypt('silversable', gen_salt('bf')),
  '{"prefix": null, "first": "Silvija", "middle": null, "last": "Sablinova", "suffix": null, "display": "Silvija Sablinova"}'::json,
  'silversable@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000386", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "black"}'::json,
  '[{"label": "home", "line1": "486 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10386", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'silversable'
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
  modified_by,
  modified_date
)
SELECT
  'blackcat',
  crypt('blackcat', gen_salt('bf')),
  '{"prefix": null, "first": "Felicia", "middle": null, "last": "Hardy", "suffix": null, "display": "Felicia Hardy"}'::json,
  'blackcat@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000387", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "487 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10387", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'blackcat'
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
  modified_by,
  modified_date
)
SELECT
  'typhoidmary',
  crypt('typhoidmary', gen_salt('bf')),
  '{"prefix": null, "first": "Mary", "middle": null, "last": "Walker", "suffix": null, "display": "Mary Walker"}'::json,
  'typhoidmary@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000388", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "488 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10388", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'typhoidmary'
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
  modified_by,
  modified_date
)
SELECT
  'sersi',
  crypt('sersi', gen_salt('bf')),
  '{"prefix": null, "first": "Sersi", "middle": null, "last": "Eternal", "suffix": null, "display": "Sersi Eternal"}'::json,
  'sersi@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000389", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "489 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10389", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sersi'
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
  modified_by,
  modified_date
)
SELECT
  'thena',
  crypt('thena', gen_salt('bf')),
  '{"prefix": null, "first": "Thena", "middle": null, "last": "Eternal", "suffix": null, "display": "Thena Eternal"}'::json,
  'thena@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000390", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "white"}'::json,
  '[{"label": "home", "line1": "490 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10390", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'thena'
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
  modified_by,
  modified_date
)
SELECT
  'sprite',
  crypt('sprite', gen_salt('bf')),
  '{"prefix": null, "first": "Sprite", "middle": null, "last": "Eternal", "suffix": null, "display": "Sprite Eternal"}'::json,
  'sprite@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000391", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "491 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10391", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sprite'
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
  modified_by,
  modified_date
)
SELECT
  'diamondback',
  crypt('diamondback', gen_salt('bf')),
  '{"prefix": null, "first": "Rachel", "middle": null, "last": "Leighton", "suffix": null, "display": "Rachel Leighton"}'::json,
  'diamondback@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000392", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "492 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10392", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'diamondback'
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
  modified_by,
  modified_date
)
SELECT
  'songbird',
  crypt('songbird', gen_salt('bf')),
  '{"prefix": null, "first": "Melissa", "middle": null, "last": "Gold", "suffix": null, "display": "Melissa Gold"}'::json,
  'songbird@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000393", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "red"}'::json,
  '[{"label": "home", "line1": "493 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10393", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'songbird'
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
  modified_by,
  modified_date
)
SELECT
  'moonstone',
  crypt('moonstone', gen_salt('bf')),
  '{"prefix": null, "first": "Karla", "middle": null, "last": "Sofen", "suffix": null, "display": "Karla Sofen"}'::json,
  'moonstone@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000394", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "white"}'::json,
  '[{"label": "home", "line1": "494 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10394", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'moonstone'
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
  modified_by,
  modified_date
)
SELECT
  'copycat',
  crypt('copycat', gen_salt('bf')),
  '{"prefix": null, "first": "Vanessa", "middle": null, "last": "Carlysle", "suffix": null, "display": "Vanessa Carlysle"}'::json,
  'copycat@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000395", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "495 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10395", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'copycat'
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
  modified_by,
  modified_date
)
SELECT
  'feral',
  crypt('feral', gen_salt('bf')),
  '{"prefix": null, "first": "Maria", "middle": null, "last": "Callasantos", "suffix": null, "display": "Maria Callasantos"}'::json,
  'feral@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000396", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "496 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10396", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'feral'
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
  modified_by,
  modified_date
)
SELECT
  'callisto',
  crypt('callisto', gen_salt('bf')),
  '{"prefix": null, "first": "Callisto", "middle": null, "last": "Morlock", "suffix": null, "display": "Callisto Morlock"}'::json,
  'callisto@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000397", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "497 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10397", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'callisto'
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
  modified_by,
  modified_date
)
SELECT
  'lifeguard',
  crypt('lifeguard', gen_salt('bf')),
  '{"prefix": null, "first": "Heather", "middle": null, "last": "Cameron", "suffix": null, "display": "Heather Cameron"}'::json,
  'lifeguard@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000398", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "498 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10398", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lifeguard'
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
  modified_by,
  modified_date
)
SELECT
  'sage',
  crypt('sage', gen_salt('bf')),
  '{"prefix": null, "first": "Tessa", "middle": null, "last": "Neal", "suffix": null, "display": "Tessa Neal"}'::json,
  'sage@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000399", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "499 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10399", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sage'
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
  modified_by,
  modified_date
)
SELECT
  'yukio',
  crypt('yukio', gen_salt('bf')),
  '{"prefix": null, "first": "Yukio", "middle": null, "last": "Ashida", "suffix": null, "display": "Yukio Ashida"}'::json,
  'yukio@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000400", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "500 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10400", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'yukio'
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
  modified_by,
  modified_date
)
SELECT
  'kwannon',
  crypt('kwannon', gen_salt('bf')),
  '{"prefix": null, "first": "Kwannon", "middle": null, "last": "Yashida", "suffix": null, "display": "Kwannon Yashida"}'::json,
  'kwannon@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000401", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "501 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10401", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kwannon'
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
  modified_by,
  modified_date
)
SELECT
  'karma',
  crypt('karma', gen_salt('bf')),
  '{"prefix": null, "first": "Xi''an", "middle": null, "last": "Coy Manh", "suffix": null, "display": "Xi''an Coy Manh"}'::json,
  'karma@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000402", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "green"}'::json,
  '[{"label": "home", "line1": "502 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10402", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'karma'
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
  modified_by,
  modified_date
)
SELECT
  'thundra',
  crypt('thundra', gen_salt('bf')),
  '{"prefix": null, "first": "Thundra", "middle": null, "last": "Bride", "suffix": null, "display": "Thundra Bride"}'::json,
  'thundra@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000403", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "503 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10403", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'thundra'
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
  modified_by,
  modified_date
)
SELECT
  'lyra',
  crypt('lyra', gen_salt('bf')),
  '{"prefix": null, "first": "Lyra", "middle": null, "last": "Walters", "suffix": null, "display": "Lyra Walters"}'::json,
  'lyra@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000404", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "504 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10404", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lyra'
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
  modified_by,
  modified_date
)
SELECT
  'titania',
  crypt('titania', gen_salt('bf')),
  '{"prefix": null, "first": "Mary", "middle": null, "last": "MacPherran", "suffix": null, "display": "Mary MacPherran"}'::json,
  'titania@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000405", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "505 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10405", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'titania'
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
  modified_by,
  modified_date
)
SELECT
  'firestar',
  crypt('firestar', gen_salt('bf')),
  '{"prefix": null, "first": "Angelica", "middle": null, "last": "Jones", "suffix": null, "display": "Angelica Jones"}'::json,
  'firestar@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000406", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "506 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10406", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'firestar'
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
  modified_by,
  modified_date
)
SELECT
  'cloud9',
  crypt('cloud9', gen_salt('bf')),
  '{"prefix": null, "first": "Abigail", "middle": null, "last": "Boyd", "suffix": null, "display": "Abigail Boyd"}'::json,
  'cloud9@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000407", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "507 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10407", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'cloud9'
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
  modified_by,
  modified_date
)
SELECT
  'meggan',
  crypt('meggan', gen_salt('bf')),
  '{"prefix": null, "first": "Meggan", "middle": null, "last": "Braddock", "suffix": null, "display": "Meggan Braddock"}'::json,
  'meggan@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000408", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "green"}'::json,
  '[{"label": "home", "line1": "508 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10408", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'meggan'
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
  modified_by,
  modified_date
)
SELECT
  'nocturne',
  crypt('nocturne', gen_salt('bf')),
  '{"prefix": null, "first": "Talia", "middle": null, "last": "Wagner", "suffix": null, "display": "Talia Wagner"}'::json,
  'nocturne@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000409", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "509 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10409", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nocturne'
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
  modified_by,
  modified_date
)
SELECT
  'bobbi',
  crypt('bobbi', gen_salt('bf')),
  '{"prefix": null, "first": "Bobbi", "middle": null, "last": "Morse", "suffix": null, "display": "Bobbi Morse"}'::json,
  'bobbi@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000410", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "510 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10410", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bobbi'
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
  modified_by,
  modified_date
)
SELECT
  'nadiapym',
  crypt('nadiapym', gen_salt('bf')),
  '{"prefix": null, "first": "Nadia", "middle": null, "last": "van Dyne", "suffix": null, "display": "Nadia van Dyne"}'::json,
  'nadiapym@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000411", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "511 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10411", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nadiapym'
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
  modified_by,
  modified_date
)
SELECT
  'tigra',
  crypt('tigra', gen_salt('bf')),
  '{"prefix": null, "first": "Greer", "middle": null, "last": "Grant", "suffix": null, "display": "Greer Grant"}'::json,
  'tigra@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000412", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "black"}'::json,
  '[{"label": "home", "line1": "512 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10412", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'tigra'
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
  modified_by,
  modified_date
)
SELECT
  'jocasta',
  crypt('jocasta', gen_salt('bf')),
  '{"prefix": null, "first": "Jocasta", "middle": null, "last": "Pym", "suffix": null, "display": "Jocasta Pym"}'::json,
  'jocasta@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000413", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "513 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10413", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jocasta'
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
  modified_by,
  modified_date
)
SELECT
  'madameweb',
  crypt('madameweb', gen_salt('bf')),
  '{"prefix": null, "first": "Cassandra", "middle": null, "last": "Webb", "suffix": null, "display": "Cassandra Webb"}'::json,
  'madameweb@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000414", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "red"}'::json,
  '[{"label": "home", "line1": "514 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10414", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'madameweb'
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
  modified_by,
  modified_date
)
SELECT
  'spidergirl',
  crypt('spidergirl', gen_salt('bf')),
  '{"prefix": null, "first": "Anya", "middle": null, "last": "Corazon", "suffix": null, "display": "Anya Corazon"}'::json,
  'spidergirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000415", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "515 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10415", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'spidergirl'
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
  modified_by,
  modified_date
)
SELECT
  'viper',
  crypt('viper', gen_salt('bf')),
  '{"prefix": null, "first": "Ophelia", "middle": null, "last": "Sarkissian", "suffix": null, "display": "Ophelia Sarkissian"}'::json,
  'viper@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000416", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "516 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10416", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'viper'
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
  modified_by,
  modified_date
)
SELECT
  'sin',
  crypt('sin', gen_salt('bf')),
  '{"prefix": null, "first": "Samantha", "middle": null, "last": "Lewicki", "suffix": null, "display": "Samantha Lewicki"}'::json,
  'sin@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000417", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "517 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10417", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'sin'
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
  modified_by,
  modified_date
)
SELECT
  'danimoonstar',
  crypt('danimoonstar', gen_salt('bf')),
  '{"prefix": null, "first": "Danielle", "middle": null, "last": "Moonstar", "suffix": null, "display": "Danielle Moonstar"}'::json,
  'danimoonstar@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000418", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "white"}'::json,
  '[{"label": "home", "line1": "518 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10418", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'danimoonstar'
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
  modified_by,
  modified_date
)
SELECT
  'magdalene',
  crypt('magdalene', gen_salt('bf')),
  '{"prefix": null, "first": "Magdalene", "middle": null, "last": "Szardos", "suffix": null, "display": "Magdalene Szardos"}'::json,
  'magdalene@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000419", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "519 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10419", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'magdalene'
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
  modified_by,
  modified_date
)
SELECT
  'riptide',
  crypt('riptide', gen_salt('bf')),
  '{"prefix": null, "first": "Janice", "middle": null, "last": "Yanizeski", "suffix": null, "display": "Janice Yanizeski"}'::json,
  'riptide@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000420", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "520 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10420", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'riptide'
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
  modified_by,
  modified_date
)
SELECT
  'stardust',
  crypt('stardust', gen_salt('bf')),
  '{"prefix": null, "first": "Kayla", "middle": null, "last": "Ballantine", "suffix": null, "display": "Kayla Ballantine"}'::json,
  'stardust@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000421", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "white"}'::json,
  '[{"label": "home", "line1": "521 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10421", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'stardust'
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
  modified_by,
  modified_date
)
SELECT
  'smasher',
  crypt('smasher', gen_salt('bf')),
  '{"prefix": null, "first": "Izzy", "middle": null, "last": "Kane", "suffix": null, "display": "Izzy Kane"}'::json,
  'smasher@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000422", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "522 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10422", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'smasher'
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
  modified_by,
  modified_date
)
SELECT
  'catseye',
  crypt('catseye', gen_salt('bf')),
  '{"prefix": null, "first": "Sharon", "middle": null, "last": "Smith", "suffix": null, "display": "Sharon Smith"}'::json,
  'catseye@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000423", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "523 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10423", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'catseye'
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
  modified_by,
  modified_date
)
SELECT
  'tarot',
  crypt('tarot', gen_salt('bf')),
  '{"prefix": null, "first": "Marie-Ange", "middle": null, "last": "Colbert", "suffix": null, "display": "Marie-Ange Colbert"}'::json,
  'tarot@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000424", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "524 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10424", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'tarot'
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
  modified_by,
  modified_date
)
SELECT
  'firebird',
  crypt('firebird', gen_salt('bf')),
  '{"prefix": null, "first": "Bonita", "middle": null, "last": "Juarez", "suffix": null, "display": "Bonita Juarez"}'::json,
  'firebird@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000425", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "525 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10425", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'firebird'
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
  modified_by,
  modified_date
)
SELECT
  'turbo',
  crypt('turbo', gen_salt('bf')),
  '{"prefix": null, "first": "Michiko", "middle": null, "last": "Musashi", "suffix": null, "display": "Michiko Musashi"}'::json,
  'turbo@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000426", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "526 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10426", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'turbo'
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
  modified_by,
  modified_date
)
SELECT
  'lightspeed',
  crypt('lightspeed', gen_salt('bf')),
  '{"prefix": null, "first": "Julie", "middle": null, "last": "Power", "suffix": null, "display": "Julie Power"}'::json,
  'lightspeed@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000427", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "527 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10427", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lightspeed'
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
  modified_by,
  modified_date
)
SELECT
  'freespirit',
  crypt('freespirit', gen_salt('bf')),
  '{"prefix": null, "first": "Mary", "middle": null, "last": "Roth", "suffix": null, "display": "Mary Roth"}'::json,
  'freespirit@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000428", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "528 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10428", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'freespirit'
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
  modified_by,
  modified_date
)
SELECT
  'jolt',
  crypt('jolt', gen_salt('bf')),
  '{"prefix": null, "first": "Hallie", "middle": null, "last": "Takahashi", "suffix": null, "display": "Hallie Takahashi"}'::json,
  'jolt@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000429", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "529 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10429", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jolt'
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
  modified_by,
  modified_date
)
SELECT
  'veranke',
  crypt('veranke', gen_salt('bf')),
  '{"prefix": null, "first": "Veranke", "middle": null, "last": "Skrull", "suffix": null, "display": "Veranke Skrull"}'::json,
  'veranke@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000430", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "530 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10430", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'veranke'
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
  modified_by,
  modified_date
)
SELECT
  'lyja',
  crypt('lyja', gen_salt('bf')),
  '{"prefix": null, "first": "Lyja", "middle": null, "last": "Storm", "suffix": null, "display": "Lyja Storm"}'::json,
  'lyja@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000431", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "green"}'::json,
  '[{"label": "home", "line1": "531 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10431", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lyja'
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
  modified_by,
  modified_date
)
SELECT
  'andromeda',
  crypt('andromeda', gen_salt('bf')),
  '{"prefix": null, "first": "Andromeda", "middle": null, "last": "Attumasen", "suffix": null, "display": "Andromeda Attumasen"}'::json,
  'andromeda@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000432", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "green"}'::json,
  '[{"label": "home", "line1": "532 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10432", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'andromeda'
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
  modified_by,
  modified_date
)
SELECT
  'marrina',
  crypt('marrina', gen_salt('bf')),
  '{"prefix": null, "first": "Marrina", "middle": null, "last": "Smallwood", "suffix": null, "display": "Marrina Smallwood"}'::json,
  'marrina@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000433", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "533 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10433", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'marrina'
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
  modified_by,
  modified_date
)
SELECT
  'snowbird',
  crypt('snowbird', gen_salt('bf')),
  '{"prefix": null, "first": "Narya", "middle": null, "last": "Inua", "suffix": null, "display": "Narya Inua"}'::json,
  'snowbird@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000434", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "534 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10434", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'snowbird'
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
  modified_by,
  modified_date
)
SELECT
  'talisman',
  crypt('talisman', gen_salt('bf')),
  '{"prefix": null, "first": "Elizabeth", "middle": null, "last": "Twoyoungmen", "suffix": null, "display": "Elizabeth Twoyoungmen"}'::json,
  'talisman@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000435", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "535 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10435", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'talisman'
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
  modified_by,
  modified_date
)
SELECT
  'pinkpearl',
  crypt('pinkpearl', gen_salt('bf')),
  '{"prefix": null, "first": "Aubrey", "middle": null, "last": "Dolan", "suffix": null, "display": "Aubrey Dolan"}'::json,
  'pinkpearl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000436", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "white"}'::json,
  '[{"label": "home", "line1": "536 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10436", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'pinkpearl'
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
  modified_by,
  modified_date
)
SELECT
  'valeria',
  crypt('valeria', gen_salt('bf')),
  '{"prefix": null, "first": "Valeria", "middle": null, "last": "Richards", "suffix": null, "display": "Valeria Richards"}'::json,
  'valeria@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000437", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "537 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10437", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'valeria'
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
  modified_by,
  modified_date
)
SELECT
  'luna',
  crypt('luna', gen_salt('bf')),
  '{"prefix": null, "first": "Luna", "middle": null, "last": "Maximoff", "suffix": null, "display": "Luna Maximoff"}'::json,
  'luna@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000438", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "538 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10438", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'luna'
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
  modified_by,
  modified_date
)
SELECT
  'magda',
  crypt('magda', gen_salt('bf')),
  '{"prefix": null, "first": "Magda", "middle": null, "last": "Lensherr", "suffix": null, "display": "Magda Lensherr"}'::json,
  'magda@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000439", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gray", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "539 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10439", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'magda'
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
  modified_by,
  modified_date
)
SELECT
  'destiny',
  crypt('destiny', gen_salt('bf')),
  '{"prefix": null, "first": "Irene", "middle": null, "last": "Adler", "suffix": null, "display": "Irene Adler"}'::json,
  'destiny@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000440", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "540 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10440", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'destiny'
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
  modified_by,
  modified_date
)
SELECT
  'roulette',
  crypt('roulette', gen_salt('bf')),
  '{"prefix": null, "first": "Jennifer", "middle": null, "last": "Stavros", "suffix": null, "display": "Jennifer Stavros"}'::json,
  'roulette@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000441", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "541 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10441", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'roulette'
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
  modified_by,
  modified_date
)
SELECT
  'skids',
  crypt('skids', gen_salt('bf')),
  '{"prefix": null, "first": "Sally", "middle": null, "last": "Blevins", "suffix": null, "display": "Sally Blevins"}'::json,
  'skids@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000442", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "542 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10442", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'skids'
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
  modified_by,
  modified_date
)
SELECT
  'mercury',
  crypt('mercury', gen_salt('bf')),
  '{"prefix": null, "first": "Cessily", "middle": null, "last": "Kincaid", "suffix": null, "display": "Cessily Kincaid"}'::json,
  'mercury@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000443", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "543 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10443", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mercury'
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
  modified_by,
  modified_date
)
SELECT
  'motherpanic',
  crypt('motherpanic', gen_salt('bf')),
  '{"prefix": null, "first": "Violet", "middle": null, "last": "Paige", "suffix": null, "display": "Violet Paige"}'::json,
  'motherpanic@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000444", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "544 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10444", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'motherpanic'
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
  modified_by,
  modified_date
)
SELECT
  'dreamgirl',
  crypt('dreamgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Imra", "middle": null, "last": "Ardeen", "suffix": null, "display": "Imra Ardeen"}'::json,
  'dreamgirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000445", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "545 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10445", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'dreamgirl'
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
  modified_by,
  modified_date
)
SELECT
  'lightninglass',
  crypt('lightninglass', gen_salt('bf')),
  '{"prefix": null, "first": "Ayla", "middle": null, "last": "Ranzz", "suffix": null, "display": "Ayla Ranzz"}'::json,
  'lightninglass@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000446", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "546 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10446", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lightninglass'
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
  modified_by,
  modified_date
)
SELECT
  'ultragirl',
  crypt('ultragirl', gen_salt('bf')),
  '{"prefix": null, "first": "Tasmia", "middle": null, "last": "Mallor", "suffix": null, "display": "Tasmia Mallor"}'::json,
  'ultragirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000447", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "547 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10447", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ultragirl'
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
  modified_by,
  modified_date
)
SELECT
  'jayna',
  crypt('jayna', gen_salt('bf')),
  '{"prefix": null, "first": "Jayna", "middle": null, "last": "Zook", "suffix": null, "display": "Jayna Zook"}'::json,
  'jayna@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000448", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "548 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10448", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jayna'
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
  modified_by,
  modified_date
)
SELECT
  'witchfire',
  crypt('witchfire', gen_salt('bf')),
  '{"prefix": null, "first": "Laura", "middle": null, "last": "Nelson", "suffix": null, "display": "Laura Nelson"}'::json,
  'witchfire@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000449", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "549 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10449", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'witchfire'
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
  modified_by,
  modified_date
)
SELECT
  'harlequin',
  crypt('harlequin', gen_salt('bf')),
  '{"prefix": null, "first": "Marcie", "middle": null, "last": "Cooper", "suffix": null, "display": "Marcie Cooper"}'::json,
  'harlequin@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000450", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "green"}'::json,
  '[{"label": "home", "line1": "550 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10450", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'harlequin'
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
  modified_by,
  modified_date
)
SELECT
  'powerhouse',
  crypt('powerhouse', gen_salt('bf')),
  '{"prefix": null, "first": "Judy", "middle": null, "last": "Jensen", "suffix": null, "display": "Judy Jensen"}'::json,
  'powerhouse@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000451", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "551 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10451", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'powerhouse'
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
  modified_by,
  modified_date
)
SELECT
  'silhouette',
  crypt('silhouette', gen_salt('bf')),
  '{"prefix": null, "first": "Silhouette", "middle": null, "last": "Chord", "suffix": null, "display": "Silhouette Chord"}'::json,
  'silhouette@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000452", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "552 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10452", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'silhouette'
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
  modified_by,
  modified_date
)
SELECT
  'beakgirl',
  crypt('beakgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Angel", "middle": null, "last": "Salvadore", "suffix": null, "display": "Angel Salvadore"}'::json,
  'beakgirl@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000453", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "553 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10453", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'beakgirl'
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
  modified_by,
  modified_date
)
SELECT
  'wallflower',
  crypt('wallflower', gen_salt('bf')),
  '{"prefix": null, "first": "Laurie", "middle": null, "last": "Collins", "suffix": null, "display": "Laurie Collins"}'::json,
  'wallflower@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000454", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "554 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10454", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'wallflower'
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
  modified_by,
  modified_date
)
SELECT
  'winddancer2',
  crypt('winddancer2', gen_salt('bf')),
  '{"prefix": null, "first": "Sofia", "middle": null, "last": "Mantegazza", "suffix": null, "display": "Sofia Mantegazza"}'::json,
  'winddancer2@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000455", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "555 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10455", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'winddancer2'
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
  modified_by,
  modified_date
)
SELECT
  'echo',
  crypt('echo', gen_salt('bf')),
  '{"prefix": null, "first": "Maya", "middle": null, "last": "Lopez", "suffix": null, "display": "Maya Lopez"}'::json,
  'echo@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000456", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "556 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10456", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'echo'
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
  modified_by,
  modified_date
)
SELECT
  'dagger',
  crypt('dagger', gen_salt('bf')),
  '{"prefix": null, "first": "Tandy", "middle": null, "last": "Bowen", "suffix": null, "display": "Tandy Bowen"}'::json,
  'dagger@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000457", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "white"}'::json,
  '[{"label": "home", "line1": "557 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10457", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'dagger'
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
  modified_by,
  modified_date
)
SELECT
  'madelyne',
  crypt('madelyne', gen_salt('bf')),
  '{"prefix": null, "first": "Madelyne", "middle": null, "last": "Pryor", "suffix": null, "display": "Madelyne Pryor"}'::json,
  'madelyne@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000458", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "558 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10458", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'madelyne'
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
  modified_by,
  modified_date
)
SELECT
  'selene',
  crypt('selene', gen_salt('bf')),
  '{"prefix": null, "first": "Selene", "middle": null, "last": "Gallio", "suffix": null, "display": "Selene Gallio"}'::json,
  'selene@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000459", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "559 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10459", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'selene'
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
  modified_by,
  modified_date
)
SELECT
  'moondragon',
  crypt('moondragon', gen_salt('bf')),
  '{"prefix": null, "first": "Heather", "middle": null, "last": "Douglas", "suffix": null, "display": "Heather Douglas"}'::json,
  'moondragon@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000460", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "560 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10460", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'moondragon'
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
  modified_by,
  modified_date
)
SELECT
  'lilandra',
  crypt('lilandra', gen_salt('bf')),
  '{"prefix": null, "first": "Lilandra", "middle": null, "last": "Neramani", "suffix": null, "display": "Lilandra Neramani"}'::json,
  'lilandra@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000461", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "561 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10461", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lilandra'
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
  modified_by,
  modified_date
)
SELECT
  'deathbird',
  crypt('deathbird', gen_salt('bf')),
  '{"prefix": null, "first": "Cal''syee", "middle": null, "last": "Neramani", "suffix": null, "display": "Cal''syee Neramani"}'::json,
  'deathbird@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000462", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "562 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10462", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'deathbird'
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
  modified_by,
  modified_date
)
SELECT
  'angela',
  crypt('angela', gen_salt('bf')),
  '{"prefix": null, "first": "Aldrif", "middle": null, "last": "Odinsdottir", "suffix": null, "display": "Aldrif Odinsdottir"}'::json,
  'angela@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000463", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "563 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10463", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'angela'
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
  modified_by,
  modified_date
)
SELECT
  'hepzibah',
  crypt('hepzibah', gen_salt('bf')),
  '{"prefix": null, "first": "Hepzibah", "middle": null, "last": "Tigra", "suffix": null, "display": "Hepzibah Tigra"}'::json,
  'hepzibah@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000464", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "564 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10464", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'hepzibah'
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
  modified_by,
  modified_date
)
SELECT
  'shriek',
  crypt('shriek', gen_salt('bf')),
  '{"prefix": null, "first": "Frances", "middle": null, "last": "Barrison", "suffix": null, "display": "Frances Barrison"}'::json,
  'shriek@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000465", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "565 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10465", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'shriek'
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
  modified_by,
  modified_date
)
SELECT
  'laynia',
  crypt('laynia', gen_salt('bf')),
  '{"prefix": null, "first": "Laynia", "middle": null, "last": "Petrovna", "suffix": null, "display": "Laynia Petrovna"}'::json,
  'laynia@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000466", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "566 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10466", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'laynia'
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
  modified_by,
  modified_date
)
SELECT
  'darkstar',
  crypt('darkstar', gen_salt('bf')),
  '{"prefix": null, "first": "Sasha", "middle": null, "last": "Roerich", "suffix": null, "display": "Sasha Roerich"}'::json,
  'darkstar@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000467", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "567 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10467", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'darkstar'
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
  modified_by,
  modified_date
)
SELECT
  'princesspython',
  crypt('princesspython', gen_salt('bf')),
  '{"prefix": null, "first": "Zelda", "middle": null, "last": "DuBois", "suffix": null, "display": "Zelda DuBois"}'::json,
  'princesspython@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000468", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "568 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10468", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'princesspython'
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
  modified_by,
  modified_date
)
SELECT
  'scream',
  crypt('scream', gen_salt('bf')),
  '{"prefix": null, "first": "Donna", "middle": null, "last": "Diego", "suffix": null, "display": "Donna Diego"}'::json,
  'scream@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000469", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "569 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10469", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'scream'
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
  modified_by,
  modified_date
)
SELECT
  'judomaster',
  crypt('judomaster', gen_salt('bf')),
  '{"prefix": null, "first": "Sonia", "middle": null, "last": "Sato", "suffix": null, "display": "Sonia Sato"}'::json,
  'judomaster@superhero.com',
  '[{"type": "mobile", "country_code": "1", "number": "5550000470", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "570 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10470", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL

WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'judomaster'
);

SELECT COUNT(*) AS superhero_seed_users
FROM public."user"
WHERE email LIKE '%@superhero.com';
