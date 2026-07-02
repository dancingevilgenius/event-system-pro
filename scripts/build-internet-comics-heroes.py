#!/usr/bin/env python3
"""Fetch DC/Marvel/Image characters from the web and write internet_comics_heroes.py."""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

OUT_PATH = Path(__file__).resolve().parent / "internet_comics_heroes.py"
AKABAB_URL = "https://akabab.github.io/superhero-api/api/all.json"

WIKI_CATEGORIES: dict[str, str] = {
    "Category:Marvel_Comics_superheroes": "Marvel",
    "Category:Marvel_Comics_supervillains": "Marvel",
    "Category:DC_Comics_superheroes": "DC",
    "Category:DC_Comics_supervillains": "DC",
    "Category:Image_Comics_superheroes": "Image",
    "Category:Image_Comics_characters": "Image",
    "Category:Image_Comics_supervillains": "Image",
}

ROMAN_NUMERAL_SUFFIX = re.compile(
    r"\s+(I{1,3}|IV|VI{0,3}|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX)$",
    re.IGNORECASE,
)
BLOCKED_LAST_NAMES = {
    "ashford",
    "blackwood",
    "chambers",
    "donovan",
    "caldwell",
    "holloway",
    "mercer",
    "sinclair",
    "sinclaire",
    "ellsworth",
}

HeroRow = tuple[str, str, str, str, str | None, str | None, str | None]


def has_numeric_marker(text: str) -> bool:
    text = text.strip()
    if not text:
        return True
    if re.search(r"\d", text):
        return True
    if ROMAN_NUMERAL_SUFFIX.search(text):
        return True
    return False


def normalize_username(raw: str) -> str:
    return "".join(ch for ch in raw.lower() if ch.isalnum())[:64]


def map_akabab_publisher(raw: str | None) -> str | None:
    if not raw:
        return None
    lower = raw.lower()
    if "marvel" in lower:
        return "Marvel"
    if "dc comics" in lower or lower == "dc":
        return "DC"
    if "image comics" in lower or lower == "image":
        return "Image"
    return None


def split_full_name(full_name: str, codename: str) -> tuple[str, str]:
    full_name = full_name.strip()
    if full_name and full_name != "-":
        parts = full_name.split()
        if len(parts) >= 2:
            return parts[0], " ".join(parts[1:])
        if len(parts) == 1:
            return parts[0], codename.split()[-1] if " " in codename else "Character"

    parts = codename.replace("-", " ").split()
    if len(parts) >= 2:
        return parts[0], " ".join(parts[1:])
    return codename, "Character"


def map_gender(raw: str | None) -> str | None:
    if not raw:
        return None
    lower = raw.lower()
    if lower == "male":
        return "male"
    if lower == "female":
        return "female"
    return None


def clean_wiki_title(title: str) -> str | None:
    if title.startswith("List of"):
        return None
    if title.startswith("Category:"):
        return None
    if title.endswith(" comics)"):
        title = title[: title.rindex(" (")]
    if has_numeric_marker(title):
        return None
    return title


def wiki_name_parts(title: str) -> tuple[str, str]:
    title = title.replace("-", " ")
    parts = title.split()
    if len(parts) >= 2:
        return parts[0], " ".join(parts[1:])
    return title, "Character"


