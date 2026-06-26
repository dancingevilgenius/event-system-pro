"""City/state resolution for Marvel and DC superhero seed users."""

from __future__ import annotations

METROPOLIS_NY = ("Metropolis", "NY")
GOTHAM_NJ = ("Gotham City", "NJ")
CENTRAL_CITY_MO = ("Central City", "MO")
COAST_CITY_CA = ("Coast City", "CA")
STAR_CITY_WA = ("Star City", "WA")
NYC = ("New York", "NY")
MALIBU_CA = ("Malibu", "CA")
WESTCHESTER_NY = ("Westchester", "NY")
WASHINGTON_DC = ("Washington", "DC")
DETROIT_MI = ("Detroit", "MI")
CHICAGO_IL = ("Chicago", "IL")
BOSTON_MA = ("Boston", "MA")
SAN_FRANCISCO_CA = ("San Francisco", "CA")
LOS_ANGELES_CA = ("Los Angeles", "CA")
NEW_ORLEANS_LA = ("New Orleans", "LA")
MIAMI_FL = ("Miami", "FL")
ATLANTA_GA = ("Atlanta", "GA")
SEATTLE_WA = ("Seattle", "WA")
PHILADELPHIA_PA = ("Philadelphia", "PA")
PITTSBURGH_PA = ("Pittsburgh", "PA")
EL_PASO_TX = ("El Paso", "TX")
LAS_VEGAS_NV = ("Las Vegas", "NV")
SMALLVILLE_KS = ("Smallville", "KS")
BLUDHAVEN_NJ = ("Bludhaven", "NJ")
FAWCETT_CITY_IN = ("Fawcett City", "IN")
HUB_CITY_IL = ("Hub City", "IL")
IVY_TOWN_CT = ("Ivy Town", "CT")
DAKOTA_CITY_MO = ("Dakota City", "MO")
FREELAND_MD = ("Freeland", "MD")
ST_ROCH_LA = ("St. Roch", "LA")
WAKANDA_GA = ("Wakanda", "GA")
ATLANTIS_FL = ("Atlantis", "FL")
KNOWHERE_NV = ("Knowhere", "NV")
KAMAR_TAJ_NY = ("New York", "NY")
JUMP_CITY_CA = ("Jump City", "CA")
BROOKLYN_NY = ("Brooklyn", "NY")
HELLS_KITCHEN_NY = ("New York", "NY")

GOTHAM_USERNAMES = frozenset(
    {
        "batman",
        "batgirl",
        "batwoman",
        "robin",
        "nightwing",
        "redhood",
        "joker",
        "catwoman",
        "riddler",
        "scarecrow",
        "twoface",
        "poisonivy",
        "harleyquinn",
        "bane",
        "huntress",
        "oracle",
        "timdrake",
        "damianwayne",
        "stephaniebrown",
        "cassandracain",
        "reneree",
        "wildcat",
        "deadshot",
        "killerfrost",
        "fire",
        "ice",
    }
)

METROPOLIS_USERNAMES = frozenset(
    {
        "superman",
        "supergirl",
        "lexluthor",
        "powergirl",
        "stargirl",
        "boostergold",
        "parademon",
        "grannygoodness",
        "steppenwolf",
        "darkseid",
        "brainiac",
    }
)

CENTRAL_CITY_USERNAMES = frozenset({"flash", "kidflash", "reverseflash", "captaincold"})

COAST_CITY_USERNAMES = frozenset({"greenlantern", "starsapphire"})

STAR_CITY_USERNAMES = frozenset({"greenarrow", "blackcanary"})

NYC_MARVEL_STREET = frozenset(
    {
        "spiderman",
        "milesmorales",
        "ghostspider",
        "spidergwen",
        "spiderpunk",
        "spideruk",
        "spidernoir",
        "spiderham",
        "peniparker",
        "miguelohara",
        "scarletspider",
        "spiderwoman",
        "silk",
        "venom",
        "greengoblin",
        "doctoroctopus",
        "lizard",
        "kingpin",
        "electro",
        "vulture",
        "mysterio",
        "mysterio2",
        "rhino",
        "shocker",
        "scorpion",
        "kraven",
        "morbius",
        "daredevil",
        "punisher",
        "punisher2",
        "punisher2099",
        "jessicajones",
        "lukecage",
        "ironfist",
        "blade",
        "doctorstrange",
        "wong",
        "ancientone",
        "mordo",
        "clea",
        "hellcat",
        "hellcat2",
        "squirrelgirl",
        "squirrelgirl2",
        "moongirl",
        "devildinosaur",
        "whitetiger",
        "katebishop",
        "ironheart",
        "msmarvel",
        "patriot",
        "americachavez",
    }
)

