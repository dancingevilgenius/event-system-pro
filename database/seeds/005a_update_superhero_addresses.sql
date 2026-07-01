-- Update addresses_json for existing superhero seed users.
-- Run: psql -U postgres -d event_system_pro -f database/seeds/005a_update_superhero_addresses.sql

\connect event_system_pro

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "344 Clinton St", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10000", "country_code": "USA"}]'::json
WHERE username = 'superman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1007 Mountain Drive", "line2": null, "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10001", "country_code": "USA"}]'::json
WHERE username = 'batman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1600 Pennsylvania Ave NW", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10002", "country_code": "USA"}]'::json
WHERE username = 'wonderwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "2121 Main St", "line2": null, "city": "Central City", "state_or_province": "MO", "postal_code": "10003", "country_code": "USA"}]'::json
WHERE username = 'flash';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1200 Coast Blvd", "line2": null, "city": "Coast City", "state_or_province": "CA", "postal_code": "10004", "country_code": "USA"}]'::json
WHERE username = 'greenlantern';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "Atlantean Embassy", "line2": null, "city": "Atlantis", "state_or_province": "FL", "postal_code": "10005", "country_code": "USA"}]'::json
WHERE username = 'aquaman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "106 Hero Lane", "line2": null, "city": "Detroit", "state_or_province": "MI", "postal_code": "10006", "country_code": "USA"}]'::json
WHERE username = 'cyborg';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "107 Hero Lane", "line2": null, "city": "Fawcett City", "state_or_province": "IN", "postal_code": "10007", "country_code": "USA"}]'::json
WHERE username = 'shazam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "108 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10008", "country_code": "USA"}]'::json
WHERE username = 'robin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1 Bludhaven Pier", "line2": null, "city": "Bludhaven", "state_or_province": "NJ", "postal_code": "10009", "country_code": "USA"}]'::json
WHERE username = 'nightwing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "110 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10010", "country_code": "USA"}]'::json
WHERE username = 'batgirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "111 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10011", "country_code": "USA"}]'::json
WHERE username = 'supergirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1401 Starling Ave", "line2": null, "city": "Star City", "state_or_province": "WA", "postal_code": "10012", "country_code": "USA"}]'::json
WHERE username = 'greenarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "113 Hero Lane", "line2": "Star City HQ", "city": "Star City", "state_or_province": "WA", "postal_code": "10013", "country_code": "USA"}]'::json
WHERE username = 'blackcanary';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "114 Hero Lane", "line2": null, "city": "Middleton", "state_or_province": "CO", "postal_code": "10014", "country_code": "USA"}]'::json
WHERE username = 'martianmanhunter';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "115 Hero Lane", "line2": null, "city": "St. Roch", "state_or_province": "LA", "postal_code": "10015", "country_code": "USA"}]'::json
WHERE username = 'hawkman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "116 Hero Lane", "line2": null, "city": "St. Roch", "state_or_province": "LA", "postal_code": "10016", "country_code": "USA"}]'::json
WHERE username = 'hawkgirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "117 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10017", "country_code": "USA"}]'::json
WHERE username = 'zatanna';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "118 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10018", "country_code": "USA"}]'::json
WHERE username = 'constantine';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "119 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10019", "country_code": "USA"}]'::json
WHERE username = 'raven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "120 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10020", "country_code": "USA"}]'::json
WHERE username = 'starfire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "121 Hero Lane", "line2": null, "city": "Jump City", "state_or_province": "CA", "postal_code": "10021", "country_code": "USA"}]'::json
WHERE username = 'beastboy';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "122 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10022", "country_code": "USA"}]'::json
WHERE username = 'redhood';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "123 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10023", "country_code": "USA"}]'::json
WHERE username = 'harleyquinn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "124 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10024", "country_code": "USA"}]'::json
WHERE username = 'joker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "125 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10025", "country_code": "USA"}]'::json
WHERE username = 'catwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "126 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10026", "country_code": "USA"}]'::json
WHERE username = 'poisonivy';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "127 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10027", "country_code": "USA"}]'::json
WHERE username = 'twoface';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "128 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10028", "country_code": "USA"}]'::json
WHERE username = 'riddler';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "129 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10029", "country_code": "USA"}]'::json
WHERE username = 'scarecrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "130 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10030", "country_code": "USA"}]'::json
WHERE username = 'bane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "131 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10031", "country_code": "USA"}]'::json
WHERE username = 'darkseid';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "132 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10032", "country_code": "USA"}]'::json
WHERE username = 'brainiac';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "LexCorp Plaza", "line2": null, "city": "Metropolis", "state_or_province": "NY", "postal_code": "10033", "country_code": "USA"}]'::json
WHERE username = 'lexluthor';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "134 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10034", "country_code": "USA"}]'::json
WHERE username = 'deathstroke';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "135 Hero Lane", "line2": null, "city": "Kahndaq", "state_or_province": "IL", "postal_code": "10035", "country_code": "USA"}]'::json
WHERE username = 'blackadam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "136 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10036", "country_code": "USA"}]'::json
WHERE username = 'captaincold';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "137 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10037", "country_code": "USA"}]'::json
WHERE username = 'reverseflash';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "138 Hero Lane", "line2": "Central City HQ", "city": "Central City", "state_or_province": "MO", "postal_code": "10038", "country_code": "USA"}]'::json
WHERE username = 'kidflash';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "139 Hero Lane", "line2": null, "city": "El Paso", "state_or_province": "TX", "postal_code": "10039", "country_code": "USA"}]'::json
WHERE username = 'bluebeetle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "140 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10040", "country_code": "USA"}]'::json
WHERE username = 'boostergold';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "141 Hero Lane", "line2": null, "city": "Hub City", "state_or_province": "IL", "postal_code": "10041", "country_code": "USA"}]'::json
WHERE username = 'question';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "142 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10042", "country_code": "USA"}]'::json
WHERE username = 'phantomstranger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "143 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10043", "country_code": "USA"}]'::json
WHERE username = 'deadman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "144 Hero Lane", "line2": null, "city": "New Orleans", "state_or_province": "LA", "postal_code": "10044", "country_code": "USA"}]'::json
WHERE username = 'swampthing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "145 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10045", "country_code": "USA"}]'::json
WHERE username = 'spectre';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "146 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10046", "country_code": "USA"}]'::json
WHERE username = 'doctorfate';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "147 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10047", "country_code": "USA"}]'::json
WHERE username = 'mistermiracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "148 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10048", "country_code": "USA"}]'::json
WHERE username = 'bigbarda';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "149 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10049", "country_code": "USA"}]'::json
WHERE username = 'orion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "150 Hero Lane", "line2": null, "city": "Las Vegas", "state_or_province": "NV", "postal_code": "10050", "country_code": "USA"}]'::json
WHERE username = 'lobo';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "151 Hero Lane", "line2": null, "city": "Dakota City", "state_or_province": "MO", "postal_code": "10051", "country_code": "USA"}]'::json
WHERE username = 'static';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "152 Hero Lane", "line2": null, "city": "Freeland", "state_or_province": "MD", "postal_code": "10052", "country_code": "USA"}]'::json
WHERE username = 'blacklightning';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "153 Hero Lane", "line2": null, "city": "Detroit", "state_or_province": "MI", "postal_code": "10053", "country_code": "USA"}]'::json
WHERE username = 'vixen';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "154 Hero Lane", "line2": null, "city": "Pittsburgh", "state_or_province": "PA", "postal_code": "10054", "country_code": "USA"}]'::json
WHERE username = 'firestorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "155 Hero Lane", "line2": null, "city": "Ivy Town", "state_or_province": "CT", "postal_code": "10055", "country_code": "USA"}]'::json
WHERE username = 'atom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "156 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10056", "country_code": "USA"}]'::json
WHERE username = 'stargirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "157 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10057", "country_code": "USA"}]'::json
WHERE username = 'drmidnite';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "158 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10058", "country_code": "USA"}]'::json
WHERE username = 'sandman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "159 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10059", "country_code": "USA"}]'::json
WHERE username = 'wildcat';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "160 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10060", "country_code": "USA"}]'::json
WHERE username = 'hourman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "161 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10061", "country_code": "USA"}]'::json
WHERE username = 'doctormidnite';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "162 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10062", "country_code": "USA"}]'::json
WHERE username = 'redtornado';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "163 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10063", "country_code": "USA"}]'::json
WHERE username = 'plasticman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "164 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10064", "country_code": "USA"}]'::json
WHERE username = 'elongatedman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "165 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10065", "country_code": "USA"}]'::json
WHERE username = 'metamorpho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "166 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10066", "country_code": "USA"}]'::json
WHERE username = 'doompatrolrobotman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "167 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10067", "country_code": "USA"}]'::json
WHERE username = 'negativeman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "168 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10068", "country_code": "USA"}]'::json
WHERE username = 'crazyjane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "169 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10069", "country_code": "USA"}]'::json
WHERE username = 'animalman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "170 Hero Lane", "line2": null, "city": "Command D", "state_or_province": "NY", "postal_code": "10070", "country_code": "USA"}]'::json
WHERE username = 'kamandi';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "171 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10071", "country_code": "USA"}]'::json
WHERE username = 'deadshot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "172 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10072", "country_code": "USA"}]'::json
WHERE username = 'captainboomerang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "173 Hero Lane", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10073", "country_code": "USA"}]'::json
WHERE username = 'enchantress';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "174 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10074", "country_code": "USA"}]'::json
WHERE username = 'killerfrost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "175 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10075", "country_code": "USA"}]'::json
WHERE username = 'fire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "176 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10076", "country_code": "USA"}]'::json
WHERE username = 'ice';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "177 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10077", "country_code": "USA"}]'::json
WHERE username = 'powergirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "178 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10078", "country_code": "USA"}]'::json
WHERE username = 'huntress';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "179 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10079", "country_code": "USA"}]'::json
WHERE username = 'batwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "180 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10080", "country_code": "USA"}]'::json
WHERE username = 'reneree';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "181 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10081", "country_code": "USA"}]'::json
WHERE username = 'oracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "182 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10082", "country_code": "USA"}]'::json
WHERE username = 'blackmanta';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "183 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10083", "country_code": "USA"}]'::json
WHERE username = 'oceanmaster';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "184 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10084", "country_code": "USA"}]'::json
WHERE username = 'sinestro';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "185 Hero Lane", "line2": null, "city": "Ysmault", "state_or_province": "NV", "postal_code": "10085", "country_code": "USA"}]'::json
WHERE username = 'atrocitus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "186 Hero Lane", "line2": null, "city": "Odym", "state_or_province": "CO", "postal_code": "10086", "country_code": "USA"}]'::json
WHERE username = 'saintwalker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "187 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10087", "country_code": "USA"}]'::json
WHERE username = 'starsapphire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "188 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10088", "country_code": "USA"}]'::json
WHERE username = 'parademon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "10880 Malibu Point", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10089", "country_code": "USA"}]'::json
WHERE username = 'ironman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "569 Leaman Pl", "line2": null, "city": "Brooklyn", "state_or_province": "NY", "postal_code": "10090", "country_code": "USA"}]'::json
WHERE username = 'captainamerica';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "20 Ingram St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10091", "country_code": "USA"}]'::json
WHERE username = 'spiderman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "192 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10092", "country_code": "USA"}]'::json
WHERE username = 'hulk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "193 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10093", "country_code": "USA"}]'::json
WHERE username = 'thor';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "194 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10094", "country_code": "USA"}]'::json
WHERE username = 'blackwidow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "195 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10095", "country_code": "USA"}]'::json
WHERE username = 'hawkeye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "196 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10096", "country_code": "USA"}]'::json
WHERE username = 'scarletwitch';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "197 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10097", "country_code": "USA"}]'::json
WHERE username = 'vision';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "198 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10098", "country_code": "USA"}]'::json
WHERE username = 'falcon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "199 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10099", "country_code": "USA"}]'::json
WHERE username = 'wintersoldier';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "200 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10100", "country_code": "USA"}]'::json
WHERE username = 'antman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "201 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10101", "country_code": "USA"}]'::json
WHERE username = 'wasp';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "Royal Palace", "line2": null, "city": "Wakanda", "state_or_province": "GA", "postal_code": "10102", "country_code": "USA"}]'::json
WHERE username = 'blackpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "177A Bleecker St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10103", "country_code": "USA"}]'::json
WHERE username = 'doctorstrange';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "204 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10104", "country_code": "USA"}]'::json
WHERE username = 'captainmarvel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "205 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10105", "country_code": "USA"}]'::json
WHERE username = 'msmarvel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "206 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10106", "country_code": "USA"}]'::json
WHERE username = 'shehulk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "250 W 57th St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10107", "country_code": "USA"}]'::json
WHERE username = 'daredevil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "123 Hell''s Kitchen Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10108", "country_code": "USA"}]'::json
WHERE username = 'punisher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "209 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10109", "country_code": "USA"}]'::json
WHERE username = 'lukecage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "210 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10110", "country_code": "USA"}]'::json
WHERE username = 'ironfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "211 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10111", "country_code": "USA"}]'::json
WHERE username = 'ghostrider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "212 Hero Lane", "line2": null, "city": "Knowhere", "state_or_province": "NV", "postal_code": "10112", "country_code": "USA"}]'::json
WHERE username = 'silversurfer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "42nd St and Madison Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10113", "country_code": "USA"}]'::json
WHERE username = 'fantasticfourmr';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "214 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10114", "country_code": "USA"}]'::json
WHERE username = 'invisiblewoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "215 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10115", "country_code": "USA"}]'::json
WHERE username = 'humantorch';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "216 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10116", "country_code": "USA"}]'::json
WHERE username = 'thething';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "217 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10117", "country_code": "USA"}]'::json
WHERE username = 'deadpool';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "218 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10118", "country_code": "USA"}]'::json
WHERE username = 'wolverine';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "219 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10119", "country_code": "USA"}]'::json
WHERE username = 'storm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "220 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10120", "country_code": "USA"}]'::json
WHERE username = 'cyclops';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1407 Graymalkin Ln", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10121", "country_code": "USA"}]'::json
WHERE username = 'professorx';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "222 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10122", "country_code": "USA"}]'::json
WHERE username = 'magneto';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "223 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10123", "country_code": "USA"}]'::json
WHERE username = 'rogue';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "224 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10124", "country_code": "USA"}]'::json
WHERE username = 'gambit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "225 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10125", "country_code": "USA"}]'::json
WHERE username = 'nightcrawler';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "226 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10126", "country_code": "USA"}]'::json
WHERE username = 'colossus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "227 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10127", "country_code": "USA"}]'::json
WHERE username = 'iceman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "228 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10128", "country_code": "USA"}]'::json
WHERE username = 'beast';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "229 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10129", "country_code": "USA"}]'::json
WHERE username = 'kittypryde';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "230 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10130", "country_code": "USA"}]'::json
WHERE username = 'jubilee';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "231 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10131", "country_code": "USA"}]'::json
WHERE username = 'psylocke';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "232 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10132", "country_code": "USA"}]'::json
WHERE username = 'cable';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "233 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10133", "country_code": "USA"}]'::json
WHERE username = 'domino';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "234 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10134", "country_code": "USA"}]'::json
WHERE username = 'cablegirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "235 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10135", "country_code": "USA"}]'::json
WHERE username = 'x23';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "236 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10136", "country_code": "USA"}]'::json
WHERE username = 'dazzler';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "237 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10137", "country_code": "USA"}]'::json
WHERE username = 'bishop';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "238 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10138", "country_code": "USA"}]'::json
WHERE username = 'sunspot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "239 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10139", "country_code": "USA"}]'::json
WHERE username = 'magik';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "240 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10140", "country_code": "USA"}]'::json
WHERE username = 'namor';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "241 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10141", "country_code": "USA"}]'::json
WHERE username = 'sentry';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "242 Hero Lane", "line2": null, "city": "Chicago", "state_or_province": "IL", "postal_code": "10142", "country_code": "USA"}]'::json
WHERE username = 'moonknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "243 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10143", "country_code": "USA"}]'::json
WHERE username = 'blade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "244 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10144", "country_code": "USA"}]'::json
WHERE username = 'ghostspider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "245 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10145", "country_code": "USA"}]'::json
WHERE username = 'venom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "246 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10146", "country_code": "USA"}]'::json
WHERE username = 'greengoblin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "247 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10147", "country_code": "USA"}]'::json
WHERE username = 'doctoroctopus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "248 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10148", "country_code": "USA"}]'::json
WHERE username = 'lizard';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "249 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10149", "country_code": "USA"}]'::json
WHERE username = 'kingpin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "250 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10150", "country_code": "USA"}]'::json
WHERE username = 'electro';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "251 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10151", "country_code": "USA"}]'::json
WHERE username = 'vulture';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "252 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10152", "country_code": "USA"}]'::json
WHERE username = 'mysterio';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "253 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10153", "country_code": "USA"}]'::json
WHERE username = 'rhino';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "254 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10154", "country_code": "USA"}]'::json
WHERE username = 'shocker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "255 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10155", "country_code": "USA"}]'::json
WHERE username = 'scorpion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "256 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10156", "country_code": "USA"}]'::json
WHERE username = 'kraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "257 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10157", "country_code": "USA"}]'::json
WHERE username = 'morbius';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "258 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10158", "country_code": "USA"}]'::json
WHERE username = 'nova';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "259 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10159", "country_code": "USA"}]'::json
WHERE username = 'starlord';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "260 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10160", "country_code": "USA"}]'::json
WHERE username = 'gamora';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "261 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10161", "country_code": "USA"}]'::json
WHERE username = 'drax';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "262 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10162", "country_code": "USA"}]'::json
WHERE username = 'rocket';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "263 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10163", "country_code": "USA"}]'::json
WHERE username = 'groot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "264 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10164", "country_code": "USA"}]'::json
WHERE username = 'mantis';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "265 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10165", "country_code": "USA"}]'::json
WHERE username = 'nebula';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "266 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10166", "country_code": "USA"}]'::json
WHERE username = 'yondu';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "267 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10167", "country_code": "USA"}]'::json
WHERE username = 'thanos';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "268 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10168", "country_code": "USA"}]'::json
WHERE username = 'loki';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "269 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10169", "country_code": "USA"}]'::json
WHERE username = 'hela';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "270 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10170", "country_code": "USA"}]'::json
WHERE username = 'valkyrie';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "271 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10171", "country_code": "USA"}]'::json
WHERE username = 'korg';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "272 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10172", "country_code": "USA"}]'::json
WHERE username = 'miek';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "273 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10173", "country_code": "USA"}]'::json
WHERE username = 'shuri';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "274 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10174", "country_code": "USA"}]'::json
WHERE username = 'okoye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "275 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10175", "country_code": "USA"}]'::json
WHERE username = 'killmonger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "276 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10176", "country_code": "USA"}]'::json
WHERE username = 'mysterio2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "277 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10177", "country_code": "USA"}]'::json
WHERE username = 'warmachine';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "278 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10178", "country_code": "USA"}]'::json
WHERE username = 'pepperpotts';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "279 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10179", "country_code": "USA"}]'::json
WHERE username = 'nickfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "280 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10180", "country_code": "USA"}]'::json
WHERE username = 'agentcoulson';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "281 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10181", "country_code": "USA"}]'::json
WHERE username = 'buckybarnes';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "282 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10182", "country_code": "USA"}]'::json
WHERE username = 'quicksilver';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "283 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10183", "country_code": "USA"}]'::json
WHERE username = 'scarletspider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "284 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10184", "country_code": "USA"}]'::json
WHERE username = 'spiderwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "285 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10185", "country_code": "USA"}]'::json
WHERE username = 'silk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "286 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10186", "country_code": "USA"}]'::json
WHERE username = 'moongirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "287 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10187", "country_code": "USA"}]'::json
WHERE username = 'ironheart';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "288 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10188", "country_code": "USA"}]'::json
WHERE username = 'patriot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "289 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10189", "country_code": "USA"}]'::json
WHERE username = 'yelena';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "290 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10190", "country_code": "USA"}]'::json
WHERE username = 'redguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "291 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10191", "country_code": "USA"}]'::json
WHERE username = 'taskmaster';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "292 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10192", "country_code": "USA"}]'::json
WHERE username = 'ultron';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "293 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10193", "country_code": "USA"}]'::json
WHERE username = 'vision2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "294 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10194", "country_code": "USA"}]'::json
WHERE username = 'wong';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "295 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10195", "country_code": "USA"}]'::json
WHERE username = 'mordo';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "296 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10196", "country_code": "USA"}]'::json
WHERE username = 'ghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "297 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10197", "country_code": "USA"}]'::json
WHERE username = 'yellowjacket';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "298 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10198", "country_code": "USA"}]'::json
WHERE username = 'stature';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "299 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10199", "country_code": "USA"}]'::json
WHERE username = 'wiccan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "300 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10200", "country_code": "USA"}]'::json
WHERE username = 'hulkling';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "301 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10201", "country_code": "USA"}]'::json
WHERE username = 'speed';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "302 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10202", "country_code": "USA"}]'::json
WHERE username = 'northstar';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "303 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10203", "country_code": "USA"}]'::json
WHERE username = 'iceman2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "304 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10204", "country_code": "USA"}]'::json
WHERE username = 'squirrelgirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "305 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10205", "country_code": "USA"}]'::json
WHERE username = 'hellcat';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "306 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10206", "country_code": "USA"}]'::json
WHERE username = 'whitetiger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "307 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10207", "country_code": "USA"}]'::json
WHERE username = 'ironlad';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "308 Hero Lane", "line2": null, "city": "Worldship", "state_or_province": "NY", "postal_code": "10208", "country_code": "USA"}]'::json
WHERE username = 'galactus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "309 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10209", "country_code": "USA"}]'::json
WHERE username = 'dormammu';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "310 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10210", "country_code": "USA"}]'::json
WHERE username = 'ghostriderrobbie';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "311 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10211", "country_code": "USA"}]'::json
WHERE username = 'punisher2099';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "312 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10212", "country_code": "USA"}]'::json
WHERE username = 'spiderpunk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "313 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10213", "country_code": "USA"}]'::json
WHERE username = 'spideruk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "314 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10214", "country_code": "USA"}]'::json
WHERE username = 'spiderham';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "315 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10215", "country_code": "USA"}]'::json
WHERE username = 'sentry2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "316 Hero Lane", "line2": null, "city": "Maryland", "state_or_province": "MD", "postal_code": "10216", "country_code": "USA"}]'::json
WHERE username = 'bluemarvel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "317 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10217", "country_code": "USA"}]'::json
WHERE username = 'spectrum';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "318 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10218", "country_code": "USA"}]'::json
WHERE username = 'rogue2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "319 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10219", "country_code": "USA"}]'::json
WHERE username = 'mystique';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "320 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10220", "country_code": "USA"}]'::json
WHERE username = 'sabretooth';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "321 Hero Lane", "line2": null, "city": "Berlin", "state_or_province": "NH", "postal_code": "10221", "country_code": "USA"}]'::json
WHERE username = 'omegared';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "322 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10222", "country_code": "USA"}]'::json
WHERE username = 'juggernaut';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "323 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10223", "country_code": "USA"}]'::json
WHERE username = 'blob';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "324 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10224", "country_code": "USA"}]'::json
WHERE username = 'toad';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "325 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10225", "country_code": "USA"}]'::json
WHERE username = 'pyro';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "326 Hero Lane", "line2": null, "city": "Osaka", "state_or_province": "HI", "postal_code": "10226", "country_code": "USA"}]'::json
WHERE username = 'ladydeathstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "327 Hero Lane", "line2": null, "city": "New Delhi", "state_or_province": "IN", "postal_code": "10227", "country_code": "USA"}]'::json
WHERE username = 'omegasentinel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "328 Hero Lane", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10228", "country_code": "USA"}]'::json
WHERE username = 'sentinel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "329 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10229", "country_code": "USA"}]'::json
WHERE username = 'hulkred';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "330 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10230", "country_code": "USA"}]'::json
WHERE username = 'abomination';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "331 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10231", "country_code": "USA"}]'::json
WHERE username = 'leader';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "332 Hero Lane", "line2": null, "city": "Yorktown", "state_or_province": "NY", "postal_code": "10232", "country_code": "USA"}]'::json
WHERE username = 'modok';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "333 Hero Lane", "line2": null, "city": "Exile Island", "state_or_province": "FL", "postal_code": "10233", "country_code": "USA"}]'::json
WHERE username = 'redskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "334 Hero Lane", "line2": null, "city": "Sokovia", "state_or_province": "NY", "postal_code": "10234", "country_code": "USA"}]'::json
WHERE username = 'baronzemo';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "335 Hero Lane", "line2": null, "city": "Moscow", "state_or_province": "ID", "postal_code": "10235", "country_code": "USA"}]'::json
WHERE username = 'whiplash';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "336 Hero Lane", "line2": null, "city": "Miami", "state_or_province": "FL", "postal_code": "10236", "country_code": "USA"}]'::json
WHERE username = 'mandarin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "337 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10237", "country_code": "USA"}]'::json
WHERE username = 'clea';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "338 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10238", "country_code": "USA"}]'::json
WHERE username = 'hellstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "339 Hero Lane", "line2": null, "city": "Boston", "state_or_province": "MA", "postal_code": "10239", "country_code": "USA"}]'::json
WHERE username = 'satana';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "340 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10240", "country_code": "USA"}]'::json
WHERE username = 'hellcat2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "341 Hero Lane", "line2": null, "city": "Everglades", "state_or_province": "FL", "postal_code": "10241", "country_code": "USA"}]'::json
WHERE username = 'manthing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "342 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10242", "country_code": "USA"}]'::json
WHERE username = 'lordpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "343 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10243", "country_code": "USA"}]'::json
WHERE username = 'violetkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "344 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10244", "country_code": "USA"}]'::json
WHERE username = 'azureflare';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "345 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10245", "country_code": "USA"}]'::json
WHERE username = 'ladyarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "346 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10246", "country_code": "USA"}]'::json
WHERE username = 'steelquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "347 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10247", "country_code": "USA"}]'::json
WHERE username = 'ninjabolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "348 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10248", "country_code": "USA"}]'::json
WHERE username = 'azuremind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "349 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10249", "country_code": "USA"}]'::json
WHERE username = 'commanderkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "350 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10250", "country_code": "USA"}]'::json
WHERE username = 'paladinshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "351 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10251", "country_code": "USA"}]'::json
WHERE username = 'rogueshock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "352 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10252", "country_code": "USA"}]'::json
WHERE username = 'kingrune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "353 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10253", "country_code": "USA"}]'::json
WHERE username = 'spectralbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "354 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10254", "country_code": "USA"}]'::json
WHERE username = 'quantumsage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "355 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10255", "country_code": "USA"}]'::json
WHERE username = 'gargoyleripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "356 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10256", "country_code": "USA"}]'::json
WHERE username = 'marshalhavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "357 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10257", "country_code": "USA"}]'::json
WHERE username = 'cosmickeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "358 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10258", "country_code": "USA"}]'::json
WHERE username = 'ladyshock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "359 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10259", "country_code": "USA"}]'::json
WHERE username = 'omegacurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "360 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10260", "country_code": "USA"}]'::json
WHERE username = 'embersmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "361 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10261", "country_code": "USA"}]'::json
WHERE username = 'mysticfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "362 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10262", "country_code": "USA"}]'::json
WHERE username = 'chaoshydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "363 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10263", "country_code": "USA"}]'::json
WHERE username = 'onyxmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "364 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10264", "country_code": "USA"}]'::json
WHERE username = 'kingleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "365 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10265", "country_code": "USA"}]'::json
WHERE username = 'marshaleye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "366 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10266", "country_code": "USA"}]'::json
WHERE username = 'goliatheagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "367 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10267", "country_code": "USA"}]'::json
WHERE username = 'wardeneye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "368 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10268", "country_code": "USA"}]'::json
WHERE username = 'marshalkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "369 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10269", "country_code": "USA"}]'::json
WHERE username = 'chaosshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "370 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10270", "country_code": "USA"}]'::json
WHERE username = 'phantomkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "371 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10271", "country_code": "USA"}]'::json
WHERE username = 'ultrashield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "372 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10272", "country_code": "USA"}]'::json
WHERE username = 'scarlethavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "373 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10273", "country_code": "USA"}]'::json
WHERE username = 'rangerrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "374 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10274", "country_code": "USA"}]'::json
WHERE username = 'atomicwing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "375 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10275", "country_code": "USA"}]'::json
WHERE username = 'majorghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "376 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10276", "country_code": "USA"}]'::json
WHERE username = 'primaltempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "377 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10277", "country_code": "USA"}]'::json
WHERE username = 'feralspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "378 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10278", "country_code": "USA"}]'::json
WHERE username = 'valkyrieshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "379 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10279", "country_code": "USA"}]'::json
WHERE username = 'colossuswing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "380 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10280", "country_code": "USA"}]'::json
WHERE username = 'savagehydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "381 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10281", "country_code": "USA"}]'::json
WHERE username = 'turbofury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "382 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10282", "country_code": "USA"}]'::json
WHERE username = 'baronripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "383 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10283", "country_code": "USA"}]'::json
WHERE username = 'mysticstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "384 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10284", "country_code": "USA"}]'::json
WHERE username = 'wardensoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "385 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10285", "country_code": "USA"}]'::json
WHERE username = 'stormkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "386 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10286", "country_code": "USA"}]'::json
WHERE username = 'lightningsurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "387 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10287", "country_code": "USA"}]'::json
WHERE username = 'hypercyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "388 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10288", "country_code": "USA"}]'::json
WHERE username = 'emeraldbreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "389 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10289", "country_code": "USA"}]'::json
WHERE username = 'solargolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "390 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10290", "country_code": "USA"}]'::json
WHERE username = 'gravestrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "391 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10291", "country_code": "USA"}]'::json
WHERE username = 'doomcurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "392 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10292", "country_code": "USA"}]'::json
WHERE username = 'colossushammer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "393 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10293", "country_code": "USA"}]'::json
WHERE username = 'tidalraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "394 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10294", "country_code": "USA"}]'::json
WHERE username = 'roninshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "395 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10295", "country_code": "USA"}]'::json
WHERE username = 'hyperblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "396 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10296", "country_code": "USA"}]'::json
WHERE username = 'hyperprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "397 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10297", "country_code": "USA"}]'::json
WHERE username = 'chaosavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "398 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10298", "country_code": "USA"}]'::json
WHERE username = 'majorspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "399 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10299", "country_code": "USA"}]'::json
WHERE username = 'ironbreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "400 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10300", "country_code": "USA"}]'::json
WHERE username = 'razorrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "401 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10301", "country_code": "USA"}]'::json
WHERE username = 'colossuspanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "402 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10302", "country_code": "USA"}]'::json
WHERE username = 'arcanedefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "403 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10303", "country_code": "USA"}]'::json
WHERE username = 'nightbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "404 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10304", "country_code": "USA"}]'::json
WHERE username = 'sergeantfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "405 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10305", "country_code": "USA"}]'::json
WHERE username = 'outlawmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "406 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10306", "country_code": "USA"}]'::json
WHERE username = 'steelsurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "407 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10307", "country_code": "USA"}]'::json
WHERE username = 'colossusraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "408 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10308", "country_code": "USA"}]'::json
WHERE username = 'turbobane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "409 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10309", "country_code": "USA"}]'::json
WHERE username = 'emeraldhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "410 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10310", "country_code": "USA"}]'::json
WHERE username = 'sentinelshock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "411 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10311", "country_code": "USA"}]'::json
WHERE username = 'commandermask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "412 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10312", "country_code": "USA"}]'::json
WHERE username = 'ancientcobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "413 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10313", "country_code": "USA"}]'::json
WHERE username = 'doomstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "414 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10314", "country_code": "USA"}]'::json
WHERE username = 'razorblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "415 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10315", "country_code": "USA"}]'::json
WHERE username = 'ironbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "416 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10316", "country_code": "USA"}]'::json
WHERE username = 'onyxrender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "417 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10317", "country_code": "USA"}]'::json
WHERE username = 'bulletcyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "418 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10318", "country_code": "USA"}]'::json
WHERE username = 'frosthand';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "419 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10319", "country_code": "USA"}]'::json
WHERE username = 'chaosraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "420 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10320", "country_code": "USA"}]'::json
WHERE username = 'ancienthavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "421 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10321", "country_code": "USA"}]'::json
WHERE username = 'solarcyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "422 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10322", "country_code": "USA"}]'::json
WHERE username = 'paladinsigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "423 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10323", "country_code": "USA"}]'::json
WHERE username = 'baronstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "424 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10324", "country_code": "USA"}]'::json
WHERE username = 'steelleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "425 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10325", "country_code": "USA"}]'::json
WHERE username = 'tidalecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "426 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10326", "country_code": "USA"}]'::json
WHERE username = 'sentinelshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "427 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10327", "country_code": "USA"}]'::json
WHERE username = 'baronsoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "428 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10328", "country_code": "USA"}]'::json
WHERE username = 'stalkergolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "429 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10329", "country_code": "USA"}]'::json
WHERE username = 'novaquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "430 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10330", "country_code": "USA"}]'::json
WHERE username = 'atomichowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "431 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10331", "country_code": "USA"}]'::json
WHERE username = 'reapergolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "432 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10332", "country_code": "USA"}]'::json
WHERE username = 'phantomspell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "433 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10333", "country_code": "USA"}]'::json
WHERE username = 'phantomsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "434 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10334", "country_code": "USA"}]'::json
WHERE username = 'deltadragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "435 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10335", "country_code": "USA"}]'::json
WHERE username = 'ultrashock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "436 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10336", "country_code": "USA"}]'::json
WHERE username = 'ironmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "437 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10337", "country_code": "USA"}]'::json
WHERE username = 'spectralwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "438 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10338", "country_code": "USA"}]'::json
WHERE username = 'quantumshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "439 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10339", "country_code": "USA"}]'::json
WHERE username = 'ioniccyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "440 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10340", "country_code": "USA"}]'::json
WHERE username = 'venomghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "441 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10341", "country_code": "USA"}]'::json
WHERE username = 'frostfreeze';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "442 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10342", "country_code": "USA"}]'::json
WHERE username = 'blizzardeagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "443 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10343", "country_code": "USA"}]'::json
WHERE username = 'ironfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "444 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10344", "country_code": "USA"}]'::json
WHERE username = 'solargriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "445 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10345", "country_code": "USA"}]'::json
WHERE username = 'violetwolf';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "446 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10346", "country_code": "USA"}]'::json
WHERE username = 'valkyrieskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "447 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10347", "country_code": "USA"}]'::json
WHERE username = 'quantumslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "448 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10348", "country_code": "USA"}]'::json
WHERE username = 'mysticphoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "449 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10349", "country_code": "USA"}]'::json
WHERE username = 'emeraldfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "450 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10350", "country_code": "USA"}]'::json
WHERE username = 'paladinspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "451 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10351", "country_code": "USA"}]'::json
WHERE username = 'alphaoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "452 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10352", "country_code": "USA"}]'::json
WHERE username = 'onyxdragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "453 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10353", "country_code": "USA"}]'::json
WHERE username = 'hyperknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "454 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10354", "country_code": "USA"}]'::json
WHERE username = 'frostrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "455 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10355", "country_code": "USA"}]'::json
WHERE username = 'reaperdefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "456 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10356", "country_code": "USA"}]'::json
WHERE username = 'marshalwrath';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "457 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10357", "country_code": "USA"}]'::json
WHERE username = 'doctordragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "458 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10358", "country_code": "USA"}]'::json
WHERE username = 'cybershade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "459 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10359", "country_code": "USA"}]'::json
WHERE username = 'cosmicdoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "460 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10360", "country_code": "USA"}]'::json
WHERE username = 'stormstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "461 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10361", "country_code": "USA"}]'::json
WHERE username = 'cyberstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "462 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10362", "country_code": "USA"}]'::json
WHERE username = 'rangercyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "463 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10363", "country_code": "USA"}]'::json
WHERE username = 'thundershield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "464 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10364", "country_code": "USA"}]'::json
WHERE username = 'ancientarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "465 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10365", "country_code": "USA"}]'::json
WHERE username = 'wraithrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "466 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10366", "country_code": "USA"}]'::json
WHERE username = 'colossuskeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "467 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10367", "country_code": "USA"}]'::json
WHERE username = 'stellarrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "468 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10368", "country_code": "USA"}]'::json
WHERE username = 'savagecobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "469 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10369", "country_code": "USA"}]'::json
WHERE username = 'chaosburn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "470 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10370", "country_code": "USA"}]'::json
WHERE username = 'savageprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "471 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10371", "country_code": "USA"}]'::json
WHERE username = 'mysticburn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "472 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10372", "country_code": "USA"}]'::json
WHERE username = 'chaosstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "473 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10373", "country_code": "USA"}]'::json
WHERE username = 'feralbeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "474 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10374", "country_code": "USA"}]'::json
WHERE username = 'agentgriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "475 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10375", "country_code": "USA"}]'::json
WHERE username = 'dukeblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "476 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10376", "country_code": "USA"}]'::json
WHERE username = 'gargoylekeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "477 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10377", "country_code": "USA"}]'::json
WHERE username = 'agentcrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "478 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10378", "country_code": "USA"}]'::json
WHERE username = 'captainkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "479 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10379", "country_code": "USA"}]'::json
WHERE username = 'reaperpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "480 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10380", "country_code": "USA"}]'::json
WHERE username = 'ninjasmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "481 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10381", "country_code": "USA"}]'::json
WHERE username = 'rangerhex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "482 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10382", "country_code": "USA"}]'::json
WHERE username = 'goliathrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "483 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10383", "country_code": "USA"}]'::json
WHERE username = 'ladywarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "484 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10384", "country_code": "USA"}]'::json
WHERE username = 'marshalcobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "485 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10385", "country_code": "USA"}]'::json
WHERE username = 'graveripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "486 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10386", "country_code": "USA"}]'::json
WHERE username = 'dukeprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "487 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10387", "country_code": "USA"}]'::json
WHERE username = 'hyperspell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "488 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10388", "country_code": "USA"}]'::json
WHERE username = 'eldritchwave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "489 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10389", "country_code": "USA"}]'::json
WHERE username = 'stormpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "490 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10390", "country_code": "USA"}]'::json
WHERE username = 'infernobone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "491 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10391", "country_code": "USA"}]'::json
WHERE username = 'cosmicsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "492 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10392", "country_code": "USA"}]'::json
WHERE username = 'sergeantrune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "493 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10393", "country_code": "USA"}]'::json
WHERE username = 'gargoylecurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "494 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10394", "country_code": "USA"}]'::json
WHERE username = 'stellarhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "495 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10395", "country_code": "USA"}]'::json
WHERE username = 'blizzardarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "496 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10396", "country_code": "USA"}]'::json
WHERE username = 'rangerseer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "497 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10397", "country_code": "USA"}]'::json
WHERE username = 'eldritchavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "498 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10398", "country_code": "USA"}]'::json
WHERE username = 'emeraldheart';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "499 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10399", "country_code": "USA"}]'::json
WHERE username = 'bulletfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "500 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10400", "country_code": "USA"}]'::json
WHERE username = 'ionictempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "501 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10401", "country_code": "USA"}]'::json
WHERE username = 'savageshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "502 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10402", "country_code": "USA"}]'::json
WHERE username = 'frostwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "503 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10403", "country_code": "USA"}]'::json
WHERE username = 'lorddoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "504 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10404", "country_code": "USA"}]'::json
WHERE username = 'colossusrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "505 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10405", "country_code": "USA"}]'::json
WHERE username = 'colossuseagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "506 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10406", "country_code": "USA"}]'::json
WHERE username = 'goliathskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "507 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10407", "country_code": "USA"}]'::json
WHERE username = 'cyberdragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "508 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10408", "country_code": "USA"}]'::json
WHERE username = 'primalspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "509 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10409", "country_code": "USA"}]'::json
WHERE username = 'valkyriespark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "510 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10410", "country_code": "USA"}]'::json
WHERE username = 'emeraldblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "511 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10411", "country_code": "USA"}]'::json
WHERE username = 'infernoecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "512 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10412", "country_code": "USA"}]'::json
WHERE username = 'doctorrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "513 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10413", "country_code": "USA"}]'::json
WHERE username = 'ironbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "514 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10414", "country_code": "USA"}]'::json
WHERE username = 'gravegolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "515 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10415", "country_code": "USA"}]'::json
WHERE username = 'spectralhawk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "516 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10416", "country_code": "USA"}]'::json
WHERE username = 'turboshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "517 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10417", "country_code": "USA"}]'::json
WHERE username = 'ancientphoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "518 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10418", "country_code": "USA"}]'::json
WHERE username = 'eldritchghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "519 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10419", "country_code": "USA"}]'::json
WHERE username = 'gargoylebrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "520 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10420", "country_code": "USA"}]'::json
WHERE username = 'blizzarddoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "521 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10421", "country_code": "USA"}]'::json
WHERE username = 'lightningfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "522 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10422", "country_code": "USA"}]'::json
WHERE username = 'queeneye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "523 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10423", "country_code": "USA"}]'::json
WHERE username = 'hypersage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "524 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10424", "country_code": "USA"}]'::json
WHERE username = 'goldengriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "525 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10425", "country_code": "USA"}]'::json
WHERE username = 'goliathkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "526 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10426", "country_code": "USA"}]'::json
WHERE username = 'ultraarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "527 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10427", "country_code": "USA"}]'::json
WHERE username = 'quantumskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "528 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10428", "country_code": "USA"}]'::json
WHERE username = 'generalknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "529 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10429", "country_code": "USA"}]'::json
WHERE username = 'marshalprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "530 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10430", "country_code": "USA"}]'::json
WHERE username = 'emberhawk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "531 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10431", "country_code": "USA"}]'::json
WHERE username = 'ladyclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "532 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10432", "country_code": "USA"}]'::json
WHERE username = 'renegadeblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "533 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10433", "country_code": "USA"}]'::json
WHERE username = 'lightningmask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "534 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10434", "country_code": "USA"}]'::json
WHERE username = 'roninhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "535 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10435", "country_code": "USA"}]'::json
WHERE username = 'primalguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "536 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10436", "country_code": "USA"}]'::json
WHERE username = 'scarletguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "537 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10437", "country_code": "USA"}]'::json
WHERE username = 'silvershade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "538 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10438", "country_code": "USA"}]'::json
WHERE username = 'mysticmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "539 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10439", "country_code": "USA"}]'::json
WHERE username = 'neontempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "540 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10440", "country_code": "USA"}]'::json
WHERE username = 'crimsonknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "541 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10441", "country_code": "USA"}]'::json
WHERE username = 'tidalrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "542 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10442", "country_code": "USA"}]'::json
WHERE username = 'turbochampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "543 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10443", "country_code": "USA"}]'::json
WHERE username = 'deltaghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "544 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10444", "country_code": "USA"}]'::json
WHERE username = 'rogueeagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "545 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10445", "country_code": "USA"}]'::json
WHERE username = 'valkyrieraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "546 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10446", "country_code": "USA"}]'::json
WHERE username = 'queensurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "547 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10447", "country_code": "USA"}]'::json
WHERE username = 'agentchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "548 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10448", "country_code": "USA"}]'::json
WHERE username = 'generalwrath';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "549 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10449", "country_code": "USA"}]'::json
WHERE username = 'generalhex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "550 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10450", "country_code": "USA"}]'::json
WHERE username = 'ninjaeye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "551 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10451", "country_code": "USA"}]'::json
WHERE username = 'infernooracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "552 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10452", "country_code": "USA"}]'::json
WHERE username = 'azuresage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "553 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10453", "country_code": "USA"}]'::json
WHERE username = 'roninhex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "554 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10454", "country_code": "USA"}]'::json
WHERE username = 'goblinkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "555 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10455", "country_code": "USA"}]'::json
WHERE username = 'dukebane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "556 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10456", "country_code": "USA"}]'::json
WHERE username = 'samuraislayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "557 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10457", "country_code": "USA"}]'::json
WHERE username = 'ancientprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "558 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10458", "country_code": "USA"}]'::json
WHERE username = 'emberrune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "559 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10459", "country_code": "USA"}]'::json
WHERE username = 'thunderraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "560 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10460", "country_code": "USA"}]'::json
WHERE username = 'wardenraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "561 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10461", "country_code": "USA"}]'::json
WHERE username = 'tidalripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "562 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10462", "country_code": "USA"}]'::json
WHERE username = 'lunarwrath';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "563 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10463", "country_code": "USA"}]'::json
WHERE username = 'crimsonbreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "564 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10464", "country_code": "USA"}]'::json
WHERE username = 'crimsonskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "565 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10465", "country_code": "USA"}]'::json
WHERE username = 'savageshock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "566 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10466", "country_code": "USA"}]'::json
WHERE username = 'queensmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "567 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10467", "country_code": "USA"}]'::json
WHERE username = 'lunarleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "568 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10468", "country_code": "USA"}]'::json
WHERE username = 'blizzardghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "569 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10469", "country_code": "USA"}]'::json
WHERE username = 'arcaneeye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "570 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10470", "country_code": "USA"}]'::json
WHERE username = 'gargoylewave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "571 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10471", "country_code": "USA"}]'::json
WHERE username = 'ancientstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "572 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10472", "country_code": "USA"}]'::json
WHERE username = 'spectralquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "573 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10473", "country_code": "USA"}]'::json
WHERE username = 'dukewing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "574 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10474", "country_code": "USA"}]'::json
WHERE username = 'azureleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "575 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10475", "country_code": "USA"}]'::json
WHERE username = 'ladystorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "576 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10476", "country_code": "USA"}]'::json
WHERE username = 'valkyriefang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "577 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10477", "country_code": "USA"}]'::json
WHERE username = 'stalkertempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "578 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10478", "country_code": "USA"}]'::json
WHERE username = 'ninjablade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "579 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10479", "country_code": "USA"}]'::json
WHERE username = 'gargoyleflare';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "580 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10480", "country_code": "USA"}]'::json
WHERE username = 'queenshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "581 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10481", "country_code": "USA"}]'::json
WHERE username = 'solarbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "582 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10482", "country_code": "USA"}]'::json
WHERE username = 'valkyriesurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "583 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10483", "country_code": "USA"}]'::json
WHERE username = 'alphabeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "584 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10484", "country_code": "USA"}]'::json
WHERE username = 'turboslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "585 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10485", "country_code": "USA"}]'::json
WHERE username = 'infernoeagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "586 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10486", "country_code": "USA"}]'::json
WHERE username = 'doomcyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "587 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10487", "country_code": "USA"}]'::json
WHERE username = 'scarlethowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "588 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10488", "country_code": "USA"}]'::json
WHERE username = 'stellarkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "589 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10489", "country_code": "USA"}]'::json
WHERE username = 'roninheart';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "590 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10490", "country_code": "USA"}]'::json
WHERE username = 'blizzardbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "591 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10491", "country_code": "USA"}]'::json
WHERE username = 'neonsoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "592 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10492", "country_code": "USA"}]'::json
WHERE username = 'roguecrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "593 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10493", "country_code": "USA"}]'::json
WHERE username = 'quantumwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "594 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10494", "country_code": "USA"}]'::json
WHERE username = 'stalkerblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "595 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10495", "country_code": "USA"}]'::json
WHERE username = 'deltamind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "596 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10496", "country_code": "USA"}]'::json
WHERE username = 'goliathsigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "597 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10497", "country_code": "USA"}]'::json
WHERE username = 'phantomdragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "598 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10498", "country_code": "USA"}]'::json
WHERE username = 'onyxguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "599 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10499", "country_code": "USA"}]'::json
WHERE username = 'crimsonhavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "600 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10500", "country_code": "USA"}]'::json
WHERE username = 'goblinshock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "601 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10501", "country_code": "USA"}]'::json
WHERE username = 'roguerage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "602 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10502", "country_code": "USA"}]'::json
WHERE username = 'roguerush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "603 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10503", "country_code": "USA"}]'::json
WHERE username = 'captaincurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "604 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10504", "country_code": "USA"}]'::json
WHERE username = 'neonarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "605 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10505", "country_code": "USA"}]'::json
WHERE username = 'blizzardbeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "606 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10506", "country_code": "USA"}]'::json
WHERE username = 'paladinslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "607 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10507", "country_code": "USA"}]'::json
WHERE username = 'samuraibeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "608 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10508", "country_code": "USA"}]'::json
WHERE username = 'violetstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "609 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10509", "country_code": "USA"}]'::json
WHERE username = 'eldritchquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "610 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10510", "country_code": "USA"}]'::json
WHERE username = 'nightbeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "611 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10511", "country_code": "USA"}]'::json
WHERE username = 'doctorghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "612 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10512", "country_code": "USA"}]'::json
WHERE username = 'deltaoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "613 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10513", "country_code": "USA"}]'::json
WHERE username = 'steeldoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "614 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10514", "country_code": "USA"}]'::json
WHERE username = 'marshalripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "615 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10515", "country_code": "USA"}]'::json
WHERE username = 'bansheedoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "616 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10516", "country_code": "USA"}]'::json
WHERE username = 'thunderpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "617 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10517", "country_code": "USA"}]'::json
WHERE username = 'bansheeheart';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "618 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10518", "country_code": "USA"}]'::json
WHERE username = 'samuraifang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "619 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10519", "country_code": "USA"}]'::json
WHERE username = 'savagehowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "620 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10520", "country_code": "USA"}]'::json
WHERE username = 'lordhand';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "621 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10521", "country_code": "USA"}]'::json
WHERE username = 'silvershield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "622 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10522", "country_code": "USA"}]'::json
WHERE username = 'paladinknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "623 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10523", "country_code": "USA"}]'::json
WHERE username = 'solarseer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "624 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10524", "country_code": "USA"}]'::json
WHERE username = 'quantumknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "625 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10525", "country_code": "USA"}]'::json
WHERE username = 'reaperhavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "626 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10526", "country_code": "USA"}]'::json
WHERE username = 'reaperknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "627 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10527", "country_code": "USA"}]'::json
WHERE username = 'marshalpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "628 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10528", "country_code": "USA"}]'::json
WHERE username = 'neonsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "629 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10529", "country_code": "USA"}]'::json
WHERE username = 'agentkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "630 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10530", "country_code": "USA"}]'::json
WHERE username = 'kingshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "631 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10531", "country_code": "USA"}]'::json
WHERE username = 'dukeruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "632 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10532", "country_code": "USA"}]'::json
WHERE username = 'doomripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "633 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10533", "country_code": "USA"}]'::json
WHERE username = 'novasurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "634 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10534", "country_code": "USA"}]'::json
WHERE username = 'baroneagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "635 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10535", "country_code": "USA"}]'::json
WHERE username = 'ionicgolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "636 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10536", "country_code": "USA"}]'::json
WHERE username = 'dukeoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "637 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10537", "country_code": "USA"}]'::json
WHERE username = 'omegakraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "638 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10538", "country_code": "USA"}]'::json
WHERE username = 'rangerrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "639 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10539", "country_code": "USA"}]'::json
WHERE username = 'azurerender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "640 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10540", "country_code": "USA"}]'::json
WHERE username = 'solarheart';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "641 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10541", "country_code": "USA"}]'::json
WHERE username = 'rangerhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "642 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10542", "country_code": "USA"}]'::json
WHERE username = 'embershield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "643 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10543", "country_code": "USA"}]'::json
WHERE username = 'captainoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "644 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10544", "country_code": "USA"}]'::json
WHERE username = 'ironhammer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "645 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10545", "country_code": "USA"}]'::json
WHERE username = 'eldritchbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "646 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10546", "country_code": "USA"}]'::json
WHERE username = 'kingsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "647 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10547", "country_code": "USA"}]'::json
WHERE username = 'goliathrune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "648 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10548", "country_code": "USA"}]'::json
WHERE username = 'sergeantbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "649 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10549", "country_code": "USA"}]'::json
WHERE username = 'phantomfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "650 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10550", "country_code": "USA"}]'::json
WHERE username = 'rogueoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "651 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10551", "country_code": "USA"}]'::json
WHERE username = 'ancientpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "652 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10552", "country_code": "USA"}]'::json
WHERE username = 'dukeslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "653 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10553", "country_code": "USA"}]'::json
WHERE username = 'thunderhex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "654 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10554", "country_code": "USA"}]'::json
WHERE username = 'razorbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "655 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10555", "country_code": "USA"}]'::json
WHERE username = 'solarsurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "656 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10556", "country_code": "USA"}]'::json
WHERE username = 'titanmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "657 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10557", "country_code": "USA"}]'::json
WHERE username = 'gravewarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "658 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10558", "country_code": "USA"}]'::json
WHERE username = 'cyberbreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "659 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10559", "country_code": "USA"}]'::json
WHERE username = 'hyperbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "660 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10560", "country_code": "USA"}]'::json
WHERE username = 'solarstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "661 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10561", "country_code": "USA"}]'::json
WHERE username = 'sentineldragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "662 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10562", "country_code": "USA"}]'::json
WHERE username = 'agentbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "663 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10563", "country_code": "USA"}]'::json
WHERE username = 'colossusbreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "664 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10564", "country_code": "USA"}]'::json
WHERE username = 'deltafreeze';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "665 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10565", "country_code": "USA"}]'::json
WHERE username = 'tidalbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "666 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10566", "country_code": "USA"}]'::json
WHERE username = 'turbomask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "667 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10567", "country_code": "USA"}]'::json
WHERE username = 'agenthex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "668 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10568", "country_code": "USA"}]'::json
WHERE username = 'ninjabrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "669 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10569", "country_code": "USA"}]'::json
WHERE username = 'baronsage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "670 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10570", "country_code": "USA"}]'::json
WHERE username = 'frostarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "671 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10571", "country_code": "USA"}]'::json
WHERE username = 'omegaavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "672 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10572", "country_code": "USA"}]'::json
WHERE username = 'omegasigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "673 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10573", "country_code": "USA"}]'::json
WHERE username = 'ionicavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "674 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10574", "country_code": "USA"}]'::json
WHERE username = 'steelbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "675 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10575", "country_code": "USA"}]'::json
WHERE username = 'lunarruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "676 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10576", "country_code": "USA"}]'::json
WHERE username = 'violethand';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "677 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10577", "country_code": "USA"}]'::json
WHERE username = 'nightflare';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "678 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10578", "country_code": "USA"}]'::json
WHERE username = 'mysticwave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "679 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10579", "country_code": "USA"}]'::json
WHERE username = 'mysticrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "680 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10580", "country_code": "USA"}]'::json
WHERE username = 'ladyfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "681 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10581", "country_code": "USA"}]'::json
WHERE username = 'kingslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "682 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10582", "country_code": "USA"}]'::json
WHERE username = 'marshalclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "683 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10583", "country_code": "USA"}]'::json
WHERE username = 'razorspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "684 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10584", "country_code": "USA"}]'::json
WHERE username = 'tidalwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "685 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10585", "country_code": "USA"}]'::json
WHERE username = 'turbobolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "686 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10586", "country_code": "USA"}]'::json
WHERE username = 'emeraldbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "687 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10587", "country_code": "USA"}]'::json
WHERE username = 'alphastrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "688 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10588", "country_code": "USA"}]'::json
WHERE username = 'phantomseer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "689 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10589", "country_code": "USA"}]'::json
WHERE username = 'roninpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "690 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10590", "country_code": "USA"}]'::json
WHERE username = 'outlawstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "691 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10591", "country_code": "USA"}]'::json
WHERE username = 'scarletpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "692 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10592", "country_code": "USA"}]'::json
WHERE username = 'thundereagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "693 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10593", "country_code": "USA"}]'::json
WHERE username = 'omegabeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "694 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10594", "country_code": "USA"}]'::json
WHERE username = 'roningriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "695 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10595", "country_code": "USA"}]'::json
WHERE username = 'ninjapulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "696 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10596", "country_code": "USA"}]'::json
WHERE username = 'onyxhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "697 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10597", "country_code": "USA"}]'::json
WHERE username = 'queendefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "698 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10598", "country_code": "USA"}]'::json
WHERE username = 'stalkerkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "699 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10599", "country_code": "USA"}]'::json
WHERE username = 'stellaravenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "700 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10600", "country_code": "USA"}]'::json
WHERE username = 'neonfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "701 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10601", "country_code": "USA"}]'::json
WHERE username = 'blizzardripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "702 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10602", "country_code": "USA"}]'::json
WHERE username = 'infernoshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "703 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10603", "country_code": "USA"}]'::json
WHERE username = 'ironkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "704 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10604", "country_code": "USA"}]'::json
WHERE username = 'valkyriephoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "705 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10605", "country_code": "USA"}]'::json
WHERE username = 'violetslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "706 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10606", "country_code": "USA"}]'::json
WHERE username = 'sentinelpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "707 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10607", "country_code": "USA"}]'::json
WHERE username = 'spectralmask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "708 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10608", "country_code": "USA"}]'::json
WHERE username = 'bansheerune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "709 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10609", "country_code": "USA"}]'::json
WHERE username = 'kingfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "710 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10610", "country_code": "USA"}]'::json
WHERE username = 'violetknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "711 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10611", "country_code": "USA"}]'::json
WHERE username = 'cannonhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "712 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10612", "country_code": "USA"}]'::json
WHERE username = 'doomsoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "713 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10613", "country_code": "USA"}]'::json
WHERE username = 'arcaneavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "714 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10614", "country_code": "USA"}]'::json
WHERE username = 'lordburn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "715 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10615", "country_code": "USA"}]'::json
WHERE username = 'silverkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "716 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10616", "country_code": "USA"}]'::json
WHERE username = 'ninjawarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "717 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10617", "country_code": "USA"}]'::json
WHERE username = 'novaleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "718 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10618", "country_code": "USA"}]'::json
WHERE username = 'azureknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "719 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10619", "country_code": "USA"}]'::json
WHERE username = 'alphafist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "720 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10620", "country_code": "USA"}]'::json
WHERE username = 'stellarghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "721 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10621", "country_code": "USA"}]'::json
WHERE username = 'stalkerrender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "722 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10622", "country_code": "USA"}]'::json
WHERE username = 'cannonwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "723 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10623", "country_code": "USA"}]'::json
WHERE username = 'steelblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "724 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10624", "country_code": "USA"}]'::json
WHERE username = 'stormhand';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "725 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10625", "country_code": "USA"}]'::json
WHERE username = 'gargoyleraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "726 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10626", "country_code": "USA"}]'::json
WHERE username = 'tidalstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "727 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10627", "country_code": "USA"}]'::json
WHERE username = 'razorspirit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "728 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10628", "country_code": "USA"}]'::json
WHERE username = 'reapereye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "729 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10629", "country_code": "USA"}]'::json
WHERE username = 'novafang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "730 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10630", "country_code": "USA"}]'::json
WHERE username = 'hunterquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "731 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10631", "country_code": "USA"}]'::json
WHERE username = 'queencurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "732 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10632", "country_code": "USA"}]'::json
WHERE username = 'ninjatempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "733 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10633", "country_code": "USA"}]'::json
WHERE username = 'cannonspell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "734 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10634", "country_code": "USA"}]'::json
WHERE username = 'paladinquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "735 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10635", "country_code": "USA"}]'::json
WHERE username = 'commandershade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "736 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10636", "country_code": "USA"}]'::json
WHERE username = 'eldritchprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "737 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10637", "country_code": "USA"}]'::json
WHERE username = 'novasigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "738 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10638", "country_code": "USA"}]'::json
WHERE username = 'queenprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "739 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10639", "country_code": "USA"}]'::json
WHERE username = 'goliathoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "740 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10640", "country_code": "USA"}]'::json
WHERE username = 'gargoyleoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "741 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10641", "country_code": "USA"}]'::json
WHERE username = 'novakeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "742 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10642", "country_code": "USA"}]'::json
WHERE username = 'infernocurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "743 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10643", "country_code": "USA"}]'::json
WHERE username = 'rangersmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "744 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10644", "country_code": "USA"}]'::json
WHERE username = 'reaperruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "745 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10645", "country_code": "USA"}]'::json
WHERE username = 'razorstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "746 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10646", "country_code": "USA"}]'::json
WHERE username = 'gargoyledragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "747 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10647", "country_code": "USA"}]'::json
WHERE username = 'doomtempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "748 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10648", "country_code": "USA"}]'::json
WHERE username = 'sergeanteye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "749 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10649", "country_code": "USA"}]'::json
WHERE username = 'lordphoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "750 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10650", "country_code": "USA"}]'::json
WHERE username = 'frostflare';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "751 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10651", "country_code": "USA"}]'::json
WHERE username = 'graveguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "752 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10652", "country_code": "USA"}]'::json
WHERE username = 'omegafist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "753 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10653", "country_code": "USA"}]'::json
WHERE username = 'ninjasigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "754 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10654", "country_code": "USA"}]'::json
WHERE username = 'lightningbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "755 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10655", "country_code": "USA"}]'::json
WHERE username = 'alphakeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "756 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10656", "country_code": "USA"}]'::json
WHERE username = 'queenraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "757 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10657", "country_code": "USA"}]'::json
WHERE username = 'frostrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "758 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10658", "country_code": "USA"}]'::json
WHERE username = 'neonknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "759 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10659", "country_code": "USA"}]'::json
WHERE username = 'scarletmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "760 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10660", "country_code": "USA"}]'::json
WHERE username = 'doomchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "761 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10661", "country_code": "USA"}]'::json
WHERE username = 'cannoncurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "762 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10662", "country_code": "USA"}]'::json
WHERE username = 'titanchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "763 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10663", "country_code": "USA"}]'::json
WHERE username = 'quantumrender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "764 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10664", "country_code": "USA"}]'::json
WHERE username = 'dukespark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "765 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10665", "country_code": "USA"}]'::json
WHERE username = 'solarshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "766 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10666", "country_code": "USA"}]'::json
WHERE username = 'stellarskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "767 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10667", "country_code": "USA"}]'::json
WHERE username = 'commandersmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "768 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10668", "country_code": "USA"}]'::json
WHERE username = 'toxicgolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "769 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10669", "country_code": "USA"}]'::json
WHERE username = 'neonwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "770 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10670", "country_code": "USA"}]'::json
WHERE username = 'stalkerhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "771 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10671", "country_code": "USA"}]'::json
WHERE username = 'atomicseer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "772 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10672", "country_code": "USA"}]'::json
WHERE username = 'arcanehammer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "773 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10673", "country_code": "USA"}]'::json
WHERE username = 'ronindefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "774 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10674", "country_code": "USA"}]'::json
WHERE username = 'kingfreeze';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "775 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10675", "country_code": "USA"}]'::json
WHERE username = 'kingtempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "776 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10676", "country_code": "USA"}]'::json
WHERE username = 'razorhex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "777 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10677", "country_code": "USA"}]'::json
WHERE username = 'neonhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "778 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10678", "country_code": "USA"}]'::json
WHERE username = 'spectralflare';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "779 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10679", "country_code": "USA"}]'::json
WHERE username = 'arcanehydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "780 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10680", "country_code": "USA"}]'::json
WHERE username = 'stormblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "781 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10681", "country_code": "USA"}]'::json
WHERE username = 'stormwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "782 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10682", "country_code": "USA"}]'::json
WHERE username = 'sergeanttempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "783 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10683", "country_code": "USA"}]'::json
WHERE username = 'azurecrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "784 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10684", "country_code": "USA"}]'::json
WHERE username = 'lunarprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "785 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10685", "country_code": "USA"}]'::json
WHERE username = 'lightningblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "786 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10686", "country_code": "USA"}]'::json
WHERE username = 'novaslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "787 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10687", "country_code": "USA"}]'::json
WHERE username = 'lunarmind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "788 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10688", "country_code": "USA"}]'::json
WHERE username = 'ionicclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "789 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10689", "country_code": "USA"}]'::json
WHERE username = 'crimsonspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "790 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10690", "country_code": "USA"}]'::json
WHERE username = 'chaoswave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "791 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10691", "country_code": "USA"}]'::json
WHERE username = 'steelbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "792 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10692", "country_code": "USA"}]'::json
WHERE username = 'primalmask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "793 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10693", "country_code": "USA"}]'::json
WHERE username = 'stormwave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "794 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10694", "country_code": "USA"}]'::json
WHERE username = 'dukebreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "795 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10695", "country_code": "USA"}]'::json
WHERE username = 'agenthydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "796 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10696", "country_code": "USA"}]'::json
WHERE username = 'spectralkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "797 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10697", "country_code": "USA"}]'::json
WHERE username = 'feralrune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "798 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10698", "country_code": "USA"}]'::json
WHERE username = 'quantumstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "799 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10699", "country_code": "USA"}]'::json
WHERE username = 'goldenkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "800 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10700", "country_code": "USA"}]'::json
WHERE username = 'majorshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "801 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10701", "country_code": "USA"}]'::json
WHERE username = 'wraithecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "802 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10702", "country_code": "USA"}]'::json
WHERE username = 'primalhand';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "803 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10703", "country_code": "USA"}]'::json
WHERE username = 'lightningshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "804 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10704", "country_code": "USA"}]'::json
WHERE username = 'eldritchbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "805 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10705", "country_code": "USA"}]'::json
WHERE username = 'cosmicrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "806 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10706", "country_code": "USA"}]'::json
WHERE username = 'gargoylepanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "807 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10707", "country_code": "USA"}]'::json
WHERE username = 'novasmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "808 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10708", "country_code": "USA"}]'::json
WHERE username = 'gargoylespell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "809 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10709", "country_code": "USA"}]'::json
WHERE username = 'generalgriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "810 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10710", "country_code": "USA"}]'::json
WHERE username = 'samurairipper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "811 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10711", "country_code": "USA"}]'::json
WHERE username = 'razordoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "812 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10712", "country_code": "USA"}]'::json
WHERE username = 'quantumdefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "813 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10713", "country_code": "USA"}]'::json
WHERE username = 'deltarage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "814 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10714", "country_code": "USA"}]'::json
WHERE username = 'gravebolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "815 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10715", "country_code": "USA"}]'::json
WHERE username = 'wardenwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "816 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10716", "country_code": "USA"}]'::json
WHERE username = 'roninkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "817 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10717", "country_code": "USA"}]'::json
WHERE username = 'doctorbone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "818 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10718", "country_code": "USA"}]'::json
WHERE username = 'solarcrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "819 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10719", "country_code": "USA"}]'::json
WHERE username = 'agentbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "820 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10720", "country_code": "USA"}]'::json
WHERE username = 'ancientripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "821 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10721", "country_code": "USA"}]'::json
WHERE username = 'arcanemirage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "822 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10722", "country_code": "USA"}]'::json
WHERE username = 'lightningtempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "823 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10723", "country_code": "USA"}]'::json
WHERE username = 'valkyriecobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "824 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10724", "country_code": "USA"}]'::json
WHERE username = 'blizzardcurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "825 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10725", "country_code": "USA"}]'::json
WHERE username = 'onyxruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "826 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10726", "country_code": "USA"}]'::json
WHERE username = 'ancientdefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "827 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10727", "country_code": "USA"}]'::json
WHERE username = 'gargoylebeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "828 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10728", "country_code": "USA"}]'::json
WHERE username = 'doctorslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "829 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10729", "country_code": "USA"}]'::json
WHERE username = 'captainskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "830 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10730", "country_code": "USA"}]'::json
WHERE username = 'deltahavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "831 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10731", "country_code": "USA"}]'::json
WHERE username = 'feralstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "832 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10732", "country_code": "USA"}]'::json
WHERE username = 'marshalfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "833 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10733", "country_code": "USA"}]'::json
WHERE username = 'goblinstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "834 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10734", "country_code": "USA"}]'::json
WHERE username = 'cosmichydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "835 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10735", "country_code": "USA"}]'::json
WHERE username = 'eldritchcobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "836 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10736", "country_code": "USA"}]'::json
WHERE username = 'goldeneagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "837 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10737", "country_code": "USA"}]'::json
WHERE username = 'sergeantclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "838 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10738", "country_code": "USA"}]'::json
WHERE username = 'samuraibolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "839 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10739", "country_code": "USA"}]'::json
WHERE username = 'silverrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "840 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10740", "country_code": "USA"}]'::json
WHERE username = 'majorwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "841 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10741", "country_code": "USA"}]'::json
WHERE username = 'blizzardwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "842 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10742", "country_code": "USA"}]'::json
WHERE username = 'azurespark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "843 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10743", "country_code": "USA"}]'::json
WHERE username = 'emberwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "844 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10744", "country_code": "USA"}]'::json
WHERE username = 'goliathpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "845 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10745", "country_code": "USA"}]'::json
WHERE username = 'agentdragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "846 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10746", "country_code": "USA"}]'::json
WHERE username = 'chaosbreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "847 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10747", "country_code": "USA"}]'::json
WHERE username = 'generalchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "848 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10748", "country_code": "USA"}]'::json
WHERE username = 'turbostrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "849 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10749", "country_code": "USA"}]'::json
WHERE username = 'marshalblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "850 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10750", "country_code": "USA"}]'::json
WHERE username = 'rogueruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "851 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10751", "country_code": "USA"}]'::json
WHERE username = 'marshalwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "852 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10752", "country_code": "USA"}]'::json
WHERE username = 'omegaskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "853 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10753", "country_code": "USA"}]'::json
WHERE username = 'roguepanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "854 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10754", "country_code": "USA"}]'::json
WHERE username = 'thundercrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "855 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10755", "country_code": "USA"}]'::json
WHERE username = 'reaperhawk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "856 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10756", "country_code": "USA"}]'::json
WHERE username = 'generalphoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "857 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10757", "country_code": "USA"}]'::json
WHERE username = 'onyxquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "858 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10758", "country_code": "USA"}]'::json
WHERE username = 'violetwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "859 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10759", "country_code": "USA"}]'::json
WHERE username = 'ultrarush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "860 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10760", "country_code": "USA"}]'::json
WHERE username = 'doctorkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "861 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10761", "country_code": "USA"}]'::json
WHERE username = 'renegadeknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "862 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10762", "country_code": "USA"}]'::json
WHERE username = 'outlawhawk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "863 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10763", "country_code": "USA"}]'::json
WHERE username = 'goliathshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "864 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10764", "country_code": "USA"}]'::json
WHERE username = 'quantumoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "865 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10765", "country_code": "USA"}]'::json
WHERE username = 'hyperstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "866 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10766", "country_code": "USA"}]'::json
WHERE username = 'dukestrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "867 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10767", "country_code": "USA"}]'::json
WHERE username = 'doctorbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "868 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10768", "country_code": "USA"}]'::json
WHERE username = 'tidalpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "869 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10769", "country_code": "USA"}]'::json
WHERE username = 'scarleteagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "870 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10770", "country_code": "USA"}]'::json
WHERE username = 'generalghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "871 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10771", "country_code": "USA"}]'::json
WHERE username = 'outlawbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "872 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10772", "country_code": "USA"}]'::json
WHERE username = 'kingpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "873 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10773", "country_code": "USA"}]'::json
WHERE username = 'cannoneagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "874 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10774", "country_code": "USA"}]'::json
WHERE username = 'frostkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "875 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10775", "country_code": "USA"}]'::json
WHERE username = 'bansheegolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "876 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10776", "country_code": "USA"}]'::json
WHERE username = 'silverguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "877 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10777", "country_code": "USA"}]'::json
WHERE username = 'roninhand';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "878 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10778", "country_code": "USA"}]'::json
WHERE username = 'cyberrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "879 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10779", "country_code": "USA"}]'::json
WHERE username = 'kingblast';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "880 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10780", "country_code": "USA"}]'::json
WHERE username = 'wraithhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "881 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10781", "country_code": "USA"}]'::json
WHERE username = 'solarsigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "882 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10782", "country_code": "USA"}]'::json
WHERE username = 'crimsonstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "883 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10783", "country_code": "USA"}]'::json
WHERE username = 'wraithguardian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "884 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10784", "country_code": "USA"}]'::json
WHERE username = 'doctorcrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "885 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10785", "country_code": "USA"}]'::json
WHERE username = 'emeraldseer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "886 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10786", "country_code": "USA"}]'::json
WHERE username = 'shadowarrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "887 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10787", "country_code": "USA"}]'::json
WHERE username = 'neonhavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "888 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10788", "country_code": "USA"}]'::json
WHERE username = 'mystichammer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "889 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10789", "country_code": "USA"}]'::json
WHERE username = 'nightphoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "890 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10790", "country_code": "USA"}]'::json
WHERE username = 'primalecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "891 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10791", "country_code": "USA"}]'::json
WHERE username = 'outlawslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "892 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10792", "country_code": "USA"}]'::json
WHERE username = 'violetviper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "893 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10793", "country_code": "USA"}]'::json
WHERE username = 'emberdoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "894 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10794", "country_code": "USA"}]'::json
WHERE username = 'scarletwing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "895 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10795", "country_code": "USA"}]'::json
WHERE username = 'sergeantleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "896 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10796", "country_code": "USA"}]'::json
WHERE username = 'renegaderender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "897 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10797", "country_code": "USA"}]'::json
WHERE username = 'bulletstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "898 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10798", "country_code": "USA"}]'::json
WHERE username = 'ultrapulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "899 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10799", "country_code": "USA"}]'::json
WHERE username = 'goblinstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "900 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10800", "country_code": "USA"}]'::json
WHERE username = 'reaperfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "901 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10801", "country_code": "USA"}]'::json
WHERE username = 'turbostorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "902 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10802", "country_code": "USA"}]'::json
WHERE username = 'stormsoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "903 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10803", "country_code": "USA"}]'::json
WHERE username = 'frostwolf';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "904 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10804", "country_code": "USA"}]'::json
WHERE username = 'deltaknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "905 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10805", "country_code": "USA"}]'::json
WHERE username = 'mysticavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "906 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10806", "country_code": "USA"}]'::json
WHERE username = 'blizzardsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "907 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10807", "country_code": "USA"}]'::json
WHERE username = 'outlawhavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "908 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10808", "country_code": "USA"}]'::json
WHERE username = 'lunartempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "909 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10809", "country_code": "USA"}]'::json
WHERE username = 'phantomcurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "910 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10810", "country_code": "USA"}]'::json
WHERE username = 'sergeantsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "911 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10811", "country_code": "USA"}]'::json
WHERE username = 'majorfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "912 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10812", "country_code": "USA"}]'::json
WHERE username = 'agentfreeze';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "913 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10813", "country_code": "USA"}]'::json
WHERE username = 'ironrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "914 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10814", "country_code": "USA"}]'::json
WHERE username = 'ionichavoc';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "915 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10815", "country_code": "USA"}]'::json
WHERE username = 'gargoylespark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "916 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10816", "country_code": "USA"}]'::json
WHERE username = 'titanburn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "917 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10817", "country_code": "USA"}]'::json
WHERE username = 'stormcurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "918 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10818", "country_code": "USA"}]'::json
WHERE username = 'emeraldmask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "919 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10819", "country_code": "USA"}]'::json
WHERE username = 'ladyquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "920 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10820", "country_code": "USA"}]'::json
WHERE username = 'cannonrune';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "921 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10821", "country_code": "USA"}]'::json
WHERE username = 'marshalchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "922 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10822", "country_code": "USA"}]'::json
WHERE username = 'crimsonghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "923 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10823", "country_code": "USA"}]'::json
WHERE username = 'marshalknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "924 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10824", "country_code": "USA"}]'::json
WHERE username = 'razorphoenix';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "925 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10825", "country_code": "USA"}]'::json
WHERE username = 'shadowleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "926 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10826", "country_code": "USA"}]'::json
WHERE username = 'steelslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "927 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10827", "country_code": "USA"}]'::json
WHERE username = 'solarspirit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "928 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10828", "country_code": "USA"}]'::json
WHERE username = 'colossusleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "929 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10829", "country_code": "USA"}]'::json
WHERE username = 'scarletruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "930 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10830", "country_code": "USA"}]'::json
WHERE username = 'chaoseagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "931 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10831", "country_code": "USA"}]'::json
WHERE username = 'generalpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "932 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10832", "country_code": "USA"}]'::json
WHERE username = 'stellarbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "933 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10833", "country_code": "USA"}]'::json
WHERE username = 'neonraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "934 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10834", "country_code": "USA"}]'::json
WHERE username = 'generalmask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "935 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10835", "country_code": "USA"}]'::json
WHERE username = 'hunterwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "936 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10836", "country_code": "USA"}]'::json
WHERE username = 'stalkerfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "937 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10837", "country_code": "USA"}]'::json
WHERE username = 'violetbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "938 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10838", "country_code": "USA"}]'::json
WHERE username = 'goldenwhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "939 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10839", "country_code": "USA"}]'::json
WHERE username = 'sentinelbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "940 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10840", "country_code": "USA"}]'::json
WHERE username = 'baronstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "941 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10841", "country_code": "USA"}]'::json
WHERE username = 'blizzardbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "942 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10842", "country_code": "USA"}]'::json
WHERE username = 'goblinrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "943 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10843", "country_code": "USA"}]'::json
WHERE username = 'bulletraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "944 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10844", "country_code": "USA"}]'::json
WHERE username = 'deltacobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "945 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10845", "country_code": "USA"}]'::json
WHERE username = 'baronhammer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "946 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10846", "country_code": "USA"}]'::json
WHERE username = 'cannoncrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "947 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10847", "country_code": "USA"}]'::json
WHERE username = 'baroncurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "948 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10848", "country_code": "USA"}]'::json
WHERE username = 'spectralruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "949 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10849", "country_code": "USA"}]'::json
WHERE username = 'quantumripper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "950 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10850", "country_code": "USA"}]'::json
WHERE username = 'primaleagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "951 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10851", "country_code": "USA"}]'::json
WHERE username = 'wardenbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "952 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10852", "country_code": "USA"}]'::json
WHERE username = 'reaperpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "953 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10853", "country_code": "USA"}]'::json
WHERE username = 'roguedoom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "954 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10854", "country_code": "USA"}]'::json
WHERE username = 'nighteye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "955 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10855", "country_code": "USA"}]'::json
WHERE username = 'reapercurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "956 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10856", "country_code": "USA"}]'::json
WHERE username = 'sergeantavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "957 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10857", "country_code": "USA"}]'::json
WHERE username = 'ninjaknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "958 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10858", "country_code": "USA"}]'::json
WHERE username = 'feralblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "959 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10859", "country_code": "USA"}]'::json
WHERE username = 'rangercobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "960 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10860", "country_code": "USA"}]'::json
WHERE username = 'violetspell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "961 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10861", "country_code": "USA"}]'::json
WHERE username = 'baronchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "962 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10862", "country_code": "USA"}]'::json
WHERE username = 'violetseer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "963 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10863", "country_code": "USA"}]'::json
WHERE username = 'bulletspell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "964 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10864", "country_code": "USA"}]'::json
WHERE username = 'lunarclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "965 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10865", "country_code": "USA"}]'::json
WHERE username = 'venombone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "966 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10866", "country_code": "USA"}]'::json
WHERE username = 'ultraquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "967 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10867", "country_code": "USA"}]'::json
WHERE username = 'feralcrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "968 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10868", "country_code": "USA"}]'::json
WHERE username = 'hyperfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "969 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10869", "country_code": "USA"}]'::json
WHERE username = 'lunareagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "970 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10870", "country_code": "USA"}]'::json
WHERE username = 'ironsigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "971 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10871", "country_code": "USA"}]'::json
WHERE username = 'silverruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "972 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10872", "country_code": "USA"}]'::json
WHERE username = 'ladymask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "973 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10873", "country_code": "USA"}]'::json
WHERE username = 'thunderkeeper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "974 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10874", "country_code": "USA"}]'::json
WHERE username = 'dukeecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "975 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10875", "country_code": "USA"}]'::json
WHERE username = 'ironblast';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "976 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10876", "country_code": "USA"}]'::json
WHERE username = 'cyberruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "977 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10877", "country_code": "USA"}]'::json
WHERE username = 'bansheeghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "978 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10878", "country_code": "USA"}]'::json
WHERE username = 'ancientbrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "979 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10879", "country_code": "USA"}]'::json
WHERE username = 'goldenbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "980 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10880", "country_code": "USA"}]'::json
WHERE username = 'reaperclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "981 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10881", "country_code": "USA"}]'::json
WHERE username = 'cannonquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "982 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10882", "country_code": "USA"}]'::json
WHERE username = 'goblinkraken';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "983 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10883", "country_code": "USA"}]'::json
WHERE username = 'alphawrath';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "984 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10884", "country_code": "USA"}]'::json
WHERE username = 'baronspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "985 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10885", "country_code": "USA"}]'::json
WHERE username = 'solartempest';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "986 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10886", "country_code": "USA"}]'::json
WHERE username = 'wardenspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "987 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10887", "country_code": "USA"}]'::json
WHERE username = 'renegadecobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "988 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10888", "country_code": "USA"}]'::json
WHERE username = 'toxicwolf';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "989 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10889", "country_code": "USA"}]'::json
WHERE username = 'commanderhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "990 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10890", "country_code": "USA"}]'::json
WHERE username = 'eldritchdragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "991 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10891", "country_code": "USA"}]'::json
WHERE username = 'frostruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "992 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10892", "country_code": "USA"}]'::json
WHERE username = 'ladychampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "993 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10893", "country_code": "USA"}]'::json
WHERE username = 'paladingriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "994 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10894", "country_code": "USA"}]'::json
WHERE username = 'dukegriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "995 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10895", "country_code": "USA"}]'::json
WHERE username = 'sergeantoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "996 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10896", "country_code": "USA"}]'::json
WHERE username = 'venomfreeze';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "997 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10897", "country_code": "USA"}]'::json
WHERE username = 'thunderquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "998 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10898", "country_code": "USA"}]'::json
WHERE username = 'atomicprophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "999 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10899", "country_code": "USA"}]'::json
WHERE username = 'alphabrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1000 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10900", "country_code": "USA"}]'::json
WHERE username = 'thundershock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1001 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10901", "country_code": "USA"}]'::json
WHERE username = 'titanbolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1002 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10902", "country_code": "USA"}]'::json
WHERE username = 'ultrahowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1003 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10903", "country_code": "USA"}]'::json
WHERE username = 'ultradefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1004 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10904", "country_code": "USA"}]'::json
WHERE username = 'solarshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1005 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10905", "country_code": "USA"}]'::json
WHERE username = 'titangriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1006 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10906", "country_code": "USA"}]'::json
WHERE username = 'onyxsoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1007 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10907", "country_code": "USA"}]'::json
WHERE username = 'doomstorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1008 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10908", "country_code": "USA"}]'::json
WHERE username = 'valkyriebane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1009 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10909", "country_code": "USA"}]'::json
WHERE username = 'infernoknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1010 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10910", "country_code": "USA"}]'::json
WHERE username = 'shadowgolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1011 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10911", "country_code": "USA"}]'::json
WHERE username = 'roguecobra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1012 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10912", "country_code": "USA"}]'::json
WHERE username = 'stellarviper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1013 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10913", "country_code": "USA"}]'::json
WHERE username = 'titanquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1014 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10914", "country_code": "USA"}]'::json
WHERE username = 'violetshock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1015 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10915", "country_code": "USA"}]'::json
WHERE username = 'feralgriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1016 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10916", "country_code": "USA"}]'::json
WHERE username = 'cannonfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1017 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10917", "country_code": "USA"}]'::json
WHERE username = 'graveshield';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1018 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10918", "country_code": "USA"}]'::json
WHERE username = 'samuraimask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1019 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10919", "country_code": "USA"}]'::json
WHERE username = 'steelburn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1020 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10920", "country_code": "USA"}]'::json
WHERE username = 'majorbeam';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1021 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10921", "country_code": "USA"}]'::json
WHERE username = 'rangerheart';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1022 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10922", "country_code": "USA"}]'::json
WHERE username = 'ultrabolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1023 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10923", "country_code": "USA"}]'::json
WHERE username = 'steelrage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1024 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10924", "country_code": "USA"}]'::json
WHERE username = 'onyxcurse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1025 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10925", "country_code": "USA"}]'::json
WHERE username = 'bulletleviathan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1026 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10926", "country_code": "USA"}]'::json
WHERE username = 'reaperrush';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1027 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10927", "country_code": "USA"}]'::json
WHERE username = 'savagesigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1028 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10928", "country_code": "USA"}]'::json
WHERE username = 'violetecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1029 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10929", "country_code": "USA"}]'::json
WHERE username = 'doommind';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1030 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10930", "country_code": "USA"}]'::json
WHERE username = 'roguewhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1031 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10931", "country_code": "USA"}]'::json
WHERE username = 'rangerhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1032 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10932", "country_code": "USA"}]'::json
WHERE username = 'paladinstomper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1033 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10933", "country_code": "USA"}]'::json
WHERE username = 'doctorhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1034 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10934", "country_code": "USA"}]'::json
WHERE username = 'marshaleagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1035 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10935", "country_code": "USA"}]'::json
WHERE username = 'crimsoncrusher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1036 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10936", "country_code": "USA"}]'::json
WHERE username = 'agentpulse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1037 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10937", "country_code": "USA"}]'::json
WHERE username = 'gargoylewhisper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1038 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10938", "country_code": "USA"}]'::json
WHERE username = 'atomicgriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1039 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10939", "country_code": "USA"}]'::json
WHERE username = 'stellarchampion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1040 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10940", "country_code": "USA"}]'::json
WHERE username = 'marshalflare';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1041 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10941", "country_code": "USA"}]'::json
WHERE username = 'cosmicskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1042 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10942", "country_code": "USA"}]'::json
WHERE username = 'frostsoul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1043 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10943", "country_code": "USA"}]'::json
WHERE username = 'reaperburn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1044 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10944", "country_code": "USA"}]'::json
WHERE username = 'solarbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1045 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10945", "country_code": "USA"}]'::json
WHERE username = 'wardenfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1046 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10946", "country_code": "USA"}]'::json
WHERE username = 'wardenwrath';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1047 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10947", "country_code": "USA"}]'::json
WHERE username = 'silverfreeze';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1048 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10948", "country_code": "USA"}]'::json
WHERE username = 'stellaroracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1049 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10949", "country_code": "USA"}]'::json
WHERE username = 'hypereagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1050 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10950", "country_code": "USA"}]'::json
WHERE username = 'feralspirit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1051 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10951", "country_code": "USA"}]'::json
WHERE username = 'stalkermask';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1052 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10952", "country_code": "USA"}]'::json
WHERE username = 'primalshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1053 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10953", "country_code": "USA"}]'::json
WHERE username = 'rangersurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1054 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10954", "country_code": "USA"}]'::json
WHERE username = 'kingdefender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1055 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10955", "country_code": "USA"}]'::json
WHERE username = 'roninoracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1056 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10956", "country_code": "USA"}]'::json
WHERE username = 'solareagle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1057 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10957", "country_code": "USA"}]'::json
WHERE username = 'stalkersurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1058 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10958", "country_code": "USA"}]'::json
WHERE username = 'ladysmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1059 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10959", "country_code": "USA"}]'::json
WHERE username = 'queengriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1060 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10960", "country_code": "USA"}]'::json
WHERE username = 'bulletstrike';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1061 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10961", "country_code": "USA"}]'::json
WHERE username = 'agentrender';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1062 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10962", "country_code": "USA"}]'::json
WHERE username = 'colossusskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1063 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10963", "country_code": "USA"}]'::json
WHERE username = 'atomicsmasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1064 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10964", "country_code": "USA"}]'::json
WHERE username = 'goblinshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1065 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10965", "country_code": "USA"}]'::json
WHERE username = 'outlawcyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1066 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10966", "country_code": "USA"}]'::json
WHERE username = 'outlawsurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1067 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10967", "country_code": "USA"}]'::json
WHERE username = 'goblinsigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1068 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10968", "country_code": "USA"}]'::json
WHERE username = 'ironhowl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1069 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10969", "country_code": "USA"}]'::json
WHERE username = 'eldritchspark';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1070 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10970", "country_code": "USA"}]'::json
WHERE username = 'azurequake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1071 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10971", "country_code": "USA"}]'::json
WHERE username = 'lightningquake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1072 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10972", "country_code": "USA"}]'::json
WHERE username = 'cyberwave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1073 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10973", "country_code": "USA"}]'::json
WHERE username = 'spectralblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1074 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10974", "country_code": "USA"}]'::json
WHERE username = 'toxicavenger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1075 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10975", "country_code": "USA"}]'::json
WHERE username = 'cannoncyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1076 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10976", "country_code": "USA"}]'::json
WHERE username = 'commandersurge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1077 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10977", "country_code": "USA"}]'::json
WHERE username = 'goldenecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1078 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10978", "country_code": "USA"}]'::json
WHERE username = 'rangerspell';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1079 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10979", "country_code": "USA"}]'::json
WHERE username = 'generalslayer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1080 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10980", "country_code": "USA"}]'::json
WHERE username = 'renegadebreaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1081 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10981", "country_code": "USA"}]'::json
WHERE username = 'novabrain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1082 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10982", "country_code": "USA"}]'::json
WHERE username = 'arcanesigil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1083 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10983", "country_code": "USA"}]'::json
WHERE username = 'sergeantgriffin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1084 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10984", "country_code": "USA"}]'::json
WHERE username = 'mysticecho';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1085 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10985", "country_code": "USA"}]'::json
WHERE username = 'azurefang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1086 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10986", "country_code": "USA"}]'::json
WHERE username = 'chaosskull';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1087 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10987", "country_code": "USA"}]'::json
WHERE username = 'bansheeraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1088 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10988", "country_code": "USA"}]'::json
WHERE username = 'ancientbane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1089 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10989", "country_code": "USA"}]'::json
WHERE username = 'novastorm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1090 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10990", "country_code": "USA"}]'::json
WHERE username = 'sentinelwave';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1091 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10991", "country_code": "USA"}]'::json
WHERE username = 'goliathfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1092 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10992", "country_code": "USA"}]'::json
WHERE username = 'hunterfang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1093 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10993", "country_code": "USA"}]'::json
WHERE username = 'steelwarden';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1094 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10994", "country_code": "USA"}]'::json
WHERE username = 'cosmicgolem';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1095 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10995", "country_code": "USA"}]'::json
WHERE username = 'stellarcyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1096 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10996", "country_code": "USA"}]'::json
WHERE username = 'wardenshade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1097 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10997", "country_code": "USA"}]'::json
WHERE username = 'baronhydra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1098 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10998", "country_code": "USA"}]'::json
WHERE username = 'cosmicruin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1099 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10999", "country_code": "USA"}]'::json
WHERE username = 'agentavenger';

SELECT username, addresses_json->0->>'city' AS city, addresses_json->0->>'state_or_province' AS state
FROM public."user"
WHERE email LIKE '%@superhero.com'
ORDER BY username
LIMIT 10;
