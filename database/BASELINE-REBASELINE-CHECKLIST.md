# Baseline rebaseline checklist

Incremental rebaseline: fold **greenfield** schema and reference data into the baseline bundle; **keep** numbered migrations for existing databases and audit history.

## When to use this checklist

Run after a batch of migrations that:

- Drop obsolete `_lu` lookup tables in favor of `static_list`
- Copy reference data that greenfield installs no longer need to derive from legacy tables
- Fix early migrations that referenced tables the baseline no longer creates

Do **not** delete old migration files unless every deployed database has been wiped or you have a separate upgrade archive.

## Baseline bundle (two files)

| File | Purpose |
|------|---------|
| `database/event-system-pro/evp_schema_postgresql.sql` | Public table DDL + legacy event/event_group seed rows |
| `database/event-system-pro/baseline_reference_data.sql` | Reference `static_list` rows (`EVENT_TYPES`, `SECRET_QUESTIONS`, …) |

Both run once on fresh installs (recorded as `baseline/evp_schema_postgresql.sql` in `schema_migrations`).

## Step-by-step (repeat per rebaseline batch)

### 1. Identify candidates

- [ ] **Schema-only** changes already reflected in a fully migrated local DB → fold into `evp_schema_postgresql.sql`
- [ ] **Reference data** now maintained in seeds (`002_*`, `014_*`, …) → fold into `baseline_reference_data.sql`
- [ ] **Legacy data fixes** (wording updates, dedupe, row deletes on old `_lu` tables) → **keep** as migrations; do not fold
- [ ] **RPC / auth / grants** → keep as migrations unless you rebaseline the entire `api` schema (separate, larger project)

### 2. Update baseline files

- [ ] Remove obsolete table DDL and seed rows from `evp_schema_postgresql.sql`
- [ ] Keep **empty shell** tables only when later migrations still reference them before a drop migration (e.g. `secret_question_lu` until `084`)
- [ ] Add or update rows in `baseline_reference_data.sql` (upsert by `list_code`)
- [ ] Remove duplicate seed files from `database/seeds/dev.manifest` when baseline owns that data

### 3. Fix early migrations (greenfield path)

When baseline no longer creates a table, update migrations that still reference it for **new** installs:

- [ ] `003_postgrest_api.sql` — drop views for removed `_lu` tables
- [ ] `004_postgrest_dev_writes.sql` / `021_prod_grants.sql` — remove grants on dropped tables

Existing DBs already recorded these migrations; edited files apply only on fresh installs.

### 4. Mark superseded migrations

- [ ] Add a filename regex to `database/superseded-by-baseline.manifest` (one pattern per line)
- [ ] Patterns match the migration **filename** only (e.g. `^081_drop_event_type`)
- [ ] Do **not** supersede migrations that still change RPCs or auth (e.g. keep `084_drop_secret_question_lu` for `_is_valid_secret_question_id` and RPC repoints)

### 5. Keep tooling in sync

- [ ] `deploy/scripts/migrate.sh` reads `database/superseded-by-baseline.manifest`
- [ ] `scripts/rebuild-local-database.ps1` reads the same manifest
- [ ] Update verification queries in rebuild script (check `static_list`, not dropped `_lu` tables)
- [ ] Update `deploy/README.md` and `docs/cursor/application-rules.md` if the workflow changed

### 6. Verify

```powershell
.\scripts\rebuild-local-database.ps1
```

- [ ] Baseline + reference data apply without error
- [ ] Superseded migrations log as skipped
- [ ] Non-superseded migrations (003–088 except manifest) apply cleanly
- [ ] Dev seeds apply
- [ ] App smoke test: login, static lists, password recovery question picker

### 7. Deploy

- [ ] Commit and push
- [ ] **Existing** imake/prod volumes: migrate applies only **new** migrations (unchanged)
- [ ] **Fresh** Dokploy volume: faster path via baseline + fewer migration runs
- [ ] Manual deploy on prod when ready

## Current superseded batch (2026-07)

Folded into baseline + reference data or obsolete on greenfield:

- Event types / static list migration: `078`–`082`, `081`, `079`, `080`
- Country/state `_lu` → static list: `051`–`053`, `069`
- Secret question `_lu` data churn: `014`, `064`–`068`, `065`, `067`
- WSDC renames / CUSTOM rows: `083`, `085`, `086`, `087`
- Earlier baseline folds: `001`, `002`, `005`–`007`, `015`, `017`, `027`, `030`

**Still runs on fresh installs:** `084` (RPC repoint + drop `secret_question_lu`), auth/RBAC, demo seeds, etc.

## What we deliberately do not do (yet)

- Full `pg_dump --schema-only` rebaseline of `api` functions, RLS, and roles
- Deleting `database/migrations/*.sql`
- Squashing migrations without wiping production `pgdata`

Those are valid later steps if you accept wiping test/prod volumes or maintaining a migration archive.
