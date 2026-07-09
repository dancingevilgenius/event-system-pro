#!/usr/bin/env python3
"""Generate database/seeds/005b_fix_character_superhero_users.sql in-place user fixes."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from replacement_dc_heroes import prefixed_replacement_heroes

_SEED_MODULE_PATH = Path(__file__).resolve().parent / "generate-superhero-user-seed.py"
_SPEC = importlib.util.spec_from_file_location("generate_superhero_user_seed", _SEED_MODULE_PATH)
_MODULE = importlib.util.module_from_spec(_SPEC)
assert _SPEC.loader is not None
_SPEC.loader.exec_module(_MODULE)
build_additional_info = _MODULE.build_additional_info

OUT_PATH = (
    Path(__file__).resolve().parents[1]
    / "database"
    / "seeds"
    / "005b_fix_character_superhero_users.sql"
)


def sql_json(value: dict) -> str:
    return json.dumps(value, ensure_ascii=True).replace("'", "''")


def sql_literal(value: str) -> str:
    return value.replace("'", "''")


def query_character_user_count() -> int:
    result = subprocess.run(
        [
            "psql",
            "-U",
            "postgres",
            "-d",
            "event_system_pro",
            "-t",
            "-A",
            "-c",
            "SELECT count(*) FROM public.\"user\" "
            "WHERE lower(trim(name_json->>'last')) = 'character';",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return int(result.stdout.strip())


def main() -> None:
    character_count = query_character_user_count()
    if character_count == 0:
        print("No Character last-name users found; skipping seed generation.")
        return

    replacements = prefixed_replacement_heroes()[:character_count]
    if len(replacements) < character_count:
        raise RuntimeError(
            f"Need {character_count} replacement heroes, only have {len(replacements)}."
        )

    value_rows: list[str] = []
    for index, (username, first, last, publisher, sex, color1, color2) in enumerate(
        replacements,
        start=1,
    ):
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
        email = f"{username}@superhero.com"
        value_rows.append(
            "("
            f"{index}, "
            f"'{sql_literal(username)}', "
            f"'{sql_literal(email)}', "
            f"'{sql_json(name_json)}'::json, "
            f"'{sql_json(additional_info)}'::json"
            ")"
        )

    lines = [
        "-- Replace superhero users with last name 'Character' (Squadron Supreme, Crime Syndicate,",
        "-- Fatal Five, Lantern corps). Keeps user_id; updates username, email, name_json, password.",
        "--",
        "--   psql -U postgres -d event_system_pro -f database/seeds/005b_fix_character_superhero_users.sql",
        "",
        "\\connect event_system_pro",
        "",
        "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
        "",
        "BEGIN;",
        "",
        "CREATE TEMP TABLE _character_replacements (",
        "  rn int PRIMARY KEY,",
        "  new_username varchar(128) NOT NULL,",
        "  new_email varchar(256) NOT NULL,",
        "  name_json json NOT NULL,",
        "  additional_info_json json NOT NULL",
        ") ON COMMIT DROP;",
        "",
        "INSERT INTO _character_replacements (rn, new_username, new_email, name_json, additional_info_json)",
        "VALUES",
        ",\n".join(value_rows) + ";",
        "",
        "WITH character_users AS (",
        "  SELECT",
        "    user_id,",
        "    username AS old_username,",
        "    row_number() OVER (ORDER BY user_id) AS rn",
        "  FROM public.\"user\"",
        "  WHERE lower(trim(name_json->>'last')) = 'character'",
        ")",
        "UPDATE public.\"user\" AS u",
        "SET",
        "  username = repl.new_username,",
        "  email = repl.new_email,",
        "  name_json = repl.name_json,",
        "  additional_info_json = repl.additional_info_json,",
        "  password_encrypted = crypt(repl.new_username, gen_salt('bf')),",
        "  modified_by = 'c-agent',",
        "  modified_date = date_trunc('second', CURRENT_TIMESTAMP)",
        "FROM character_users AS c",
        "JOIN _character_replacements AS repl ON repl.rn = c.rn",
        "WHERE u.user_id = c.user_id;",
        "",
        "COMMIT;",
        "",
        "SELECT count(*) AS remaining_character_last_names",
        "FROM public.\"user\"",
        "WHERE lower(trim(name_json->>'last')) = 'character';",
        "",
    ]

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({character_count} user fixes)")


if __name__ == "__main__":
    main()
