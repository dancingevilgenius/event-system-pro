-- Dummy users for local development / UI testing.
-- Safe to re-run: skips rows when username already exists.
--
--   psql -U postgres -d event_system_pro -f database/seeds/003_user_dummy.sql

\connect event_system_pro

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
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
  'demo_alice',
  'dummy_hash_alice_01',
  '{
    "prefix": "Ms.",
    "first": "Alice",
    "middle": "M",
    "last": "Demo",
    "suffix": null,
    "display": "Alice Demo"
  }'::json,
  'alice.demo@example.com',
  '[
    {"type": "mobile", "country_code": "1", "number": "6125550101", "primary": true},
    {"type": "home", "country_code": "1", "number": "6125550199", "primary": false}
  ]'::json,
  '{
    "instagram": "@alice_demo",
    "facebook": "alice.demo.fan",
    "website": "https://example.com/alice"
  }'::json,
  '{
    "interested": true,
    "roles": ["registration", "score_table"],
    "availability": "weekends"
  }'::json,
  '{
    "question_id": 1,
    "answer_hint": "pet name"
  }'::json,
  '{
    "notes": "Seed user for Event System Pro demos.",
    "preferred_contact": "email"
  }'::json,
  '[
    {
      "label": "home",
      "line1": "100 Main St",
      "line2": "Apt 4B",
      "city": "Minneapolis",
      "state_or_province": "MN",
      "postal_code": "55401",
      "country_code": "USA"
    }
  ]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'demo_alice'
);

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
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
  'demo_bob',
  'dummy_hash_bob_02',
  '{
    "prefix": "Mr.",
    "first": "Bob",
    "middle": null,
    "last": "Sample",
    "suffix": "Jr.",
    "display": "Bob Sample Jr."
  }'::json,
  'bob.sample@example.com',
  '[
    {"type": "mobile", "country_code": "1", "number": "4075550142", "primary": true}
  ]'::json,
  '{
    "instagram": "@bob_sample",
    "youtube": "https://youtube.com/@bobsample"
  }'::json,
  '{
    "interested": false,
    "roles": [],
    "availability": null
  }'::json,
  '{}'::json,
  '{
    "notes": "Second seed user with a Florida address.",
    "preferred_contact": "phone"
  }'::json,
  '[
    {
      "label": "home",
      "line1": "2500 Event Blvd",
      "line2": null,
      "city": "Orlando",
      "state_or_province": "FL",
      "postal_code": "32801",
      "country_code": "USA"
    },
    {
      "label": "mailing",
      "line1": "PO Box 42",
      "line2": null,
      "city": "Orlando",
      "state_or_province": "FL",
      "postal_code": "32802",
      "country_code": "USA"
    }
  ]'::json,
  TRUE,
  'seed',
  'seed'
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" WHERE username = 'demo_bob'
);

SELECT user_id, username, email, name_json, phone_numbers_json, addresses_json
FROM public."user"
WHERE username IN ('demo_alice', 'demo_bob')
ORDER BY user_id;
