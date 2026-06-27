# Event System Pro — To-Do List

Last updated: 2026-06-27

Use this file to track planned work across the front end, database, and deploy stack. Check items off as they are completed.

---

## Admin area

- [ ] Replace **Event Details** placeholder (`/admin/event-details`) with a real page for viewing and editing event metadata.
- [ ] Replace **Competition Entries** placeholder (`/admin/competition-entries`) with entry management (list, add, edit, withdraw).
- [ ] Load **Contests** from the database instead of hardcoded `Contest 1` / `Contest 2` / `Contest 3` buttons.
- [ ] Pass the selected contest into **Contest Results** (`/admin/contests/contest`) instead of always showing the same mock contest.
- [ ] Add admin CRUD for **event groups** and **events** (19 legacy TSL groups are seeded; no UI yet).

## Staff and competitor flows

- [ ] Load contests dynamically on **Staff** (`/staff`) and **Competitor** (`/competitor`) selection pages.
- [ ] Wire **Competitor** contest buttons to real routes (`contestRoute` is not set today).
- [ ] Carry the selected **event** and **contest** context from Staff/Competitor into Judging and related pages.

## Judging

- [ ] Replace mock competitor data (`legionNames`, `createMockContestEntries`) with real **contest entries** from the API.
- [ ] Persist raw scores, color picks, and completion state to the database (currently regenerated on every page load).
- [ ] Wire the **`judging_panel`** table and `api.judging_panel` view into the judging workflow.
- [ ] Support multiple judges per contest (7 mock judge sheets exist in admin results; judging UI is single-judge today).

## Roles and navigation

- [ ] Add pages and route guards for **`headjudge`**, **`registration`**, and **`floorcoordinator`** roles (defined in auth but no dedicated UI yet).
- [ ] Add Home hub buttons for any new role-specific landing pages.
- [ ] Decide whether **`judge`** is a separate route from **`staff`**, or stays combined under Staff/Judging.

## Database and API

- [ ] Add migrations/RPCs for saving and loading judge scores and contest results.
- [ ] Add PostgREST views or RPCs for competition entry management.
- [ ] Confirm **`021_prod_grants.sql`** is applied on production (revokes anonymous writes).
- [ ] Add seeds or admin tools for non-legacy test events and contests.

## Deploy and CI

- [ ] Publish Docker images to a registry on release (see `deploy/README.md`).
- [ ] Add an automated deploy job that pulls and restarts the production stack.
- [ ] Document the difference between local dev stack, `deploy/docker-compose.yml`, and Dokploy (`deploy/DOKPLOY.md`) in one place.

## Documentation

- [ ] Update `docs/cursor/application-rules.md` when placeholder pages and mock data are replaced.
- [ ] Document the event → contest → entry → judging data model for future contributors.

---

## Recently completed (2026-06-27)

- [x] Rename `fight_event_group` → `event_group` and `fight_event` → `event` (Cursor Agent).
- [x] Add `judging_panel` table with event and contest foreign keys (Cursor Agent).
- [x] Add JWT auth, route guards, and production grant lockdown.
- [x] Add account password change and forgot-password flow.
- [x] Add admin competitors list with filter/sort.
- [x] Add admin contest results mock with relative placement scoring.
- [x] Unify audit columns (`created_by`, `modified_by`, etc.) across tables.
