# Dokploy deploy checklist — eventsystem.pro

Use this checklist for first-time deploy on a Hostinger VPS with Dokploy.

**Repo:** `dancingevilgenius/event-system-pro`  
**Branch:** `main`  
**Compose file:** `deploy/docker-compose.dokploy.yml`  
**Domain:** `https://eventsystem.pro`

---

## Architecture

```text
Phone/browser → https://eventsystem.pro (Dokploy HTTPS)
              → proxy (Caddy, port 80 inside stack)
                 /           → web (React)
                 /api/*      → PostgREST
                 /realtime/* → WebSocket counter POC
```

Dokploy terminates HTTPS at the edge. Caddy inside the stack routes by path.

---

## Before you start

- [ ] Hostinger VPS with Ubuntu 22.04 or 24.04
- [ ] At least **2 GB RAM** (4 GB recommended)
- [ ] Root SSH access to the VPS
- [ ] Domain **eventsystem.pro** managed in Hostinger

---

## 1. DNS (Hostinger domain panel)

| Type | Name | Value        |
|------|------|--------------|
| A    | `@`  | VPS public IP |
| A    | `www` | VPS public IP (optional) |

- [ ] A record for `@` points to VPS IP
- [ ] (Optional) A record for `www` points to VPS IP
- [ ] Waited for DNS propagation (a few minutes to an hour)

---

## 2. VPS firewall

- [ ] Port **80** open (HTTP / Let's Encrypt)
- [ ] Port **443** open (HTTPS)

Check both Hostinger's firewall panel and the VPS itself if applicable.

---

## 3. Install Dokploy on the VPS

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

## 4. Create Dokploy application

In Dokploy:

| Setting | Value |
|---------|-------|
| Application type | **Docker Compose** |
| GitHub repo | `dancingevilgenius/event-system-pro` |
| Branch | `main` |
| Compose file path | `deploy/docker-compose.dokploy.yml` |

- [ ] New project created
- [ ] GitHub repo connected
- [ ] Application type is **Docker Compose** (not Dockerfile-only)
- [ ] Compose path set to `deploy/docker-compose.dokploy.yml`

---

## 5. Environment variables

In Dokploy → Application → **Environment**, add:

```env
APP_URL=https://eventsystem.pro

POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me-long-random-postgres
POSTGRES_DB=event_system_pro

PGRST_AUTHENTICATOR_PASSWORD=change-me-long-random-postgrest
MAILER_DB_PASSWORD=change-me-long-random-mailer
REALTIME_DB_PASSWORD=change-me-long-random-realtime

PGRST_JWT_SECRET=change-me-long-random-jwt-secret-min-32-chars

VITE_POSTGREST_URL=https://eventsystem.pro/api
VITE_MAILER_URL=https://eventsystem.pro/mailer
VITE_REALTIME_WS_URL=wss://eventsystem.pro/realtime/ws

CORS_ORIGINS=https://eventsystem.pro
```

- [ ] All `change-me-*` values replaced with strong random secrets
- [ ] `PGRST_JWT_SECRET` is at least 32 characters

### Password note (first deploy)

Migrations create DB roles with **dev defaults** on a fresh database:

| Role | Default password (migrations) |
|------|-------------------------------|
| `authenticator` | `postgrest_dev_password` |
| `realtime` | `realtime_dev_password` |

**Easiest first deploy:** set env vars to match those defaults, deploy successfully, then rotate later:

```env
PGRST_AUTHENTICATOR_PASSWORD=postgrest_dev_password
REALTIME_DB_PASSWORD=realtime_dev_password
```

- [ ] Password env vars match what PostgreSQL roles expect (or roles altered after migrate)

---

## 6. Domain in Dokploy

In Dokploy → **Domains**:

| Setting | Value |
|---------|-------|
| Domain | `eventsystem.pro` |
| Service | `proxy` |
| Container port | `80` |
| HTTPS | Enabled (Let's Encrypt) |

- [ ] Domain `eventsystem.pro` added
- [ ] Routed to service **`proxy`**, port **80**
- [ ] HTTPS / Let's Encrypt enabled
- [ ] (Optional) `www.eventsystem.pro` added

**Do not** expose `postgres` or `postgrest` directly to the internet.

---

## 7. First deploy

Click **Deploy** in Dokploy.

Startup order:

1. `postgres`
2. `migrate` (runs all SQL, including migration `029` for the counter)
3. `postgrest`, `realtime`, `web`
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
| https://eventsystem.pro | Login page |
| https://eventsystem.pro/api/ | PostgREST OpenAPI JSON |
| https://eventsystem.pro/realtime/health | `{"ok":true}` |
| https://eventsystem.pro/adminhome | `counter: …` ticking every 5s (admin login required) |

- [ ] Site loads over HTTPS
- [ ] API responds
- [ ] Realtime health check passes
- [ ] Admin counter updates live without page refresh

---

## 9. Auto-deploy on git push

In Dokploy → Application settings:

- [ ] Auto-deploy enabled for pushes to `main`

After this:

```text
git push origin main  →  Dokploy rebuilds and redeploys
```

---

## 10. Optional — seed test users

Exec into the `postgres` container after first deploy:

```bash
psql -U postgres -d event_system_pro -f /sql/seeds/005_user_superheroes.sql
```

- [ ] (Optional) Seed users loaded

---

## Redeploy later

| Situation | Action |
|-----------|--------|
| Code pushed to `main` | Wait for auto-deploy, or click **Redeploy** in Dokploy |
| Changed `VITE_*` env vars | **Redeploy with rebuild** (web image must rebuild) |
| Deploy failed | Check logs → fix env/DNS → Redeploy |

---

## Not included yet

- **Mailer** — forgot-password email will not work until mailer/SMTP is added (see `deploy/DOKPLOY.md`)
- **www → apex redirect** — configure in Dokploy if you use both hostnames

---

## Troubleshooting

| Problem | Likely fix |
|---------|------------|
| Site doesn't load | DNS A record → VPS IP; ports 80/443 open |
| API returns 502 | Check `postgrest` logs; verify `PGRST_AUTHENTICATOR_PASSWORD` |
| Counter stuck | Check `realtime` logs; verify `REALTIME_DB_PASSWORD`; test `/realtime/health` |
| Login works but API fails in browser | `CORS_ORIGINS` must be exactly `https://eventsystem.pro` |
| Counter doesn't update live | `VITE_REALTIME_WS_URL` must be `wss://eventsystem.pro/realtime/ws`; rebuild web image |

---

## Related docs

- `deploy/DOKPLOY.md` — overview and mailer setup later
- `deploy/.env.dokploy.example` — environment variable template
- `deploy/docker-compose.dokploy.yml` — compose stack definition
