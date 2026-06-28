# Deploy to Dokploy (imake.wtf — test)

Full stack: **PostgreSQL + migrations + PostgREST + web + Caddy proxy**.  
Mailer is **skipped initially** (forgot-password email will not work until mailer/SMTP is added).

## Two repos, two domains

| Domain | Repo | Dokploy type | Purpose |
|--------|------|--------------|---------|
| [eventsystem.pro](https://eventsystem.pro) | `dancingevilgenius/EventSystemPro` | Dockerfile (1 container) | **Production** — leave as-is |
| [imake.wtf](https://imake.wtf) | `dancingevilgenius/event-system-pro` | Docker Compose | **Test** full stack |

Use a **separate Dokploy application** for event-system-pro. Do not repoint the EventSystemPro app.

## Why Docker Compose in Dokploy (not Dockerfile-only)

EventSystemPro uses a **single root `Dockerfile`** because it is one container (Vite dev server).

event-system-pro needs **postgres, migrate, PostgREST, web, and proxy**. In Dokploy:

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
| https://imake.wtf/mailer/ | Reserved (mailer not deployed yet) |
| https://imake.wtf/realtime/health | Realtime POC health |

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

## Adding mailer later

1. Add `mailpit` or real SMTP env vars
2. Add `mailer` service (copy from `deploy/docker-compose.yml`)
3. Add `/mailer/*` route to `deploy/Caddyfile.dokploy`
4. Redeploy

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
