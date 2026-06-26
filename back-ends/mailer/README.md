# Event System Pro mailer

Sends password-reset verification emails for the front-end forgot-password flow.

## Local development (with Docker)

From `back-ends/postgrest`:

```bash
docker compose up -d mailpit mailer
```

- **Mailpit web UI:** http://localhost:8025 (view captured emails)
- **Mailer API:** http://localhost:3001

Copy `back-ends/mailer/.env.example` to `.env` if running the mailer outside Docker.

## Front-end

Set in `front-ends/front-end-cursor/.env`:

```
VITE_MAILER_URL=http://localhost:3001
```

## Production SMTP

Point `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` at your provider (SendGrid, Amazon SES, Gmail app password, etc.) in `back-ends/mailer/.env`.

Apply `database/migrations/010_mailer_password_reset.sql` and change the `mailer` role password before production.