WESTCHESTER_XMEN = frozenset(
    {
        "professorx",
        "cyclops",
        "jeangrey",
        "storm",
        "beast",
        "iceman",
        "iceman2",
        "rogue",
        "rogue2",
        "gambit",
        "nightcrawler",
        "colossus",
        "kittypryde",
        "jubilee",
        "psylocke",
        "wolverine",
        "x23",
        "magneto",
        "mystique",
        "sabretooth",
        "juggernaut",
        "blob",
        "toad",
        "pyro",
        "bishop",
        "cable",
        "cablegirl",
        "domino",
        "sunspot",
        "magik",
        "dazzler",
        "northstar",
    }
)

WAKANDA_USERNAMES = frozenset({"blackpanther", "shuri", "killmonger", "okoye"})

ATLANTIS_USERNAMES = frozenset({"aquaman", "oceanmaster", "blackmanta", "namor"})

MALIBU_STARK = frozenset({"ironman", "pepperpotts", "warmachine"})

Avengers_NYC = frozenset(
    {
        "captainamerica",
        "blackwidow",
        "hawkeye",
        "scarletwitch",
        "vision",
        "vision2",
        "falcon",
        "wintersoldier",
        "buckybarnes",
        "antman",
        "wasp",
        "yellowjacket",
        "stature",
        "captainmarvel",
        "binary",
        "photon",
        "spectrum",
        "nickfury",
        "agentcoulson",
        "mariahill",
        "sharoncarter",
        "quicksilver",
        "hulk",
        "shehulk",
        "abomination",
        "hulkred",
        "leader",
        "thor",
        "loki",
        "hela",
        "valkyrie",
        "sentry",
        "sentry2",
        "ultron",
        "taskmaster",
        "yelena",
        "redguardian",
        "ghost",
        "wiccan",
        "hulkling",
        "speed",
    }
)

FANTASTIC_FOUR_NYC = frozenset(
    {"fantasticfourmr", "invisiblewoman", "humantorch", "thething"}
)

GUARDIANS_NYC = frozenset(
    {
        "starlord",
        "gamora",
        "drax",
        "rocket",
        "groot",
        "mantis",
        "nebula",
        "yondu",
        "adamwarlock",
        "thanos",
        "korg",
        "miek",
    }
)

LOCATION_OVERRIDES: dict[str, tuple[str, str]] = {
    "wonderwoman": WASHINGTON_DC,
    "shazam": FAWCETT_CITY_IN,
    "cyborg": DETROIT_MI,
    "martianmanhunter": ("Middleton", "CO"),
    "hawkman": ST_ROCH_LA,
    "hawkgirl": ST_ROCH_LA,
    "zatanna": SAN_FRANCISCO_CA,
    "constantine": LOS_ANGELES_CA,
    "raven": JUMP_CITY_CA,
    "starfire": JUMP_CITY_CA,
    "beastboy": JUMP_CITY_CA,
    "swampthing": NEW_ORLEANS_LA,
    "doctorfate": BOSTON_MA,
    "bluebeetle": EL_PASO_TX,
    "question": HUB_CITY_IL,
    "static": DAKOTA_CITY_MO,
    "blacklightning": FREELAND_MD,
    "vixen": DETROIT_MI,
    "firestorm": PITTSBURGH_PA,
    "atom": IVY_TOWN_CT,
    "nightwing": BLUDHAVEN_NJ,
    "blackadam": ("Kahndaq", "IL"),
    "sinestro": COAST_CITY_CA,
    "atrocitus": ("Ysmault", "NV"),
    "saintwalker": ("Odym", "CO"),
    "lobo": LAS_VEGAS_NV,
    "lobohunter": LAS_VEGAS_NV,
    "kamandi": ("Command D", "NY"),
    "jonahhex": ("Confederate Territory", "TX"),
    "lucifermorningstar": LOS_ANGELES_CA,
    "enchantress": WASHINGTON_DC,
    "blackmanta": ATLANTIS_FL,
    "deadpool": ("San Francisco", "CA"),
    "ghostrider": ("Los Angeles", "CA"),
    "ghostriderrobbie": LOS_ANGELES_CA,
    "silversurfer": KNOWHERE_NV,
    "silversurfer2": KNOWHERE_NV,
    "galactus": ("Worldship", "NY"),
    "nova": ("New York", "NY"),
    "moonknight": ("Chicago", "IL"),
    "redskull": ("Exile Island", "FL"),
    "baronzemo": ("Sokovia", "NY"),
    "whiplash": ("Moscow", "ID"),
    "mandarin": ("Miami", "FL"),
    "finfangfoom": ("Chinatown", "NY"),
    "hellstorm": BOSTON_MA,
    "satana": BOSTON_MA,
    "manthing": ("Everglades", "FL"),
    "howardduck": ("Cleveland", "OH"),
    "kang": ("Chronopolis", "NJ"),
    "immortus": ("Limbo", "NY"),
    "ironlad": ("New York", "NY"),
    "dormammu": KAMAR_TAJ_NY,
    "shumagorath": KAMAR_TAJ_NY,
    "bluemarvel": ("Maryland", "MD"),
    "omegared": ("Berlin", "NH"),
    "ladydeathstrike": ("Osaka", "HI"),
    "omegasentinel": ("New Delhi", "IN"),
    "sentinel": ("Washington", "DC"),
    "modok": ("Yorktown", "NY"),
    "captainamerica": BROOKLYN_NY,
    "fantasticfourmr": NYC,
}

