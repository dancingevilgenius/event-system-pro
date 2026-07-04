-- Reference static_list rows for greenfield installs (no legacy _lu tables required).
-- Applied immediately after evp_schema_postgresql.sql (baseline bundle).
-- Safe to re-run (upserts by list_code).

INSERT INTO public.governing_body (governing_body_code, long_name, short_name, created_by)
VALUES ('GLOBAL', 'Global', 'Global', 'c-agent')
ON CONFLICT (governing_body_code) DO NOTHING;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES (
  'EVENT_TYPES',
  'GLOBAL',
  'Competition and event type definitions',
  $event_types$
[
  {
    "key": "COUPLES_BALLROOM",
    "label": "Couples ballroom",
    "major-group": "couples_dance",
    "minor-group": "ballroom",
    "description": "Partner dances in the international and American ballroom tradition, including waltz, tango, foxtrot, and quickstep. Competitors are judged on frame, timing, floorcraft, and presentation as a couple.",
    "min-persons-per-entry": 2,
    "max-persons-per-entry": 16
  },
  {
    "key": "COUPLES_HUSTLE",
    "label": "Couples hustle",
    "major-group": "couples_dance",
    "minor-group": "hustle",
    "description": "Fast-paced disco-era partner dance competitions focused on smooth turns, slot-style movement, and flashy presentation. Judging typically rewards timing, flow, and how well the couple moves together across the floor.",
    "min-persons-per-entry": 2,
    "max-persons-per-entry": 16
  },
  {
    "key": "COUPLES_LATIN",
    "label": "Couples latin",
    "major-group": "couples_dance",
    "minor-group": "latin",
    "description": "Rhythmic partner dances such as cha-cha, rumba, samba, and salsa. Competitions highlight hip action, musicality, chemistry, and sharp execution of latin styling and patterns.",
    "min-persons-per-entry": 2,
    "max-persons-per-entry": 16
  },
  {
    "key": "COUPLES_SWING",
    "label": "Couples swing",
    "major-group": "couples_dance",
    "minor-group": "swing",
    "description": "Energetic partner dances rooted in jazz-era social dance, such as Lindy Hop, East Coast Swing, and West Coast Swing. Events emphasize rhythm, connection, improvisation, and showmanship between lead and follow.",
    "min-persons-per-entry": 2,
    "max-persons-per-entry": 16
  },
  {
    "key": "MOTORSPORTS_KART",
    "label": "Motorsports kart",
    "major-group": "motorsports",
    "minor-group": "kart",
    "description": "Wheel-to-wheel kart racing on dedicated sprint circuits or full-size tracks. Drivers compete in lightweight open-wheel karts through practice, qualifying, heats, and finals. Classes are commonly defined by age, engine package, and weight, with results based on finishing position, consistency, or fastest lap depending on the event format.",
    "min-persons-per-entry": 1,
    "max-persons-per-entry": 20
  },
  {
    "key": "ROBOTICS_GENERAL",
    "label": "Robotics general",
    "major-group": "robotics",
    "minor-group": "general",
    "description": "Amateur autonomous and remote-controlled robot competitions spanning popular hobby and student formats. Events may include line following, sumo-style pushing matches, line or wall maze solving, and combat bouts where robots score points or achieve knockouts within weight and safety rules. Classes are commonly split by builder age, robot weight, and autonomy level.",
    "min-persons-per-entry": 1,
    "max-persons-per-entry": 8
  },
  {
    "key": "SWORD_FENCING",
    "label": "Sword fencing",
    "major-group": "sword_combat",
    "minor-group": "fencing",
    "description": "Modern fencing competition in foil, epee, or sabre. Athletes score touches through speed, distance, tactics, and precise blade work within standardized piste rules and officiating.",
    "min-persons-per-entry": 1,
    "max-persons-per-entry": 2
  },
  {
    "key": "SWORD_HEMA",
    "label": "Sword hema",
    "major-group": "sword_combat",
    "minor-group": "hema",
    "description": "Historical European Martial Arts contests using reconstructed techniques with longsword, rapier, saber, and related weapons. Bouts reward historical form, control, effective technique, and adherence to period or federation rules.",
    "min-persons-per-entry": 1,
    "max-persons-per-entry": 2
  },
  {
    "key": "SWORD_LIGHT_SABER",
    "label": "Sword light saber",
    "major-group": "sword_combat",
    "minor-group": "light-saber",
    "description": "Choreographed or rule-based saber dueling inspired by cinematic combat arts. Competitors face off in timed bouts using approved sabers, with scoring based on clean strikes, defense, footwork, and performance.",
    "min-persons-per-entry": 1,
    "max-persons-per-entry": 2
  }
]
$event_types$::json
)
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES (
  'SECRET_QUESTIONS',
  'GLOBAL',
  'Secret questions for password recovery',
  $secret_questions$
[
  {"key": "1", "label": "Favorite place to visit as a child?"},
  {"key": "2", "label": "Favorite actor?"},
  {"key": "3", "label": "Favorite musician?"},
  {"key": "4", "label": "Name of your pet as a child?"},
  {"key": "5", "label": "In what city were you born?"},
  {"key": "6", "label": "Favorite movie?"},
  {"key": "7", "label": "What street did you grow up on?"},
  {"key": "8", "label": "Color of your first car?"},
  {"key": "9", "label": "Father's middle name?"},
  {"key": "10", "label": "Mother's maiden name?"},
  {"key": "11", "label": "First name of your first kiss?"},
  {"key": "12", "label": "Guilty pleasure?"},
  {"key": "13", "label": "Name of best friend in high school"},
  {"key": "14", "label": "You have 99 problems. What ain't one of them?"},
  {"key": "15", "label": "Name of your elementary school?"},
  {"key": "16", "label": "Childhood nickname?"},
  {"key": "17", "label": "Make and model of your first car?"},
  {"key": "18", "label": "Name of your first employer?"},
  {"key": "19", "label": "First concert you attended?"},
  {"key": "20", "label": "Favorite food as a child?"},
  {"key": "21", "label": "Name of your favorite teacher?"},
  {"key": "22", "label": "First album you bought?"},
  {"key": "23", "label": "Town where your parents met?"},
  {"key": "24", "label": "Name of your childhood toy?"}
]
$secret_questions$::json
)
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;
