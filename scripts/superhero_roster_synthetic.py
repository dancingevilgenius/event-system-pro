"""Synthetic superhero/supervillain roster entries to supplement the core Marvel/DC list."""

from __future__ import annotations

import itertools
import random
from typing import Iterator

HeroTuple = tuple[str, str, str, str, str | None, str | None, str | None]

# Codename building blocks (hero and villain themed).
_PREFIXES = (
    "night", "shadow", "storm", "iron", "steel", "silver", "golden", "crimson",
    "azure", "emerald", "onyx", "scarlet", "violet", "phantom", "spectral",
    "cosmic", "stellar", "lunar", "solar", "nova", "quantum", "atomic", "ionic",
    "thunder", "lightning", "blizzard", "inferno", "ember", "frost", "tidal",
    "grave", "doom", "chaos", "venom", "toxic", "razor", "bullet", "cannon",
    "savage", "feral", "primal", "ancient", "mystic", "arcane", "eldritch",
    "cyber", "neon", "turbo", "hyper", "ultra", "omega", "alpha", "delta",
    "rogue", "renegade", "outlaw", "warden", "sentinel", "paladin", "ranger",
    "hunter", "stalker", "reaper", "wraith", "banshee", "gargoyle", "goblin",
    "titan", "colossus", "goliath", "valkyrie", "samurai", "ronin", "ninja",
    "captain", "doctor", "lord", "lady", "baron", "duke", "king", "queen",
    "agent", "marshal", "general", "commander", "major", "sergeant",
)

_SUFFIXES = (
    "strike", "blade", "fang", "claw", "fist", "hammer", "shield", "arrow",
    "bolt", "spark", "flare", "beam", "wave", "pulse", "surge", "rush",
    "fury", "rage", "wrath", "havoc", "ruin", "doom", "bane", "curse",
    "soul", "spirit", "ghost", "shade", "mirage", "echo", "whisper", "howl",
    "wing", "hawk", "eagle", "raven", "wolf", "panther", "viper", "cobra",
    "dragon", "phoenix", "griffin", "hydra", "kraken", "leviathan", "golem",
    "knight", "warden", "keeper", "guardian", "defender", "avenger", "champion",
    "slayer", "breaker", "crusher", "smasher", "stomper", "ripper", "render",
    "mind", "brain", "eye", "hand", "heart", "bone", "skull", "mask",
    "storm", "tempest", "cyclone", "quake", "shock", "blast", "burn", "freeze",
    "hex", "spell", "sigil", "rune", "oracle", "prophet", "seer", "sage",
)

_FIRST_NAMES = (
    "Ethan", "Mia", "Noah", "Ava", "Liam", "Sophia", "Owen", "Isla", "Caleb",
    "Nora", "Julian", "Elena", "Miles", "Clara", "Felix", "Hazel", "Adrian",
    "Iris", "Simon", "Ruby", "Victor", "Paige", "Grant", "Tessa", "Dean",
    "Vera", "Colin", "Jade", "Marcus", "Leah", "Nolan", "Gwen", "Tristan",
    "Selene", "Derek", "Alina", "Rafael", "Bianca", "Harper", "Jonah", "Mira",
    "Cedric", "Lena", "Andre", "Sasha", "Malik", "Priya", "Kenji", "Yara",
    "Rosa", "Hugo", "Ingrid", "Pascal", "Freya", "Dante", "Keiko", "Amir",
    "Lucia", "Tobias", "Anika", "Reid", "Carmen", "Elliot", "Naomi", "Sterling",
    "Zara", "Gideon", "Helena", "Roman", "Vivian", "Quinn", "Marcel", "Talia",
    "Desmond", "Ariana", "Brock", "Celeste", "Warren", "Delilah", "Spencer",
    "Monroe", "Beckett", "Soraya", "Landon", "Petra", "Cassius", "Rowan",
)

_LAST_NAMES = (
    "Caldwell", "Mercer", "Holloway", "Sinclair", "Ashford", "Blackwood",
    "Chambers", "Donovan", "Ellsworth", "Fairchild", "Granger", "Hawthorne",
    "Ingram", "Jarrett", "Kensington", "Langford", "Montague", "Northcott",
    "Oakley", "Pemberton", "Quincy", "Redmond", "Sterling", "Thornton",
    "Underwood", "Vance", "Whitaker", "York", "Zimmerman", "Barrett", "Crosby",
    "Dalton", "Everett", "Fitzgerald", "Gallagher", "Harrington", "Iverson",
    "Jamison", "Keller", "Lancaster", "Morrison", "Nash", "Osborn", "Prescott",
    "Ramsey", "Sullivan", "Townsend", "Upton", "Valdez", "Winters", "Xavier",
    "Yates", "Zuniga", "Bishop", "Carver", "Dunham", "Easton", "Frost", "Gentry",
    "Holbrook", "Irving", "Jennings", "Kendrick", "Lowell", "Matthews",
    "Norwood", "Porter", "Reeves", "Sawyer", "Trask", "Vaughn", "Wheeler",
    "Baldwin", "Corbett", "Drummond", "Emerson", "Finch", "Garrett", "Huxley",
    "Kingsley", "Lennox", "Marlowe", "Neville", "Ortega", "Pritchard", "Quinlan",
    "Rutherford", "Shelton", "Talbot", "Vernon", "Wainwright", "Yorkson",
)

_COLORS = (
    ("red", "black"), ("blue", "silver"), ("green", "gold"), ("purple", "black"),
    ("orange", "brown"), ("yellow", "blue"), ("black", "white"), ("white", "red"),
    ("crimson", "gold"), ("teal", "gray"), ("indigo", "silver"), ("pink", "black"),
)

_PUBLISHERS = ("Marvel", "DC", "Independent")


def iter_synthetic_heroes() -> Iterator[HeroTuple]:
    """Yield deterministic synthetic hero/villain tuples (username, first, last, ...)."""
    rng = random.Random(0x5EED_1000)
    combos = list(itertools.product(_PREFIXES, _SUFFIXES))
    rng.shuffle(combos)

    for idx, (prefix, suffix) in enumerate(combos):
        raw_username = prefix + suffix
        first = _FIRST_NAMES[idx % len(_FIRST_NAMES)]
        last = _LAST_NAMES[(idx // len(_FIRST_NAMES)) % len(_LAST_NAMES)]
        publisher = _PUBLISHERS[idx % len(_PUBLISHERS)]
        sex = "female" if idx % 2 else "male"
        color1, color2 = _COLORS[idx % len(_COLORS)]
        yield (raw_username, first, last, publisher, sex, color1, color2)

    # Numbered variants if the Cartesian product is exhausted.
    variant = 0
    while True:
        prefix = _PREFIXES[variant % len(_PREFIXES)]
        suffix = _SUFFIXES[(variant // len(_PREFIXES)) % len(_SUFFIXES)]
        raw_username = f"{prefix}{suffix}{variant + 1}"
        first = _FIRST_NAMES[(variant + 13) % len(_FIRST_NAMES)]
        last = _LAST_NAMES[(variant + 29) % len(_LAST_NAMES)]
        publisher = _PUBLISHERS[variant % len(_PUBLISHERS)]
        sex = "female" if variant % 3 == 0 else "male"
        color1, color2 = _COLORS[variant % len(_COLORS)]
        yield (raw_username, first, last, publisher, sex, color1, color2)
        variant += 1