LINE1_OVERRIDES: dict[str, str] = {
    "superman": "344 Clinton St",
    "batman": "1007 Mountain Drive",
    "wonderwoman": "1600 Pennsylvania Ave NW",
    "spiderman": "20 Ingram St",
    "ironman": "10880 Malibu Point",
    "captainamerica": "569 Leaman Pl",
    "doctorstrange": "177A Bleecker St",
    "blackpanther": "Royal Palace",
    "aquaman": "Atlantean Embassy",
    "flash": "2121 Main St",
    "greenlantern": "1200 Coast Blvd",
    "greenarrow": "1401 Starling Ave",
    "fantasticfourmr": "42nd St and Madison Ave",
    "professorx": "1407 Graymalkin Ln",
    "daredevil": "250 W 57th St",
    "punisher": "123 Hell's Kitchen Ave",
    "lexluthor": "LexCorp Plaza",
    "nightwing": "1 Bludhaven Pier",
}


def resolve_city_state(username: str, publisher: str) -> tuple[str, str]:
    if username in LOCATION_OVERRIDES:
        return LOCATION_OVERRIDES[username]
    if username in GOTHAM_USERNAMES:
        return GOTHAM_NJ
    if username in METROPOLIS_USERNAMES:
        return METROPOLIS_NY
    if username in CENTRAL_CITY_USERNAMES:
        return CENTRAL_CITY_MO
    if username in COAST_CITY_USERNAMES:
        return COAST_CITY_CA
    if username in STAR_CITY_USERNAMES:
        return STAR_CITY_WA
    if username in WAKANDA_USERNAMES:
        return WAKANDA_GA
    if username in ATLANTIS_USERNAMES:
        return ATLANTIS_FL
    if username in MALIBU_STARK:
        return MALIBU_CA
    if username in NYC_MARVEL_STREET:
        return NYC
    if username in WESTCHESTER_XMEN:
        return WESTCHESTER_NY
    if username in Avengers_NYC:
        return NYC
    if username in FANTASTIC_FOUR_NYC:
        return NYC
    if username in GUARDIANS_NYC:
        return NYC
    if username.startswith("spider"):
        return NYC
    if publisher == "Marvel":
        return NYC
    return METROPOLIS_NY


def build_address(username: str, publisher: str, index: int) -> dict:
    city, state = resolve_city_state(username, publisher)
    line1 = LINE1_OVERRIDES.get(username, f"{100 + index} Hero Lane")

    # Use city name in line2 for famous fictional bases when not already a custom line1.
    line2 = None
    if city in {"Metropolis", "Gotham City", "Central City", "Coast City", "Star City", "Wakanda", "Atlantis"}:
        if username not in LINE1_OVERRIDES:
            line2 = f"{city} HQ"

    return {
        "label": "home",
        "line1": line1,
        "line2": line2,
        "city": city,
        "state_or_province": state,
        "postal_code": f"{10000 + index:05d}",
        "country_code": "USA",
    }
