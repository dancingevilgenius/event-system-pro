# TSL legacy database scripts

Original **tsl2** MySQL schema and data from Navicat, plus the PostgreSQL conversion used as the baseline for `event_system_pro`.

| File | Purpose |
|------|---------|
| `tsl_db_dump_navicat_2021_04_04.sql` | MySQL 8 source dump (Navicat export, 2021-04-04) |
| `tsl_schema_postgresql.sql` | Full PostgreSQL schema + seed data converted from the MySQL dump |

## Apply converted schema

```bash
psql -U postgres -d event_system_pro -f database/tsl/tsl_schema_postgresql.sql
```

Incremental changes after this baseline live in `database/migrations/`.

## Regenerate PostgreSQL schema from MySQL dump

```bash
python scripts/mysql_to_postgresql.py
```
