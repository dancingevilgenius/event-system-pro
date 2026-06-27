-- Owner account for Carlos Garcia (dancingevilgenius).
-- Address: 2005 Williamsburg Drive, Streamwood, IL 60107 (public listing match for IL + 630 area).
--
--   psql -U postgres -d event_system_pro -f database/seeds/004_user_carlos.sql

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
  'dancingevilgenius',
  crypt('ChangeMeOnFirstLogin!', gen_salt('bf')),
  '{
    "prefix": null,
    "first": "Carlos",
    "middle": null,
    "last": "Garcia",
    "suffix": null,
    "display": "Carlos Garcia"
  }'::json,
  'dancingevilgenius@gmail.com',
  '[
    {"type": "mobile", "country_code": "1", "number": "6302201111", "primary": true}
  ]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{"method": "email_code", "email": "dancingevilgenius@gmail.com"}'::json,
  '{
    "notes": "Project owner account.",
    "preferred_contact": "email"
  }'::json,
  '[
    {
      "label": "home",
      "line1": "2005 Williamsburg Drive",
      "line2": null,
      "city": "Streamwood",
      "state_or_province": "IL",
      "postal_code": "60107",
      "country_code": "USA"
    }
  ]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'dancingevilgenius'
);

SELECT user_id, username, email, name_json, addresses_json, phone_numbers_json
FROM public."user"
WHERE username = 'dancingevilgenius';

-- Then run database/seeds/007_dancingevilgenius_app_roles.sql for all app roles.
