#!/usr/bin/env python3
"""Generate database/seeds/005_user_superheroes.sql with 200 Marvel/DC seed users."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from superhero_locations import build_address

# username, first, last, publisher, sex (or None), color1 (or None), color2 (or None)
HEROES: list[tuple[str, str, str, str, str | None, str | None, str | None]] = [
    # DC
    ("superman", "Clark", "Kent", "DC", "male", "blue", "red"),
    ("batman", "Bruce", "Wayne", "DC", "male", "black", "yellow"),
    ("wonderwoman", "Diana", "Prince", "DC", "female", "red", "gold"),
    ("flash", "Barry", "Allen", "DC", "male", "red", "yellow"),
    ("greenlantern", "Hal", "Jordan", "DC", "male", "green", "black"),
    ("aquaman", "Arthur", "Curry", "DC", "male", "orange", "green"),
    ("cyborg", "Victor", "Stone", "DC", "male", "silver", "red"),
    ("shazam", "Billy", "Batson", "DC", "male", "red", "gold"),
    ("robin", "Dick", "Grayson", "DC", "male", "red", "green"),
    ("nightwing", "Richard", "Grayson", "DC", "male", "black", "blue"),
    ("batgirl", "Barbara", "Gordon", "DC", "female", "black", "yellow"),
    ("supergirl", "Kara", "Zor-El", "DC", "female", "blue", "red"),
    ("greenarrow", "Oliver", "Queen", "DC", "male", "green", "black"),
    ("blackcanary", "Dinah", "Lance", "DC", "female", "black", "yellow"),
    ("martianmanhunter", "J'onn", "J'onzz", "DC", "male", "green", "red"),
    ("hawkman", "Carter", "Hall", "DC", "male", "brown", "gold"),
    ("hawkgirl", "Shayera", "Hol", "DC", "female", "brown", "gold"),
    ("zatanna", "Zatanna", "Zatara", "DC", "female", "black", "white"),
    ("constantine", "John", "Constantine", "DC", "male", "beige", "black"),
    ("raven", "Rachel", "Roth", "DC", "female", "indigo", "black"),
    ("starfire", "Koriand'r", "Andr", "DC", "female", "purple", "orange"),
    ("beastboy", "Garfield", "Logan", "DC", "male", "green", "purple"),
    ("redhood", "Jason", "Todd", "DC", "male", "red", "black"),
    ("harleyquinn", "Harleen", "Quinzel", "DC", "female", "red", "black"),
    ("joker", "Jack", "Napier", "DC", "male", "purple", "green"),
    ("catwoman", "Selina", "Kyle", "DC", "female", "black", "purple"),
    ("poisonivy", "Pamela", "Isley", "DC", "female", "green", "red"),
    ("twoface", "Harvey", "Dent", "DC", "male", "orange", "purple"),
    ("riddler", "Edward", "Nygma", "DC", "male", "green", "purple"),
    ("scarecrow", "Jonathan", "Crane", "DC", "male", "brown", "yellow"),
    ("bane", "Antonio", "Daggett", "DC", "male", "black", "green"),
    ("darkseid", "Uxas", "Darkseid", "DC", "male", "gray", "blue"),
    ("brainiac", "Vril", "Dox", "DC", "male", "green", "purple"),
    ("lexluthor", "Alexander", "Luthor", "DC", "male", "purple", "green"),
    ("deathstroke", "Slade", "Wilson", "DC", "male", "orange", "black"),
    ("blackadam", "Teth", "Adam", "DC", "male", "black", "gold"),
    ("captaincold", "Leonard", "Snart", "DC", "male", "blue", "white"),
    ("reverseflash", "Eobard", "Thawne", "DC", "male", "yellow", "red"),
    ("kidflash", "Wally", "West", "DC", "male", "red", "yellow"),
    ("bluebeetle", "Jaime", "Reyes", "DC", "male", "blue", "black"),
    ("booster gold", "Michael", "Carter", "DC", "male", "gold", "blue"),
    ("question", "Vic", "Sage", "DC", "male", "blue", "black"),
    ("phantomstranger", "Jim", "Corrigan", "DC", "male", "purple", "black"),
    ("deadman", "Boston", "Brand", "DC", "male", "white", "red"),
    ("swampthing", "Alec", "Holland", "DC", "male", "green", "brown"),
    ("spectre", "Crispus", "Allen", "DC", "male", "white", "green"),
    ("doctorfate", "Kent", "Nelson", "DC", "male", "gold", "blue"),
    ("mister miracle", "Scott", "Free", "DC", "male", "green", "red"),
    ("big barda", "Barda", "Free", "DC", "female", "blue", "silver"),
    ("orion", "Orion", "New Genesis", "DC", "male", "red", "gray"),
    ("lobo", "Lobo", "Czarnia", "DC", "male", "black", "white"),
    ("static", "Virgil", "Hawkins", "DC", "male", "black", "yellow"),
    ("blacklightning", "Jefferson", "Pierce", "DC", "male", "blue", "black"),
    ("vixen", "Mari", "McCabe", "DC", "female", "orange", "gold"),
    ("firestorm", "Ronnie", "Raymond", "DC", "male", "red", "yellow"),
    ("atom", "Ray", "Palmer", "DC", "male", "red", "blue"),
    ("stargirl", "Courtney", "Whitmore", "DC", "female", "red", "white"),
    ("drmidnite", "Charles", "McNider", "DC", "male", "black", "red"),
    ("sandman", "Wesley", "Dodds", "DC", "male", "green", "brown"),
    ("wildcat", "Ted", "Grant", "DC", "male", "black", "yellow"),
    ("hourman", "Rex", "Tyler", "DC", "male", "black", "gold"),
    ("doctormid-nite", "Pieter", "Cross", "DC", "male", "black", "red"),
    ("redtornado", "John", "Smith", "DC", "male", "red", "yellow"),
    ("plasticman", "Patrick", "O'Brian", "DC", "male", "red", "yellow"),
    ("elongatedman", "Ralph", "Dibny", "DC", "male", "purple", "black"),
    ("metamorpho", "Rex", "Mason", "DC", "male", "orange", "purple"),
    ("doom patrol robotman", "Cliff", "Steele", "DC", "male", "red", "silver"),
    ("negativeman", "Larry", "Trainor", "DC", "male", "black", "white"),
    ("crazy jane", "Kay", "Challis", "DC", "female", "purple", "black"),
    ("animal man", "Buddy", "Baker", "DC", "male", "orange", "brown"),
    ("kamandi", "Kamandi", "Last Boy", "DC", "male", "red", "blue"),
    ("jonahhex", "Jonah", "Hex", "DC", "male", "brown", "gray"),
    ("lucifermorningstar", "Lucifer", "Morningstar", "DC", "male", "white", "gold"),
    ("deadshot", "Floyd", "Lawton", "DC", "male", "red", "black"),
    ("captainboomerang", "George", "Harkness", "DC", "male", "blue", "white"),
    ("enchantress", "June", "Moone", "DC", "female", "green", "gold"),
    ("killerfrost", "Caitlin", "Snow", "DC", "female", "blue", "white"),
    ("fire", "Beatriz", "da Costa", "DC", "female", "green", "red"),
    ("ice", "Tora", "Olafsdotter", "DC", "female", "blue", "white"),
    ("powergirl", "Kara", "Zor-L", "DC", "female", "white", "red"),
    ("huntress", "Helena", "Bertinelli", "DC", "female", "purple", "black"),
    ("batwoman", "Kate", "Kane", "DC", "female", "black", "red"),
    ("reneree", "Renee", "Montoya", "DC", "female", "brown", "black"),
    ("oracle", "Barbara", "Rand", "DC", "female", "black", "yellow"),
    ("timdrake", "Tim", "Drake", "DC", "male", "red", "black"),
    ("damianwayne", "Damian", "Wayne", "DC", "male", "green", "black"),
    ("stephaniebrown", "Stephanie", "Brown", "DC", "female", "purple", "black"),
    ("cassandracain", "Cassandra", "Cain", "DC", "female", "black", "gray"),
    ("blackmanta", "David", "Hyde", "DC", "male", "black", "silver"),
    ("oceanmaster", "Orm", "Curry", "DC", "male", "green", "gold"),
    ("sinestro", "Thaal", "Sinestro", "DC", "male", "yellow", "black"),
    ("atrocitus", "Atrocitus", "Rage", "DC", "male", "red", "black"),
    ("saintwalker", "Bro'Dee", "Walker", "DC", "male", "blue", "white"),
    ("star sapphire", "Carol", "Ferris", "DC", "female", "violet", "white"),
    ("lobo hunter", "Lobo", "Hunter", "DC", "male", "black", "red"),
    ("grannygoodness", "Granny", "Goodness", "DC", "female", "blue", "gray"),
    ("steppenwolf", "Steppen", "Wolf", "DC", "male", "gray", "blue"),
    ("parademon", "Parademon", "Apokolips", "DC", "male", "gray", "red"),
    # Marvel
    ("ironman", "Tony", "Stark", "Marvel", "male", "red", "gold"),
    ("captainamerica", "Steve", "Rogers", "Marvel", "male", "blue", "red"),
    ("spiderman", "Peter", "Parker", "Marvel", "male", "red", "blue"),
    ("hulk", "Bruce", "Banner", "Marvel", "male", "green", "purple"),
    ("thor", "Donald", "Blake", "Marvel", "male", "red", "silver"),
    ("blackwidow", "Natasha", "Romanoff", "Marvel", "female", "black", "red"),
    ("hawkeye", "Clint", "Barton", "Marvel", "male", "purple", "black"),
    ("scarletwitch", "Wanda", "Maximoff", "Marvel", "female", "red", "pink"),
    ("vision", "Victor", "Shade", "Marvel", "male", "red", "green"),
    ("falcon", "Sam", "Wilson", "Marvel", "male", "red", "white"),
    ("wintersoldier", "James", "Buchanan", "Marvel", "male", "black", "silver"),
    ("antman", "Scott", "Lang", "Marvel", "male", "red", "black"),
    ("wasp", "Hope", "van Dyne", "Marvel", "female", "yellow", "black"),
    ("blackpanther", "T'Challa", "Udaku", "Marvel", "male", "black", "purple"),
    ("doctorstrange", "Stephen", "Strange", "Marvel", "male", "blue", "red"),
    ("captainmarvel", "Carol", "Danvers", "Marvel", "female", "red", "blue"),
    ("msmarvel", "Kamala", "Khan", "Marvel", "female", "red", "blue"),
    ("shehulk", "Jennifer", "Walters", "Marvel", "female", "green", "purple"),
    ("daredevil", "Matt", "Murdock", "Marvel", "male", "red", "black"),
    ("punisher", "Frank", "Castle", "Marvel", "male", "black", "white"),
    ("lukecage", "Carl", "Lucas", "Marvel", "male", "yellow", "black"),
    ("ironfist", "Danny", "Rand", "Marvel", "male", "green", "gold"),
    ("jessicajones", "Jessica", "Jones", "Marvel", "female", "purple", "white"),
    ("ghostrider", "Johnny", "Blaze", "Marvel", "male", "black", "orange"),
    ("silver surfer", "Norrin", "Radd", "Marvel", "male", "silver", "black"),
    ("fantasticfour mr", "Reed", "Richards", "Marvel", "male", "blue", "white"),
    ("invisiblewoman", "Susan", "Storm", "Marvel", "female", "blue", "white"),
    ("humantorch", "Johnny", "Storm", "Marvel", "male", "orange", "yellow"),
    ("thething", "Benjamin", "Grimm", "Marvel", "male", "orange", "brown"),
    ("deadpool", "Wade", "Wilson", "Marvel", "male", "red", "black"),
    ("wolverine", "James", "Howlett", "Marvel", "male", "yellow", "blue"),
    ("storm", "Ororo", "Munroe", "Marvel", "female", "white", "gold"),
    ("cyclops", "Scott", "Summers", "Marvel", "male", "blue", "yellow"),
    ("jeangrey", "Jean", "Grey", "Marvel", "female", "gold", "green"),
    ("professorx", "Charles", "Xavier", "Marvel", "male", "green", "gold"),
    ("magneto", "Max", "Eisenhardt", "Marvel", "male", "red", "purple"),
    ("rogue", "Anna Marie", "LeBeau", "Marvel", "female", "green", "yellow"),
    ("gambit", "Remy", "LeBeau", "Marvel", "male", "purple", "pink"),
    ("nightcrawler", "Kurt", "Wagner", "Marvel", "male", "blue", "black"),
    ("colossus", "Piotr", "Rasputin", "Marvel", "male", "red", "silver"),
    ("iceman", "Bobby", "Drake", "Marvel", "male", "blue", "white"),
    ("beast", "Henry", "McCoy", "Marvel", "male", "blue", "black"),
    ("kittypryde", "Katherine", "Pryde", "Marvel", "female", "yellow", "black"),
    ("jubilee", "Jubilation", "Lee", "Marvel", "female", "yellow", "pink"),
    ("psylocke", "Elizabeth", "Braddock", "Marvel", "female", "purple", "blue"),
    ("cable", "Nathan", "Summers", "Marvel", "male", "blue", "silver"),
    ("domino", "Neena", "Thurman", "Marvel", "female", "black", "white"),
    ("cablegirl", "Hope", "Summers", "Marvel", "female", "yellow", "blue"),
    ("x23", "Laura", "Kinney", "Marvel", "female", "yellow", "blue"),
    ("dazzler", "Alison", "Blaire", "Marvel", "female", "silver", "pink"),
    ("bishop", "Lucas", "Bishop", "Marvel", "male", "red", "black"),
    ("sunspot", "Roberto", "da Costa", "Marvel", "male", "black", "gold"),
    ("magik", "Illyana", "Rasputin", "Marvel", "female", "gold", "black"),
    ("namor", "Namor", "McKenzie", "Marvel", "male", "green", "gold"),
    ("sentry", "Robert", "Reynolds", "Marvel", "male", "yellow", "blue"),
    ("moonknight", "Marc", "Spector", "Marvel", "male", "white", "silver"),
    ("blade", "Eric", "Brooks", "Marvel", "male", "black", "silver"),
    ("ghostspider", "Gwen", "Stacy", "Marvel", "female", "white", "pink"),
    ("milesmorales", "Miles", "Morales", "Marvel", "male", "black", "red"),
    ("venom", "Eddie", "Brock", "Marvel", "male", "black", "white"),
    ("green goblin", "Norman", "Osborn", "Marvel", "male", "green", "purple"),
    ("doctoroctopus", "Otto", "Octavius", "Marvel", "male", "green", "silver"),
    ("lizard", "Curt", "Connors", "Marvel", "male", "green", "brown"),
    ("kingpin", "Wilson", "Fisk", "Marvel", "male", "white", "black"),
    ("electro", "Max", "Dillon", "Marvel", "male", "green", "yellow"),
    ("sandman", "William", "Baker", "Marvel", "male", "brown", "tan"),
    ("vulture", "Adrian", "Toomes", "Marvel", "male", "green", "black"),
    ("mysterio", "Quentin", "Beck", "Marvel", "male", "green", "gold"),
    ("rhino", "Aleksei", "Sytsevich", "Marvel", "male", "gray", "white"),
    ("shocker", "Herman", "Schultz", "Marvel", "male", "yellow", "brown"),
    ("scorpion", "Mac", "Gargan", "Marvel", "male", "green", "brown"),
    ("kraven", "Sergei", "Kravinoff", "Marvel", "male", "brown", "yellow"),
    ("morbius", "Michael", "Morbius", "Marvel", "male", "black", "red"),
    ("nova", "Richard", "Rider", "Marvel", "male", "gold", "black"),
    ("starlord", "Peter", "Quill", "Marvel", "male", "red", "blue"),
    ("gamora", "Gamora", "Zen Whoberi", "Marvel", "female", "green", "black"),
    ("drax", "Drax", "Destroyer", "Marvel", "male", "green", "red"),
    ("rocket", "Rocket", "Raccoon", "Marvel", "male", "brown", "orange"),
    ("groot", "Groot", "Tree", "Marvel", "male", "brown", "green"),
    ("mantis", "Mantis", "Brandt", "Marvel", "female", "green", "black"),
    ("nebula", "Nebula", "Titan", "Marvel", "female", "blue", "purple"),
    ("yondu", "Yondu", "Udonta", "Marvel", "male", "blue", "red"),
    ("adamwarlock", "Adam", "Warlock", "Marvel", "male", "gold", "red"),
    ("thanos", "Thanos", "Titan", "Marvel", "male", "purple", "gold"),
    ("loki", "Loki", "Laufeyson", "Marvel", "male", "green", "gold"),
    ("hela", "Hela", "Asgard", "Marvel", "female", "black", "green"),
    ("valkyrie", "Brunnhilde", "Valkyrie", "Marvel", "female", "white", "gold"),
    ("korg", "Korg", "Kronan", "Marvel", "male", "gray", "brown"),
    ("miek", "Miek", "Sakaar", "Marvel", "male", "brown", "red"),
    ("shuri", "Shuri", "Udaku", "Marvel", "female", "black", "purple"),
    ("okoye", "Okoye", "Dora Milaje", "Marvel", "female", "red", "gold"),
    ("killmonger", "Erik", "Stevens", "Marvel", "male", "black", "gold"),
    ("mysterio2", "Ludwig", "Ravelli", "Marvel", "male", "silver", "green"),
    ("war machine", "James", "Rhodes", "Marvel", "male", "gray", "silver"),
    ("pepperpotts", "Virginia", "Potts", "Marvel", "female", "blue", "silver"),
    ("nickfury", "Nicholas", "Fury", "Marvel", "male", "black", "gray"),
    ("agentcoulson", "Phil", "Coulson", "Marvel", "male", "black", "gray"),
    ("mariahill", "Maria", "Hill", "Marvel", "female", "black", "gray"),
    ("sharoncarter", "Sharon", "Carter", "Marvel", "female", "white", "blue"),
    ("buckybarnes", "James", "Barnes", "Marvel", "male", "blue", "silver"),
    ("quicksilver", "Pietro", "Maximoff", "Marvel", "male", "blue", "white"),
    ("scarletspider", "Ben", "Reilly", "Marvel", "male", "red", "blue"),
    ("spiderwoman", "Jessica", "Drew", "Marvel", "female", "red", "yellow"),
    ("silk", "Cindy", "Moon", "Marvel", "female", "red", "black"),
    ("punisher2", "Frank", "Castle", "Marvel", "male", "gray", "black"),
    ("moon girl", "Lunella", "Lafayette", "Marvel", "female", "purple", "yellow"),
    ("devil dinosaur", "Devil", "Dinosaur", "Marvel", "male", "red", "orange"),
    ("americachavez", "America", "Chavez", "Marvel", "female", "red", "blue"),
    ("ironheart", "Riri", "Williams", "Marvel", "female", "red", "gold"),
    ("patriot", "Eli", "Bradley", "Marvel", "male", "blue", "white"),
    ("katebishop", "Kate", "Bishop", "Marvel", "female", "purple", "black"),
    ("yelena", "Yelena", "Belova", "Marvel", "female", "black", "white"),
    ("redguardian", "Alexei", "Shostakov", "Marvel", "male", "red", "white"),
    ("taskmaster", "Tony", "Masters", "Marvel", "male", "orange", "black"),
    ("ultron", "Ultron", "Prime", "Marvel", "male", "red", "silver"),
    ("vision2", "Vision", "Android", "Marvel", "male", "green", "gold"),
    ("wong", "Wong", "Master", "Marvel", "male", "red", "black"),
    ("ancientone", "Ancient", "One", "Marvel", None, "gold", "green"),
    ("mordo", "Karl", "Mordo", "Marvel", "male", "red", "black"),
    ("ghost", "Ava", "Starr", "Marvel", "female", "white", "gray"),
    ("yellowjacket", "Darren", "Cross", "Marvel", "male", "yellow", "black"),
    ("stature", "Cassie", "Lang", "Marvel", "female", "red", "black"),
    ("wiccan", "William", "Kaplan", "Marvel", "male", "blue", "white"),
    ("hulkling", "Theodore", "Altman", "Marvel", "male", "green", "gold"),
    ("speed", "Thomas", "Shepherd", "Marvel", "male", "red", "silver"),
    ("northstar", "Jean-Paul", "Beaubier", "Marvel", "male", "white", "black"),
    ("iceman2", "Robert", "Drake", "Marvel", "male", "white", "blue"),
    ("squirrelgirl", "Doreen", "Green", "Marvel", "female", "brown", "gray"),
    ("hellcat", "Patsy", "Walker", "Marvel", "female", "yellow", "blue"),
    ("white tiger", "Ava", "Ayala", "Marvel", "female", "white", "black"),
    ("ironlad", "Nathaniel", "Richards", "Marvel", "male", "red", "silver"),
    ("kang", "Nathaniel", "Richards", "Marvel", "male", "green", "purple"),
    ("immortus", "Nathaniel", "Richards", "Marvel", "male", "blue", "gold"),
    ("galactus", "Galan", "Galactus", "Marvel", "male", "purple", "blue"),
    ("silversurfer2", "Norrin", "Radd", "Marvel", "male", "chrome", "black"),
    ("dormammu", "Dormammu", "Dark", "Marvel", "male", "red", "orange"),
    ("shuma gorath", "Shuma", "Gorath", "Marvel", "male", "green", "yellow"),
    ("ghost rider robbie", "Robbie", "Reyes", "Marvel", "male", "blue", "orange"),
    ("punisher2099", "Jake", "Gallows", "Marvel", "male", "black", "red"),
    ("spidergwen", "Gwen", "Stacy", "Marvel", "female", "white", "pink"),
    ("spiderpunk", "Hobie", "Brown", "Marvel", "male", "red", "black"),
    ("spideruk", "William", "Braddock", "Marvel", "male", "blue", "red"),
    ("peniparker", "Peni", "Parker", "Marvel", "female", "pink", "black"),
    ("miguelohara", "Miguel", "O'Hara", "Marvel", "male", "blue", "red"),
    ("spidernoir", "Peter", "Parker", "Marvel", "male", "black", "gray"),
    ("spiderham", "Peter", "Porker", "Marvel", "male", "blue", "red"),
    ("sentry2", "Bob", "Reynolds", "Marvel", "male", "gold", "red"),
    ("blue marvel", "Adam", "Brashear", "Marvel", "male", "blue", "white"),
    ("spectrum", "Monica", "Rambeau", "Marvel", "female", "white", "gold"),
    ("photon", "Monica", "Rambeau", "Marvel", "female", "gold", "white"),
    ("binary", "Carol", "Danvers", "Marvel", "female", "white", "gold"),
    ("rogue2", "Rogue", "X-Men", "Marvel", "female", "yellow", "green"),
    ("mystique", "Raven", "Darkholme", "Marvel", "female", "blue", "yellow"),
    ("sabretooth", "Victor", "Creed", "Marvel", "male", "orange", "brown"),
    ("omega red", "Arkady", "Rossovich", "Marvel", "male", "red", "silver"),
    ("juggernaut", "Cain", "Marko", "Marvel", "male", "red", "brown"),
    ("blob", "Fred", "Dukes", "Marvel", "male", "purple", "white"),
    ("toad", "Mortimer", "Toynbee", "Marvel", "male", "green", "brown"),
    ("pyro", "St. John", "Allerdyce", "Marvel", "male", "yellow", "orange"),
    ("ladydeathstrike", "Yuriko", "Oyama", "Marvel", "female", "silver", "red"),
    ("omega sentinel", "Karima", "Shapandar", "Marvel", "female", "gold", "red"),
    ("sentinel", "Sentinel", "Prime", "Marvel", "male", "purple", "pink"),
    ("hulk red", "Thaddeus", "Ross", "Marvel", "male", "red", "black"),
    ("abomination", "Emil", "Blonsky", "Marvel", "male", "green", "brown"),
    ("leader", "Samuel", "Sterns", "Marvel", "male", "green", "purple"),
    ("modok", "George", "Tarlton", "Marvel", "male", "yellow", "purple"),
    ("redskull", "Johann", "Schmidt", "Marvel", "male", "red", "black"),
    ("baronzemo", "Helmut", "Zemo", "Marvel", "male", "purple", "black"),
    ("whiplash", "Ivan", "Vanko", "Marvel", "male", "silver", "black"),
    ("mandarin", "Xin", "Zhang", "Marvel", "male", "green", "gold"),
    ("fin fang foom", "Fin", "Fang Foom", "Marvel", "male", "green", "yellow"),
    ("clea", "Clea", "Strange", "Marvel", "female", "purple", "black"),
    ("hellstorm", "Daimon", "Hellstrom", "Marvel", "male", "red", "black"),
    ("satana", "Satana", "Hellstrom", "Marvel", "female", "red", "black"),
    ("hellcat2", "Hellcat", "Walker", "Marvel", "female", "yellow", "black"),
    ("manthing", "Theodore", "Sallis", "Marvel", "male", "green", "brown"),
    ("howardduck", "Howard", "Duck", "Marvel", "male", "green", "white"),
    ("squirrelgirl2", "Doreen", "Green", "Marvel", "female", "orange", "brown"),
]

def normalize_username(raw: str) -> str:
    return "".join(ch for ch in raw.lower() if ch.isalnum())[:64]


def build_additional_info(
    publisher: str,
    sex: str | None,
    color1: str | None,
    color2: str | None,
) -> dict:
    info: dict[str, str] = {
        "notes": f"{publisher} superhero seed user.",
        "preferred_contact": "email",
    }
    if sex:
        info["sex"] = sex
        info["primary-role"] = "leader" if sex == "male" else "follower"
    if color1:
        info["color1"] = color1
    if color2:
        info["color2"] = color2
    return info


def sql_json(value: dict | list) -> str:
    return json.dumps(value, ensure_ascii=True).replace("'", "''")


def main() -> None:
    seen: set[str] = set()
    seen_names: set[tuple[str, str]] = set()
    rows: list[tuple[str, str, str, str, str, str, str, str, str]] = []

    for raw_username, first, last, publisher, sex, color1, color2 in HEROES:
        username = normalize_username(raw_username)
        if not username or username in seen:
            continue

        name_key = (first.strip().lower(), last.strip().lower())
        if name_key in seen_names:
            continue

        seen.add(username)
        seen_names.add(name_key)

        display = f"{first} {last}".strip()
        name_json = {
            "prefix": None,
            "first": first,
            "middle": None,
            "last": last,
            "suffix": None,
            "display": display,
        }
        additional_info = build_additional_info(publisher, sex, color1, color2)
        email = f"{username}@superhero.example.com"
        phone = [
            {
                "type": "mobile",
                "country_code": "1",
                "number": f"555{len(rows):07d}"[-10:],
                "primary": True,
            }
        ]
        address = [build_address(username, publisher, len(rows))]

        rows.append(
            (
                username,
                sql_json(name_json),
                email,
                sql_json(phone),
                sql_json(additional_info),
                sql_json(address),
                sql_json({}),
                sql_json({"interested": False, "roles": [], "availability": None}),
                sql_json({}),
            )
        )
        if len(rows) >= 200:
            break

    if len(rows) < 200:
        raise SystemExit(f"Only collected {len(rows)} unique heroes; need 200.")

    out = Path(__file__).resolve().parents[1] / "database" / "seeds" / "005_user_superheroes.sql"
    update_out = (
        Path(__file__).resolve().parents[1]
        / "database"
        / "seeds"
        / "005a_update_superhero_addresses.sql"
    )
    lines = [
        "-- 200 Marvel and DC superhero seed users for local development.",
        "-- Username and plaintext password are identical; password is bcrypt-hashed on insert.",
        "-- Safe to re-run: skips rows when username already exists.",
        "--",
        "--   psql -U postgres -d event_system_pro -f database/seeds/005_user_superheroes.sql",
        "",
        "\\connect event_system_pro",
        "",
        "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
        "",
    ]

    for username, name_json, email, phone, additional_info, address, social, volunteer, recovery in rows:
        lines.extend(
            [
                "INSERT INTO public.\"user\" (",
                "  username,",
                "  password_encrypted,",
                "  name_json,",
                "  email,",
                "  phone_numbers_json,",
                "  social_media_json,",
                "  volunteer_json,",
                "  password_recovery_json,",
                "  additional_info_json,",
                "  addresses_json,",
                "  active,",
                "  created_by,",
                "  updated_by",
                ")",
                "SELECT",
                f"  '{username}',",
                f"  crypt('{username}', gen_salt('bf')),",
                f"  '{name_json}'::json,",
                f"  '{email}',",
                f"  '{phone}'::json,",
                f"  '{social}'::json,",
                f"  '{volunteer}'::json,",
                f"  '{recovery}'::json,",
                f"  '{additional_info}'::json,",
                f"  '{address}'::json,",
                "  TRUE,",
                "  'seed',",
                "  'seed'",
                "WHERE NOT EXISTS (",
                f"  SELECT 1 FROM public.\"user\" WHERE username = '{username}'",
                ");",
                "",
            ]
        )

    lines.extend(
        [
            "SELECT COUNT(*) AS superhero_seed_users",
            "FROM public.\"user\"",
            "WHERE email LIKE '%@superhero.example.com';",
            "",
        ]
    )

    out.write_text("\n".join(lines), encoding="utf-8")

    update_lines = [
        "-- Update addresses_json for existing superhero seed users.",
        "-- Run: psql -U postgres -d event_system_pro -f database/seeds/005a_update_superhero_addresses.sql",
        "",
        "\\connect event_system_pro",
        "",
    ]

    for username, _, _, _, _, address, *_ in rows:
        update_lines.extend(
            [
                "UPDATE public.\"user\"",
                f"SET addresses_json = '{address}'::json,",
                "    updated_by = 'seed'",
                f"WHERE username = '{username}';",
                "",
            ]
        )

    update_lines.extend(
        [
            "SELECT username, addresses_json->0->>'city' AS city, addresses_json->0->>'state_or_province' AS state",
            "FROM public.\"user\"",
            "WHERE email LIKE '%@superhero.example.com'",
            "ORDER BY username",
            "LIMIT 10;",
            "",
        ]
    )

    update_out.write_text("\n".join(update_lines), encoding="utf-8")
    print(f"Wrote {len(rows)} users to {out}")
    print(f"Wrote address updates to {update_out}")


if __name__ == "__main__":
    main()
