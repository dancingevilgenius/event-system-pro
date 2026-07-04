-- Seed static_list lookup rows (dev / demo).
-- Safe to re-run (upserts by list_code).
-- min-age / max-age use integer -1 for not applicable (N/A).

\connect event_system_pro

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES
  (
    'WSDC_SWING_EVENTS',
    'WSDC',
    'List of competition events that might appear at a swing dance',
    '[
      {"key": "JNJ", "label": "Jack and Jill"},
      {"key": "SS", "label": "Strictly Swing"},
      {"key": "ROU_CLASSIC", "label": "Classic Routine"},
      {"key": "ROU_SHOWCASE", "label": "Showcase Routine"}
    ]'::json
  ),
  (
    'WSDC_LEVELS',
    'WSDC',
    'Ability or age levels to further describe a swing contest',
    '[
      {"key": "NEW", "label": "Newcomer", "min-age": -1, "max-age": -1},
      {"key": "NOV", "label": "Novice", "min-age": -1, "max-age": -1},
      {"key": "INT", "label": "Intermediate", "min-age": -1, "max-age": -1},
      {"key": "ADV", "label": "Advanced", "min-age": -1, "max-age": -1},
      {"key": "ALL", "label": "All-Star", "min-age": -1, "max-age": -1},
      {"key": "OPE", "label": "Open", "min-age": -1, "max-age": -1},
      {"key": "CHA", "label": "Champion", "min-age": -1, "max-age": -1},
      {"key": "INV", "label": "Invitational", "min-age": -1, "max-age": -1},
      {"key": "SOP", "label": "Sophisticated", "min-age": 35, "max-age": -1},
      {"key": "MAS", "label": "Masters", "min-age": 50, "max-age": -1},
      {"key": "JUN", "label": "Juniors", "min-age": -1, "max-age": 18},
      {"key": "YAM", "label": "Young America", "min-age": -1, "max-age": 12}
    ]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
