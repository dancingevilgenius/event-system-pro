# Deploy — Docker stack

## Step 1 — Web image only

```powershell
docker build -f deploy/Dockerfile.web -t event-system-pro-web .
docker compose -f deploy/docker-compose.web.yml up --build
```

Open http://localhost:8088 (static UI only; API not included).

## Step 2 + 3 — Full stack with reverse proxy

```powershell
copy deploy\.env.example deploy\.env
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up --build
```

**Single browser URL:** http://localhost:8090

| Path | Backend |
|------|---------|
| `/` | React app (nginx) |
| `/api/*` | PostgREST |
| `/mailer/*` | Mailer service |
| `/realtime/*` | Realtime WebSocket POC |

| Other URL | Service |
|-----------|---------|
| http://localhost:8025 | Mailpit (dev email inbox) |

### Scheduler (maintenance cron)

The **`scheduler`** service starts with `/scheduler-entrypoint.sh`, which builds `/etc/crontabs/root` from **`maintenance.job_definition`** (`api.scheduler_crontab()`), then runs Alpine `crond`.

| Job name | Default schedule (TZ `America/Chicago`) | RPC |
|----------|------------------------------------------|-----|
| `inactivity_logout` | cron `*/5 * * * *` | `api.inactivity_logout()` |
| `nightly_cleanup` | cron `0 0 * * *` | `api.nightly_cleanup()` |
| `poc_counter_tick` | interval **10 seconds** | `api.poc_counter_tick()` |

Cron lines call `/run-maintenance-job.sh <job_name>` → `api.run_maintenance_job()` (looks up the registry, records `maintenance.job_run`, dispatches the RPC). Interval jobs are started as background sleep loops by `/scheduler-entrypoint.sh` (Alpine cron cannot fire sub-minute). Underlying RPCs use transaction-scoped advisory locks so overlapping runs return `skipped`.

Jobs connect as the limited Postgres role **`scheduler`** (migration `104`; inherits `maintenance` EXECUTE grants). Set `SCHEDULER_DB_PASSWORD` to match the role password (dev default: `scheduler_dev_password`).

`deploy/crontab` is documentation / image fallback only — the live schedule comes from the DB.

The admin-home **POC counter** is ticked by `poc_counter_tick`; the **realtime** service only listens for `NOTIFY` and pushes WebSocket updates to the browser.

#### Adding a new maintenance job

1. Create a no-arg `SECURITY DEFINER` RPC in `api` that returns `json`, calls `api.set_audit_actor('maintenance')`, uses `pg_try_advisory_xact_lock(901001, hashtext('<job_name>'))`, and is granted only to `maintenance` (revoke `PUBLIC`).
2. Insert a row into `maintenance.job_definition`:
   - **Cron job:** set `schedule_cron` (5 fields), leave `interval_seconds` NULL.
   - **Sub-minute job:** set `interval_seconds` (e.g. `10`), leave `schedule_cron` NULL.
   - Also set `enabled`, `stale_after_interval`, `description`, `created_by = 'c-agent'`.
3. Redeploy / recreate the **`scheduler`** container so entrypoint regenerates crontab / interval loops.
4. Manual test: `docker compose … exec scheduler /run-maintenance-job.sh <job_name>`

#### Idempotency

| Job | Re-run behavior |
|-----|-----------------|
| `inactivity_logout` | Safe to re-run. Marks currently stale active sessions; already-marked sessions are skipped by `user_session_is_active`. |
| `nightly_cleanup` | **Not** idempotent within the same calendar day — each successful run shifts demo event dates forward one day. Overlap is blocked by advisory lock; do not invoke manually unless you intend another shift. |

#### Health check

```powershell
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec scheduler `
  sh -c 'export PGPASSWORD="$SCHEDULER_DB_PASSWORD"; psql -h postgres -U scheduler -d event_system_pro -c "SELECT api.scheduler_health();"'
