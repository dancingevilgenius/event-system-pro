# Deploy to Dokploy (eventsystem.pro)

Full stack: **PostgreSQL + migrations + PostgREST + web + Caddy proxy**.  
Mailer is **skipped initially** (forgot-password email will not work until mailer/SMTP is added).

## Why Docker Compose in Dokploy (not Dockerfile-only)

EventSystemPro used a **single root `Dockerfile`** because it is one container (Vite dev server).

This project needs **postgres, migrate, PostgREST, web, and proxy**. In Dokploy:

| Dokploy setting | Value |
|-----------------|--------|
| **Application type** | **Docker Compose** |
| **Compose file** | `deploy/docker-compose.dokploy.yml` |
| **Build** | Web service uses root **`Dockerfile`** |

The root `Dockerfile` builds the production React app (nginx). Compose orchestrates the full stack.

## Dokploy setup checklist

**Downloadable checklist:** [DOKPLOY-CHECKLIST.md](./DOKPLOY-CHECKLIST.md)

1. **New application** → type **Docker Compose**
2. Connect GitHub repo `event-system-pro`, branch `main`
3. **Compose path:** `deploy/docker-compose.dokploy.yml`
4. **Environment variables:** copy from `deploy/.env.dokploy.example` and replace all `change-me-*` values
5. **Domain:** assign `eventsystem.pro` to service **`proxy`**, container port **80**
6. Enable **HTTPS** in Dokploy (Let's Encrypt)
7. Deploy / redeploy on push (same pattern as EventSystemPro)

## URLs after deploy

| URL | Service |
|-----|---------|
| https://eventsystem.pro | React app |
| https://eventsystem.pro/api/ | PostgREST |
| https://eventsystem.pro/mailer/ | Reserved (mailer not deployed yet) |

## Local smoke test (before Dokploy)

```powershell
copy deploy\.env.dokploy.example deploy\.env.dokploy
# Edit passwords in deploy\.env.dokploy, then:
docker compose -f deploy/docker-compose.dokploy.yml --env-file deploy/.env.dokploy up --build
```

Map `eventsystem.pro` to `127.0.0.1` in your hosts file for local HTTPS testing, or use http://localhost with a modified compose port mapping on `proxy`.

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
| Dokploy type | Dockerfile (1 container) | **Docker Compose** (multi-service) |
| Root Dockerfile | `npm run dev` | **`npm run build` + nginx** |
| Database | None | PostgreSQL in compose |
| API | External mock | PostgREST in compose |