VALUES
  (
    'US_STATES',
    'US',
    'United States states and territories',
    $us_states$
[
  {
    "key": "AL",
    "label": "Alabama"
  },
  {
    "key": "AK",
    "label": "Alaska"
  },
  {
    "key": "AS",
    "label": "American Samoa"
  },
  {
    "key": "AZ",
    "label": "Arizona"
  },
  {
    "key": "AR",
    "label": "Arkansas"
  },
  {
    "key": "CA",
    "label": "California"
  },
  {
    "key": "CO",
    "label": "Colorado"
  },
  {
    "key": "CT",
    "label": "Connecticut"
  },
  {
    "key": "DE",
    "label": "Delaware"
  },
  {
    "key": "DC",
    "label": "District of Columbia"
  },
  {
    "key": "FM",
    "label": "Federated States of Micronesia"
  },
  {
    "key": "FL",
    "label": "Florida"
  },
  {
    "key": "GA",
    "label": "Georgia"
  },
  {
    "key": "GU",
    "label": "Guam"
  },
  {
    "key": "HI",
    "label": "Hawaii"
  },
  {
    "key": "ID",
    "label": "Idaho"
  },
  {
    "key": "IL",
    "label": "Illinois"
  },
  {
    "key": "IN",
    "label": "Indiana"
  },
  {
    "key": "IA",
    "label": "Iowa"
  },
  {
    "key": "KS",
    "label": "Kansas"
  },
  {
    "key": "KY",
    "label": "Kentucky"
  },
  {
    "key": "LA",
    "label": "Louisiana"
  },
  {
    "key": "ME",
    "label": "Maine"
  },
  {
    "key": "MH",
    "label": "Marshall Islands"
  },
  {
    "key": "MD",
    "label": "Maryland"
  },
  {
    "key": "MA",
    "label": "Massachusetts"
  },
  {
    "key": "MI",
    "label": "Michigan"
  },
  {
    "key": "MN",
    "label": "Minnesota"
  },
  {
    "key": "MS",
    "label": "Mississippi"
  },
  {
    "key": "MO",
    "label": "Missouri"
  },
  {
    "key": "MT",
    "label": "Montana"
  },
  {
    "key": "NE",
    "label": "Nebraska"
  },
  {
    "key": "NV",
    "label": "Nevada"
  },
  {
    "key": "NH",
    "label": "New Hampshire"
  },
  {
    "key": "NJ",
    "label": "New Jersey"
  },
  {
    "key": "NM",
    "label": "New Mexico"
  },
  {
    "key": "NY",
    "label": "New York"
  },
  {
    "key": "NC",
    "label": "North Carolina"
  },
  {
    "key": "ND",
    "label": "North Dakota"
  },
  {
    "key": "MP",
    "label": "Northern Mariana Islands"
  },
  {
    "key": "OH",
    "label": "Ohio"
  },
  {
    "key": "OK",
    "label": "Oklahoma"
  },
  {
    "key": "OR",
    "label": "Oregon"
  },
  {
    "key": "PW",
    "label": "Palau"
  },
  {
    "key": "PA",
    "label": "Pennsylvania"
  },
  {
    "key": "PR",
    "label": "Puerto Rico"
  },
  {
    "key": "RI",
    "label": "Rhode Island"
  },
  {
    "key": "SC",
    "label": "South Carolina"
  },
  {
    "key": "SD",
    "label": "South Dakota"
  },
  {
    "key": "TN",
    "label": "Tennessee"
  },
  {
    "key": "TX",
    "label": "Texas"
  },
  {
    "key": "UT",
    "label": "Utah"
  },
  {
    "key": "VT",
    "label": "Vermont"
  },
  {
    "key": "VI",
    "label": "Virgin Islands"
  },
  {
    "key": "VA",
    "label": "Virginia"
  },
  {
    "key": "WA",
    "label": "Washington"
  },
  {
    "key": "WV",
    "label": "West Virginia"
  },
  {
    "key": "WI",
    "label": "Wisconsin"
  },
  {
    "key": "WY",
    "label": "Wyoming"
  }
]$us_states$::json
  ),
  (
    'COUNTRIES',
    'GLOBAL',
    'Countries and territories',
    $countries$
[
  {
    "key": "ASM",
    "label": "American Samoa"
  },
  {
    "key": "AIA",
    "label": "Anguilla"
  },
  {
    "key": "ATA",
    "label": "Antarctica"
  },
  {
    "key": "ATG",
    "label": "Antigua and Barbuda"
  },
  {
    "key": "EGY",
    "label": "Arab Republic of Egypt"
  },
  {
    "key": "ARG",
    "label": "Argentine Republic"
  },
  {
    "key": "ABW",
    "label": "Aruba"
  },
  {
    "key": "BRB",
    "label": "Barbados"
  },
  {
    "key": "BLZ",
    "label": "Belize"
  },
  {
    "key": "BMU",
    "label": "Bermuda Islands"
  },
  {
    "key": "VEN",
    "label": "Bolivarian Republic of Venezuela"
  },
  {
    "key": "BES",
    "label": "Bonaire, Sint Eustatius and Saba"
  },
  {
    "key": "BIH",
    "label": "Bosnia and Herzegovina"
  },
  {
    "key": "BVT",
    "label": "Bouvet Island"
  },
  {
    "key": "IOT",
    "label": "British Indian Ocean Territory"
  },
  {
    "key": "VGB",
    "label": "British Virgin Islands"
  },
  {
    "key": "BRN",
    "label": "Brunei Darussalam"
  },
  {
    "key": "BFA",
    "label": "Burkina Faso"
  },
  {
    "key": "CAN",
    "label": "Canada"
  },
  {
    "key": "CAF",
    "label": "Central African Republic"
  },
  {
    "key": "CXR",
    "label": "Christmas Island"
  },
  {
    "key": "GUY",
    "label": "Co-operative Republic of Guyana"
  },
  {
    "key": "CCK",
    "label": "Cocos (Keeling) Islands"
  },
  {
    "key": "AUS",
    "label": "Commonwealth of Australia"
  },
  {
    "key": "DMA",
    "label": "Commonwealth of Dominica"
  },
  {
    "key": "PRI",
    "label": "Commonwealth of Puerto Rico"
  },
  {
    "key": "BHS",
    "label": "Commonwealth of The Bahamas"
  },
  {
    "key": "COK",
    "label": "Cook Islands"
  },
  {
    "key": "CUW",
    "label": "Cura&ccedil;ao"
  },
  {
    "key": "CZE",
    "label": "Czech Republic"
  },
  {
    "key": "PRK",
    "label": "Democratic People's Republic of Korea"
  },
  {
    "key": "STP",
    "label": "Democratic Republic of S&atilde;o Tom&eacute; and Pr&iacute;ncipe"
  },
  {
    "key": "COD",
    "label": "Democratic Republic of the Congo"
  },
  {
    "key": "TLS",
    "label": "Democratic Republic of Timor-Leste"
  },
  {
    "key": "LKA",
    "label": "Democratic Socialist Republic of Sri Lanka"
  },
  {
    "key": "DOM",
    "label": "Dominican Republic"
  },
  {
    "key": "URY",
    "label": "Eastern Republic of Uruguay"
  },
  {
    "key": "ETH",
    "label": "Federal Democratic Republic of Ethiopia"
  },
  {
    "key": "NPL",
    "label": "Federal Democratic Republic of Nepal"
  },
  {
    "key": "DEU",
    "label": "Federal Republic of Germany"
  },
  {
    "key": "NGA",
    "label": "Federal Republic of Nigeria"
  },
  {
    "key": "FSM",
    "label": "Federated States of Micronesia"
  },
  {
    "key": "KNA",
    "label": "Federation of Saint Christopher and Nevis"
  },
  {
    "key": "BRA",
    "label": "Federative Republic of Brazil"
  },
  {
    "key": "GUF",
    "label": "French Guiana"
  },
  {
    "key": "PYF",
    "label": "French Polynesia"
  },
  {
    "key": "FRA",
    "label": "French Republic"
  },
  {
    "key": "ATF",
    "label": "French Southern Territories"
  },
  {
    "key": "GAB",
    "label": "Gabonese Republic"
  },
  {
    "key": "GEO",
    "label": "Georgia"
  },
  {
    "key": "GIB",
    "label": "Gibraltar"
  },
  {
    "key": "LUX",
    "label": "Grand Duchy of Luxembourg"
  },
  {
    "key": "GRL",
    "label": "Greenland"
  },
  {
    "key": "GRD",
    "label": "Grenada"
  },
  {
    "key": "GLP",
    "label": "Guadeloupe"
  },
  {
    "key": "GUM",
    "label": "Guam"
  },
  {
    "key": "GGY",
    "label": "Guernsey"
  },
  {
    "key": "JOR",
    "label": "Hashemite Kingdom of Jordan"
  },
  {
    "key": "HMD",
    "label": "Heard Island and McDonald Islands"
  },
  {
    "key": "GRC",
    "label": "Hellenic Republic"
  },
  {
    "key": "HKG",
    "label": "Hong Kong"
  },
  {
    "key": "HUN",
    "label": "Hungary"
  },
  {
    "key": "PNG",
    "label": "Independent State of Papua New Guinea"
  },
  {
    "key": "WSM",
    "label": "Independent State of Samoa"
  },
  {
    "key": "IRL",
    "label": "Ireland"
  },
  {
    "key": "AFG",
    "label": "Islamic Republic of Afghanistan"
  },
  {
    "key": "IRN",
    "label": "Islamic Republic of Iran"
  },
  {
    "key": "MRT",
    "label": "Islamic Republic of Mauritania"
  },
  {
    "key": "PAK",
    "label": "Islamic Republic of Pakistan"
  },
  {
    "key": "IMN",
    "label": "Isle of Man"
  },
  {
    "key": "ITA",
    "label": "Italian Republic"
  },
  {
    "key": "JAM",
    "label": "Jamaica"
  },
  {
    "key": "JPN",
    "label": "Japan"
  },
  {
    "key": "BHR",
    "label": "Kingdom of Bahrain"
  },
  {
    "key": "BEL",
    "label": "Kingdom of Belgium"
  },
  {
    "key": "BTN",
    "label": "Kingdom of Bhutan"
  },
  {
    "key": "KHM",
    "label": "Kingdom of Cambodia"
  },
  {
    "key": "DNK",
    "label": "Kingdom of Denmark"
  },
  {
    "key": "LSO",
    "label": "Kingdom of Lesotho"
  },
  {
    "key": "MAR",
    "label": "Kingdom of Morocco"
  },
  {
    "key": "NOR",
    "label": "Kingdom of Norway"
  },
  {
    "key": "SAU",
    "label": "Kingdom of Saudi Arabia"
  },
  {
    "key": "ESP",
    "label": "Kingdom of Spain"
  },
  {
    "key": "SWZ",
    "label": "Kingdom of Swaziland"
  },
  {
    "key": "SWE",
    "label": "Kingdom of Sweden"
  },
  {
    "key": "THA",
    "label": "Kingdom of Thailand"
  },
  {
    "key": "NLD",
    "label": "Kingdom of the Netherlands"
  },
  {
    "key": "TON",
    "label": "Kingdom of Tonga"
  },
  {
    "key": "KGZ",
    "label": "Kyrgyz Republic"
  },
  {
    "key": "LAO",
    "label": "Lao People's Democratic Republic"
  },
  {
    "key": "LBY",
    "label": "Libya"
  },
  {
    "key": "MYS",
    "label": "Malaysia"
  },
  {
    "key": "MTQ",
    "label": "Martinique"
  },
  {
    "key": "MYT",
    "label": "Mayotte"
  },
  {
    "key": "MNG",
    "label": "Mongolia"
  },
  {
    "key": "MNE",
    "label": "Montenegro"
  },
  {
    "key": "MSR",
    "label": "Montserrat"
  },
  {
    "key": "NCL",
    "label": "New Caledonia"
  },
  {
    "key": "NZL",
    "label": "New Zealand"
  },
  {
    "key": "NIU",
    "label": "Niue"
  },
  {
    "key": "NFK",
    "label": "Norfolk Island"
  },
  {
    "key": "MNP",
    "label": "Northern Mariana Islands"
  },
  {
    "key": "DZA",
    "label": "People's Democratic Republic of Algeria"
  },
  {
    "key": "BGD",
    "label": "People's Republic of Bangladesh"
  },
  {
    "key": "CHN",
    "label": "People's Republic of China"
  },
  {
    "key": "PCN",
    "label": "Pitcairn"
  },
  {
    "key": "BOL",
    "label": "Plurinational State of Bolivia"
  },
  {
    "key": "PRT",
    "label": "Portuguese Republic"
  },
  {
    "key": "AND",
    "label": "Principality of Andorra"
  },
  {
    "key": "LIE",
    "label": "Principality of Liechtenstein"
  },
  {
    "key": "MCO",
    "label": "Principality of Monaco"
  },
  {
    "key": "REU",
    "label": "R&eacute;union"
  },
  {
    "key": "ALB",
    "label": "Republic of Albania"
  },
  {
    "key": "AGO",
    "label": "Republic of Angola"
  },
  {
    "key": "ARM",
    "label": "Republic of Armenia"
  },
  {
    "key": "AUT",
    "label": "Republic of Austria"
  },
  {
    "key": "AZE",
    "label": "Republic of Azerbaijan"
  },
  {
    "key": "BLR",
    "label": "Republic of Belarus"
  },
  {
    "key": "BEN",
    "label": "Republic of Benin"
  },
  {
    "key": "BWA",
    "label": "Republic of Botswana"
  },
  {
    "key": "BGR",
    "label": "Republic of Bulgaria"
  },
  {
    "key": "BDI",
    "label": "Republic of Burundi"
  },
  {
    "key": "CMR",
    "label": "Republic of Cameroon"
  },
  {
    "key": "CPV",
    "label": "Republic of Cape Verde"
  },
  {
    "key": "TCD",
    "label": "Republic of Chad"
  },
  {
    "key": "CHL",
    "label": "Republic of Chile"
  },
  {
    "key": "TWN",
    "label": "Republic of China (Taiwan)"
  },
  {
    "key": "COL",
    "label": "Republic of Colombia"
  },
  {
    "key": "CRI",
    "label": "Republic of Costa Rica"
  },
  {
    "key": "HRV",
    "label": "Republic of Croatia"
  },
  {
    "key": "CUB",
    "label": "Republic of Cuba"
  },
  {
    "key": "CYP",
    "label": "Republic of Cyprus"
  },
  {
    "key": "DJI",
    "label": "Republic of Djibouti"
  },
  {
    "key": "ECU",
    "label": "Republic of Ecuador"
  },
  {
    "key": "SLV",
    "label": "Republic of El Salvador"
  },
  {
    "key": "GNQ",
    "label": "Republic of Equatorial Guinea"
  },
  {
    "key": "EST",
    "label": "Republic of Estonia"
  },
  {
    "key": "FJI",
    "label": "Republic of Fiji"
  },
  {
    "key": "FIN",
    "label": "Republic of Finland"
  },
  {
    "key": "GHA",
    "label": "Republic of Ghana"
  },
  {
    "key": "GTM",
    "label": "Republic of Guatemala"
  },
  {
    "key": "GIN",
    "label": "Republic of Guinea"
  },
  {
    "key": "GNB",
    "label": "Republic of Guinea-Bissau"
  },
  {
    "key": "HTI",
    "label": "Republic of Haiti"
  },
  {
    "key": "HND",
    "label": "Republic of Honduras"
  },
  {
    "key": "ISL",
    "label": "Republic of Iceland"
  },
  {
    "key": "IND",
    "label": "Republic of India"
  },
  {
    "key": "IDN",
    "label": "Republic of Indonesia"
  },
  {
    "key": "IRQ",
    "label": "Republic of Iraq"
  },
  {
    "key": "KAZ",
    "label": "Republic of Kazakhstan"
  },
  {
    "key": "KEN",
    "label": "Republic of Kenya"
  },
  {
    "key": "KIR",
    "label": "Republic of Kiribati"
  },
  {
    "key": "KOR",
    "label": "Republic of Korea"
  },
  {
    "key": "---",
    "label": "Republic of Kosovo"
  },
  {
    "key": "LVA",
    "label": "Republic of Latvia"
  },
  {
    "key": "LBN",
    "label": "Republic of Lebanon"
  },
  {
    "key": "LBR",
    "label": "Republic of Liberia"
  },
  {
    "key": "LTU",
    "label": "Republic of Lithuania"
  },
  {
    "key": "MDG",
    "label": "Republic of Madagascar"
  },
  {
    "key": "MWI",
    "label": "Republic of Malawi"
  },
  {
    "key": "MDV",
    "label": "Republic of Maldives"
  },
  {
    "key": "MLI",
    "label": "Republic of Mali"
  },
  {
    "key": "MLT",
    "label": "Republic of Malta"
  },
  {
    "key": "MUS",
    "label": "Republic of Mauritius"
  },
  {
    "key": "MDA",
    "label": "Republic of Moldova"
  },
  {
    "key": "MOZ",
    "label": "Republic of Mozambique"
  },
  {
    "key": "NAM",
    "label": "Republic of Namibia"
  },
  {
    "key": "NRU",
    "label": "Republic of Nauru"
  },
  {
    "key": "NIC",
    "label": "Republic of Nicaragua"
  },
  {
    "key": "NER",
    "label": "Republic of Niger"
  },
  {
    "key": "PLW",
    "label": "Republic of Palau"
  },
  {
    "key": "PAN",
    "label": "Republic of Panama"
  },
  {
    "key": "PRY",
    "label": "Republic of Paraguay"
  },
  {
    "key": "PER",
    "label": "Republic of Peru"
  },
  {
    "key": "POL",
    "label": "Republic of Poland"
  },
  {
    "key": "RWA",
    "label": "Republic of Rwanda"
  },
  {
    "key": "SMR",
    "label": "Republic of San Marino"
  },
  {
    "key": "SEN",
    "label": "Republic of Senegal"
  },
  {
    "key": "SRB",
    "label": "Republic of Serbia"
  },
  {
    "key": "SYC",
    "label": "Republic of Seychelles"
  },
  {
    "key": "SLE",
    "label": "Republic of Sierra Leone"
  },
  {
    "key": "SGP",
    "label": "Republic of Singapore"
  },
  {
    "key": "SVN",
    "label": "Republic of Slovenia"
  },
  {
    "key": "ZAF",
    "label": "Republic of South Africa"
  },
  {
    "key": "SSD",
    "label": "Republic of South Sudan"
  },
  {
    "key": "SUR",
    "label": "Republic of Suriname"
  },
  {
    "key": "TJK",
    "label": "Republic of Tajikistan"
  },
  {
    "key": "COG",
    "label": "Republic of the Congo"
  },
  {
    "key": "GMB",
    "label": "Republic of The Gambia"
  },
  {
    "key": "MHL",
    "label": "Republic of the Marshall Islands"
  },
  {
    "key": "PHL",
    "label": "Republic of the Philippines"
  },
  {
    "key": "SDN",
    "label": "Republic of the Sudan"
  },
  {
    "key": "MMR",
    "label": "Republic of the Union of Myanmar"
  },
  {
    "key": "TTO",
    "label": "Republic of Trinidad and Tobago"
  },
  {
    "key": "TUN",
    "label": "Republic of Tunisia"
  },
  {
    "key": "TUR",
    "label": "Republic of Turkey"
  },
  {
    "key": "UGA",
    "label": "Republic of Uganda"
  },
  {
    "key": "UZB",
    "label": "Republic of Uzbekistan"
  },
  {
    "key": "VUT",
    "label": "Republic of Vanuatu"
  },
  {
    "key": "YEM",
    "label": "Republic of Yemen"
  },
  {
    "key": "ZMB",
    "label": "Republic of Zambia"
  },
  {
    "key": "ZWE",
    "label": "Republic of Zimbabwe"
  },
  {
    "key": "ROU",
    "label": "Romania"
  },
  {
    "key": "RUS",
    "label": "Russian Federation"
  },
  {
    "key": "BLM",
    "label": "Saint Barth&eacute;lemy"
  },
  {
    "key": "SHN",
    "label": "Saint Helena, Ascension and Tristan da Cunha"
  },
  {
    "key": "LCA",
    "label": "Saint Lucia"
  },
  {
    "key": "MAF",
    "label": "Saint Martin"
  },
  {
    "key": "SPM",
    "label": "Saint Pierre and Miquelon"
  },
  {
    "key": "VCT",
    "label": "Saint Vincent and the Grenadines"
  },
  {
    "key": "SXM",
    "label": "Sint Maarten"
  },
  {
    "key": "SVK",
    "label": "Slovak Republic"
  },
  {
    "key": "VNM",
    "label": "Socialist Republic of Vietnam"
  },
  {
    "key": "SLB",
    "label": "Solomon Islands"
  },
  {
    "key": "SOM",
    "label": "Somali Republic"
  },
  {
    "key": "SGS",
    "label": "South Georgia and the South Sandwich Islands"
  },
  {
    "key": "ERI",
    "label": "State of Eritrea"
  },
  {
    "key": "ISR",
    "label": "State of Israel"
  },
  {
    "key": "KWT",
    "label": "State of Kuwait"
  },
  {
    "key": "PSE",
    "label": "State of Palestine (or Occupied Palestinian Territory)"
  },
  {
    "key": "QAT",
    "label": "State of Qatar"
  },
  {
    "key": "VAT",
    "label": "State of the Vatican City"
  },
  {
    "key": "OMN",
    "label": "Sultanate of Oman"
  },
  {
    "key": "SJM",
    "label": "Svalbard and Jan Mayen"
  },
  {
    "key": "CHE",
    "label": "Swiss Confederation"
  },
  {
    "key": "SYR",
    "label": "Syrian Arab Republic"
  },
  {
    "key": "JEY",
    "label": "The Bailiwick of Jersey"
  },
  {
    "key": "CYM",
    "label": "The Cayman Islands"
  },
  {
    "key": "FLK",
    "label": "The Falkland Islands (Malvinas)"
  },
  {
    "key": "FRO",
    "label": "The Faroe Islands"
  },
  {
    "key": "MKD",
    "label": "The Former Yugoslav Republic of Macedonia"
  },
  {
    "key": "MAC",
    "label": "The Macao Special Administrative Region"
  },
  {
    "key": "TGO",
    "label": "Togolese Republic"
  },
  {
    "key": "TKL",
    "label": "Tokelau"
  },
  {
    "key": "TKM",
    "label": "Turkmenistan"
  },
  {
    "key": "TCA",
    "label": "Turks and Caicos Islands"
  },
  {
    "key": "TUV",
    "label": "Tuvalu"
  },
  {
    "key": "UKR",
    "label": "Ukraine"
  },
  {
    "key": "COM",
    "label": "Union of the Comoros"
  },
  {
    "key": "ARE",
    "label": "United Arab Emirates"
  },
  {
    "key": "GBR",
    "label": "United Kingdom of Great Britain and Nothern Ireland"
  },
  {
    "key": "MEX",
    "label": "United Mexican States"
  },
  {
    "key": "TZA",
    "label": "United Republic of Tanzania"
  },
  {
    "key": "UMI",
    "label": "United States Minor Outlying Islands"
  },
  {
    "key": "USA",
    "label": "United States of America"
  },
  {
    "key": "VIR",
    "label": "Virgin Islands of the United States"
  },
  {
    "key": "WAK",
    "label": "Wakanda"
  },
  {
    "key": "WLF",
    "label": "Wallis and Futuna"
  },
  {
    "key": "ESH",
    "label": "Western Sahara"
  }
]$countries$::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;

-- EVENT_TYPES: one list_json entry per event_type_lu row (requires 002_event_type_lu_seed + GLOBAL governing body).
INSERT INTO public.static_list (list_code, governing_body_code, short_desc, list_json)
SELECT
  'EVENT_TYPES',
  'GLOBAL',
  'Competition and event type definitions',
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'key', trim(e.event_type_code),
          'label', initcap(replace(lower(trim(e.event_type_code)), '_', ' ')),
          'major-group', e.description_json->>'major_group',
          'minor-group', e.description_json->>'minor_group',
          'description', e.description_json->>'description',
          'min-persons-per-entry', (e.description_json->>'min_persons_per_entry')::int,
          'max-persons-per-entry', (e.description_json->>'max_persons_per_entry')::int
        )
        ORDER BY e.event_type_code
      )
      FROM public.event_type_lu AS e
    ),
    '[]'::json
  )
ON CONFLICT (list_code) DO UPDATE SET
  governing_body_code = EXCLUDED.governing_body_code,
  short_desc = EXCLUDED.short_desc,
  list_json = EXCLUDED.list_json;
