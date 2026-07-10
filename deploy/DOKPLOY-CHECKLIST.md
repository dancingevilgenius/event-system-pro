# Dokploy deploy checklist — imake.wtf (test)

Use this checklist for **event-system-pro** test deploy on your Hostinger VPS with Dokploy.

**Production stays separate:** [eventsystem.pro](https://eventsystem.pro) continues to run **EventSystemPro** (single Dockerfile). This checklist targets **imake.wtf** only.

**Repo:** `dancingevilgenius/event-system-pro`  
**Branch:** `main`  
**Compose file:** `deploy/docker-compose.dokploy.yml`  
**Test domain:** `https://imake.wtf`

---

## Architecture

```text
Phone/browser → https://imake.wtf (Dokploy HTTPS)
              → proxy (Caddy, port 80 inside stack)
                 /           → web (React)
                 /api/*      → PostgREST
                 /mailer/*   → mailer (password-reset email)
                 /realtime/* → WebSocket counter POC

scheduler (internal): entrypoint → job_definition crontab → run_maintenance_job → job_run
Mailpit (dev/test): SMTP on mailpit:1025 inside stack; optional UI on VPS :8025
```

Dokploy terminates HTTPS at the edge. Caddy inside the stack routes by path.

---

## Before you start

- [ ] Hostinger VPS with Ubuntu 22.04 or 24.04 (can be the same VPS as eventsystem.pro)
- [ ] At least **2 GB RAM** (4 GB recommended if both apps run on one VPS)
- [ ] Root SSH access to the VPS
- [ ] Domain **imake.wtf** managed in Hostinger (or your registrar DNS panel)

---

## 1. DNS (domain panel)

| Type | Name | Value        |
|------|------|--------------|
| A    | `@`  | VPS public IP |
| A    | `www` | VPS public IP (optional) |

- [ ] A record for `@` points to VPS IP
- [ ] (Optional) A record for `www` points to VPS IP
- [ ] Waited for DNS propagation (a few minutes to an hour)

**Note:** If eventsystem.pro already points to this VPS, you only need to add DNS for **imake.wtf** — do not change eventsystem.pro records.

---

## 2. VPS firewall

- [ ] Port **80** open (HTTP / Let's Encrypt)
- [ ] Port **443** open (HTTPS)

Check both Hostinger's firewall panel and the VPS itself if applicable.

---

## 3. Install Dokploy on the VPS

Skip if Dokploy is already installed for eventsystem.pro.

SSH into the server:

```bash
ssh root@YOUR_VPS_IP
```

Install Dokploy:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

- [ ] Dokploy installed
- [ ] Dokploy admin account created
- [ ] Can open Dokploy UI in browser

---

## 4. Create Dokploy application (separate from EventSystemPro)

Create a **new** Dokploy application — do not repoint the existing EventSystemPro app on eventsystem.pro.

| Setting | Value |
|---------|-------|
| Application type | **Docker Compose** |
| GitHub repo | `dancingevilgenius/event-system-pro` |
| Branch | `main` |
| Compose file path | `deploy/docker-compose.dokploy.yml` |

- [ ] New project created (e.g. `event-system-pro-test`)
- [ ] GitHub repo connected
- [ ] Application type is **Docker Compose** (not Dockerfile-only)
- [ ] Compose path set to `deploy/docker-compose.dokploy.yml`

---

## 5. Environment variables

In Dokploy → Application → **Environment**, add (from `deploy/.env.dokploy.example`):

```env
APP_URL=https://imake.wtf

POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me-long-random-postgres
POSTGRES_DB=event_system_pro

PGRST_AUTHENTICATOR_PASSWORD=change-me-long-random-postgrest
MAILER_DB_PASSWORD=change-me-long-random-mailer
REALTIME_DB_PASSWORD=change-me-long-random-realtime
SCHEDULER_DB_PASSWORD=change-me-long-random-scheduler

PGRST_JWT_SECRET=change-me-long-random-jwt-secret-min-32-chars

VITE_POSTGREST_URL=https://imake.wtf/api
VITE_MAILER_URL=https://imake.wtf/mailer
VITE_REALTIME_WS_URL=wss://imake.wtf/realtime/ws

CORS_ORIGINS=https://imake.wtf
```

- [ ] All `change-me-*` values replaced with strong random secrets
- [ ] `PGRST_JWT_SECRET` is at least 32 characters
- [ ] All URLs use **imake.wtf** (not eventsystem.pro)

### Password note (first deploy)

Migrations create DB roles with **dev defaults** on a fresh database:

| Role | Default password (migrations) |
|------|-------------------------------|
| `authenticator` | `postgrest_dev_password` |
| `mailer` | `mailer_dev_password` |
| `realtime` | `realtime_dev_password` |
| `scheduler` | `scheduler_dev_password` |

**Easiest first deploy:** set env vars to match those defaults, deploy successfully, then rotate later:

```env
PGRST_AUTHENTICATOR_PASSWORD=postgrest_dev_password
MAILER_DB_PASSWORD=mailer_dev_password
REALTIME_DB_PASSWORD=realtime_dev_password
SCHEDULER_DB_PASSWORD=scheduler_dev_password
```

- [ ] Password env vars match what PostgreSQL roles expect (or roles altered after migrate)

---

## 6. Domain / HTTPS routing

Traefik labels on service **`proxy`** in `deploy/docker-compose.dokploy.yml` handle HTTP → HTTPS and Let's Encrypt. Set in Environment:

```env
APP_DOMAIN=imake.wtf
```

**Important:** In Dokploy → **Domains**, **remove** any `imake.wtf` entry. Duplicate Domains-tab routers often cause **HTTP works, HTTPS 404**.

- [ ] `APP_DOMAIN=imake.wtf` in Environment
- [ ] **No** domain entries in Domains tab (routing is in compose)
- [ ] DNS A record for `imake.wtf` → VPS IP; ports 80/443 open
- [ ] (Optional) `www.imake.wtf` — add a second Host rule in compose if needed later
- [ ] **eventsystem.pro** domain binding on EventSystemPro app left unchanged

**Do not** expose `postgres` or `postgrest` directly to the internet.

### If you prefer Dokploy Domains tab instead

Use **either** compose labels **or** the Domains tab, not both. If HTTPS fails while HTTP works:

1. Domains → edit `imake.wtf` → Certificate type **Let's Encrypt** (not "None")
2. **Deploy**, then **Reload Traefik** in Dokploy
3. SSH: `docker inspect <proxy> --format '{{json .Config.Labels}}' | jq` — confirm a router with `entrypoints=websecure` and `tls.certresolver=letsencrypt`

---

## 7. First deploy

Click **Deploy** in Dokploy.

Startup order:

1. `postgres`
2. `migrate` (runs all SQL, including migration `029` for the counter)
3. `postgrest`, `realtime`, `mailpit`, `mailer`, `web`
4. `proxy` (Caddy)

- [ ] Deploy started
- [ ] `migrate` completed without errors
- [ ] All services running

First deploy may take several minutes.

---

## 8. Verify

Test from phone or laptop:

| URL | Expected result |
|-----|-----------------|
| https://imake.wtf | Login page (Event System Pro) |
| https://imake.wtf/api/ | PostgREST OpenAPI JSON |
| https://imake.wtf/mailer/health | `{"ok":true}` |
| https://imake.wtf/realtime/health | `{"ok":true}` |
| https://imake.wtf/adminhome | `counter: …` ticking every 5s (admin login required) |

- [ ] Site loads over HTTPS
- [ ] API responds
- [ ] Mailer health check passes
- [ ] Realtime health check passes
- [ ] Admin counter updates live without page refresh
- [ ] https://eventsystem.pro still shows Scoring System (EventSystemPro unchanged)

---

## 8b. Verify forgot-password email (Mailpit)

Test **Send verification code** on https://imake.wtf/forgot-password using a seed user (e.g. email ending in `@superhero.com` when `SEED_DEV_DATA=true`).

Read the 6-digit code from Mailpit:

| Method | Steps |
|--------|--------|
| VPS port | Open `http://YOUR_VPS_IP:8025` (optional env `MAILPIT_UI_PORT=8025`; open firewall TCP 8025 — dev/test only) |
| SSH tunnel | `ssh -L 8025:localhost:8025 root@YOUR_VPS_IP` → `http://localhost:8025` |

- [ ] **Send verification code** succeeds (no network/CORS error)
- [ ] Code appears in Mailpit inbox
- [ ] Code verifies on step 2 and password reset completes

If mailer fails, check Dokploy **Logs** → service **`mailer`**. Common fixes: `MAILER_DB_PASSWORD` matches Postgres `mailer` role; `CORS_ORIGINS=https://imake.wtf`; redeploy with rebuild after `Caddyfile.dokploy` changes.

---

## 9. Auto-deploy on git push

In Dokploy → **this** application's settings:

- [ ] Auto-deploy enabled for pushes to `main`

After this:

```text
git push origin main  →  Dokploy rebuilds imake.wtf only
```

EventSystemPro auto-deploy (if enabled) is independent on its own Dokploy app.

---

## 10. Dev seed data (automatic on fresh deploy)

For **imake.wtf**, set in Environment:

```env
SEED_DEV_DATA=true
```

On each deploy, the **migrate** container:

1. Applies baseline + migrations (tracked in `schema_migrations`)
2. Applies `database/seeds/dev.manifest` (tracked in `schema_seeds`)

**Fresh database** (delete `pgdata` volume → Deploy): one step — migrate loads schema + full demo data (users, events, attendees).

**Existing database**: seeds **skip** files already recorded in `schema_seeds`. To re-run all seeds, delete the `pgdata` volume or clear `schema_seeds` in SQL.

Manual re-seed without redeploying migrate:

```bash
POSTGRES=$(docker ps --format '{{.Names}}' | grep postgres | head -1)
NETWORK=$(docker inspect "$POSTGRES" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' | awk '{print $1}')
docker run --rm --entrypoint /seed-dev-environment.sh --network "$NETWORK" \
  -e PGHOST=postgres -e PGPASSWORD='YOUR_POSTGRES_PASSWORD' \
  event-system-pro-migrate:latest
```

### Production (eventsystem.pro)

Set `SEED_DEV_DATA=false` or omit it — migrate applies schema only, no demo users/events.

### Alternative: database snapshot (later)

If dev seeds become too slow, you can `pg_dump` a fully seeded database and use it as a custom baseline for test deploys. Prefer the manifest approach while seeds still change often; snapshots drift from migrations and are harder to review in git.

- [ ] `SEED_DEV_DATA=true` on imake.wtf
- [ ] Fresh deploy loads demo data without manual SQL

---

## Optional — external Postgres access (dev only)

For pgAdmin, DBeaver, or local tools connecting to the VPS database.

**Security:** Exposes Postgres to the internet. Use only on imake.wtf test deploy, with a strong `POSTGRES_PASSWORD`. Remove before any production cutover.

### 1. Compose port mapping

In Dokploy **Environment**, add:

```env
POSTGRES_PUBLISH_PORT=5432
```

Redeploy the compose stack so the `postgres` service publishes host port 5432.

### 2. Hostinger VPS firewall (hPanel)

1. **VPS** → your server → **Security** / **Firewall**
2. Add rule: **TCP port 5432**, allow inbound
3. If Hostinger offers **source IP restriction**, limit to your home/office IP (recommended)

### 3. VPS OS firewall (if ufw is enabled)

SSH into the VPS:

```bash
sudo ufw allow 5432/tcp
sudo ufw status
```

### 4. Connection from your PC

| Field | Value |
|-------|--------|
| Host | VPS public IP (same as eventsystem.pro / imake.wtf) |
| Port | `5432` |
| Database | `event_system_pro` |
| User | `postgres` |
| Password | Your `POSTGRES_PASSWORD` from Dokploy Environment |

**Connection string:**

```text
postgres://postgres:YOUR_PASSWORD@YOUR_VPS_IP:5432/event_system_pro
```

### 5. Verify

From your PC (with `psql` installed):

```powershell
psql "postgres://postgres:YOUR_PASSWORD@YOUR_VPS_IP:5432/event_system_pro" -c "SELECT 1"
```

Or test port reachability:

```powershell
Test-NetConnection YOUR_VPS_IP -Port 5432
```

- [ ] `POSTGRES_PUBLISH_PORT=5432` in Dokploy Environment
- [ ] Compose redeployed
- [ ] Hostinger firewall allows 5432
- [ ] ufw allows 5432 (if used)
- [ ] Client connects successfully

---

## Redeploy later

| Situation | Action |
|-----------|--------|
| Code pushed to `main` | Wait for auto-deploy, or click **Redeploy** in Dokploy |
| Changed `VITE_*` env vars | **Redeploy with rebuild** (web image must rebuild) |
| Deploy failed | Check logs → fix env/DNS → Redeploy |

---

## Not included yet

- **Real SMTP** — test deploy uses Mailpit (captured mail only); swap mailer SMTP env for SendGrid/etc. when you need real delivery (see `deploy/DOKPLOY.md`)
- **www → apex redirect** — configure in Dokploy if you use both hostnames
- **Production cutover to eventsystem.pro** — only when ready; requires a separate migration plan

---

## Troubleshooting

### Read migrate logs in Dokploy

1. Open your **event-system-pro** compose app.
2. Go to **Logs** (`g` then `l`).
3. Choose service **`migrate`** (not postgres or postgrest).
4. Scroll to the bottom of the latest run and look for:
   - `ERROR:` — explains the failure
   - `Failed during:` — which step broke (e.g. `apply migrations/012_...` or `database connection check`)
   - `psql:` — SQL error details

Paste those lines when asking for help.

### Reset database volume (fresh start)

Use this when logs mention **authentication failed**, **database does not exist**, or repeated migrate failures after many deploy attempts:

1. In Dokploy, **Stop** the compose app.
2. Remove the Postgres data volume (name contains **`pgdata`**):
   - Dokploy **Advanced** → volumes, or
   - SSH: `docker volume ls | grep pgdata` then `docker volume rm <volume-name>`
3. **Deploy** again (pulls code, rebuilds migrate image, creates a new empty database).

After a volume reset, Postgres is recreated with your current `POSTGRES_PASSWORD` from Environment.

### Sync postgres password without deleting data (SSH)

If migrate logs say **Cannot connect to database 'postgres' either**, the password in Dokploy does not match what is stored in the existing `pgdata` volume. You can align them without wiping data:

1. Note the exact `POSTGRES_PASSWORD` value in Dokploy → **Environment**.
2. SSH to the VPS and run (replace container name and password):

```bash
docker ps --format '{{.Names}}' | grep postgres
docker exec -it event-system-pro-dev-fa2q1z-postgres-1 psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'YOUR_DOKPLOY_POSTGRES_PASSWORD';"
```

3. In Dokploy, **Deploy** again (no volume delete needed).

Inside the postgres container, local `psql -U postgres` works without the old password. After `ALTER USER`, migrate can connect over the network using `POSTGRES_PASSWORD` from Environment.

### Confirm compose type

In **General**, application type must be **Docker Compose**, not **Stack**. Stack mode ignores `build:` and migrate will not include SQL from `Dockerfile.migrate`.

| Problem | Likely fix |
|---------|------------|
| `migrate` exit 2 | **Logs** tab → service **migrate** → read lines starting with `ERROR:` or `Failed during:`. |
| `migrate` / PostgreSQL authentication failed | `POSTGRES_PASSWORD` in Dokploy no longer matches the existing **pgdata** volume. **Stop** the app, delete the `pgdata` volume, **Deploy** again (fresh DB). |
| `migrate` logs "baseline SQL not found" | Migrate image was not rebuilt — **Stop** → **Deploy** again. Confirm app type is **Docker Compose** (not Stack). |
| Site loads but `/api/` or `/realtime/health` is 404 | Domain must target **`proxy`** port **80**. Redeploy after pulling latest (proxy uses `handle_path` in Caddy). SSH: `docker exec <proxy> wget -qO- http://127.0.0.1/realtime/health` — if that works, fix Traefik (see HTTPS row). |
| `/mailer/health` is 404 | Redeploy with rebuild (proxy image includes `Caddyfile.dokploy`); confirm `mailer` service is running |
| Forgot-password send fails (network/CORS) | `CORS_ORIGINS` must be exactly `https://imake.wtf`; `VITE_MAILER_URL=https://imake.wtf/mailer` (rebuild web if changed) |
| Mailer 500 / "Unable to send verification email" | Check **mailer** logs; verify `MAILER_DB_PASSWORD` matches Postgres `mailer` role (`ALTER ROLE mailer ...` if rotated) |
| Code sent but no email in Mailpit | Check **mailer** logs for SMTP errors; confirm `mailpit` service is up |
| HTTP works but HTTPS returns 404 | Traefik **websecure** router missing or broken. Remove Domains-tab entry; use compose Traefik labels + `APP_DOMAIN`; Deploy + Reload Traefik. Or fix certificate type to Let's Encrypt in Domains tab. |
| Realtime password authentication failed | Set `REALTIME_DB_PASSWORD=realtime_dev_password` (migration default), redeploy. |
| Scheduler password authentication failed | Set `SCHEDULER_DB_PASSWORD=scheduler_dev_password` (migration 104 default), redeploy. Or `ALTER ROLE scheduler WITH PASSWORD ...` if rotated. |
| Scheduler not running / jobs never fire | Confirm **`scheduler`** service is up; Logs should show `installed crontab from maintenance.job_definition`. Manual: `exec scheduler /run-maintenance-job.sh inactivity_logout` |
| Scheduler health stale | `SELECT api.scheduler_health();` as scheduler role. Inspect `maintenance.job_run` / `job_definition`. |
| Site doesn't load | DNS A record for imake.wtf → VPS IP; ports 80/443 open |
| API returns 502 | Check `postgrest` logs; verify `PGRST_AUTHENTICATOR_PASSWORD` |
| Counter stuck | Check `realtime` logs; verify `REALTIME_DB_PASSWORD`; test `/realtime/health` |
| Login works but API fails in browser | `CORS_ORIGINS` must be exactly `https://imake.wtf` |
| Counter doesn't update live | `VITE_REALTIME_WS_URL` must be `wss://imake.wtf/realtime/ws`; rebuild web image |
| eventsystem.pro broke | You edited the wrong Dokploy app — restore EventSystemPro domain binding |

---

## Related docs

- `deploy/DOKPLOY.md` — overview and email / Mailpit setup
- `deploy/.env.dokploy.example` — environment variable template (imake.wtf defaults)
- `deploy/docker-compose.dokploy.yml` — compose stack definition
