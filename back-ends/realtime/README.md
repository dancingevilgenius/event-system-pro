# Realtime service

Broadcast-only Node service. It listens for PostgreSQL `NOTIFY` and broadcasts
those messages to WebSocket clients at `/ws`. Payloads are metadata only.
Pages refetch rows over PostgREST.

Channels:

- `system_config_poc_counter` — proof-of-concept counter. Ticks come from the
  maintenance job `poc_counter_tick` (`api.poc_counter_tick()`), not from this
  service.
- `event_attendee_change` — attendee list changes. The attendee page uses
  `useEventAttendeeRealtime`.
- `contest_roster_change` — `contest_entry` insert, update, or delete (migration
  152). Prelims, finals, and the floor-parent page should call
  `useContestRosterRealtime(contestId, onChange)` once they load `contest_entry`
  for that contest. `onChange` silently refetches the roster and leaves
  in-progress judge marks and scores in place. Do not attach the hook to mock
  rosters. The floor-parent page does not exist yet; it should use this same hook.

## Local development

```bash
# Apply migrations through 152 first, then:
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
