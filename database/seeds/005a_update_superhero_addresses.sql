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
SET addresses_json = '[{"label": "home", "line1": "171 Hero Lane", "line2": null, "city": "Confederate Territory", "state_or_province": "TX", "postal_code": "10071", "country_code": "USA"}]'::json
WHERE username = 'jonahhex';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "172 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10072", "country_code": "USA"}]'::json
WHERE username = 'lucifermorningstar';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "173 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10073", "country_code": "USA"}]'::json
WHERE username = 'deadshot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "174 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10074", "country_code": "USA"}]'::json
WHERE username = 'captainboomerang';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "175 Hero Lane", "line2": null, "city": "Washington", "state_or_province": "DC", "postal_code": "10075", "country_code": "USA"}]'::json
WHERE username = 'enchantress';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "176 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10076", "country_code": "USA"}]'::json
WHERE username = 'killerfrost';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "177 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10077", "country_code": "USA"}]'::json
WHERE username = 'fire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "178 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10078", "country_code": "USA"}]'::json
WHERE username = 'ice';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "179 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10079", "country_code": "USA"}]'::json
WHERE username = 'powergirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "180 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10080", "country_code": "USA"}]'::json
WHERE username = 'huntress';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "181 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10081", "country_code": "USA"}]'::json
WHERE username = 'batwoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "182 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10082", "country_code": "USA"}]'::json
WHERE username = 'reneree';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "183 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10083", "country_code": "USA"}]'::json
WHERE username = 'oracle';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "184 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10084", "country_code": "USA"}]'::json
WHERE username = 'timdrake';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "185 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10085", "country_code": "USA"}]'::json
WHERE username = 'damianwayne';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "186 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10086", "country_code": "USA"}]'::json
WHERE username = 'stephaniebrown';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "187 Hero Lane", "line2": "Gotham City HQ", "city": "Gotham City", "state_or_province": "NJ", "postal_code": "10087", "country_code": "USA"}]'::json
WHERE username = 'cassandracain';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "188 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10088", "country_code": "USA"}]'::json
WHERE username = 'blackmanta';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "189 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10089", "country_code": "USA"}]'::json
WHERE username = 'oceanmaster';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "190 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10090", "country_code": "USA"}]'::json
WHERE username = 'sinestro';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "191 Hero Lane", "line2": null, "city": "Ysmault", "state_or_province": "NV", "postal_code": "10091", "country_code": "USA"}]'::json
WHERE username = 'atrocitus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "192 Hero Lane", "line2": null, "city": "Odym", "state_or_province": "CO", "postal_code": "10092", "country_code": "USA"}]'::json
WHERE username = 'saintwalker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "193 Hero Lane", "line2": "Coast City HQ", "city": "Coast City", "state_or_province": "CA", "postal_code": "10093", "country_code": "USA"}]'::json
WHERE username = 'starsapphire';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "194 Hero Lane", "line2": null, "city": "Las Vegas", "state_or_province": "NV", "postal_code": "10094", "country_code": "USA"}]'::json
WHERE username = 'lobohunter';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "195 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10095", "country_code": "USA"}]'::json
WHERE username = 'grannygoodness';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "196 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10096", "country_code": "USA"}]'::json
WHERE username = 'steppenwolf';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "197 Hero Lane", "line2": "Metropolis HQ", "city": "Metropolis", "state_or_province": "NY", "postal_code": "10097", "country_code": "USA"}]'::json
WHERE username = 'parademon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "10880 Malibu Point", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10098", "country_code": "USA"}]'::json
WHERE username = 'ironman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "569 Leaman Pl", "line2": null, "city": "Brooklyn", "state_or_province": "NY", "postal_code": "10099", "country_code": "USA"}]'::json
WHERE username = 'captainamerica';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "20 Ingram St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10100", "country_code": "USA"}]'::json
WHERE username = 'spiderman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "201 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10101", "country_code": "USA"}]'::json
WHERE username = 'hulk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "202 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10102", "country_code": "USA"}]'::json
WHERE username = 'thor';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "203 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10103", "country_code": "USA"}]'::json
WHERE username = 'blackwidow';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "204 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10104", "country_code": "USA"}]'::json
WHERE username = 'hawkeye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "205 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10105", "country_code": "USA"}]'::json
WHERE username = 'scarletwitch';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "206 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10106", "country_code": "USA"}]'::json
WHERE username = 'vision';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "207 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10107", "country_code": "USA"}]'::json
WHERE username = 'falcon';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "208 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10108", "country_code": "USA"}]'::json
WHERE username = 'wintersoldier';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "209 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10109", "country_code": "USA"}]'::json
WHERE username = 'antman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "210 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10110", "country_code": "USA"}]'::json
WHERE username = 'wasp';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "Royal Palace", "line2": null, "city": "Wakanda", "state_or_province": "GA", "postal_code": "10111", "country_code": "USA"}]'::json
WHERE username = 'blackpanther';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "177A Bleecker St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10112", "country_code": "USA"}]'::json
WHERE username = 'doctorstrange';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "213 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10113", "country_code": "USA"}]'::json
WHERE username = 'captainmarvel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "214 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10114", "country_code": "USA"}]'::json
WHERE username = 'msmarvel';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "215 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10115", "country_code": "USA"}]'::json
WHERE username = 'shehulk';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "250 W 57th St", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10116", "country_code": "USA"}]'::json
WHERE username = 'daredevil';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "123 Hell''s Kitchen Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10117", "country_code": "USA"}]'::json
WHERE username = 'punisher';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "218 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10118", "country_code": "USA"}]'::json
WHERE username = 'lukecage';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "219 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10119", "country_code": "USA"}]'::json
WHERE username = 'ironfist';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "220 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10120", "country_code": "USA"}]'::json
WHERE username = 'jessicajones';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "221 Hero Lane", "line2": null, "city": "Los Angeles", "state_or_province": "CA", "postal_code": "10121", "country_code": "USA"}]'::json
WHERE username = 'ghostrider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "222 Hero Lane", "line2": null, "city": "Knowhere", "state_or_province": "NV", "postal_code": "10122", "country_code": "USA"}]'::json
WHERE username = 'silversurfer';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "42nd St and Madison Ave", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10123", "country_code": "USA"}]'::json
WHERE username = 'fantasticfourmr';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "224 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10124", "country_code": "USA"}]'::json
WHERE username = 'invisiblewoman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "225 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10125", "country_code": "USA"}]'::json
WHERE username = 'humantorch';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "226 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10126", "country_code": "USA"}]'::json
WHERE username = 'thething';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "227 Hero Lane", "line2": null, "city": "San Francisco", "state_or_province": "CA", "postal_code": "10127", "country_code": "USA"}]'::json
WHERE username = 'deadpool';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "228 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10128", "country_code": "USA"}]'::json
WHERE username = 'wolverine';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "229 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10129", "country_code": "USA"}]'::json
WHERE username = 'storm';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "230 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10130", "country_code": "USA"}]'::json
WHERE username = 'cyclops';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "231 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10131", "country_code": "USA"}]'::json
WHERE username = 'jeangrey';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "1407 Graymalkin Ln", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10132", "country_code": "USA"}]'::json
WHERE username = 'professorx';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "233 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10133", "country_code": "USA"}]'::json
WHERE username = 'magneto';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "234 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10134", "country_code": "USA"}]'::json
WHERE username = 'rogue';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "235 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10135", "country_code": "USA"}]'::json
WHERE username = 'gambit';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "236 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10136", "country_code": "USA"}]'::json
WHERE username = 'nightcrawler';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "237 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10137", "country_code": "USA"}]'::json
WHERE username = 'colossus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "238 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10138", "country_code": "USA"}]'::json
WHERE username = 'iceman';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "239 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10139", "country_code": "USA"}]'::json
WHERE username = 'beast';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "240 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10140", "country_code": "USA"}]'::json
WHERE username = 'kittypryde';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "241 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10141", "country_code": "USA"}]'::json
WHERE username = 'jubilee';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "242 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10142", "country_code": "USA"}]'::json
WHERE username = 'psylocke';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "243 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10143", "country_code": "USA"}]'::json
WHERE username = 'cable';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "244 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10144", "country_code": "USA"}]'::json
WHERE username = 'domino';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "245 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10145", "country_code": "USA"}]'::json
WHERE username = 'cablegirl';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "246 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10146", "country_code": "USA"}]'::json
WHERE username = 'x23';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "247 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10147", "country_code": "USA"}]'::json
WHERE username = 'dazzler';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "248 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10148", "country_code": "USA"}]'::json
WHERE username = 'bishop';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "249 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10149", "country_code": "USA"}]'::json
WHERE username = 'sunspot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "250 Hero Lane", "line2": null, "city": "Westchester", "state_or_province": "NY", "postal_code": "10150", "country_code": "USA"}]'::json
WHERE username = 'magik';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "251 Hero Lane", "line2": "Atlantis HQ", "city": "Atlantis", "state_or_province": "FL", "postal_code": "10151", "country_code": "USA"}]'::json
WHERE username = 'namor';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "252 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10152", "country_code": "USA"}]'::json
WHERE username = 'sentry';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "253 Hero Lane", "line2": null, "city": "Chicago", "state_or_province": "IL", "postal_code": "10153", "country_code": "USA"}]'::json
WHERE username = 'moonknight';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "254 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10154", "country_code": "USA"}]'::json
WHERE username = 'blade';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "255 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10155", "country_code": "USA"}]'::json
WHERE username = 'ghostspider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "256 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10156", "country_code": "USA"}]'::json
WHERE username = 'milesmorales';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "257 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10157", "country_code": "USA"}]'::json
WHERE username = 'venom';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "258 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10158", "country_code": "USA"}]'::json
WHERE username = 'greengoblin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "259 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10159", "country_code": "USA"}]'::json
WHERE username = 'doctoroctopus';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "260 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10160", "country_code": "USA"}]'::json
WHERE username = 'lizard';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "261 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10161", "country_code": "USA"}]'::json
WHERE username = 'kingpin';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "262 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10162", "country_code": "USA"}]'::json
WHERE username = 'electro';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "263 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10163", "country_code": "USA"}]'::json
WHERE username = 'vulture';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "264 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10164", "country_code": "USA"}]'::json
WHERE username = 'mysterio';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "265 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10165", "country_code": "USA"}]'::json
WHERE username = 'rhino';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "266 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10166", "country_code": "USA"}]'::json
WHERE username = 'shocker';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "267 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10167", "country_code": "USA"}]'::json
WHERE username = 'scorpion';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "268 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10168", "country_code": "USA"}]'::json
WHERE username = 'kraven';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "269 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10169", "country_code": "USA"}]'::json
WHERE username = 'morbius';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "270 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10170", "country_code": "USA"}]'::json
WHERE username = 'nova';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "271 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10171", "country_code": "USA"}]'::json
WHERE username = 'starlord';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "272 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10172", "country_code": "USA"}]'::json
WHERE username = 'gamora';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "273 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10173", "country_code": "USA"}]'::json
WHERE username = 'drax';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "274 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10174", "country_code": "USA"}]'::json
WHERE username = 'rocket';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "275 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10175", "country_code": "USA"}]'::json
WHERE username = 'groot';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "276 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10176", "country_code": "USA"}]'::json
WHERE username = 'mantis';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "277 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10177", "country_code": "USA"}]'::json
WHERE username = 'nebula';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "278 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10178", "country_code": "USA"}]'::json
WHERE username = 'yondu';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "279 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10179", "country_code": "USA"}]'::json
WHERE username = 'adamwarlock';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "280 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10180", "country_code": "USA"}]'::json
WHERE username = 'thanos';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "281 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10181", "country_code": "USA"}]'::json
WHERE username = 'loki';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "282 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10182", "country_code": "USA"}]'::json
WHERE username = 'hela';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "283 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10183", "country_code": "USA"}]'::json
WHERE username = 'valkyrie';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "284 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10184", "country_code": "USA"}]'::json
WHERE username = 'korg';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "285 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10185", "country_code": "USA"}]'::json
WHERE username = 'miek';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "286 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10186", "country_code": "USA"}]'::json
WHERE username = 'shuri';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "287 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10187", "country_code": "USA"}]'::json
WHERE username = 'okoye';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "288 Hero Lane", "line2": "Wakanda HQ", "city": "Wakanda", "state_or_province": "GA", "postal_code": "10188", "country_code": "USA"}]'::json
WHERE username = 'killmonger';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "289 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10189", "country_code": "USA"}]'::json
WHERE username = 'mysterio2';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "290 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10190", "country_code": "USA"}]'::json
WHERE username = 'warmachine';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "291 Hero Lane", "line2": null, "city": "Malibu", "state_or_province": "CA", "postal_code": "10191", "country_code": "USA"}]'::json
WHERE username = 'pepperpotts';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "292 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10192", "country_code": "USA"}]'::json
WHERE username = 'nickfury';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "293 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10193", "country_code": "USA"}]'::json
WHERE username = 'agentcoulson';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "294 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10194", "country_code": "USA"}]'::json
WHERE username = 'mariahill';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "295 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10195", "country_code": "USA"}]'::json
WHERE username = 'sharoncarter';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "296 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10196", "country_code": "USA"}]'::json
WHERE username = 'buckybarnes';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "297 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10197", "country_code": "USA"}]'::json
WHERE username = 'quicksilver';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "298 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10198", "country_code": "USA"}]'::json
WHERE username = 'scarletspider';

UPDATE public."user"
SET addresses_json = '[{"label": "home", "line1": "299 Hero Lane", "line2": null, "city": "New York", "state_or_province": "NY", "postal_code": "10199", "country_code": "USA"}]'::json
WHERE username = 'spiderwoman';

SELECT username, addresses_json->0->>'city' AS city, addresses_json->0->>'state_or_province' AS state
FROM public."user"
WHERE email LIKE '%@superhero.example.com'
ORDER BY username
LIMIT 10;
