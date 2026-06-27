#!/usr/bin/env python3
"""Generate database/seeds/011_event_fictional_instances.sql for fictional event_group rows."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "database" / "seeds" / "011_event_fictional_instances.sql"

# event_group_code, full_name, short_name, optional (country, state, city)
GROUPS: list[tuple[str, str, str, tuple[str, str, str] | None]] = [
    ("BRINDLEWICK_CLASSIC", "Brindlewick Classic", "Brindlewick", None),
    ("LARKSPUR_OPEN", "Larkspur Open", "Larkspur", ("USA", "CA", "Larkspur")),
    ("MARIGLEN_INVITATIONAL", "Mariglen Invitational", "Mariglen", None),
    ("SELWICK_CONGRESS", "Selwick Congress", "Selwick", None),
    ("THORNBAY_COUPLES_CHAMPIONSHIP", "Thornbay Couples Championship", "Thornbay", None),
    ("VELLGRIMM_LONGSWORD_OPEN", "Vellgrimm Longsword Open", "Vellgrimm", None),
    ("CINDERHOLT_HEMA_SYMPOSIUM", "Cinderholt HEMA Symposium", "Cinderholt", None),
    ("BRAMBLEGATE_RAPIER_CUP", "Bramblegate Rapier Cup", "Bramblegate", None),
    ("MOSSWICK_STEEL_ACADEMY_OPEN", "Mosswick Steel Academy Open", "Mosswick", None),
    ("HOLLOWFEN_BLADE_CONGRESS", "Hollowfen Blade Congress", "Hollowfen", None),
    ("RIVETON_KART_GRAND_PRIX", "Riveton Kart Grand Prix", "Riveton", None),
    ("GLIMMERWICK_SPRINT_CUP", "Glimmerwick Sprint Cup", "Glimmerwick", None),
    ("DRAKEWELL_OVAL_CLASSIC", "Drakewell Oval Classic", "Drakewell", None),
    ("QUARRYLANE_VELOCITY_200", "Quarrylane Velocity 200", "Quarrylane", None),
    ("FOXMERE_KART_INVITATIONAL", "Foxmere Kart Invitational", "Foxmere", None),
    ("ROBOT_RIOT", "Robot Riot", "Robot Riot", None),
    ("SERVO_SLAM", "Servo Slam", "Servo Slam", None),
    ("RIVET_RUMBLE", "Rivet Rumble", "Rivet Rumble", None),
    ("CIRCUIT_CARNAGE", "Circuit Carnage", "Circuit Carnage", None),
    ("GASKET_GAUNTLET", "Gasket Gauntlet", "Gasket Gauntlet", None),
    ("PORTLAND_PLASMA_PRIX", "Portland Plasma Prix", "Portland", ("USA", "OR", "Portland")),
    ("CHICAGO_CHROME_CLASH", "Chicago Chrome Clash", "Chicago", ("USA", "IL", "Chicago")),
    ("STELLAR_SHOWDOWN", "Stellar Showdown", "Stellar Showdown", None),
    ("NEON_NEXUS", "Neon Nexus", "Neon Nexus", None),
    ("MERIDIAN_MELEE", "Meridian Melee", "Meridian Melee", None),
]

DAYS = (3, 4, 5)
# Past / current / future instances (~12 months apart).
START_DATES = (
    "2025-06-22 09:00:00-05",
    "2026-06-24 09:00:00-05",
    "2027-06-24 09:00:00-05",
)
START_YEARS = (2025, 2026, 2027)

# ~32% of groups (8/25) use Roman suffixes; remainder use full_name + year.
ROMAN_SUFFIX_GROUP_INDICES = {index for index in range(len(GROUPS)) if index % 3 == 1}

ROMAN_VALUES = (
    (10, "X"),
    (9, "IX"),
    (5, "V"),
    (4, "IV"),
    (1, "I"),
)
# Fictitious venue names (one category per instance: I=hotel, II=sports complex, III=gym/dojo).
HOTEL_NAMES = (
    "The Halcyon Harbor Hotel",
    "Emberline Grand Hotel",
    "Copper Veil Inn & Suites",
    "Ridgewell Station Hotel",
    "Meridian Wharf Hotel",
    "Valebridge Court Hotel",
    "Orchard Gate Inn",
    "North Ashford Hotel",
    "Foundry Lane Hotel",
    "Brindlewick Lodge",
    "Mariglen House Hotel",
    "Selwick Terrace Hotel",
    "Thornbay Harbor Inn",
    "Vellgrimm Plaza Hotel",
    "Cinderholt Inn",
    "Bramblegate Hotel",
    "Mosswick Station Inn",
    "Hollowfen Lodge",
    "Riveton Bay Hotel",
    "Glimmerwick Grand",
    "Drakewell Inn",
    "Quarrylane Hotel",
    "Foxmere Court Hotel",
    "Servo Tower Hotel",
    "Neon Nexus Hotel",
)

SPORTS_COMPLEX_NAMES = (
    "Meridian Wharf Sports Complex",
    "Valebridge Event Center",
    "Orchard Gate Athletic Complex",
    "North Ashford Sportsplex",
    "Copper Veil Arena & Fieldhouse",
    "Ridgewell Station Sports Complex",
    "Halcyon Foundry Athletic Center",
    "Emberline Regional Sports Complex",
    "Brindlewick Convention & Sports Center",
    "Larkspur Fieldhouse Complex",
    "Mariglen Sports Pavilion",
    "Selwick Metro Athletic Complex",
    "Thornbay Riverfront Sports Center",
    "Vellgrimm Combat Sports Complex",
    "Cinderholt Multi-Sport Arena",
    "Bramblegate Athletic Center",
    "Mosswick Sports Coliseum",
    "Hollowfen Field Complex",
    "Riveton Kart & Sports Center",
    "Glimmerwick Sprint Complex",
    "Drakewell Oval Sports Park",
    "Quarrylane Velocity Arena",
    "Foxmere Circuit Sports Complex",
    "Robot Foundry Sports Center",
    "Stellar Showdown Arena",
)

GYM_DOJO_NAMES = (
    "Ironvale Training Dojo",
    "Foundry Lane Combat Gym",
    "Ashford Martial Arts Gym",
    "Copper Veil Fitness Dojo",
    "Meridian Wharf Gym & Dojo",
    "Emberline Athletic Gym",
    "Brindlewick Dance & Fitness Studio",
    "Larkspur Movement Dojo",
    "Mariglen Training Gym",
    "Selwick Academy Dojo",
    "Thornbay Couples Dance Gym",
    "Vellgrimm Longsword Dojo",
    "Cinderholt HEMA Gym",
    "Bramblegate Rapier Dojo",
    "Mosswick Steel Academy Gym",
    "Hollowfen Blade Dojo",
    "Riveton Kart Fitness Gym",
    "Glimmerwick Training Dojo",
    "Drakewell Oval Gym",
    "Quarrylane Velocity Dojo",
    "Foxmere Martial Gym",
    "Servo Slam Dojo",
    "Circuit Carnage Gym",
    "Gasket Gauntlet Training Center",
    "Portland Plasma Dojo",
)

VENUE_NAMES_BY_INSTANCE = (HOTEL_NAMES, SPORTS_COMPLEX_NAMES, GYM_DOJO_NAMES)
DEFAULT_STATES = ("MN", "WI", "CO", "OH", "FL", "TX", "WA", "NC")

STREETS = (
    "4182 Copper Veil Road",
    "901 Meridian Wharf Lane",
    "77 Halcyon Foundry Way",
    "1204 North Ashford Circle",
    "633 Valebridge Court",
    "15 Orchard Gate Parkway",
    "2880 Ridgewell Station Drive",
    "504 Emberline Terrace",
)


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def to_roman(value: int) -> str:
    parts: list[str] = []
    remaining = value

    for amount, numeral in ROMAN_VALUES:
        while remaining >= amount:
            parts.append(numeral)
            remaining -= amount

    return "".join(parts)


def roman_start_for_group(group_index: int) -> int:
    """Deterministic pseudo-random Roman numeral (I–X) for the past-year instance."""
    return (group_index * 7 + 3) % 10 + 1


def event_name(full_name: str, group_index: int, instance: int) -> str:
    if group_index in ROMAN_SUFFIX_GROUP_INDICES:
        roman = to_roman(roman_start_for_group(group_index) + instance)
        return f"{full_name} {roman}"

    return f"{full_name} {START_YEARS[instance]}"


def main() -> None:
    lines = [
        "-- Three event instances per fictional event_group (seeds 008–010).",
        "-- I  = ~12 months in the past (Jun 2025), II = around today (Jun 2026), III = ~12 months ahead (Jun 2027).",
        "-- number_of_days is 3, 4, or 5; end_date = start_date + number_of_days.",
        "-- event.name is event_group.full_name + year, or full_name + Roman suffix (~32% of groups).",
        "-- location_json.venue is a fictitious hotel, sports complex, or gym/dojo name.",
        "-- Safe to re-run: removes prior fictional-group events first.",
        "--",
        "--   psql -U postgres -d event_system_pro -f database/seeds/011_event_fictional_instances.sql",
        "",
        "\\connect event_system_pro",
        "",
        "DELETE FROM public.\"event\"",
        "WHERE event_group_code IN (",
    ]

    codes = [g[0] for g in GROUPS]
    for index, code in enumerate(codes):
        suffix = "," if index < len(codes) - 1 else ""
        lines.append(f"  {sql_str(code)}{suffix}")

    lines.extend([");", ""])
    lines.append("INSERT INTO public.\"event\" (")
    lines.append("  event_group_code,")
    lines.append("  name,")
    lines.append("  country_code,")
    lines.append("  state_or_province,")
    lines.append("  location_json,")
    lines.append("  active,")
    lines.append("  number_of_days,")
    lines.append("  start_date,")
    lines.append("  end_date,")
    lines.append("  created_by")
    lines.append(")")
    lines.append("VALUES")

    value_rows: list[str] = []
    street_index = 0

    for group_index, (code, full_name, short, geo) in enumerate(GROUPS):
        if geo:
            country, state, city = geo
        else:
            country = "USA"
            state = DEFAULT_STATES[group_index % len(DEFAULT_STATES)]
            city = short

        for instance in range(3):
            days = DAYS[instance]
            start = START_DATES[instance]
            name = event_name(full_name, group_index, instance)
            venue_pool = VENUE_NAMES_BY_INSTANCE[instance]
            venue = venue_pool[group_index % len(venue_pool)]
            street = STREETS[street_index % len(STREETS)]
            street_index += 1

            location = {
                "venue": venue,
                "street": street,
                "city": city,
                "state": state,
                "country": country,
            }
            location_json = json.dumps(location, separators=(",", ":"))

            value_rows.append(
                "  (\n"
                f"    {sql_str(code)},\n"
                f"    {sql_str(name)},\n"
                f"    {sql_str(country)},\n"
                f"    {sql_str(state)},\n"
                f"    {sql_str(location_json)},\n"
                "    TRUE,\n"
                f"    {days},\n"
                f"    TIMESTAMPTZ '{start}',\n"
                f"    TIMESTAMPTZ '{start}' + INTERVAL '{days} days',\n"
                "    'c-agent'\n"
                "  )"
            )

    lines.append(",\n".join(value_rows) + ";")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(value_rows)} events)")


if __name__ == "__main__":
    main()