def fetch_json(url: str) -> object:
    request = urllib.request.Request(url, headers={"User-Agent": "event-system-pro-seed-builder/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_wiki_category_members(category: str) -> list[str]:
    titles: list[str] = []
    continue_token: str | None = None

    while True:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": category,
            "cmlimit": "500",
            "format": "json",
        }
        if continue_token:
            params["cmcontinue"] = continue_token
        url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
        payload = fetch_json(url)
        members = payload.get("query", {}).get("categorymembers", [])
        for member in members:
            if member.get("ns") == 0:
                titles.append(member["title"])
        continue_token = payload.get("continue", {}).get("cmcontinue")
        if not continue_token:
            break

    return titles


def fetch_akabab_rows() -> list[HeroRow]:
    heroes = fetch_json(AKABAB_URL)
    rows: list[HeroRow] = []

    for hero in heroes:
        codename = hero.get("name", "").strip()
        if not codename or has_numeric_marker(codename):
            continue

        publisher = map_akabab_publisher(hero.get("biography", {}).get("publisher"))
        if not publisher:
            continue

        biography = hero.get("biography", {})
        first, last = split_full_name(biography.get("fullName", ""), codename)
        if last.lower() in BLOCKED_LAST_NAMES:
            continue

        appearance = hero.get("appearance", {})
        sex = map_gender(appearance.get("gender"))
        color1 = (appearance.get("eyeColor") or "").strip().lower() or None
        color2 = (appearance.get("hairColor") or "").strip().lower() or None
        if color1 in {"", "null", "-"}:
            color1 = None
        if color2 in {"", "null", "-", "no hair"}:
            color2 = None

        rows.append((codename, first, last, publisher, sex, color1, color2))

    return rows


def fetch_wiki_rows() -> list[HeroRow]:
    rows: list[HeroRow] = []
    for category, publisher in WIKI_CATEGORIES.items():
        for title in fetch_wiki_category_members(category):
            codename = clean_wiki_title(title)
            if not codename:
                continue
            first, last = wiki_name_parts(codename)
            if last.lower() in BLOCKED_LAST_NAMES:
                continue
            rows.append((codename, first, last, publisher, None, None, None))
    return rows


def dedupe_rows(rows: list[HeroRow]) -> list[HeroRow]:
    seen_keys: set[tuple[str, str, str]] = set()
    seen_usernames: set[str] = set()
    unique: list[HeroRow] = []

    for codename, first, last, publisher, sex, color1, color2 in rows:
        username = normalize_username(codename)
        if not username or has_numeric_marker(username):
            continue
        person_key = (publisher, first.strip().lower(), last.strip().lower())
        if person_key in seen_keys:
            continue
        if username in seen_usernames:
            continue
        seen_keys.add(person_key)
        seen_usernames.add(username)
        unique.append((codename, first, last, publisher, sex, color1, color2))

    unique.sort(key=lambda row: normalize_username(row[0]))
    return unique


def render_python(rows: list[HeroRow]) -> str:
    timestamp = datetime.now(timezone.utc).isoformat()
    lines = [
        '"""Curated DC/Marvel/Image characters scraped from public datasets and wiki categories."""',
        "",
        f"# Generated: {timestamp}",
        "# Sources: akabab/superhero-api, English Wikipedia category members",
        "# username, first, last, publisher, sex, color1, color2",
        "INTERNET_COMICS_HEROES: list[tuple[str, str, str, str, str | None, str | None, str | None]] = [",
    ]

    for codename, first, last, publisher, sex, color1, color2 in rows:
        sex_repr = repr(sex)
        color1_repr = repr(color1)
        color2_repr = repr(color2)
        lines.append(
            f"    ({codename!r}, {first!r}, {last!r}, {publisher!r}, {sex_repr}, {color1_repr}, {color2_repr}),"
        )

    lines.extend(["]", ""])
    return "\n".join(lines)


def main() -> None:
    akabab_rows = fetch_akabab_rows()
    wiki_rows = fetch_wiki_rows()
    rows = dedupe_rows(akabab_rows + wiki_rows)
    OUT_PATH.write_text(render_python(rows), encoding="utf-8")
    print(f"Wrote {len(rows)} internet comics heroes to {OUT_PATH}")
    print(f"  akabab rows kept: {len(akabab_rows)}")
    print(f"  wiki rows scanned: {len(wiki_rows)}")
    by_pub = {}
    for *_, publisher, _, _, _ in rows:
        by_pub[publisher] = by_pub.get(publisher, 0) + 1
    print(f"  by publisher: {by_pub}")


if __name__ == "__main__":
    main()
