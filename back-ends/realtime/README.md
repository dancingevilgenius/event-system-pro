# Realtime service (POC)

Small Node service for the `system_config.poc_counter` proof of concept:

- Increments `poc_counter` every 5 seconds
- Resets the counter to `0` at the start of each hour
- Listens for PostgreSQL `NOTIFY` on counter changes
- Broadcasts updates to WebSocket clients at `/ws`

## Local development

```bash
# Apply migration 029 first, then:
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
