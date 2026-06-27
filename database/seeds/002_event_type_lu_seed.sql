-- Seed event_type_lu: 7 contest types (one row per type)

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'COUPLES_BALLROOM',
  '{
    "major_group": "couples_dance",
    "minor_group": "ballroom",
    "description": "Partner dances in the international and American ballroom tradition, including waltz, tango, foxtrot, and quickstep. Competitors are judged on frame, timing, floorcraft, and presentation as a couple.",
    "min_persons_per_entry": 2,
    "max_persons_per_entry": 16
  }'::jsonb,
  'c-agent'
);

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'COUPLES_SWING',
  '{
    "major_group": "couples_dance",
    "minor_group": "swing",
    "description": "Energetic partner dances rooted in jazz-era social dance, such as Lindy Hop, East Coast Swing, and West Coast Swing. Events emphasize rhythm, connection, improvisation, and showmanship between lead and follow.",
    "min_persons_per_entry": 2,
    "max_persons_per_entry": 16
  }'::jsonb,
  'c-agent'
);

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'COUPLES_HUSTLE',
  '{
    "major_group": "couples_dance",
    "minor_group": "hustle",
    "description": "Fast-paced disco-era partner dance competitions focused on smooth turns, slot-style movement, and flashy presentation. Judging typically rewards timing, flow, and how well the couple moves together across the floor.",
    "min_persons_per_entry": 2,
    "max_persons_per_entry": 16
  }'::jsonb,
  'c-agent'
);

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'COUPLES_LATIN',
  '{
    "major_group": "couples_dance",
    "minor_group": "latin",
    "description": "Rhythmic partner dances such as cha-cha, rumba, samba, and salsa. Competitions highlight hip action, musicality, chemistry, and sharp execution of latin styling and patterns.",
    "min_persons_per_entry": 2,
    "max_persons_per_entry": 16
  }'::jsonb,
  'c-agent'
);

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'SWORD_LIGHT_SABER',
  '{
    "major_group": "sword_combat",
    "minor_group": "light-saber",
    "description": "Choreographed or rule-based saber dueling inspired by cinematic combat arts. Competitors face off in timed bouts using approved sabers, with scoring based on clean strikes, defense, footwork, and performance.",
    "min_persons_per_entry": 1,
    "max_persons_per_entry": 2
  }'::jsonb,
  'c-agent'
);

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'SWORD_HEMA',
  '{
    "major_group": "sword_combat",
    "minor_group": "hema",
    "description": "Historical European Martial Arts contests using reconstructed techniques with longsword, rapier, saber, and related weapons. Bouts reward historical form, control, effective technique, and adherence to period or federation rules.",
    "min_persons_per_entry": 1,
    "max_persons_per_entry": 2
  }'::jsonb,
  'c-agent'
);

INSERT INTO event_type_lu (event_type_code, description_json, created_by)
VALUES (
  'SWORD_FENCING',
  '{
    "major_group": "sword_combat",
    "minor_group": "fencing",
    "description": "Modern fencing competition in foil, epee, or sabre. Athletes score touches through speed, distance, tactics, and precise blade work within standardized piste rules and officiating.",
    "min_persons_per_entry": 1,
    "max_persons_per_entry": 2
  }'::jsonb,
  'c-agent'
);
