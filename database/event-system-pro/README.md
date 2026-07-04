# Event System Pro database baseline

PostgreSQL schema and seed data for the `event_system_pro` database.

| File | Purpose |
|------|---------|
| `evp_schema_postgresql.sql` | Public table DDL + legacy event/event_group seed rows |
| `baseline_reference_data.sql` | Reference `static_list` rows (`EVENT_TYPES`, `SECRET_QUESTIONS`, …) |
| `tsl_db_dump_navicat_2021_04_04.sql` | Legacy MySQL 8 source dump (Navicat export, 2021-04-04) — used only by the conversion script |

## Apply baseline bundle

```bash
psql -U postgres -d event_system_pro -f database/event-system-pro/evp_schema_postgresql.sql
psql -U postgres -d event_system_pro -f database/event-system-pro/baseline_reference_data.sql
```

Incremental changes after this bundle live in `database/migrations/`. Migrations folded into the baseline are listed in `database/superseded-by-baseline.manifest`. See `database/BASELINE-REBASELINE-CHECKLIST.md`.

## Regenerate PostgreSQL schema from MySQL dump

```bash
python scripts/mysql_to_postgresql.py
```