```

`api.scheduler_health()` uses each job’s `stale_after_interval` from `job_definition` (defaults: inactivity **15 minutes**, nightly **25 hours**). Disabled jobs are not treated as stale.

**Note:** Client `session_status` already treats stale activity as inactive without the cron (migration `035`). Keep the 5-minute `inactivity_logout` job to stamp `inactive_logout_at` for users who never hit the API again.

Manual one-shot from a running stack:

```powershell
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec scheduler /run-maintenance-job.sh inactivity_logout
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec scheduler /run-maintenance-job.sh nightly_cleanup
```

Inspect registry and recent runs:

```powershell
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec postgres `
  psql -U postgres -d event_system_pro -c "SELECT job_name, schedule_cron, enabled, stale_after_interval FROM maintenance.job_definition ORDER BY job_name;"
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec postgres `
  psql -U postgres -d event_system_pro -c "SELECT job_run_id, job_name, status, started_at, finished_at FROM maintenance.job_run ORDER BY job_run_id DESC LIMIT 10;"
```

If you rotate the password after the database already exists:

```sql
ALTER ROLE scheduler WITH PASSWORD 'your-new-password';
```

Then update `SCHEDULER_DB_PASSWORD` and recreate the scheduler container.

First boot runs `deploy/scripts/migrate.sh`: baseline schema + reference static lists + migrations tracked in `public.schema_migrations`. Migrations listed in `database/superseded-by-baseline.manifest` are skipped on fresh installs because the baseline bundle already includes those changes. See `database/BASELINE-REBASELINE-CHECKLIST.md`.

Re-running `docker compose up` skips already-applied SQL files.

### Optional seed data

Superhero users are not loaded automatically. After the stack is up:

```powershell
docker compose -f deploy/docker-compose.yml exec postgres psql -U postgres -d event_system_pro -f /sql/seeds/005_user_superheroes.sql
```

Use `docker compose run --rm migrate` to re-run the migration job manually.

### Production TLS

Edit `deploy/Caddyfile`: replace the `:80 { ... }` block with your domain name. Caddy obtains Let's Encrypt certificates automatically when the domain points at the server and ports 80/443 are reachable.

Example:

```
app.example.com {
  handle_path /api/* { reverse_proxy postgrest:3000 }
  handle_path /mailer/* { reverse_proxy mailer:3001 }
  handle { reverse_proxy web:80 }
}
```

Set `APP_URL`, `VITE_POSTGREST_URL`, `VITE_MAILER_URL`, and `CORS_ORIGINS` to your HTTPS origin, then rebuild:

```powershell
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up --build -d
```

## Step 4 — CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

| Job | When | What it does |
|-----|------|----------------|
| **frontend** | Every push / PR to `main` | `npm ci`, `npm run lint`, `npm run build` |
| **docker** | Every push / PR to `main` | Builds web + mailer + realtime + scheduler images; validates both compose files |
| **stack-smoke** | Push to `main` only | Starts full stack, curls `/`, `/api/`, `/mailer/health`, `/realtime/health`; runs one scheduler job |

Trigger manually from GitHub: **Actions → CI → Run workflow**.

### Future: push images and deploy

To publish images on release, add registry secrets (`GHCR` or Docker Hub) and a deploy job that runs on your server:

```bash
docker compose -f deploy/docker-compose.yml pull
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d
```

## Legacy dev stack (no proxy)

The older compose file under `back-ends/postgrest/` exposes PostgREST, mailer, and Mailpit on separate localhost ports. Do not run both stacks at once on the same ports.

## Dokploy test deploy (imake.wtf)

See [DOKPLOY.md](./DOKPLOY.md) for full-stack **test** deploy on Dokploy with `deploy/docker-compose.dokploy.yml` and root `Dockerfile`. Production [eventsystem.pro](https://eventsystem.pro) remains on the separate EventSystemPro repo.

**Downloadable checklist:** [DOKPLOY-CHECKLIST.md](./DOKPLOY-CHECKLIST.md)
