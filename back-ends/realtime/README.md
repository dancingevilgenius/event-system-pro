# Realtime service (POC)

Broadcast-only Node service for the `system_config.poc_counter` proof of concept:

- Listens for PostgreSQL `NOTIFY` on counter changes
- Broadcasts updates to WebSocket clients at `/ws`

Counter **ticks** are driven by the maintenance scheduler job `poc_counter_tick`
(every 10 seconds via `api.poc_counter_tick()`). This service does not increment
the counter itself.

## Local development

```bash
# Apply migrations through 107 first, then:
cd back-ends/realtime
cp .env.example .env
npm install
npm run dev
```

WebSocket URL: `ws://localhost:3002/ws`

With the Vite dev server, use the proxy at `ws://localhost:5173/realtime/ws`.

## Docker stack

The full stack exposes the service through Caddy at `/realtime/*`.

Health check: `GET /health`
