# Database

## Layout

| Path | Purpose |
|------|---------|
| `event-system-pro/evp_schema_postgresql.sql` | Baseline schema + seeds (new databases) |
| `migrations/` | Incremental changes for existing databases |
| `seeds/` | Optional dev/test data |

## Local development: passwordless `psql`

To run migrations without typing a password (localhost only), use trust authentication:

```powershell
# Run PowerShell as Administrator
.\scripts\configure-local-postgres-trust.ps1
```

This updates `pg_hba.conf` for `local`, `127.0.0.1`, and `::1` only, then reloads PostgreSQL.

**Security:** Use on your dev machine only. Do not use trust auth on shared or production servers.

PostgREST Docker still uses the `authenticator` role password in `back-ends/postgrest/.env` — that is separate from the `postgres` superuser used for migrations.

**API grants:** Migration `004_postgrest_dev_writes.sql` allows anonymous REST writes (local Swagger testing). Migration `021_prod_grants.sql` revokes those and limits writes to the `authenticated` role (JWT required). Apply `021` on any environment that should not allow open anon mutations.

**Audit columns:** All tables use `created_date`, `created_by`, `modified_date`, `modified_by`. On insert, `modified_date` and `modified_by` are NULL; no epoch (`1970`/`1969`) column defaults. Agent-written SQL uses `c-agent` for `created_by` on insert (see `.cursor/rules/database-audit-columns.mdc` and migration `024_unify_audit_columns.sql`).

**Readable timestamps:** When saving human-readable timestamps to text/JSON, use `api.format_activity_timestamp(date_trunc('second', ...))` — format `Jul 3, 2026, 2:56:58 PM CDT` (see `.cursor/rules/database-timestamp-format.mdc` and migration `077_standard_timestamp_format.sql`).

## Apply schema

```powershell
psql -U postgres -d event_system_pro -f database/event-system-pro/evp_schema_postgresql.sql
psql -U postgres -d event_system_pro -f database/migrations/003_postgrest_api.sql
```
