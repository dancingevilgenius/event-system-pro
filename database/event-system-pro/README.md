# Event System Pro database baseline

PostgreSQL schema and seed data for the `event_system_pro` database.

| File | Purpose |
|------|---------|
| `evp_schema_postgresql.sql` | Full PostgreSQL schema + seed data (baseline for new databases) |
| `tsl_db_dump_navicat_2021_04_04.sql` | Legacy MySQL 8 source dump (Navicat export, 2021-04-04) — used only by the conversion script |

## Apply baseline schema

```bash
psql -U postgres -d event_system_pro -f database/event-system-pro/evp_schema_postgresql.sql
```

Incremental changes after this baseline live in `database/migrations/`.

## Regenerate PostgreSQL schema from MySQL dump

```bash
python scripts/mysql_to_postgresql.py
```
