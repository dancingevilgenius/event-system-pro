-- Remove duplicate first/last name users (keep lowest user_id) and insert replacements.
-- Run: psql -U postgres -d event_system_pro -f database/migrations/012_dedupe_duplicate_user_names.sql

\connect event_system_pro

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_dup_groups integer;
  v_dup_rows integer;
BEGIN
  SELECT COUNT(*)::integer, COALESCE(SUM(cnt - 1), 0)::integer
  INTO v_dup_groups, v_dup_rows
  FROM (
    SELECT COUNT(*) AS cnt
    FROM public."user"
    WHERE name_json->>'first' IS NOT NULL
      AND name_json->>'last' IS NOT NULL
    GROUP BY name_json->>'first', name_json->>'last'
    HAVING COUNT(*) > 1
  ) d;

  RAISE NOTICE 'Duplicate first/last name groups: %', v_dup_groups;
  RAISE NOTICE 'Duplicate rows to remove: %', v_dup_rows;
END $$;

WITH ranked AS (
  SELECT user_id,
         username,
         name_json->>'first' AS first_name,
         name_json->>'last' AS last_name,
         ROW_NUMBER() OVER (
           PARTITION BY name_json->>'first', name_json->>'last'
           ORDER BY user_id
         ) AS rn
  FROM public."user"
  WHERE name_json->>'first' IS NOT NULL
    AND name_json->>'last' IS NOT NULL
),
deleted AS (
  DELETE FROM public."user" u
  USING ranked r
  WHERE u.user_id = r.user_id
    AND r.rn > 1
  RETURNING u.user_id, u.username, r.first_name, r.last_name
)
SELECT COUNT(*) AS duplicate_rows_deleted FROM deleted;

INSERT INTO public."user" (
  username,
  password_encrypted,
  name_json,
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
  v.username,
  crypt(v.username, gen_salt('bf')),
  json_build_object(
    'prefix', NULL,
    'first', v.first_name,
    'middle', NULL,
    'last', v.last_name,
    'suffix', NULL,
    'display', v.first_name || ' ' || v.last_name
  ),
  v.email,
  '[{"type": "mobile", "country_code": "1", "number": "5559990001", "primary": true}]'::json,
  '{}'::json,
  '{"interested": false, "roles": [], "availability": null}'::json,
  '{}'::json,
  v.additional_info_json::json,
  v.addresses_json::json,
  TRUE,
  'seed',
  'seed'
FROM (
  VALUES
    (
      'nightwing',
      'Richard',
      'Grayson',
      'nightwing@superhero.example.com',
      '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "black", "color2": "blue"}',
      '[{"label": "home", "line1": "1 Bludhaven Pier", "line2": null, "city": "Bludhaven", "state_or_province": "NJ", "postal_code": "10015", "country_code": "USA"}]'
    ),
    (
      'oracle',
      'Barbara',
      'Rand',
      'oracle@superhero.example.com',
      '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "black", "color2": "yellow"}',
      '[{"label": "home", "line1": "142 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10089", "country_code": "USA"}]'
    ),
    (
      'spectre',
      'Crispus',
      'Allen',
      'spectre@superhero.example.com',
      '{"notes": "DC superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "white", "color2": "green"}',
      '[{"label": "home", "line1": "151 Hero Lane", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10051", "country_code": "USA"}]'
    ),
    (
      'mysterio2',
      'Ludwig',
      'Ravelli',
      'mysterio2@superhero.example.com',
      '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "male", "primary-role": "leader", "color1": "silver", "color2": "green"}',
      '[{"label": "home", "line1": "195 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10195", "country_code": "USA"}]'
    ),
    (
      'silk',
      'Cindy',
      'Moon',
      'silk@superhero.example.com',
      '{"notes": "Marvel superhero seed user.", "preferred_contact": "email", "sex": "female", "primary-role": "follower", "color1": "red", "color2": "black"}',
      '[{"label": "home", "line1": "20 Ingram St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10205", "country_code": "USA"}]'
    )
) AS v(username, first_name, last_name, email, additional_info_json, addresses_json)
WHERE NOT EXISTS (
  SELECT 1 FROM public."user" existing WHERE existing.username = v.username
);

SELECT COUNT(*) AS remaining_duplicate_name_groups
FROM (
  SELECT name_json->>'first', name_json->>'last'
  FROM public."user"
  WHERE name_json->>'first' IS NOT NULL
    AND name_json->>'last' IS NOT NULL
  GROUP BY name_json->>'first', name_json->>'last'
  HAVING COUNT(*) > 1
) d;

SELECT COUNT(*) AS duplicate_usernames
FROM (
  SELECT username
  FROM public."user"
  GROUP BY username
  HAVING COUNT(*) > 1
) d;

SELECT user_id, username, name_json->>'display' AS display_name
FROM public."user"
WHERE username IN ('nightwing', 'oracle', 'spectre', 'mysterio2', 'silk')
ORDER BY username;
