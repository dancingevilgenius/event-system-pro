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
SET addresses_json = '[{"label": "home", "line1": "342 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10242", "country_code": "USA"}]'::json
WHERE username = 'invincible';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "343 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10243", "country_code": "USA"}]'::json
WHERE username = 'atomeve';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "344 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10244", "country_code": "USA"}]'::json
WHERE username = 'omniman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "345 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10245", "country_code": "USA"}]'::json
WHERE username = 'robot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "346 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10246", "country_code": "USA"}]'::json
WHERE username = 'rexsplode';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "347 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10247", "country_code": "USA"}]'::json
WHERE username = 'duplikate';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "348 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10248", "country_code": "USA"}]'::json
WHERE username = 'monstergirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "349 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10249", "country_code": "USA"}]'::json
WHERE username = 'immortal';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "350 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10250", "country_code": "USA"}]'::json
WHERE username = 'bulletproof';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "351 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10251", "country_code": "USA"}]'::json
WHERE username = 'blacksamson';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "352 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10252", "country_code": "USA"}]'::json
WHERE username = 'warwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "353 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10253", "country_code": "USA"}]'::json
WHERE username = 'shrinkray';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "354 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10254", "country_code": "USA"}]'::json
WHERE username = 'greenghost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "355 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10255", "country_code": "USA"}]'::json
WHERE username = 'darkwing';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "356 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10256", "country_code": "USA"}]'::json
WHERE username = 'besttiger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "357 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10257", "country_code": "USA"}]'::json
WHERE username = 'brit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "358 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10258", "country_code": "USA"}]'::json
WHERE username = 'techjacket';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "359 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10259", "country_code": "USA"}]'::json
WHERE username = 'spawn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "360 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10260", "country_code": "USA"}]'::json
WHERE username = 'witchblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "361 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10261", "country_code": "USA"}]'::json
WHERE username = 'darkness';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "362 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10262", "country_code": "USA"}]'::json
WHERE username = 'savagedragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "363 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10263", "country_code": "USA"}]'::json
WHERE username = 'shadowhawk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "364 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10264", "country_code": "USA"}]'::json
WHERE username = 'youngbloodshaft';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "365 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10265", "country_code": "USA"}]'::json
WHERE username = 'youngbloodchapel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "366 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10266", "country_code": "USA"}]'::json
WHERE username = 'youngbloodbadrock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "367 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10267", "country_code": "USA"}]'::json
WHERE username = 'youngbloodvogue';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "368 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10268", "country_code": "USA"}]'::json
WHERE username = 'youngblooddiehard';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "369 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10269", "country_code": "USA"}]'::json
WHERE username = 'youngbloodcombat';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "370 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10270", "country_code": "USA"}]'::json
WHERE username = 'youngbloodriptide';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "371 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10271", "country_code": "USA"}]'::json
WHERE username = 'supreme';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "372 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10272", "country_code": "USA"}]'::json
WHERE username = 'glory';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "373 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10273", "country_code": "USA"}]'::json
WHERE username = 'bloodstrikefourplay';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "374 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10274", "country_code": "USA"}]'::json
WHERE username = 'bloodstrikecabot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "375 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10275", "country_code": "USA"}]'::json
WHERE username = 'prophet';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "376 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10276", "country_code": "USA"}]'::json
WHERE username = 'brigadebattlestone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "377 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10277", "country_code": "USA"}]'::json
WHERE username = 'brigadeseahawk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "378 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10278", "country_code": "USA"}]'::json
WHERE username = 'firebreather';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "379 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10279", "country_code": "USA"}]'::json
WHERE username = 'noblecausesdocnoble';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "380 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10280", "country_code": "USA"}]'::json
WHERE username = 'noblecausesrace';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "381 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10281", "country_code": "USA"}]'::json
WHERE username = 'noblecauseszephyr';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "382 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10282", "country_code": "USA"}]'::json
WHERE username = 'noblecausesfrost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "383 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10283", "country_code": "USA"}]'::json
WHERE username = 'noblecausesgaia';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "384 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10284", "country_code": "USA"}]'::json
WHERE username = 'noblecausesrusty';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "385 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10285", "country_code": "USA"}]'::json
WHERE username = 'radiantblack';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "386 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10286", "country_code": "USA"}]'::json
WHERE username = 'radiantred';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "387 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10287", "country_code": "USA"}]'::json
WHERE username = 'radiantpink';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "388 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10288", "country_code": "USA"}]'::json
WHERE username = 'radiantyellow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "389 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10289", "country_code": "USA"}]'::json
WHERE username = 'roguesun';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "390 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10290", "country_code": "USA"}]'::json
WHERE username = 'infernogirlred';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "391 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10291", "country_code": "USA"}]'::json
WHERE username = 'deadlucky';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "392 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10292", "country_code": "USA"}]'::json
WHERE username = 'supermassive';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "393 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10293", "country_code": "USA"}]'::json
WHERE username = 'geiger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "394 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10294", "country_code": "USA"}]'::json
WHERE username = 'junkyardjoe';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "395 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10295", "country_code": "USA"}]'::json
WHERE username = 'redcoat';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "396 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10296", "country_code": "USA"}]'::json
WHERE username = 'voidrivalk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "397 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10297", "country_code": "USA"}]'::json
WHERE username = 'wolfman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "398 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10298", "country_code": "USA"}]'::json
WHERE username = 'guardinglobe';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "399 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10299", "country_code": "USA"}]'::json
WHERE username = 'velocity';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "400 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10300", "country_code": "USA"}]'::json
WHERE username = 'cyblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "401 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10301", "country_code": "USA"}]'::json
WHERE username = 'ripclaw';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "402 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10302", "country_code": "USA"}]'::json
WHERE username = 'grifter';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "403 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10303", "country_code": "USA"}]'::json
WHERE username = 'zealot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "404 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10304", "country_code": "USA"}]'::json
WHERE username = 'voodoo';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "405 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10305", "country_code": "USA"}]'::json
WHERE username = 'maul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "406 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10306", "country_code": "USA"}]'::json
WHERE username = 'spartan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "407 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10307", "country_code": "USA"}]'::json
WHERE username = 'warblade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "408 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10308", "country_code": "USA"}]'::json
WHERE username = 'fairchild';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "409 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10309", "country_code": "USA"}]'::json
WHERE username = 'burnout';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "410 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10310", "country_code": "USA"}]'::json
WHERE username = 'rainmaker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "411 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10311", "country_code": "USA"}]'::json
WHERE username = 'freefall';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "412 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10312", "country_code": "USA"}]'::json
WHERE username = 'boon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "413 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10313", "country_code": "USA"}]'::json
WHERE username = 'newmen';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "414 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10314", "country_code": "USA"}]'::json
WHERE username = 'kickass';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "415 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10315", "country_code": "USA"}]'::json
WHERE username = 'hitgirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "416 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10316", "country_code": "USA"}]'::json
WHERE username = 'nemesis';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "417 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10317", "country_code": "USA"}]'::json
WHERE username = 'kingsman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "418 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10318", "country_code": "USA"}]'::json
WHERE username = 'chrononaut';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "419 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10319", "country_code": "USA"}]'::json
WHERE username = 'reborn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "420 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10320", "country_code": "USA"}]'::json
WHERE username = 'skyboundrogue';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "421 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10321", "country_code": "USA"}]'::json
WHERE username = 'talialghul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "422 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10322", "country_code": "USA"}]'::json
WHERE username = 'nyssalghul';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "423 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10323", "country_code": "USA"}]'::json
WHERE username = 'cheetah';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "424 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10324", "country_code": "USA"}]'::json
WHERE username = 'silverbanshee';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "425 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10325", "country_code": "USA"}]'::json
WHERE username = 'livewire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "426 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10326", "country_code": "USA"}]'::json
WHERE username = 'giganta';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "427 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10327", "country_code": "USA"}]'::json
WHERE username = 'maxima';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "428 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10328", "country_code": "USA"}]'::json
WHERE username = 'thunder';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "429 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10329", "country_code": "USA"}]'::json
WHERE username = 'lightning';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "430 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10330", "country_code": "USA"}]'::json
WHERE username = 'mera';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "431 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10331", "country_code": "USA"}]'::json
WHERE username = 'ravager';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "432 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10332", "country_code": "USA"}]'::json
WHERE username = 'cheshire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "433 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10333", "country_code": "USA"}]'::json
WHERE username = 'tarantula';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "434 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10334", "country_code": "USA"}]'::json
WHERE username = 'circe';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "435 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10335", "country_code": "USA"}]'::json
WHERE username = 'blackalice';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "436 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10336", "country_code": "USA"}]'::json
WHERE username = 'amethyst';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "437 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10337", "country_code": "USA"}]'::json
WHERE username = 'nubia';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "438 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10338", "country_code": "USA"}]'::json
WHERE username = 'katana';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "439 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10339", "country_code": "USA"}]'::json
WHERE username = 'ladyshiva';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "440 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10340", "country_code": "USA"}]'::json
WHERE username = 'jade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "441 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10341", "country_code": "USA"}]'::json
WHERE username = 'hawkwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "442 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10342", "country_code": "USA"}]'::json
WHERE username = 'goldenglider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "443 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10343", "country_code": "USA"}]'::json
WHERE username = 'empress';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "444 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10344", "country_code": "USA"}]'::json
WHERE username = 'gypsy';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "445 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10345", "country_code": "USA"}]'::json
WHERE username = 'dawnstar';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "446 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10346", "country_code": "USA"}]'::json
WHERE username = 'tinya';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "447 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10347", "country_code": "USA"}]'::json
WHERE username = 'luornu';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "448 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10348", "country_code": "USA"}]'::json
WHERE username = 'blackfire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "449 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10349", "country_code": "USA"}]'::json
WHERE username = 'missmartian';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "450 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10350", "country_code": "USA"}]'::json
WHERE username = 'wondergirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "451 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10351", "country_code": "USA"}]'::json
WHERE username = 'jinx';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "452 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10352", "country_code": "USA"}]'::json
WHERE username = 'arella';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "453 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10353", "country_code": "USA"}]'::json
WHERE username = 'mazikeen';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "454 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10354", "country_code": "USA"}]'::json
WHERE username = 'knockout';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "455 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10355", "country_code": "USA"}]'::json
WHERE username = 'fury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "456 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10356", "country_code": "USA"}]'::json
WHERE username = 'cyclone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "457 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10357", "country_code": "USA"}]'::json
WHERE username = 'phantomlady';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "458 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10358", "country_code": "USA"}]'::json
WHERE username = 'terra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "459 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10359", "country_code": "USA"}]'::json
WHERE username = 'artemis';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "460 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10360", "country_code": "USA"}]'::json
WHERE username = 'spitfire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "461 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10361", "country_code": "USA"}]'::json
WHERE username = 'maryjane';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "462 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10362", "country_code": "USA"}]'::json
WHERE username = 'gwenpool';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "463 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10363", "country_code": "USA"}]'::json
WHERE username = 'elektra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "464 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10364", "country_code": "USA"}]'::json
WHERE username = 'medusa';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "465 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10365", "country_code": "USA"}]'::json
WHERE username = 'crystal';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "466 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10366", "country_code": "USA"}]'::json
WHERE username = 'sif';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "467 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10367", "country_code": "USA"}]'::json
WHERE username = 'amora';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "468 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10368", "country_code": "USA"}]'::json
WHERE username = 'lorelei';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "469 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10369", "country_code": "USA"}]'::json
WHERE username = 'namora';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "470 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10370", "country_code": "USA"}]'::json
WHERE username = 'namorita';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "471 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10371", "country_code": "USA"}]'::json
WHERE username = 'singularity';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "472 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10372", "country_code": "USA"}]'::json
WHERE username = 'gertyorkes';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "473 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10373", "country_code": "USA"}]'::json
WHERE username = 'pixie';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "474 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10374", "country_code": "USA"}]'::json
WHERE username = 'armor';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "475 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10375", "country_code": "USA"}]'::json
WHERE username = 'blink';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "476 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10376", "country_code": "USA"}]'::json
WHERE username = 'polaris';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "477 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10377", "country_code": "USA"}]'::json
WHERE username = 'boomboom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "478 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10378", "country_code": "USA"}]'::json
WHERE username = 'siryn';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "479 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10379", "country_code": "USA"}]'::json
WHERE username = 'moira';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "480 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10380", "country_code": "USA"}]'::json
WHERE username = 'marrow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "481 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10381", "country_code": "USA"}]'::json
WHERE username = 'husk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "482 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10382", "country_code": "USA"}]'::json
WHERE username = 'surge';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "483 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10383", "country_code": "USA"}]'::json
WHERE username = 'winddancer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "484 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10384", "country_code": "USA"}]'::json
WHERE username = 'honeybadger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "485 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10385", "country_code": "USA"}]'::json
WHERE username = 'mania';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "486 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10386", "country_code": "USA"}]'::json
WHERE username = 'silversable';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "487 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10387", "country_code": "USA"}]'::json
WHERE username = 'blackcat';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "488 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10388", "country_code": "USA"}]'::json
WHERE username = 'typhoidmary';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "489 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10389", "country_code": "USA"}]'::json
WHERE username = 'sersi';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "490 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10390", "country_code": "USA"}]'::json
WHERE username = 'thena';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "491 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10391", "country_code": "USA"}]'::json
WHERE username = 'sprite';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "492 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10392", "country_code": "USA"}]'::json
WHERE username = 'diamondback';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "493 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10393", "country_code": "USA"}]'::json
WHERE username = 'songbird';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "494 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10394", "country_code": "USA"}]'::json
WHERE username = 'moonstone';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "495 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10395", "country_code": "USA"}]'::json
WHERE username = 'copycat';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "496 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10396", "country_code": "USA"}]'::json
WHERE username = 'feral';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "497 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10397", "country_code": "USA"}]'::json
WHERE username = 'callisto';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "498 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10398", "country_code": "USA"}]'::json
WHERE username = 'lifeguard';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "499 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10399", "country_code": "USA"}]'::json
WHERE username = 'sage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "500 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10400", "country_code": "USA"}]'::json
WHERE username = 'yukio';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "501 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10401", "country_code": "USA"}]'::json
WHERE username = 'kwannon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "502 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10402", "country_code": "USA"}]'::json
WHERE username = 'karma';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "503 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10403", "country_code": "USA"}]'::json
WHERE username = 'thundra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "504 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10404", "country_code": "USA"}]'::json
WHERE username = 'lyra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "505 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10405", "country_code": "USA"}]'::json
WHERE username = 'titania';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "506 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10406", "country_code": "USA"}]'::json
WHERE username = 'firestar';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "507 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10407", "country_code": "USA"}]'::json
WHERE username = 'cloud9';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "508 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10408", "country_code": "USA"}]'::json
WHERE username = 'meggan';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "509 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10409", "country_code": "USA"}]'::json
WHERE username = 'nocturne';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "510 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10410", "country_code": "USA"}]'::json
WHERE username = 'bobbi';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "511 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10411", "country_code": "USA"}]'::json
WHERE username = 'nadiapym';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "512 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10412", "country_code": "USA"}]'::json
WHERE username = 'tigra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "513 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10413", "country_code": "USA"}]'::json
WHERE username = 'jocasta';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "514 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10414", "country_code": "USA"}]'::json
WHERE username = 'madameweb';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "515 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10415", "country_code": "USA"}]'::json
WHERE username = 'spidergirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "516 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10416", "country_code": "USA"}]'::json
WHERE username = 'viper';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "517 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10417", "country_code": "USA"}]'::json
WHERE username = 'sin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "518 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10418", "country_code": "USA"}]'::json
WHERE username = 'danimoonstar';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "519 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10419", "country_code": "USA"}]'::json
WHERE username = 'magdalene';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "520 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10420", "country_code": "USA"}]'::json
WHERE username = 'riptide';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "521 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10421", "country_code": "USA"}]'::json
WHERE username = 'stardust';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "522 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10422", "country_code": "USA"}]'::json
WHERE username = 'smasher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "523 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10423", "country_code": "USA"}]'::json
WHERE username = 'catseye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "524 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10424", "country_code": "USA"}]'::json
WHERE username = 'tarot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "525 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10425", "country_code": "USA"}]'::json
WHERE username = 'firebird';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "526 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10426", "country_code": "USA"}]'::json
WHERE username = 'turbo';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "527 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10427", "country_code": "USA"}]'::json
WHERE username = 'lightspeed';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "528 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10428", "country_code": "USA"}]'::json
WHERE username = 'freespirit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "529 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10429", "country_code": "USA"}]'::json
WHERE username = 'jolt';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "530 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10430", "country_code": "USA"}]'::json
WHERE username = 'veranke';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "531 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10431", "country_code": "USA"}]'::json
WHERE username = 'lyja';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "532 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10432", "country_code": "USA"}]'::json
WHERE username = 'andromeda';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "533 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10433", "country_code": "USA"}]'::json
WHERE username = 'marrina';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "534 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10434", "country_code": "USA"}]'::json
WHERE username = 'snowbird';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "535 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10435", "country_code": "USA"}]'::json
WHERE username = 'talisman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "536 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10436", "country_code": "USA"}]'::json
WHERE username = 'pinkpearl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "537 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10437", "country_code": "USA"}]'::json
WHERE username = 'valeria';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "538 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10438", "country_code": "USA"}]'::json
WHERE username = 'luna';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "539 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10439", "country_code": "USA"}]'::json
WHERE username = 'magda';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "540 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10440", "country_code": "USA"}]'::json
WHERE username = 'destiny';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "541 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10441", "country_code": "USA"}]'::json
WHERE username = 'roulette';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "542 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10442", "country_code": "USA"}]'::json
WHERE username = 'skids';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "543 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10443", "country_code": "USA"}]'::json
WHERE username = 'mercury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "544 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10444", "country_code": "USA"}]'::json
WHERE username = 'motherpanic';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "545 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10445", "country_code": "USA"}]'::json
WHERE username = 'dreamgirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "546 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10446", "country_code": "USA"}]'::json
WHERE username = 'lightninglass';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "547 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10447", "country_code": "USA"}]'::json
WHERE username = 'ultragirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "548 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10448", "country_code": "USA"}]'::json
WHERE username = 'jayna';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "549 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10449", "country_code": "USA"}]'::json
WHERE username = 'witchfire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "550 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10450", "country_code": "USA"}]'::json
WHERE username = 'harlequin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "551 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10451", "country_code": "USA"}]'::json
WHERE username = 'powerhouse';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "552 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10452", "country_code": "USA"}]'::json
WHERE username = 'silhouette';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "553 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10453", "country_code": "USA"}]'::json
WHERE username = 'beakgirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "554 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10454", "country_code": "USA"}]'::json
WHERE username = 'wallflower';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "555 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10455", "country_code": "USA"}]'::json
WHERE username = 'winddancer2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "556 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10456", "country_code": "USA"}]'::json
WHERE username = 'echo';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "557 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10457", "country_code": "USA"}]'::json
WHERE username = 'dagger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "558 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10458", "country_code": "USA"}]'::json
WHERE username = 'madelyne';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "559 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10459", "country_code": "USA"}]'::json
WHERE username = 'selene';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "560 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10460", "country_code": "USA"}]'::json
WHERE username = 'moondragon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "561 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10461", "country_code": "USA"}]'::json
WHERE username = 'lilandra';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "562 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10462", "country_code": "USA"}]'::json
WHERE username = 'deathbird';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "563 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10463", "country_code": "USA"}]'::json
WHERE username = 'angela';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "564 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10464", "country_code": "USA"}]'::json
WHERE username = 'hepzibah';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "565 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10465", "country_code": "USA"}]'::json
WHERE username = 'shriek';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "566 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10466", "country_code": "USA"}]'::json
WHERE username = 'laynia';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "567 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10467", "country_code": "USA"}]'::json
WHERE username = 'darkstar';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "568 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10468", "country_code": "USA"}]'::json
WHERE username = 'princesspython';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "569 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10469", "country_code": "USA"}]'::json
WHERE username = 'scream';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "570 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10470", "country_code": "USA"}]'::json
WHERE username = 'judomaster';

SELECT username, addresses_json->0->>'city' AS city, addresses_json->0->>'state_or_province' AS state
FROM public."user"
WHERE email LIKE '%@superhero.com'
ORDER BY username
LIMIT 10;
