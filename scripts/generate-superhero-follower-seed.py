#!/usr/bin/env python3
"""Generate database/seeds/006_user_superhero_followers.sql with 200 female follower seed users."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from female_follower_heroes import FEMALE_FOLLOWERS
from superhero_locations import build_address

_GEN_PATH = Path(__file__).resolve().parent / "generate-superhero-user-seed.py"
_spec = importlib.util.spec_from_file_location("hero_seed", _GEN_PATH)
_hero_seed = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_hero_seed)

normalize_username = _hero_seed.normalize_username


def load_existing_users() -> tuple[set[str], set[tuple[str, str]]]:
    query = """
SELECT lower(username),
       lower(name_json->>'first'),
       lower(name_json->>'last')
FROM public."user";
"""
    result = subprocess.run(
        ["psql", "-U", "postgres", "-d", "event_system_pro", "-t", "-A", "-F", "|"],
        input=query,
        capture_output=True,
        text=True,
        check=True,
        encoding="utf-8",
    )
    usernames: set[str] = set()
    names: set[tuple[str, str]] = set()
    for line in result.stdout.splitlines():
        parts = line.strip().split("|")
        if len(parts) >= 3 and parts[0]:
            usernames.add(parts[0])
            names.add((parts[1], parts[2]))
    return usernames, names


def build_additional_info(publisher: str, color1: str, color2: str) -> dict:
    return {
        "notes": f"{publisher} superhero follower seed user.",
        "preferred_contact": "email",
        "sex": "female",
        "primary-role": "follower",
        "color1": color1,
        "color2": color2,
    }


def sql_json(value: dict | list) -> str:
    return json.dumps(value, ensure_ascii=True).replace("'", "''")


def collect_rows(
    existing_users: set[str],
    existing_names: set[tuple[str, str]],
    limit: int = 200,
) -> list[tuple[str, str, str, str, str, str, str, str, str]]:
    seen_users = set(existing_users)
    seen_names = set(existing_names)
    rows: list[tuple[str, str, str, str, str, str, str, str, str]] = []

    for raw_username, first, last, publisher, color1, color2 in FEMALE_FOLLOWERS:
        username = normalize_username(raw_username)
        if not username or username in seen_users:
            continue

        name_key = (first.strip().lower(), last.strip().lower())
        if name_key in seen_names:
            continue

        seen_users.add(username)
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
        additional_info = build_additional_info(publisher, color1, color2)
        email = f"{username}@superhero.example.com"
        phone = [
            {
                "type": "mobile",
                "country_code": "1",
                "number": f"556{len(rows):07d}"[-10:],
                "primary": True,
            }
        ]
        address = [build_address(username, publisher, len(rows) + 200)]

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
        if len(rows) >= limit:
            break

    return rows


def main() -> None:
    existing_users, existing_names = load_existing_users()
    rows = collect_rows(existing_users, existing_names)
    if len(rows) < 200:
        raise SystemExit(f"Only collected {len(rows)} unique female followers; need 200.")

    out = (
        Path(__file__).resolve().parents[1]
        / "database"
        / "seeds"
        / "006_user_superhero_followers.sql"
    )
    lines = [
        "-- 200 Marvel and DC female follower seed users for local development.",
        "-- Username and plaintext password are identical; password is bcrypt-hashed on insert.",
        "-- All users have additional_info_json sex=female and primary-role=follower.",
        "-- Safe to re-run: skips rows when username already exists.",
        "--",
        "--   psql -U postgres -d event_system_pro -f database/seeds/006_user_superhero_followers.sql",
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
            "SELECT COUNT(*) AS superhero_follower_seed_users",
            "FROM public.\"user\"",
            "WHERE email LIKE '%@superhero.example.com'",
            "  AND additional_info_json->>'primary-role' = 'follower'",
            "  AND additional_info_json->>'sex' = 'female';",
            "",
        ]
    )

    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(rows)} users to {out}")


if __name__ == "__main__":
    main()
