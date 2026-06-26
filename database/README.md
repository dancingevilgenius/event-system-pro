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

## Apply schema

```powershell
psql -U postgres -d event_system_pro -f database/event-system-pro/evp_schema_postgresql.sql
psql -U postgres -d event_system_pro -f database/migrations/003_postgrest_api.sql
```
