-- 200 Marvel and DC female follower seed users for local development.
-- Username and plaintext password are identical; password is bcrypt-hashed on insert.
-- All users have additional_info_json sex=female and primary-role=follower.
-- Safe to re-run: skips rows when username already exists.
--
--   psql -U postgres -d event_system_pro -f database/seeds/006_user_superhero_followers.sql

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
  'moongirl',
  crypt('moongirl', gen_salt('bf')),
  '{"prefix": null, "first": "Lunella", "middle": null, "last": "Lafayette", "suffix": null, "display": "Lunella Lafayette"}'::json,
  'moongirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000000", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "300 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10200", "country_code": "USA"}]'::json,
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
  'americachavez',
  crypt('americachavez', gen_salt('bf')),
  '{"prefix": null, "first": "America", "middle": null, "last": "Chavez", "suffix": null, "display": "America Chavez"}'::json,
  'americachavez@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000001", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "301 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10201", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'americachavez'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'ironheart@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000002", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "302 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10202", "country_code": "USA"}]'::json,
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
  'katebishop',
  crypt('katebishop', gen_salt('bf')),
  '{"prefix": null, "first": "Kate", "middle": null, "last": "Bishop", "suffix": null, "display": "Kate Bishop"}'::json,
  'katebishop@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000003", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "303 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10203", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'katebishop'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'yelena@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000004", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "304 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10204", "country_code": "USA"}]'::json,
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
  'ghost',
  crypt('ghost', gen_salt('bf')),
  '{"prefix": null, "first": "Ava", "middle": null, "last": "Starr", "suffix": null, "display": "Ava Starr"}'::json,
  'ghost@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000005", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "305 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10205", "country_code": "USA"}]'::json,
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
  'stature',
  crypt('stature', gen_salt('bf')),
  '{"prefix": null, "first": "Cassie", "middle": null, "last": "Lang", "suffix": null, "display": "Cassie Lang"}'::json,
  'stature@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000006", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "306 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10206", "country_code": "USA"}]'::json,
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
  'squirrelgirl',
  crypt('squirrelgirl', gen_salt('bf')),
  '{"prefix": null, "first": "Doreen", "middle": null, "last": "Green", "suffix": null, "display": "Doreen Green"}'::json,
  'squirrelgirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000007", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "307 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10207", "country_code": "USA"}]'::json,
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
  'hellcat@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000008", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "308 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10208", "country_code": "USA"}]'::json,
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
  'whitetiger@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000009", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "black"}'::json,
  '[{"label": "home", "line1": "309 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10209", "country_code": "USA"}]'::json,
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
  'peniparker',
  crypt('peniparker', gen_salt('bf')),
  '{"prefix": null, "first": "Peni", "middle": null, "last": "Parker", "suffix": null, "display": "Peni Parker"}'::json,
  'peniparker@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000010", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "black"}'::json,
  '[{"label": "home", "line1": "310 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10210", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'peniparker'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'spectrum@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000011", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "311 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10211", "country_code": "USA"}]'::json,
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
  'rogue2@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000012", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "green"}'::json,
  '[{"label": "home", "line1": "312 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10212", "country_code": "USA"}]'::json,
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
  'mystique@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000013", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "313 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10213", "country_code": "USA"}]'::json,
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
  'ladydeathstrike',
  crypt('ladydeathstrike', gen_salt('bf')),
  '{"prefix": null, "first": "Yuriko", "middle": null, "last": "Oyama", "suffix": null, "display": "Yuriko Oyama"}'::json,
  'ladydeathstrike@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000014", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "red"}'::json,
  '[{"label": "home", "line1": "314 Hero Lane", "line2": null, "city": "Osaka", "state_or_province": "HI", "postal_code": "10214", "country_code": "USA"}]'::json,
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
  'omegasentinel@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000015", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "315 Hero Lane", "line2": null, "city": "New Delhi", "state_or_province": "IN", "postal_code": "10215", "country_code": "USA"}]'::json,
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
  'clea',
  crypt('clea', gen_salt('bf')),
  '{"prefix": null, "first": "Clea", "middle": null, "last": "Strange", "suffix": null, "display": "Clea Strange"}'::json,
  'clea@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000016", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "316 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10216", "country_code": "USA"}]'::json,
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
  'satana',
  crypt('satana', gen_salt('bf')),
  '{"prefix": null, "first": "Satana", "middle": null, "last": "Hellstrom", "suffix": null, "display": "Satana Hellstrom"}'::json,
  'satana@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000017", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "317 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10217", "country_code": "USA"}]'::json,
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
  'hellcat2@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000018", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "318 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10218", "country_code": "USA"}]'::json,
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
  'loislane',
  crypt('loislane', gen_salt('bf')),
  '{"prefix": null, "first": "Lois", "middle": null, "last": "Lane", "suffix": null, "display": "Lois Lane"}'::json,
  'loislane@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000019", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "319 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10219", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'loislane'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'marthakent',
  crypt('marthakent', gen_salt('bf')),
  '{"prefix": null, "first": "Martha", "middle": null, "last": "Kent", "suffix": null, "display": "Martha Kent"}'::json,
  'marthakent@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000020", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "320 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10220", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'marthakent'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'lanalang',
  crypt('lanalang', gen_salt('bf')),
  '{"prefix": null, "first": "Lana", "middle": null, "last": "Lang", "suffix": null, "display": "Lana Lang"}'::json,
  'lanalang@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000021", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "321 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10221", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lanalang'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'talialghul@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000022", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "322 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10222", "country_code": "USA"}]'::json,
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
  'nyssalghul@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000023", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "green"}'::json,
  '[{"label": "home", "line1": "323 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10223", "country_code": "USA"}]'::json,
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
  'cheetah@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000024", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "324 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10224", "country_code": "USA"}]'::json,
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
  'silverbanshee@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000025", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "green"}'::json,
  '[{"label": "home", "line1": "325 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10225", "country_code": "USA"}]'::json,
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
  'livewire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000026", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "326 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10226", "country_code": "USA"}]'::json,
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
  'giganta@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000027", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "327 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10227", "country_code": "USA"}]'::json,
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
  'maxima@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000028", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "328 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10228", "country_code": "USA"}]'::json,
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
  'jessequick',
  crypt('jessequick', gen_salt('bf')),
  '{"prefix": null, "first": "Jesse", "middle": null, "last": "Chambers", "suffix": null, "display": "Jesse Chambers"}'::json,
  'jessequick@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000029", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "329 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10229", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'jessequick'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'thunder@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000030", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "330 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10230", "country_code": "USA"}]'::json,
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
  'lightning@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000031", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "white"}'::json,
  '[{"label": "home", "line1": "331 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10231", "country_code": "USA"}]'::json,
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
  'gracechoi',
  crypt('gracechoi', gen_salt('bf')),
  '{"prefix": null, "first": "Grace", "middle": null, "last": "Choi", "suffix": null, "display": "Grace Choi"}'::json,
  'gracechoi@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000032", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "332 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10232", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'gracechoi'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'mera@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000033", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "333 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10233", "country_code": "USA"}]'::json,
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
  'donnatroy',
  crypt('donnatroy', gen_salt('bf')),
  '{"prefix": null, "first": "Donna", "middle": null, "last": "Troy", "suffix": null, "display": "Donna Troy"}'::json,
  'donnatroy@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000034", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "334 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10234", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'donnatroy'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'karenbeecher',
  crypt('karenbeecher', gen_salt('bf')),
  '{"prefix": null, "first": "Karen", "middle": null, "last": "Beecher", "suffix": null, "display": "Karen Beecher"}'::json,
  'karenbeecher@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000035", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "335 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10235", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'karenbeecher'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'ravager@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000036", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "336 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10236", "country_code": "USA"}]'::json,
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
  'cheshire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000037", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "337 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10237", "country_code": "USA"}]'::json,
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
  'tarantula@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000038", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "black"}'::json,
  '[{"label": "home", "line1": "338 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10238", "country_code": "USA"}]'::json,
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
  'lindadanvers',
  crypt('lindadanvers', gen_salt('bf')),
  '{"prefix": null, "first": "Linda", "middle": null, "last": "Danvers", "suffix": null, "display": "Linda Danvers"}'::json,
  'lindadanvers@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000039", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "339 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10239", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lindadanvers'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'circe@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000040", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "340 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10240", "country_code": "USA"}]'::json,
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
  'blackalice@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000041", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "341 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10241", "country_code": "USA"}]'::json,
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
  'amethyst@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000042", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "342 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10242", "country_code": "USA"}]'::json,
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
  'nubia@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000043", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "343 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10243", "country_code": "USA"}]'::json,
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
  'katana@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000044", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "344 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10244", "country_code": "USA"}]'::json,
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
  'ladyshiva@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000045", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "345 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10245", "country_code": "USA"}]'::json,
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
  'jade@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000046", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "346 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10246", "country_code": "USA"}]'::json,
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
  'hawkwoman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000047", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "347 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10247", "country_code": "USA"}]'::json,
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
  'kendrasaunders',
  crypt('kendrasaunders', gen_salt('bf')),
  '{"prefix": null, "first": "Kendra", "middle": null, "last": "Saunders", "suffix": null, "display": "Kendra Saunders"}'::json,
  'kendrasaunders@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000048", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "348 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10248", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'kendrasaunders'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'goldenglider@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000049", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "white"}'::json,
  '[{"label": "home", "line1": "349 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10249", "country_code": "USA"}]'::json,
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
  'katespencer',
  crypt('katespencer', gen_salt('bf')),
  '{"prefix": null, "first": "Kate", "middle": null, "last": "Spencer", "suffix": null, "display": "Kate Spencer"}'::json,
  'katespencer@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000050", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "350 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10250", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'katespencer'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'alurazorel',
  crypt('alurazorel', gen_salt('bf')),
  '{"prefix": null, "first": "Alura", "middle": null, "last": "Zor-El", "suffix": null, "display": "Alura Zor-El"}'::json,
  'alurazorel@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000051", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "351 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10251", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'alurazorel'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'empress@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000052", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "352 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10252", "country_code": "USA"}]'::json,
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
  'gypsy@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000053", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "353 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10253", "country_code": "USA"}]'::json,
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
  'dawnstar@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000054", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "354 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10254", "country_code": "USA"}]'::json,
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
  'saludigby',
  crypt('saludigby', gen_salt('bf')),
  '{"prefix": null, "first": "Salu", "middle": null, "last": "Digby", "suffix": null, "display": "Salu Digby"}'::json,
  'saludigby@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000055", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "white"}'::json,
  '[{"label": "home", "line1": "355 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10255", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'saludigby'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'tinya@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000056", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "white"}'::json,
  '[{"label": "home", "line1": "356 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10256", "country_code": "USA"}]'::json,
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
  'luornu@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000057", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "357 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10257", "country_code": "USA"}]'::json,
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
  'blackfire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000058", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "358 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10258", "country_code": "USA"}]'::json,
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
  'missmartian@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000059", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "359 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10259", "country_code": "USA"}]'::json,
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
  'wondergirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000060", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "360 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10260", "country_code": "USA"}]'::json,
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
  'lianharper',
  crypt('lianharper', gen_salt('bf')),
  '{"prefix": null, "first": "Lian", "middle": null, "last": "Harper", "suffix": null, "display": "Lian Harper"}'::json,
  'lianharper@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000061", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "361 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10261", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lianharper'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'jinx@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000062", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "black"}'::json,
  '[{"label": "home", "line1": "362 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10262", "country_code": "USA"}]'::json,
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
  'arella@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000063", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "indigo", "color2": "black"}'::json,
  '[{"label": "home", "line1": "363 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10263", "country_code": "USA"}]'::json,
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
  'mazikeen@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000064", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "364 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10264", "country_code": "USA"}]'::json,
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
  'knockout@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000065", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "365 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10265", "country_code": "USA"}]'::json,
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
  'fury@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000066", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "366 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10266", "country_code": "USA"}]'::json,
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
  'lytahall',
  crypt('lytahall', gen_salt('bf')),
  '{"prefix": null, "first": "Lyta", "middle": null, "last": "Hall", "suffix": null, "display": "Lyta Hall"}'::json,
  'lytahall@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000067", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "green"}'::json,
  '[{"label": "home", "line1": "367 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10267", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lytahall'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'cyclone@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000068", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "368 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10268", "country_code": "USA"}]'::json,
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
  'phantomlady@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000069", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "369 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10269", "country_code": "USA"}]'::json,
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
  'terra@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000070", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "green"}'::json,
  '[{"label": "home", "line1": "370 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10270", "country_code": "USA"}]'::json,
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
  'artemis@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000071", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "371 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10271", "country_code": "USA"}]'::json,
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
  'spitfire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000072", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "372 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10272", "country_code": "USA"}]'::json,
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
  'lorilemaris',
  crypt('lorilemaris', gen_salt('bf')),
  '{"prefix": null, "first": "Lori", "middle": null, "last": "Lemaris", "suffix": null, "display": "Lori Lemaris"}'::json,
  'lorilemaris@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000073", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "373 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10273", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lorilemaris'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'maryjane@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000074", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "374 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10274", "country_code": "USA"}]'::json,
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
  'gwenpool@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000075", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "white"}'::json,
  '[{"label": "home", "line1": "375 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10275", "country_code": "USA"}]'::json,
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
  'elektra@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000076", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "376 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10276", "country_code": "USA"}]'::json,
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
  'colleenwing',
  crypt('colleenwing', gen_salt('bf')),
  '{"prefix": null, "first": "Colleen", "middle": null, "last": "Wing", "suffix": null, "display": "Colleen Wing"}'::json,
  'colleenwing@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000077", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "377 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10277", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'colleenwing'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'mistyknight',
  crypt('mistyknight', gen_salt('bf')),
  '{"prefix": null, "first": "Misty", "middle": null, "last": "Knight", "suffix": null, "display": "Misty Knight"}'::json,
  'mistyknight@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000078", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "378 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10278", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mistyknight'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'medusa@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000079", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "379 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10279", "country_code": "USA"}]'::json,
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
  'crystal@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000080", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "380 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10280", "country_code": "USA"}]'::json,
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
  'sif@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000081", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "381 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10281", "country_code": "USA"}]'::json,
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
  'amora@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000082", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "382 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10282", "country_code": "USA"}]'::json,
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
  'lorelei@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000083", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "green"}'::json,
  '[{"label": "home", "line1": "383 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10283", "country_code": "USA"}]'::json,
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
  'namora@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000084", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "384 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10284", "country_code": "USA"}]'::json,
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
  'namorita@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000085", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "green"}'::json,
  '[{"label": "home", "line1": "385 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10285", "country_code": "USA"}]'::json,
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
  'janefoster',
  crypt('janefoster', gen_salt('bf')),
  '{"prefix": null, "first": "Jane", "middle": null, "last": "Foster", "suffix": null, "display": "Jane Foster"}'::json,
  'janefoster@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000086", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "386 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10286", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'janefoster'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'darcylewis',
  crypt('darcylewis', gen_salt('bf')),
  '{"prefix": null, "first": "Darcy", "middle": null, "last": "Lewis", "suffix": null, "display": "Darcy Lewis"}'::json,
  'darcylewis@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000087", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "387 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10287", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'darcylewis'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'singularity@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000088", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "388 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10288", "country_code": "USA"}]'::json,
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
  'nicominoru',
  crypt('nicominoru', gen_salt('bf')),
  '{"prefix": null, "first": "Nico", "middle": null, "last": "Minoru", "suffix": null, "display": "Nico Minoru"}'::json,
  'nicominoru@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000089", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "389 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10289", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'nicominoru'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'karolinadean',
  crypt('karolinadean', gen_salt('bf')),
  '{"prefix": null, "first": "Karolina", "middle": null, "last": "Dean", "suffix": null, "display": "Karolina Dean"}'::json,
  'karolinadean@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000090", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "390 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10290", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'karolinadean'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'gertyorkes@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000091", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "391 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10291", "country_code": "USA"}]'::json,
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
  'mollyhayes',
  crypt('mollyhayes', gen_salt('bf')),
  '{"prefix": null, "first": "Molly", "middle": null, "last": "Hayes", "suffix": null, "display": "Molly Hayes"}'::json,
  'mollyhayes@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000092", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "392 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10292", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'mollyhayes'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'pixie@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000093", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "393 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10293", "country_code": "USA"}]'::json,
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
  'armor@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000094", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "394 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10294", "country_code": "USA"}]'::json,
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
  'blink@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000095", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "pink"}'::json,
  '[{"label": "home", "line1": "395 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10295", "country_code": "USA"}]'::json,
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
  'emmafrost',
  crypt('emmafrost', gen_salt('bf')),
  '{"prefix": null, "first": "Emma", "middle": null, "last": "Frost", "suffix": null, "display": "Emma Frost"}'::json,
  'emmafrost@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000096", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "396 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10296", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'emmafrost'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'polaris@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000097", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "397 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10297", "country_code": "USA"}]'::json,
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
  'boomboom@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000098", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "398 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10298", "country_code": "USA"}]'::json,
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
  'siryn@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000099", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "399 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10299", "country_code": "USA"}]'::json,
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
  'moira@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000100", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "white"}'::json,
  '[{"label": "home", "line1": "400 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10300", "country_code": "USA"}]'::json,
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
  'marrow@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000101", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "red"}'::json,
  '[{"label": "home", "line1": "401 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10301", "country_code": "USA"}]'::json,
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
  'husk@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000102", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "402 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10302", "country_code": "USA"}]'::json,
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
  'surge@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000103", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "403 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10303", "country_code": "USA"}]'::json,
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
  'winddancer@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000104", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "404 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10304", "country_code": "USA"}]'::json,
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
  'honeybadger@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000105", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "405 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10305", "country_code": "USA"}]'::json,
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
  'mania@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000106", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "406 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10306", "country_code": "USA"}]'::json,
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
  'silversable@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000107", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "black"}'::json,
  '[{"label": "home", "line1": "407 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10307", "country_code": "USA"}]'::json,
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
  'blackcat@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000108", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "white"}'::json,
  '[{"label": "home", "line1": "408 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10308", "country_code": "USA"}]'::json,
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
  'typhoidmary@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000109", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "409 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10309", "country_code": "USA"}]'::json,
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
  'sersi@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000110", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "410 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10310", "country_code": "USA"}]'::json,
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
  'thena@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000111", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "white"}'::json,
  '[{"label": "home", "line1": "411 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10311", "country_code": "USA"}]'::json,
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
  'sprite@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000112", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "412 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10312", "country_code": "USA"}]'::json,
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
  'diamondback@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000113", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "413 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10313", "country_code": "USA"}]'::json,
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
  'songbird@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000114", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "red"}'::json,
  '[{"label": "home", "line1": "414 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10314", "country_code": "USA"}]'::json,
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
  'moonstone@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000115", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "white"}'::json,
  '[{"label": "home", "line1": "415 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10315", "country_code": "USA"}]'::json,
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
  'copycat@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000116", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "416 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10316", "country_code": "USA"}]'::json,
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
  'feral@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000117", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "417 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10317", "country_code": "USA"}]'::json,
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
  'callisto@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000118", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "418 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10318", "country_code": "USA"}]'::json,
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
  'lifeguard@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000119", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "419 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10319", "country_code": "USA"}]'::json,
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
  'sage@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000120", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "420 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10320", "country_code": "USA"}]'::json,
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
  'marikoyashida',
  crypt('marikoyashida', gen_salt('bf')),
  '{"prefix": null, "first": "Mariko", "middle": null, "last": "Yashida", "suffix": null, "display": "Mariko Yashida"}'::json,
  'marikoyashida@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000121", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "421 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10321", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'marikoyashida'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'yukio@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000122", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "422 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10322", "country_code": "USA"}]'::json,
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
  'kwannon@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000123", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "423 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10323", "country_code": "USA"}]'::json,
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
  'rachelsummers',
  crypt('rachelsummers', gen_salt('bf')),
  '{"prefix": null, "first": "Rachel", "middle": null, "last": "Summers", "suffix": null, "display": "Rachel Summers"}'::json,
  'rachelsummers@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000124", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "424 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10324", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'rachelsummers'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'karma@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000125", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "green"}'::json,
  '[{"label": "home", "line1": "425 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10325", "country_code": "USA"}]'::json,
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
  'thundra@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000126", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "426 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10326", "country_code": "USA"}]'::json,
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
  'lyra@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000127", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "427 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10327", "country_code": "USA"}]'::json,
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
  'bettyross',
  crypt('bettyross', gen_salt('bf')),
  '{"prefix": null, "first": "Betty", "middle": null, "last": "Ross", "suffix": null, "display": "Betty Ross"}'::json,
  'bettyross@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000128", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "green"}'::json,
  '[{"label": "home", "line1": "428 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10328", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'bettyross'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'titania@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000129", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "429 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10329", "country_code": "USA"}]'::json,
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
  'abigailbrand',
  crypt('abigailbrand', gen_salt('bf')),
  '{"prefix": null, "first": "Abigail", "middle": null, "last": "Brand", "suffix": null, "display": "Abigail Brand"}'::json,
  'abigailbrand@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000130", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "430 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10330", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'abigailbrand'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'firestar@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000131", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "431 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10331", "country_code": "USA"}]'::json,
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
  'cloud9@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000132", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "432 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10332", "country_code": "USA"}]'::json,
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
  'meggan@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000133", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "green"}'::json,
  '[{"label": "home", "line1": "433 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10333", "country_code": "USA"}]'::json,
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
  'faizahussain',
  crypt('faizahussain', gen_salt('bf')),
  '{"prefix": null, "first": "Faiza", "middle": null, "last": "Hussain", "suffix": null, "display": "Faiza Hussain"}'::json,
  'faizahussain@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000134", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "434 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10334", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'faizahussain'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'nocturne@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000135", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "435 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10335", "country_code": "USA"}]'::json,
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
  'bobbi@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000136", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "436 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10336", "country_code": "USA"}]'::json,
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
  'janetvandyne',
  crypt('janetvandyne', gen_salt('bf')),
  '{"prefix": null, "first": "Janet", "middle": null, "last": "van Dyne", "suffix": null, "display": "Janet van Dyne"}'::json,
  'janetvandyne@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000137", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "437 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10337", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'janetvandyne'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'nadiapym@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000138", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "438 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10338", "country_code": "USA"}]'::json,
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
  'ritademara',
  crypt('ritademara', gen_salt('bf')),
  '{"prefix": null, "first": "Rita", "middle": null, "last": "DeMara", "suffix": null, "display": "Rita DeMara"}'::json,
  'ritademara@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000139", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "black"}'::json,
  '[{"label": "home", "line1": "439 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10339", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'ritademara'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'tigra@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000140", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "black"}'::json,
  '[{"label": "home", "line1": "440 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10340", "country_code": "USA"}]'::json,
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
  'jocasta@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000141", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "441 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10341", "country_code": "USA"}]'::json,
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
  'madameweb@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000142", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "red"}'::json,
  '[{"label": "home", "line1": "442 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10342", "country_code": "USA"}]'::json,
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
  'spidergirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000143", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "443 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10343", "country_code": "USA"}]'::json,
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
  'juliacarpenter',
  crypt('juliacarpenter', gen_salt('bf')),
  '{"prefix": null, "first": "Julia", "middle": null, "last": "Carpenter", "suffix": null, "display": "Julia Carpenter"}'::json,
  'juliacarpenter@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000144", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "444 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10344", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'juliacarpenter'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'viper@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000145", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "black"}'::json,
  '[{"label": "home", "line1": "445 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10345", "country_code": "USA"}]'::json,
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
  'sin@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000146", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "446 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10346", "country_code": "USA"}]'::json,
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
  'frankieraye',
  crypt('frankieraye', gen_salt('bf')),
  '{"prefix": null, "first": "Frankie", "middle": null, "last": "Raye", "suffix": null, "display": "Frankie Raye"}'::json,
  'frankieraye@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000147", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "red"}'::json,
  '[{"label": "home", "line1": "447 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10347", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'frankieraye'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'danimoonstar@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000148", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "brown", "color2": "white"}'::json,
  '[{"label": "home", "line1": "448 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10348", "country_code": "USA"}]'::json,
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
  'magdalene@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000149", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "449 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10349", "country_code": "USA"}]'::json,
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
  'riptide@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000150", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "450 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10350", "country_code": "USA"}]'::json,
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
  'stardust@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000151", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gold", "color2": "white"}'::json,
  '[{"label": "home", "line1": "451 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10351", "country_code": "USA"}]'::json,
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
  'smasher@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000152", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "452 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10352", "country_code": "USA"}]'::json,
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
  'catseye@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000153", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "453 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10353", "country_code": "USA"}]'::json,
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
  'tarot@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000154", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "454 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10354", "country_code": "USA"}]'::json,
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
  'firebird@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000155", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "455 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10355", "country_code": "USA"}]'::json,
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
  'turbo@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000156", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "456 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10356", "country_code": "USA"}]'::json,
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
  'lightspeed@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000157", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "457 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10357", "country_code": "USA"}]'::json,
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
  'freespirit@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000158", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "458 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10358", "country_code": "USA"}]'::json,
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
  'jolt@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000159", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "459 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10359", "country_code": "USA"}]'::json,
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
  'veranke@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000160", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "purple"}'::json,
  '[{"label": "home", "line1": "460 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10360", "country_code": "USA"}]'::json,
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
  'lyja@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000161", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "orange", "color2": "green"}'::json,
  '[{"label": "home", "line1": "461 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10361", "country_code": "USA"}]'::json,
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
  'andromeda@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000162", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "green"}'::json,
  '[{"label": "home", "line1": "462 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10362", "country_code": "USA"}]'::json,
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
  'marrina@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000163", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "463 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10363", "country_code": "USA"}]'::json,
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
  'snowbird@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000164", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "464 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10364", "country_code": "USA"}]'::json,
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
  'talisman@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000165", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "465 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10365", "country_code": "USA"}]'::json,
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
  'pinkpearl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000166", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "pink", "color2": "white"}'::json,
  '[{"label": "home", "line1": "466 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10366", "country_code": "USA"}]'::json,
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
  'veronicadare',
  crypt('veronicadare', gen_salt('bf')),
  '{"prefix": null, "first": "Veronica", "middle": null, "last": "Dare", "suffix": null, "display": "Veronica Dare"}'::json,
  'veronicadare@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000167", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "467 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10367", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'veronicadare'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'valeria@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000168", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "468 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10368", "country_code": "USA"}]'::json,
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
  'luna@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000169", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "silver"}'::json,
  '[{"label": "home", "line1": "469 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10369", "country_code": "USA"}]'::json,
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
  'magda@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000170", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "gray", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "470 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10370", "country_code": "USA"}]'::json,
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
  'destiny@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000171", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "471 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10371", "country_code": "USA"}]'::json,
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
  'roulette@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000172", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "472 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10372", "country_code": "USA"}]'::json,
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
  'skids@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000173", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "473 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10373", "country_code": "USA"}]'::json,
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
  'mercury@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000174", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "silver", "color2": "gray"}'::json,
  '[{"label": "home", "line1": "474 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10374", "country_code": "USA"}]'::json,
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
  'lesliethompkins',
  crypt('lesliethompkins', gen_salt('bf')),
  '{"prefix": null, "first": "Leslie", "middle": null, "last": "Thompkins", "suffix": null, "display": "Leslie Thompkins"}'::json,
  'lesliethompkins@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000175", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "475 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10375", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'lesliethompkins'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'myramason',
  crypt('myramason', gen_salt('bf')),
  '{"prefix": null, "first": "Myra", "middle": null, "last": "Mason", "suffix": null, "display": "Myra Mason"}'::json,
  'myramason@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000176", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "white"}'::json,
  '[{"label": "home", "line1": "476 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10376", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'myramason'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'pennyblack',
  crypt('pennyblack', gen_salt('bf')),
  '{"prefix": null, "first": "Penny", "middle": null, "last": "Black", "suffix": null, "display": "Penny Black"}'::json,
  'pennyblack@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000177", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "477 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10377", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'pennyblack'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
  password_recovery_json,
  additional_info_json,
  addresses_json,
  active,
  created_by,
  modified_by,
  modified_date
)
SELECT
  'claireclover',
  crypt('claireclover', gen_salt('bf')),
  '{"prefix": null, "first": "Claire", "middle": null, "last": "Clover", "suffix": null, "display": "Claire Clover"}'::json,
  'claireclover@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000178", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "478 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10378", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'claireclover'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'motherpanic@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000179", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "479 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10379", "country_code": "USA"}]'::json,
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
  'dreamgirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000180", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "white"}'::json,
  '[{"label": "home", "line1": "480 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10380", "country_code": "USA"}]'::json,
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
  'lightninglass@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000181", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "481 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10381", "country_code": "USA"}]'::json,
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
  'ultragirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000182", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "482 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10382", "country_code": "USA"}]'::json,
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
  'laurelgand',
  crypt('laurelgand', gen_salt('bf')),
  '{"prefix": null, "first": "Laurel", "middle": null, "last": "Gand", "suffix": null, "display": "Laurel Gand"}'::json,
  'laurelgand@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000183", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "483 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10383", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'laurelgand'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
  email,
  phone_numbers_json,
  social_media_json,
  volunteer_json,
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
  'jayna@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000184", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "484 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10384", "country_code": "USA"}]'::json,
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
  'witchfire@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000185", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "orange"}'::json,
  '[{"label": "home", "line1": "485 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10385", "country_code": "USA"}]'::json,
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
  'harlequin@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000186", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "green"}'::json,
  '[{"label": "home", "line1": "486 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10386", "country_code": "USA"}]'::json,
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
  'powerhouse@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000187", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "DC superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "blue", "color2": "red"}'::json,
  '[{"label": "home", "line1": "487 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10387", "country_code": "USA"}]'::json,
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
  'silhouette@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000188", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "488 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10388", "country_code": "USA"}]'::json,
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
  'beakgirl@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000189", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "brown"}'::json,
  '[{"label": "home", "line1": "489 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10389", "country_code": "USA"}]'::json,
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
  'wallflower@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000190", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "yellow"}'::json,
  '[{"label": "home", "line1": "490 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10390", "country_code": "USA"}]'::json,
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
  'winddancer2@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000191", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "491 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10391", "country_code": "USA"}]'::json,
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
  'echo@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000192", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "blue"}'::json,
  '[{"label": "home", "line1": "492 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10392", "country_code": "USA"}]'::json,
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
  'dagger@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000193", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "yellow", "color2": "white"}'::json,
  '[{"label": "home", "line1": "493 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10393", "country_code": "USA"}]'::json,
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
  'madelyne@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000194", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}'::json,
  '[{"label": "home", "line1": "494 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10394", "country_code": "USA"}]'::json,
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
  'selene@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000195", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "red"}'::json,
  '[{"label": "home", "line1": "495 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10395", "country_code": "USA"}]'::json,
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
  'moondragon@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000196", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "496 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10396", "country_code": "USA"}]'::json,
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
  'lilandra@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000197", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "green", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "497 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10397", "country_code": "USA"}]'::json,
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
  'deathbird@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000198", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "purple", "color2": "black"}'::json,
  '[{"label": "home", "line1": "498 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10398", "country_code": "USA"}]'::json,
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
  'angela@superhero.example.com',
  '[{"type": "mobile", "country_code": "1", "number": "5560000199", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  '{"notes": "Marvel superhero follower seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "white", "color2": "gold"}'::json,
  '[{"label": "home", "line1": "499 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10399", "country_code": "USA"}]'::json,
  TRUE,
  'c-agent',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'angela'
);

SELECT COUNT(*) AS superhero_follower_seed_users
FROM public."user"
WHERE email LIKE '%@superhero.example.com'
  AND additional_info_json->>'primary-role' = 'follower'
  AND additional_info_json->>'sex' = 'female';
