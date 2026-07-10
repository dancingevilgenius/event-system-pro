# Deploy to Dokploy (imake.wtf — test)

Full stack: **PostgreSQL + migrations + PostgREST + mailer + Mailpit + scheduler + web + Caddy proxy**.  
Forgot-password **Send verification code** uses the mailer — captured by **Mailpit** on test deploys (no real SMTP required).
Maintenance cron (`inactivity_logout`, `nightly_cleanup`) runs in the **`scheduler`** service.

## Two repos, two domains

| Domain | Repo | Dokploy type | Purpose |
|--------|------|--------------|---------|
| [eventsystem.pro](https://eventsystem.pro) | `dancingevilgenius/EventSystemPro` | Dockerfile (1 container) | **Production** — leave as-is |
| [imake.wtf](https://imake.wtf) | `dancingevilgenius/event-system-pro` | Docker Compose | **Test** full stack |

Use a **separate Dokploy application** for event-system-pro. Do not repoint the EventSystemPro app.

## Why Docker Compose in Dokploy (not Dockerfile-only)

EventSystemPro uses a **single root `Dockerfile`** because it is one container (Vite dev server).

event-system-pro needs **postgres, migrate, PostgREST, mailer, mailpit, scheduler, web, and proxy**. In Dokploy:

| Dokploy setting | Value |
|-----------------|--------|
| **Application type** | **Docker Compose** |
| **Compose file** | `deploy/docker-compose.dokploy.yml` |
| **Build** | Web service uses root **`Dockerfile`** |

The root `Dockerfile` builds the production React app (nginx). Compose orchestrates the full stack.

## Dokploy setup checklist

**Downloadable checklist:** [DOKPLOY-CHECKLIST.md](./DOKPLOY-CHECKLIST.md)

1. **New application** → type **Docker Compose** (not the EventSystemPro app)
2. Connect GitHub repo `event-system-pro`, branch `main`
3. **Compose path:** `deploy/docker-compose.dokploy.yml`
4. **Environment variables:** copy from `deploy/.env.dokploy.example` (imake.wtf URLs) and replace all `change-me-*` values
5. **Domain:** assign `imake.wtf` to service **`proxy`**, container port **80**
6. Enable **HTTPS** in Dokploy (Let's Encrypt)
7. Deploy / redeploy on push

## URLs after deploy

| URL | Service |
|-----|---------|
| https://imake.wtf | React app |
| https://imake.wtf/api/ | PostgREST |
| https://imake.wtf/mailer/health | Mailer health check |
| https://imake.wtf/realtime/health | Realtime POC health |
| http://YOUR_VPS_IP:8025 | Mailpit inbox UI (dev/test; optional firewall) |

Scheduler has no public URL — check Dokploy **Logs** → service **`scheduler`**, or exec a one-shot job (see below).

## Local smoke test (before Dokploy)

```powershell
copy deploy\.env.dokploy.example deploy\.env.dokploy
# Edit passwords in deploy\.env.dokploy, then:
docker compose -f deploy/docker-compose.dokploy.yml --env-file deploy/.env.dokploy up --build
```

Map `imake.wtf` to `127.0.0.1` in your hosts file for local HTTPS testing, or use http://localhost with a modified compose port mapping on `proxy`.

## After first deploy

- Load seed users if needed (optional):

```bash
docker compose -f deploy/docker-compose.dokploy.yml exec postgres \
  psql -U postgres -d event_system_pro -f /sql/seeds/005_user_superheroes.sql
```

- **Rotate DB role passwords** to match `PGRST_AUTHENTICATOR_PASSWORD` (migration 003 creates `postgrest_dev_password` by default on first boot — change via SQL `ALTER ROLE` before production traffic).

## Email / forgot-password (Mailpit on test)

The stack includes **mailer** (Node) and **Mailpit** (SMTP capture). Caddy routes `/mailer/*` to the mailer service (`deploy/Caddyfile.dokploy`).

### Flow

1. User opens **Forgot password** → enters email or username → **Send verification code**
2. Browser calls `POST https://imake.wtf/mailer/forgot-password/request`
3. Mailer calls `api.mailer_issue_password_reset()` in Postgres and sends a 6-digit code via SMTP
4. On imake.wtf test deploys, Mailpit receives the message (not a real inbox)

### Required env (Dokploy Environment)

Already in `deploy/.env.dokploy.example`:

| Variable | Purpose |
|----------|---------|
| `MAILER_DB_PASSWORD` | Postgres `mailer` role (migration 010 default: `mailer_dev_password`) |
| `VITE_MAILER_URL` | Baked into web at build: `https://imake.wtf/mailer` |
| `CORS_ORIGINS` | Must include `https://imake.wtf` (mailer CORS) |

Optional:

| Variable | Purpose |
|----------|---------|
| `MAILPIT_UI_PORT` | Host port for Mailpit web UI (default `8025`) |

If you change `MAILER_DB_PASSWORD` after the database already exists:

```sql
ALTER ROLE mailer WITH PASSWORD 'your-new-password';
```

## Scheduler (maintenance cron)

The **`scheduler`** service (`deploy/Dockerfile.scheduler`) generates crontab at startup from **`maintenance.job_definition`** via `api.scheduler_crontab()`, then runs Alpine `crond`.

| Job | Default schedule (TZ `America/Chicago`) |
|-----|------------------------------------------|
| `inactivity_logout` | Every 5 minutes (cron) |
| `nightly_cleanup` | Daily at midnight (cron) |
| `poc_counter_tick` | Every 10 seconds (interval loop) |

Each run writes a `maintenance.job_run` row and one structured log line (`job=… status=ok|error|skipped duration_ms=…`). Overlapping invocations are skipped via advisory locks. To add a job, insert into `job_definition` and recreate the scheduler container (see `deploy/README.md`).

| Variable | Purpose |
|----------|---------|
| `SCHEDULER_DB_PASSWORD` | Postgres `scheduler` role (migration 104 default: `scheduler_dev_password`) |

**Easiest first deploy:** keep `SCHEDULER_DB_PASSWORD=scheduler_dev_password` to match the migration default, then rotate later:

```sql
ALTER ROLE scheduler WITH PASSWORD 'your-new-password';
```

Manual one-shot (Dokploy / compose):

```bash
docker compose -f deploy/docker-compose.dokploy.yml exec scheduler /run-maintenance-job.sh inactivity_logout
docker compose -f deploy/docker-compose.dokploy.yml exec scheduler /run-maintenance-job.sh nightly_cleanup
docker compose -f deploy/docker-compose.dokploy.yml exec scheduler \
  sh -c 'export PGPASSWORD="$SCHEDULER_DB_PASSWORD"; psql -h postgres -U scheduler -d event_system_pro -c "SELECT api.scheduler_health();"'
```

### Read verification codes (test)

After **Send verification code**, open Mailpit:

- **Direct:** `http://YOUR_VPS_IP:8025` (open TCP **8025** in the VPS firewall; dev/test only)
- **SSH tunnel:** `ssh -L 8025:localhost:8025 root@YOUR_VPS_IP` → browse `http://localhost:8025`

Use a seed user email (e.g. `@superhero.com` when `SEED_DEV_DATA=true`).

### Verify mailer is up

```text
https://imake.wtf/mailer/health   →  {"ok":true}
```

Redeploy **with rebuild** after changing `VITE_MAILER_URL` or editing `Caddyfile.dokploy` (proxy image bakes in Caddy config).

### Real SMTP (optional)

For delivery to real inboxes, replace Mailpit SMTP in `deploy/docker-compose.dokploy.yml` mailer `environment` with your provider, for example:

```yaml
SMTP_HOST: smtp.sendgrid.net
SMTP_PORT: "587"
SMTP_SECURE: "false"
SMTP_USER: apikey
SMTP_PASS: ${SMTP_PASS}
```

Set `SMTP_PASS` (and related vars) in Dokploy Environment. You can remove the `mailpit` service if unused.

## EventSystemPro comparison

| | EventSystemPro | event-system-pro |
|---|----------------|------------------|
| Domain | eventsystem.pro | imake.wtf (test) |
| Dokploy type | Dockerfile (1 container) | **Docker Compose** (multi-service) |
| Root Dockerfile | `npm run dev` | **`npm run build` + nginx** |
| Database | None | PostgreSQL in compose |
| API | External mock | PostgREST in compose |

## Future production cutover

When imake.wtf is stable, migrating to eventsystem.pro is a deliberate swap: new env URLs, domain binding in Dokploy, and retiring or relocating EventSystemPro. See checklist “Not included yet” section.
