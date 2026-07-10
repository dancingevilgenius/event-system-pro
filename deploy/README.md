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

The **`scheduler`** service runs Alpine `crond` with jobs from `deploy/crontab`:

| Schedule (TZ `America/Chicago`) | Script | RPC |
|---------------------------------|--------|-----|
| Every 5 minutes | `inactivity-logout.sh` | `api.inactivity_logout()` |
| Daily at midnight | `nightly-cleanup.sh` | `api.nightly_cleanup()` |

Jobs connect as the limited Postgres role **`scheduler`** (migration `104`; inherits `maintenance` EXECUTE grants). Set `SCHEDULER_DB_PASSWORD` to match the role password (dev default: `scheduler_dev_password`).

Manual one-shot from a running stack:

```powershell
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec scheduler /inactivity-logout.sh
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec scheduler /nightly-cleanup.sh
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
