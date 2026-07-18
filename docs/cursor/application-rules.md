# Event System Pro — Application Rules

Plain-language summary of rules, restrictions, and constraints for the **front-end-cursor** app and related **database / demo-data** conventions.

**Primary code locations**

| Area | Path |
|------|------|
| Routes | `front-ends/front-end-cursor/src/App.tsx` |
| Route guard | `front-ends/front-end-cursor/src/components/ProtectedRoute.tsx` |
| Session / roles | `front-ends/front-end-cursor/src/lib/session.ts` |
| Auth context | `front-ends/front-end-cursor/src/context/AuthProvider.tsx` |
| PostgREST API | `front-ends/front-end-cursor/src/api/postgrest.ts` |
| Mailer API | `front-ends/front-end-cursor/src/api/mailer.ts` |
| WSDC registry API | `front-ends/front-end-cursor/src/api/wsdcRegistry.ts` |
| Public home | `front-ends/front-end-cursor/src/pages/PublicHomePage.tsx` |
| Login | `front-ends/front-end-cursor/src/pages/LoginPage.tsx` |
| Register | `front-ends/front-end-cursor/src/pages/RegisterPage.tsx` |
| Forgot password | `front-ends/front-end-cursor/src/pages/ForgotPasswordPage.tsx` |
| Demo hub | `front-ends/front-end-cursor/src/pages/DemoPage.tsx` |
| Tournament bracket demo | `front-ends/front-end-cursor/src/pages/TournamentBracketDemoPage.tsx` |
| Merchandise POS demo | `front-ends/front-end-cursor/src/pages/EventMerchandisePosDemoPage.tsx` |
| Signed-in Home (role hub) | `front-ends/front-end-cursor/src/pages/HomePage.tsx` |
| Account | `front-ends/front-end-cursor/src/pages/AccountPage.tsx` |
| Show roles dialog | `front-ends/front-end-cursor/src/components/ShowRolesDialog.tsx` |
| Secret questions (password recovery) | `front-ends/front-end-cursor/src/pages/SecretQuestionsPage.tsx` |
| Change password | `front-ends/front-end-cursor/src/pages/ChangePasswordPage.tsx` |
| Secret questions form | `front-ends/front-end-cursor/src/components/SecretQuestionsSelector.tsx` |
| Secret question slot chrome | `front-ends/front-end-cursor/src/components/SecretQuestionSlot.tsx` |
| Secret question + answer (one slot) | `front-ends/front-end-cursor/src/components/SecretQuestionAndAnswer.tsx` |
| Secret question carousel (mobile) | `front-ends/front-end-cursor/src/components/SecretQuestionCarousel.tsx` |
| Register password-recovery dialog | `front-ends/front-end-cursor/src/components/PasswordRecoveryDialog.tsx` |
| Password recovery setup re-export | `front-ends/front-end-cursor/src/components/PasswordRecoverySetupForm.tsx` |
| Admin home | `front-ends/front-end-cursor/src/pages/AdminHomePage.tsx` |
| Build info dialog | `front-ends/front-end-cursor/src/components/BuildInfoDialog.tsx` |
| Admin competitors | `front-ends/front-end-cursor/src/pages/AdminCompetitorsPage.tsx` |
| Admin search users | `front-ends/front-end-cursor/src/pages/AdminSearchUsersPage.tsx` |
| User advanced search dialog | `front-ends/front-end-cursor/src/components/UserAdvancedSearchDialog.tsx` |
| Edit user dialog | `front-ends/front-end-cursor/src/components/EditUserDialog.tsx` |
| Event home | `front-ends/front-end-cursor/src/pages/EventHomePage.tsx` |
| Event groups list | `front-ends/front-end-cursor/src/pages/AdminEventsPage.tsx` |
| Event group detail | `front-ends/front-end-cursor/src/pages/AdminEventGroupPage.tsx` |
| Event detail | `front-ends/front-end-cursor/src/pages/AdminEventPage.tsx` |
| Event attendees | `front-ends/front-end-cursor/src/pages/AdminEventAttendeesPage.tsx` |
| Event contests | `front-ends/front-end-cursor/src/pages/AdminEventContestsPage.tsx` |
| Audit log | `front-ends/front-end-cursor/src/pages/AdminAuditLogPage.tsx` |
| Audit trail card / detail | `front-ends/front-end-cursor/src/components/AuditTrailCard.tsx`, `AuditLogDetailDialog.tsx` |
| Scheduled tasks | `front-ends/front-end-cursor/src/pages/AdminScheduledTasksPage.tsx` |
| Schedule frequency presets | `front-ends/front-end-cursor/src/utils/schedulePresets.ts` |
| Static lists | `front-ends/front-end-cursor/src/pages/StaticListsPage.tsx`, `StaticListDetailsPage.tsx` |
| Governing bodies | `front-ends/front-end-cursor/src/pages/GoverningBodyPage.tsx` |
| WSDC Find Dancer | `front-ends/front-end-cursor/src/pages/WsdcFindDancerPage.tsx` |
| Set Event Judges | `front-ends/front-end-cursor/src/pages/AdminSetEventJudgesPage.tsx` |
| Staff / contest pick | `front-ends/front-end-cursor/src/pages/StaffPage.tsx`, `ContestSelectionPage.tsx` |
| Competitor placeholder | `front-ends/front-end-cursor/src/pages/CompetitorPage.tsx` |
| Judging page | `front-ends/front-end-cursor/src/pages/JudgingPage.tsx` |
| Competitor names | `front-ends/front-end-cursor/src/data/legionNames.ts` |
| Raw score types/helpers | `front-ends/front-end-cursor/src/types/judgingScore.ts` |
| Color palette | `front-ends/front-end-cursor/src/data/judgingColorPalette.ts` |
| Color dialog | `front-ends/front-end-cursor/src/components/CompetitorColorDialog.tsx` |
| Color swatch (square cell) | `front-ends/front-end-cursor/src/components/CompetitorColorSwatchBox.tsx` |
| Color swatch button | `front-ends/front-end-cursor/src/components/CompetitorColorSwatch.tsx` |
| Duplicate score dialog | `front-ends/front-end-cursor/src/components/DuplicateScoreDialog.tsx` |
| Progress bar | `front-ends/front-end-cursor/src/components/PercentCompleteBar.tsx` |
| Layout constants | `front-ends/front-end-cursor/src/constants/layout.ts` |
| Event admin routes | `front-ends/front-end-cursor/src/constants/eventRoutes.ts` |
| Add / Edit Event page | `front-ends/front-end-cursor/src/pages/AdminAddEventPage.tsx` |
| Add Event sections | `front-ends/front-end-cursor/src/components/AddEvent*Section.tsx`, `AddEventSortableSectionAccordion.tsx` |
| Add Event shared helpers | `front-ends/front-end-cursor/src/lib/eventDates.ts`, `eventGroupSession.ts`, `eventLocation.ts` |
| Drag handle icon | `front-ends/front-end-cursor/src/components/DragHandleIcon.tsx` |
| Message stack UI | `front-ends/front-end-cursor/src/components/MessageStack.tsx` |
| Message provider / API | `front-ends/front-end-cursor/src/context/MessageProvider.tsx` |
| Message auto-dismiss prefs | `front-ends/front-end-cursor/src/lib/messagePreferences.ts` |
| `useMessages` hook | `front-ends/front-end-cursor/src/hooks/useMessages.ts` |
| Readable datetime helpers | `front-ends/front-end-cursor/src/utils/auditTimestamps.ts` |
| Theme switcher UI | `front-ends/front-end-cursor/src/components/ThemeSwitcher.tsx` |
| Theme provider | `front-ends/front-end-cursor/src/context/AppThemeProvider.tsx` |
| Skin definitions | `front-ends/front-end-cursor/src/skins/` |
| `useThemeSwitcher` hook | `front-ends/front-end-cursor/src/hooks/useThemeSwitcher.ts` |
| Mobile device detection | `front-ends/front-end-cursor/src/hooks/useIsMobileDevice.ts` |
| Viewport / page shell | `front-ends/front-end-cursor/index.html` |
| Demo attendee seed SQL | `database/seeds/012_attendee_seed.sql` |
| Generate demo attendees RPC | `database/migrations/044_generate_demo_attendees.sql` |
| Dev seed manifest | `database/seeds/dev.manifest` |
| Superhero user seed generator | `scripts/generate-superhero-user-seed.py`, `scripts/superhero_roster_synthetic.py` |
| Find user by username RPC | `database/migrations/049_find_user_by_username_rpc.sql` |
| Local DB rebuild script | `scripts/rebuild-local-database.ps1` |
| PostgREST dev config | `back-ends/postgrest/postgrest.conf`, `back-ends/postgrest/.env.example` |
| Cursor rules (DB audit) | `.cursor/rules/database-audit-columns.mdc` |
| Cursor rules (demo attendee IDs) | `.cursor/rules/demo-attendee-id-reservation.mdc` |
| Cursor rules (readable timestamps) | `.cursor/rules/database-timestamp-format.mdc` |
| Cursor rules (bold labels) | `.cursor/rules/bold-text-labels.mdc` |
| Cursor rules (MUI v9 `sx`) | `.cursor/rules/mui-v9-sx-styling.mdc` |
| Activity monitor | `front-ends/front-end-cursor/src/components/ActivityMonitor.tsx` |
| Contest selection layout | `front-ends/front-end-cursor/src/pages/ContestSelectionPage.tsx` |
| Admin contests / results | `front-ends/front-end-cursor/src/pages/AdminContestsPage.tsx`, `AdminContestResultsPage.tsx` |
| Fictional event seed generator | `scripts/generate-fictional-event-seed.py` |
| Application rules PDF | `docs/cursor/application-rules.pdf` (generated by `scripts/generate-application-rules-pdf.py`) |
| Deploy / Dokploy | `deploy/README.md`, `deploy/DOKPLOY.md` |

---

## General layout and navigation

- Main content blocks (messages, buttons, fields, dropdowns) are capped at **360px** wide and centered (`CONTENT_MAX_WIDTH`).
- Default route is **Public Home** (`/`). Alias: `/home-page`. Unknown URLs redirect to **`/`**.
- **Public routes:** `/`, `/home-page`, `/login`, `/register`, `/forgot-password`, `/demo`, `/tournament-bracket-demo`.
- **Protected routes** require a signed-in session (see **Authentication** and **Roles and route guards**).
- Staff reaches Judging via **Staff → Contest**, which navigates to `/judging`.
- Judging **Submit** and **Back to Staff** both return to `/staff`.

---

## Public home (`/`, `/home-page`)

Unauthenticated landing page (`PublicHomePage`):

- Brand title: **Event System Pro**.
- Short tagline plus “More features coming soon.”
- Shows current **hostname**.
- Buttons: **Login** (`/login`), **Register** (`/register`), **Demo** (`/demo`).

---

## Authentication and session

- Login is at **`/login`** (not `/`). Success navigates to **`/home`**. **Back to Home** on the login page goes to `/home-page`.
- Login calls PostgREST RPC **`api.login`** with username or email and password.
- Passwords are verified with **bcrypt** on the server; distinct error messages for unknown account vs incorrect password.
- On success the app stores a **session** in `sessionStorage` (`esp_session`): `user_id`, `username`, `email`, `roles`, and JWT **`token`**.
- Authenticated API calls send **`Authorization: Bearer <token>`** (see `postgrest.ts`).
- **Public** RPCs and lookups (login, register, forgot-password, country/state lists) call PostgREST with **`auth: 'omit'`** so a stale session JWT is not sent on unauthenticated flows.
- **Log Off** (signed-in Home) calls the logout RPC, clears the session, and returns to **`/`** (public home).
- Sign in again after database auth or role changes so the JWT includes current roles and username.

---

## Roles and route guards

### App roles

Ten roles from `user_app_role` (included in login JWT `app_roles`). Codes are **uppercase**:

| Code | Label |
|------|-------|
| `ADMIN` | Admin |
| `STAFF` | Staff |
| `JUDGE` | Judge |
| `HEAD_JUDGE` | Head Judge |
| `REGISTRATION` | Registration |
| `FLOOR_PARENT` | Floor Parent |
| `EVENT_MANAGER` | Event Manager |
| `DJ` | DJ |
| `EVENT_DIRECTOR` | Event Director |
| `COMPETITOR` | Competitor |

Legacy codes **`EVENT_COORDINATOR`** and **`BALLROOM_COORDINATOR`** were renamed to **`EVENT_DIRECTOR`** and **`EVENT_MANAGER`**.

### `ProtectedRoute` behavior

- No session → redirect to **`/`** (public home).
- Session present but missing required role → redirect to **`/home`**.
- Users with the **`ADMIN`** role pass **any** role check (admin can open staff, competitor, and admin routes).

### Route access

| Route | Required role(s) |
|-------|------------------|
| `/home`, `/account`, `/changepassword`, `/secret-questions`, `/static-lists`, `/static-list-details/:listCode` | Any signed-in user |
| `/staff`, `/judging` | `STAFF` (or `ADMIN`) |
| `/competitor` | `COMPETITOR` (or `ADMIN`) |
| `/adminhome`, `/event-home`, `/event-groups`, `/event-groups/:code`, `/event-groups/:code/:eventId` (+ `/attendees`, `/competitors`, `/contests`), `/create-event`, `/admin/contests`, `/admin/contests/contest`, `/admin/competitors`, `/admin/search-users`, `/admin/competition-entries`, `/admin/audit-log`, `/admin/scheduled-tasks`, `/admin/set-event-judges`, `/governing-body`, `/wsdc-find-dancer`, `/event-merchandise-pos-demo` | `ADMIN` |
| `/admin/event-details` | Redirects to `/event-groups` |
| `/add-event` | Redirects to `/create-event` |
| `/admin/tournament-bracket-demo` | Redirects to `/tournament-bracket-demo` |

---

## Home page (`/home`)

- After login, the user lands on **Home** (role hub).
- Buttons (top to bottom): **Staff** (`/staff`), **Competitor** (`/competitor`), **Admin** (`/adminhome`) — **only when the user has the `ADMIN` role** — then **Account** (`/account`).
- **Skin** lives on **Account**, not Home.
- **Log Off** calls logout, clears session, and returns to **`/`** (public home).
- **Test Message Boxes** is on **Admin** home, not Home (see **Admin section**).

---

## Account and password

### Account (`/account`)

- Shows signed-in **username**.
- **`ThemeSwitcher`** (Skin dropdown) — moved here from Home.
- **Message display time** select: how long success / warning / problem / info messages stay visible before auto-dismiss. Options: **3 seconds** (default), **10 seconds**, **1 minute**, **5 minutes**, **10 minutes**. Stored in `localStorage` key `evp.messageAutoDismissMs` (`messagePreferences.ts`).
- **Show Roles** opens `ShowRolesDialog` listing the session’s role codes (e.g. `ADMIN`), or “No roles…” when empty.
- **Change Password** navigates to `/changepassword`.
- **Password Recovery** navigates to `/secret-questions`.
- **Back to Home** returns to `/home`.

### Secret questions (`/secret-questions`)

- Protected route; opened from **Account → Password Recovery**.
- Title: **Password Recovery**; same centered card layout as Register (`Container maxWidth="sm"`, `Paper`, `centeredContentStackSx`).
- On load, calls RPC **`get_password_recovery_setup`** with session `user_id` to pre-select the user's three saved question ids (answers are not returned).
- Renders **`SecretQuestionsSelector`** (full 3-slot form with save button).
- Save calls RPC **`update_password_recovery`** with three `{ secret_question_id, answer }` pairs; answers are bcrypt-hashed server-side.
- On success: success message and navigate to **`/account`**.
- **Back to Account** returns to `/account`.
- Slot labels **Question 1**, **Question 2**, **Question 3** are shown (`showSlotLabels` defaults to `true` on this page).

### Change password (`/changepassword`)

- Requires a signed-in session.
- Fields: old password, new password, confirm password (with optional show/hide).
- New password must be at least **8** characters and match confirmation.
- Submits to RPC **`api.change_password`** with session `user_id`.
- Server records **`modified_by`** = username and **`modified_date`** on the user row.
- **Back to Account** returns to `/account`.

### Forgot password (`/forgot-password`)

Four-step stepper (public, no login required):

1. **Find your account** — enter email or username; mailer sends a verification code (dev: Mailpit).
2. **Verify code** — enter the 6-digit code (`api.forgot_password_verify`).
3. **New password** — set new password (≥ 8 characters, must match confirm); `api.forgot_password_complete`.
4. **Done** — return to login.

Login page links: **Forgot password?**, **Register**, and **Back to Home** (`/home-page`).

---

## Registration (`/register`)

- **Username**, **email**, and **password** are required (password ≥ 8 characters, must match confirm).
- **First name** and **last name** are required.
- Optional address: **city**, **state** (`static_list` → `US_STATES`), and **country** (`static_list` → `COUNTRIES`) only — no street line on this form (`addresses_json.line1` is `null` when an address row is saved).
- Phone uses three numeric US segments (area, prefix, line).
- Before submit, user must complete **three secret password-recovery questions** in the **`PasswordRecoveryDialog`** (opened from the register form).
- Dialog uses the same shared slot components as `/secret-questions` (see **Secret question UI** below); slot labels are **not** shown in the dialog.
- Answers are bcrypt-hashed via RPC **`api.hash_password_recovery_answers`** (`auth: omit`) and stored in `password_recovery_json` on submit.
- Submit calls **`api.register_user`**; on success navigates to **`/login`**.
- **Login** and **Register** call `clearMessages()` on mount.

---

## Secret question UI

Shared React components for choosing three secret questions and answers. Used on **Register** (`PasswordRecoveryDialog`) and **Account → Password Recovery** (`SecretQuestionsPage` → `SecretQuestionsSelector`).

### Component hierarchy

| Component | File | Role |
|-----------|------|------|
| **`SecretQuestionsSelector`** | `SecretQuestionsSelector.tsx` | Full 3-slot form: loads question list, manages slots, validates, save button. |
| **`SecretQuestionSlot`** | `SecretQuestionSlot.tsx` | Bordered wrapper around one slot; optional **Question N** label. Border: `divider`, 1px, rounded, responsive padding. |
| **`SecretQuestionAndAnswer`** | `SecretQuestionAndAnswer.tsx` | One slot's picker + answer field; content centered via `centeredContentStackSx`. **No border** (border lives in `SecretQuestionSlot`). |
| **`SecretQuestionPicker`** | exported from `SecretQuestionsSelector.tsx` | Desktop: MUI select dropdown (`aria-label="Secret question"`, no visible field label). Mobile: **`SecretQuestionCarousel`**. |
| **`SecretQuestionCarousel`** | `SecretQuestionCarousel.tsx` | Mobile carousel; arrow buttons to browse questions. |
| **`PasswordRecoveryDialog`** | `PasswordRecoveryDialog.tsx` | Register modal; maps three slots as `SecretQuestionSlot` → `SecretQuestionAndAnswer`. |
| **`PasswordRecoverySetupForm`** | `PasswordRecoverySetupForm.tsx` | Thin re-export of `SecretQuestionsSelector` (legacy import path). |

Typical slot markup:

```tsx
<SecretQuestionSlot label={showSlotLabels ? `Question ${index + 1}` : undefined}>
  <SecretQuestionAndAnswer ... />
</SecretQuestionSlot>
```

### Mobile vs desktop picker

- **`useIsMobileDevice`** chooses the picker:
  - **Desktop:** `AppTextField` select with all questions; already-selected questions in other slots are **disabled**.
  - **Mobile:** `SecretQuestionCarousel` with left/right arrows.
- Same behavior on Register dialog and `/secret-questions`.

### Validation (both flows)

- All three slots must have a selected question and a non-blank answer (trimmed).
- Each question id may be used **once** across the three slots.
- Register dialog may highlight empty answer fields on failed submit; `SecretQuestionsSelector` shows a single inline error message.

### API

| Call | When | Auth |
|------|------|------|
| `fetchSecretQuestions()` → `GET /secret_question_lu` | Load question list | `omit` (public lookup) |
| `hash_password_recovery_answers` | Register submit (pre-hash answers) | `omit` |
| `get_password_recovery_setup` | `/secret-questions` load | bearer |
| `update_password_recovery` | `/secret-questions` save | bearer |

Forgot-password flow uses a separate stepper on **`/forgot-password`** (user answers two of their saved questions); it does **not** reuse these picker components.

---

## Admin section

### Admin home (`/adminhome`)

- Title: **Admin**.
- Shows a **POC counter** (10s realtime WebSocket demo) above the button stack.
- Contained navigation buttons (top to bottom):

| Label | Path |
|-------|------|
| Events | `/event-home` |
| Contests | `/admin/contests` |
| Competitors | `/admin/competitors` |
| Users | `/admin/search-users` |
| Competition Entries | `/admin/competition-entries` (placeholder) |
| Event Merchandise POS | `/event-merchandise-pos-demo` |
| WSDC Find Dancer | `/wsdc-find-dancer` |
| Set Event Judges | `/admin/set-event-judges` |
| Governing Bodies | `/governing-body` |
| Audit Log | `/admin/audit-log` |
| Scheduled Tasks | `/admin/scheduled-tasks` |
| Static Lists | `/static-lists` |
| Staff | `/staff` |

- Outlined actions below the nav stack:
  - **Generate Attendees** — calls PostgREST RPC **`api.generate_demo_attendees`** (admin JWT). Regenerates demo attendee rows in the reserved `attendee_id` range (see **Attendee demo data**). Success includes selected event-group names. Label becomes **Generating Attendees…** while in flight.
  - **Rotate Robot Riot Attendees (10 min)** — starts a short-lived attendee churn job for the Robot Riot demo event (`startRobotRiotAttendeeChurn(10)`).
  - **Refresh WSDC Attendee Info** — prepares targets, fetches WSDC profiles, and saves them onto matching users.
  - **Test Message Boxes** — clears the stack, then shows one success, warning, problem, and **info** alert (`You look marvelous!`).
  - **Build Info** — opens `BuildInfoDialog`.
  - **Back to Home** → `/home`.
- Removed: **Refresh Hollowfen & Jitterbug Active Window** (no longer on Admin home).
- Legacy path `/admin/event-details` redirects to **`/event-groups`**.

### Event admin hierarchy

Paths from `eventRoutes.ts`: `EVENT_HOME_PATH=/event-home`, `EVENT_GROUPS_PATH=/event-groups`, `EVENTS_PATH=/events`, `CREATE_EVENT_PATH=/create-event`.

| Route | Page | Behavior |
|-------|------|----------|
| `/event-home` | `EventHomePage` | **Event Groups** → `/event-groups`; **Events** → `/events` (placeholder); Back to Admin |
| `/event-groups` | `AdminEventsPage` | Title **Event Groups**; filter by name; **Add Event Group**; table columns Code / Full Name / **Event Type** (inline dropdown from static list `EVENT_TYPES`, saves immediately) / **Edit** → group detail. No Directors column. |
| `/event-groups/:code` | `AdminEventGroupPage` | Buttons per event (month/year labels); **Add Event**; Back to Event Groups |
| `/event-groups/:code/:eventId` | `AdminEventPage` | **Attendees**, **Competitors** (placeholder), **Contests**; **Edit Event** (`AddEventButton` with `eventId`); Back to group |
| `.../attendees` | `AdminEventAttendeesPage` | Real attendees list for that event |
| `.../contests` | `AdminEventContestsPage` | Event contest management |
| `/create-event` | `AdminAddEventPage` | **Add Event** or **Edit Event** (when navigated with `{ eventGroupCode, eventId }`). Edit preloads event dates/fields; title **Edit Event for {code}**; Back returns to the event detail when editing. |

See **Multi-section admin form pages (Add Event pattern)** for accordion / status / DnD construction rules.

### Admin competitors (`/admin/competitors`)

- Paginated **user** table (not contest entries): first name, last name, city, state, primary role.
- Page size: **25** desktop, **10** mobile (`useIsMobileDevice`).
- **Filter / Sort** dialog: filter by first name, last name, city, state, primary role (not username); sort by last name, first name, or city (asc/desc).
- Data comes from **`GET /user`** with PostgREST `ilike` / `eq` filters on JSON columns (`postgrest.ts`).
- Empty filter values shown as **—** in the table.
- **Back to Admin** returns to `/adminhome`.

### Search Users (`/admin/search-users`)

- Paginated **user** table columns: first name, last name, username, **Edit**.
- Page size: **25** desktop, **10** mobile (`useIsMobileDevice`).
- **Search-as-you-type** text field (`fetchUsersPage` `quickSearch`, max 30 characters):
  - Contains `@` → **email** only.
  - Digits + special characters only (no letters) → **phone number** only (`phone_numbers_json->0->>number`).
  - Otherwise → first name, last name, email, or phone number.
- **Advanced Search** button opens a modal (`UserAdvancedSearchDialog`) with username, State dropdown, Country dropdown, Demo / Not Demo toggle, Leader / Follower (primary-role) toggle; **Search** applies filters, **Cancel** discards draft changes.
- **Edit** opens `EditUserDialog` to change first name, last name, username, email, phone, and optional password via RPC **`api.admin_update_user`** (admin JWT required). Existing email/phone are pre-populated. Leave password blank to keep the current password. Users with `additional_info_json.demo = true` skip libphonenumber validation (demo phones use `555…` placeholders).
- Empty values shown as **—** in the table.
- **Back to Admin** returns to `/adminhome`.

---

## Competitor page (`/competitor`) — placeholder

- Route: **`/competitor`**, opened from the **Competitor** button on Home (requires `COMPETITOR` or `ADMIN` role).
- Page title: **Competitor** (`ContestSelectionPage` with `title="Competitor"`).
- Shows three full-width contest buttons: **Contest 1**, **Contest 2**, **Contest 3**.
- Contest buttons are **placeholders** — they do **not** navigate anywhere (`contestRoute` is not set).
- **Back to Home** button navigates to `/home`.
- Same layout shell as Staff (centered paper, 360px-wide button stack) but without a working contest destination yet.

---

## Demo pages

### Demo hub (`/demo`)

- Public page opened from Public Home **Demo**.
- Currently links to **Tournament Bracket Demo** (`/tournament-bracket-demo`).
- **Back** returns to `/home-page`.

### Tournament bracket demo (`/tournament-bracket-demo`)

- Public interactive bracket demo (loads users from the API; picks winners).
- Legacy `/admin/tournament-bracket-demo` redirects here.
- Back to Demo → `/demo`.

### Event Merchandise POS demo (`/event-merchandise-pos-demo`)

- **ADMIN** only (linked from Admin home, not the public Demo hub).
- Demo checkout/receipt flow for seeded merchandise event data (`016_merchandise_pos_demo.sql`).
- **Back to Admin** → `/adminhome`.

---

## Audit log (`/admin/audit-log`)

- **ADMIN** only.
- Paginated grid: **When**, **Action**, **Actor**, **Table**, **Record**, and a **View** button as the last cell (also on mobile cards via `AuditTrailCard` with `actionsInGrid`).
- Page size: **25** desktop, **10** mobile.
- **When** uses `formatReadableDateTime` (see **Readable datetime strings**).
- **View** opens `AuditLogDetailDialog` for the row.
- Filter dialog for narrowing results.
- **Purge** (“Delete all audit trail records”) is shown only on **eventsystem.fun** deployments (`isEventsystemFunDeployment()`).
- **Back to Admin** → `/adminhome`.

---

## Scheduled tasks (`/admin/scheduled-tasks`)

- **ADMIN** only.
- Task cards with enable toggle, health chip, schedule dialog, and **Run now**.
- Frequency options (`schedulePresets.ts` / `SCHEDULE_FREQUENCY_OPTIONS`):

| Option | Notes |
|--------|--------|
| Once every 30 seconds | Interval schedule (`30` seconds), not cron |
| Once a minute | Cron |
| Once every 10 minutes | Cron `*/10 * * * *` |
| Once every 30 minutes | Cron `*/30 * * * *` |
| Once an hour | Cron |
| Once a day | Cron + time of day |
| Once a week | Cron + weekday + time of day |
| Once a year | Cron + month/day + time of day |

- Changing frequency **saves immediately**.
- For **`inactivity_logout`**, frequency **is** the idle window (e.g. every 30 seconds → logout after 30 seconds without activity). The card shows a read-only **Idle window** derived from the schedule.
- Last-run / next-run style timestamps display with `formatReadableDateTime`.
- **Back to Admin** → `/adminhome`.

---

## Static lists, governing bodies, WSDC, judges

### Static lists (`/static-lists`)

- Any signed-in user can open the list hub and detail pages.
- Hub shows a button per `list_code` → `/static-list-details/:listCode`.
- Detail page: view entries; **edit only if the user has `ADMIN`**.

### Governing bodies (`/governing-body`)

- **ADMIN** only.
- Table of governing body code / names; **More** opens edit of `more_json`.

### WSDC Find Dancer (`/wsdc-find-dancer`)

- **ADMIN** only.
- Looks up a dancer in the WSDC registry, matches an ESP user (WSDC# or name), and **Confirm and Save** via `saveWsdcForMatchingUser` / related PostgREST helpers.

### Set Event Judges (`/admin/set-event-judges`)

- **ADMIN** only.
- Pick event group / event, search users, build a judging pool, **Save judging pool** (`persistEventJudgingPool`).

---

## Message boxes

App-wide stacked alerts at the top of the screen (not Judging-specific). Wrapped by `MessageProvider` in `main.tsx`.

### Types and appearance

- Four message types: **success**, **warning**, **problem**, and **info**.
- Each type uses a distinct outlined **MUI Alert** color scheme (green, amber, red, blue).
- The stack is **fixed** at the top center (`top: 16px`), capped at **360px** wide (`CONTENT_MAX_WIDTH`), same as other main content blocks.
- Container uses `aria-live="polite"` for screen readers.

### Stacking and dismissal

- Multiple messages can be visible **at the same time**, stacked vertically (newest appended below prior messages).
- Messages **auto-dismiss** after the user’s **Message display time** preference (default **3 seconds**; set on Account). Clicking a message still dismisses it immediately (collapse animation ~350ms).
- New messages **slide in** from above when added.

### API and usage

- Any page can call `useMessages()` (must be inside `MessageProvider`).
- Show messages with `showSuccess(text)`, `showWarning(text)`, `showProblem(text)`, or `showInfo(text)` — each returns the new message id.
- `clearMessages()` removes all messages immediately (no exit animation).
- `dismissMessage(id)` removes a single message immediately (used internally after the collapse animation).

### Page-specific behavior

- **Login**, **Register**, and **Forgot password** call `clearMessages()` on mount so no stale messages carry over.
- **Admin home** has a **Test Message Boxes** button that clears the stack, then shows:
  - Success: `Your change has been saved.`
  - Warning: `Your event starts in less than 15 min.`
  - Problem: `Your sign in time has passed.`
  - Info: `You look marvelous!`

---

## Theme / skin switcher

App-wide MUI theming via **skins**. `AppThemeProvider` wraps the app in `main.tsx` (outside `MessageProvider` and the router).

### Account page placement

- The **Account** page (`/account`) exposes the skin control via `ThemeSwitcher` (near the top of the account stack).
- Home does **not** show the skin dropdown.
- The dropdown uses the same **360px** centered width as other main controls (`centeredContentStackSx` / `fullWidth`).

### Dropdown behavior

- MUI **Select** with label **"Skin"** (`FormControl`, `size="small"`, full width).
- Two options: **Light** and **Dark** (from `src/skins/light.ts` and `src/skins/dark.ts`).
- Changing the selection updates the active skin **immediately** across the entire app.

### Persistence

- Selected skin id is saved to **`localStorage`** under key `event-system-pro.skin-id`.
- On load, the stored value is read and applied; invalid or missing values fall back to **Light**.
- Legacy stored value `default` is treated as **Light**.

### App-wide application

- `AppThemeProvider` builds the MUI theme from the active skin (`createAppTheme`) and supplies it via MUI `ThemeProvider` + `CssBaseline`.
- All pages inherit the current skin.
- Other components may read or change the skin via `useThemeSwitcher()` (`skinId`, `setSkin`, `skins`, `currentSkin`).

---

## Judging page — competitor data

- Each session shows **20 couples** (accordion rows).
- Each couple has:
  - A **bib number** (1–999, unique within the set, sorted ascending)
  - A **Leader** and **Follower** (first + last name)
- Names come from two pools:
  - **Legion of Super-Heroes** (DC)
  - **Shi'ar Imperial Guard** (Marvel-inspired)
- Each character has a **sex** value (`male` or `female`) based on common comic portrayals.
- Judging entries are generated **once per page load** (random bib numbers and names are fixed for that visit).

### Name selection rules

- **Leader:** pick a **male** character **90%** of the time.
- **Follower:** pick a **female** character **90%** of the time.
- The other **10%** can be anyone still available in the pool.
- A character may appear **only once** in the whole dataset, in either Leader or Follower slot (checked across both columns).
- Names are **excluded** if the first or last name contains any of these whole words:
  - `boy`, `girl`, `lad`, `lass`, `ladd`, `man`, `woman`

---

## Accordion behavior

- **Only one panel** can be open at a time.
- **Collapsed row** (accordion title) shows: `bib # | leader swatch · names · follower swatch | score`
  - Leader's color cell (when set) is to the **left** of the leader name.
  - Follower's color cell (when set) is to the **right** of the follower name.
  - Names sit between the two swatches as `Leader · Follower`.
- **Expanded row** shows: **Raw Score** first, then leader and follower rows (with color picking).
- Clicking inside expanded details **must not** collapse the accordion.

### Sort/filter freeze while editing

- While a panel is **open**, the list **must not** re-sort or re-filter, even if:
  - Scores change
  - The sort/filter dropdown selection changes
- Re-sort/re-filter happens when:
  - The user **collapses** the open panel, or
  - The user **opens a different** panel
- Changing the **sort/filter dropdown** always **closes** any open panel and applies the new option immediately.

---

## Raw scores

- Label is **"Raw Score"**.
- Entered with **4 digit dropdowns** (0–9), displayed as `XX.XX` (e.g. `87.43`).
- Score range: **0.00 to 99.99**.
- Summary score area is **blank** until the score has been touched/changed.
- Once any digit changes, the score shows in the collapsed header **immediately**.
- A couple counts as **scored** only if raw score is **greater than 0.0** (not merely touched at `0.00`).
- Score digit dropdown clicks **must not** toggle the accordion (`stopPropagation` on the selects).

### Assign Random Scores

- A **dropdown action**, not a persistent sort mode.
- Sets every couple to a random score between **30.0 and 99.9** (inclusive).
- Marks all as touched, switches sort to **Sort by Raw Score**, and closes any open panel.

---

## Sorting and filtering

Dropdown options:

| Option | Behavior |
|--------|----------|
| **Sort by Bib #** | Ascending bib number (default) |
| **Sort by Raw Score** | Highest score first; unscored / touched-at-zero at bottom; bib # breaks ties |
| **Sort by Leader's Last Name** | A–Z; bib # breaks ties |
| **Sort by Follower's Last Name** | A–Z; bib # breaks ties |
| **Unscored Only** | Hides couples with a **non-zero** raw score |
| **Assign Random Scores** | Bulk random scoring (see above) |

### Additional sort rules

- When **100% complete** is first reached, sort automatically switches to **Sort by Raw Score**.
- **Unscored Only** treats a couple as unscored if never touched, or touched but still **≤ 0.0**.

---

## Progress and submit

- Top of page shows **Percent Complete** bar (replaces the old "Judging" header).
- Progress = couples with **non-zero raw score** ÷ 20 × 100.
- Display text: `Percent Complete: X%`.
- At **100%**, the bar becomes a **Submit** button (navigates to `/staff`).

---

## Duplicate raw scores

When an accordion **closes** (collapse, switch panels, or change sort/filter while one was open):

- If that couple's raw score **matches another couple's** score (> 0), open the **Duplicate Score** dialog.

### Dialog rules

- Title: **Duplicate Score**
- Close **X** in top-right (dismisses without changing scores)
- Two choices using **leader and follower first names**:
  - Put the **current** couple higher
  - Put the **other** couple higher

### Resolution logic

- **Preferred fix:** raise the chosen couple's score by **+0.1**
- **If +0.1 would collide** with someone else's score: leave the chosen couple's score unchanged and **lower the other duplicate couple by 0.1** instead
- Scores must stay within **0.00–99.99**
- After a choice, if sort is **Sort by Raw Score**, the list **must re-sort** to reflect new scores (including when another panel is still open with a frozen list)

---

## Color picking

- Each **leader** and **follower** can have two colors: **top** and **bottom**.
- Colors are chosen from a fixed palette (**8 columns × 8 rows**).
- Palette source: `front-ends/front-end-cursor/src/data/judgingColorPalette.ts`.
- Palette icon opens the dialog if no colors yet; color swatch opens it if colors exist.
- Dialog flow:
  1. First click → **top** color
  2. Second click → **bottom** color, then **auto-save and close**
- Dialog titles:
  - On open: **Pick Top Color for {firstname}**
  - After first pick: **Pick Bottom Color {firstname}**
- **X** cancels without saving.
- Reopening shows prior selections; first click replaces top, second replaces bottom.
- After one pick in a session, clicking the **backdrop** saves that one color and closes.
- Color swatches appear in the collapsed summary when at least one color is set.
- Colors are stored per **bib + role** (`leader` or `follower`).

### Color palette (8 × 8)

Rows are listed top to bottom; columns left to right. Row 1 uses fixed hex values. Rows 2–7 are hue gradients (stored as HSL in code); the HEX and RGB values below are the rendered equivalents. Row 8 is a fixed neon assortment (HSL in code). In the color picker dialog, hover a swatch to see its HEX and RGB.

#### Row 1 - Neutral (black to white)

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#000000` | `rgb(0, 0, 0)` |
| 2 | `#1f1f1f` | `rgb(31, 31, 31)` |
| 3 | `#3d3d3d` | `rgb(61, 61, 61)` |
| 4 | `#5c5c5c` | `rgb(92, 92, 92)` |
| 5 | `#7a7a7a` | `rgb(122, 122, 122)` |
| 6 | `#999999` | `rgb(153, 153, 153)` |
| 7 | `#d9d9d9` | `rgb(217, 217, 217)` |
| 8 | `#ffffff` | `rgb(255, 255, 255)` |

#### Row 2 - Blue gradient

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#193a56` | `rgb(25, 58, 86)` |
| 2 | `#1d4a76` | `rgb(29, 74, 118)` |
| 3 | `#205898` | `rgb(32, 88, 152)` |
| 4 | `#2264bb` | `rgb(34, 100, 187)` |
| 5 | `#236ede` | `rgb(35, 110, 222)` |
| 6 | `#3e7ce7` | `rgb(62, 124, 231)` |
| 7 | `#5a8cf0` | `rgb(90, 140, 240)` |
| 8 | `#789ef6` | `rgb(120, 158, 246)` |

#### Row 3 - Purple gradient

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#3c1f5a` | `rgb(60, 31, 90)` |
| 2 | `#502477` | `rgb(80, 36, 119)` |
| 3 | `#662895` | `rgb(102, 40, 149)` |
| 4 | `#7f29b5` | `rgb(127, 41, 181)` |
| 5 | `#9a2ad5` | `rgb(154, 42, 213)` |
| 6 | `#b041e0` | `rgb(176, 65, 224)` |
| 7 | `#c359e9` | `rgb(195, 89, 233)` |
| 8 | `#d573f1` | `rgb(213, 115, 241)` |

#### Row 4 - Red gradient

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#4d181e` | `rgb(77, 24, 30)` |
| 2 | `#6b1d24` | `rgb(107, 29, 36)` |
| 3 | `#8c1f27` | `rgb(140, 31, 39)` |
| 4 | `#ae2027` | `rgb(174, 32, 39)` |
| 5 | `#d21f23` | `rgb(210, 31, 35)` |
| 6 | `#e62e2e` | `rgb(230, 46, 46)` |
| 7 | `#ef4d48` | `rgb(239, 77, 72)` |
| 8 | `#f66b63` | `rgb(246, 107, 99)` |

#### Row 5 - Brown gradient

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#3a2a21` | `rgb(58, 42, 33)` |
| 2 | `#4d3627` | `rgb(77, 54, 39)` |
| 3 | `#60432c` | `rgb(96, 67, 44)` |
| 4 | `#744f31` | `rgb(116, 79, 49)` |
| 5 | `#8a5d34` | `rgb(138, 93, 52)` |
| 6 | `#a16c36` | `rgb(161, 108, 54)` |
| 7 | `#b87b37` | `rgb(184, 123, 55)` |
| 8 | `#cb8c3d` | `rgb(203, 140, 61)` |

#### Row 6 - Green gradient

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#1e471f` | `rgb(30, 71, 31)` |
| 2 | `#246229` | `rgb(36, 98, 41)` |
| 3 | `#297f34` | `rgb(41, 127, 52)` |
| 4 | `#2c9e40` | `rgb(44, 158, 64)` |
| 5 | `#2dbe4d` | `rgb(45, 190, 77)` |
| 6 | `#36d762` | `rgb(54, 215, 98)` |
| 7 | `#4ce27d` | `rgb(76, 226, 125)` |
| 8 | `#64eb97` | `rgb(100, 235, 151)` |

#### Row 7 - Yellow gradient

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#997528` | `rgb(153, 117, 40)` |
| 2 | `#b78f29` | `rgb(183, 143, 41)` |
| 3 | `#d6ab2b` | `rgb(214, 171, 43)` |
| 4 | `#e0be41` | `rgb(224, 190, 65)` |
| 5 | `#e9cf58` | `rgb(233, 207, 88)` |
| 6 | `#f1dd70` | `rgb(241, 221, 112)` |
| 7 | `#f7ea8b` | `rgb(247, 234, 139)` |
| 8 | `#fbf4a6` | `rgb(251, 244, 166)` |

#### Row 8 - Neon assortment

| Col | HEX | RGB |
|-----|-----|-----|
| 1 | `#fa2d9a` | `rgb(250, 45, 154)` |
| 2 | `#fce620` | `rgb(252, 230, 32)` |
| 3 | `#1bf513` | `rgb(27, 245, 19)` |
| 4 | `#07f7c7` | `rgb(7, 247, 199)` |
| 5 | `#19cdfa` | `rgb(25, 205, 250)` |
| 6 | `#b729f3` | `rgb(183, 41, 243)` |
| 7 | `#91fc16` | `rgb(145, 252, 22)` |
| 8 | `#fa6a2d` | `rgb(250, 106, 45)` |

When changing the palette in code, update these tables so the HEX and RGB reference stays in sync.

### Color swatch shape

Each competitor's selected colors are shown in a **square** swatch cell (`CompetitorColorSwatchBox`, 20×20px in the UI).

- **Top** color fills the **top half** of the square.
- **Bottom** color fills the **bottom half** of the square.
- The cell is split horizontally (top over bottom), not side-by-side.
- In the **expanded** accordion, the swatch (or palette icon when no colors are set yet) sits on the **left** of each leader/follower name; the name is to its right on the same row.
- In the **collapsed** accordion title, the **same** split square cells appear when colors are set:
  - **Leader** swatch: immediately to the **left** of the leader (first) name.
  - **Follower** swatch: immediately to the **right** of the follower (second) name.
- If only the **top** color is set (no bottom yet), the top color fills the **entire** square until a bottom color is chosen.

---

## Name display in summary row

- Names are shown as `Leader · Follower` in the collapsed accordion title.
- **Leader** color swatch (when set) sits to the **left** of the leader name; **follower** swatch (when set) sits to the **right** of the follower name.
- If space is tight, names shorten progressively:
  1. Both full first names
  2. Leader initial + follower full
  3. Leader full + follower initial
  4. Both initials
- Shortening accounts for space taken by color swatches.

---

## Mobile-friendly layout

The app is designed to be **usable on phones** as well as desktop — narrow, centered content rather than wide multi-column layouts.

### Viewport and page shell

- `index.html` sets a responsive viewport: `width=device-width`, `initial-scale=1.0`, and `interactive-widget=resizes-content` (layout adjusts when the on-screen keyboard opens).
- `body` uses `min-height: 100vh` with no default margin.

### Narrow centered column

- Primary interactive content is capped at **360px** wide (`CONTENT_MAX_WIDTH`) and **centered** horizontally.
- Applies to messages, buttons, fields, dropdowns, and main page stacks (`centeredContentStackSx`).
- MUI theme defaults also cap **buttons** and **form controls** at 360px (`muiButtonTheme`, `muiFormTheme`).
- Pages wrap content in MUI **`Container`** (`maxWidth="sm"` on Login/Register, `maxWidth="md"` on Home, Staff, Competitor, Judging) with vertical padding (`py: 6`).
- Buttons inside stacks use **`fullWidth`** so they fill the centered column on any screen width.

### Touch and small screens

- **`useIsMobileDevice`** treats the device as mobile when it has a coarse pointer, or when the screen is ≤768px **and** touch-capable.
- Used for mobile-specific form behavior (see below); layout itself relies on the narrow column rather than separate desktop/mobile layouts.

### Dialogs and overlays

- Modals (color picker, duplicate score) use MUI **`Dialog`** with `fullWidth` and `maxWidth="xs"` so they fit phone screens.
- Message stack is fixed at the top with horizontal padding (`px: 2`) so alerts do not touch screen edges.

### Judging on narrow widths

- Accordion **summary names** shorten progressively when horizontal space is tight (see **Name display in summary row**); uses `ResizeObserver` to react to width changes.
- No separate mobile-only Judging layout — the same accordion UI is used at all breakpoints.

---

## Mobile and form behavior (Login / Register)

- **AppTextField** on mobile:
  - Scrolls focused field into view when the keyboard opens
  - Tapping the field container focuses the input
  - Default `enterKeyHint`: **done** (single-line) or **enter** (multiline)
  - Default `inputMode`: **text** (password fields excluded)
- Register numeric fields use `inputMode: numeric` with max lengths on phone/zip fields.
- Outlined inputs use **16px** font size in the theme (`muiOutlinedInputTheme`) to reduce unwanted zoom on focus (especially iOS).

---

## Readable datetime strings

When saving a **datetime as a string** (JSON text fields, `additional_info_json`, activity strings, audit-style payloads), use:

**Example:** `Jul 11, 2026, 5:42:28 AM CDT`

- Abbreviated month (`Jul`), day, year, comma, 12-hour time **with seconds**, `AM`/`PM`, timezone abbreviation
- **No milliseconds**
- **No ISO-8601** for these string fields (e.g. not `2026-07-11T05:42:28-05:00`)

Applies to keys such as `last_login_at`, `last_logout_at`, `last-activity`, and any new string datetime fields (unless a field documents its own format, e.g. WSDC `last_update_datetime`).

| Layer | Helper |
|-------|--------|
| PostgreSQL | `api.format_activity_timestamp(date_trunc('second', p_ts))` / `api.parse_activity_timestamp(text)` |
| Frontend | `formatReadableDateTime()` / `formatAuditJsonForDisplay()` in `utils/auditTimestamps.ts` |

`TIMESTAMPTZ` columns (`created_date`, `modified_date`, …) stay as real timestamps — do not stringify those.

Cursor rule: `.cursor/rules/database-timestamp-format.mdc`.

---

## Database audit columns

Every `public` table uses these four columns:

| Column | Type | Notes |
|--------|------|--------|
| `created_date` | `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP` | Set on insert |
| `created_by` | `varchar(128) NOT NULL` | Who created the row |
| `modified_date` | `TIMESTAMPTZ NULL DEFAULT NULL` | Set on every update; **NULL on insert** |
| `modified_by` | `varchar(128) NULL DEFAULT NULL` | Who last changed the row; **NULL on insert** |

Do **not** use epoch placeholder defaults (`1970-01-01`, `1969-12-31`, etc.).

### Seeds and agent-written SQL

- **Insert:** `created_by = 'c-agent'`; leave `modified_by` and `modified_date` **NULL**.
- **Seed UPDATE scripts:** do **not** set `modified_by` / `modified_date`.

### Application / logged-in users

- **Insert (self-registration):** `created_by = username`; `modified_by` / `modified_date` NULL.
- **Update (RPC or REST PATCH):** `modified_by` = acting user's **username**; `modified_date = CURRENT_TIMESTAMP`.

---

## Demo data and `more_json`

Demo vs production data is flagged with a **`more_json`** column (`jsonb`) on **`event_group`**, **`event`**, and **`attendee`**.

- JSON shape: `{"demo": true}` or `{"demo": false}`.
- Use the short key **`demo`** (not `is_demo`).
- Use the column name **`more_json`** (not `additional_info_json`).

### Where the flag lives

| Table | How `demo` is set |
|-------|-------------------|
| **`event_group`** | Seeded directly (`true` for fictional groups in seeds 008–010; `false` for TSL groups). |
| **`event`** | Copied from the parent `event_group.more_json.demo` when fictional events are inserted (seed `011`). |
| **`attendee`** | Copied from the parent `event.more_json` on demo attendee inserts. |

### Example queries

```sql
-- Demo events
SELECT * FROM event WHERE (more_json->>'demo')::boolean = true;

-- Demo event groups
SELECT * FROM event_group WHERE (more_json->>'demo')::boolean = true;

-- Production events
SELECT * FROM event WHERE COALESCE((more_json->>'demo')::boolean, false) = false;
```

### Schema naming (`club`)

The legacy **`charter`** table was renamed to **`club`**. On `event`, **`host_charter_id`** was renamed to **`host_club_id`**.

---

## Attendee demo data

The **`attendee`** table links a `user_id` to an `event_id` with optional JSON fields (`contests_json`, `more_json`, etc.).

### Reserved `attendee_id` range

**`attendee_id` 1 through 10000** are reserved for **demo seed data** (when all recent-year demo events are present).

- **Never** insert production or real-world attendee rows with `attendee_id <= 10000`.
- Demo **content** in that range may change on each seed run; the **ID slots** stay fixed.
- Production attendees must use `attendee_id > 10000` (identity sequence is bumped after demo seed runs).

### Demo seed behavior

Implemented in **`api.generate_demo_attendees_core()`** (called by seed `012_attendee_seed.sql` and the admin RPC wrapper).

| Rule | Value |
|------|--------|
| Events selected | Every `event` with `more_json.demo = true` in **current_year** and **current_year - 1** (America/Chicago) |
| Attendees per event | **200** random active users (pool needs **≥ 200** users; dev seed provides **1000** superheroes) |
| Total demo rows | **events × 200** (`attendee_id` **1–10000** for 50 events) |
| `created_date` | **1–90 days before** that event's `start_date` (America/Chicago calendar math); same **calendar year** as the event |
| Re-run safety | Deletes only `attendee_id <=` reserved total; **does not** delete rows above the reserved range |
| Demo marking | `more_json.demo = true`, `created_by = 'c-agent'` |

### Admin UI and RPC

- **Generate Attendees** on Admin home calls **`api.generate_demo_attendees()`** (requires **admin** JWT role).
- CLI / rebuild seed: `database/seeds/012_attendee_seed.sql` calls **`api.generate_demo_attendees_core()`** (no JWT; for `psql` / rebuild script).

### PostgREST JWT (local dev)

Authenticated RPCs (including **Generate Attendees**) send `Authorization: Bearer <token>`. PostgREST must have **`PGRST_JWT_SECRET`** set to the same value as database **`app.jwt_secret`** (see `database/migrations/018_auth_rbac.sql` and `back-ends/postgrest/.env.example`). Without it, the API returns **"Server lacks JWT secret"**.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `front-ends/front-end-cursor/` | Primary React + Vite + MUI app documented here |
| `front-ends/front-end-emergent/` | Separate front-end experiment (not covered by these rules) |
| `back-ends/postgrest/` | PostgREST + Swagger UI + Mailpit + mailer (Docker Compose) |
| `back-ends/realtime/` | WebSocket POC (counter demo) |
| `database/event-system-pro/` | Baseline schema SQL (`evp_schema_postgresql.sql`) |
| `database/migrations/` | Incremental schema/API changes (numbered `NNN_*.sql`) |
| `database/seeds/` | Dev/test data (optional; not run in production deploy migrate) |
| `scripts/` | Local tooling (`rebuild-local-database.ps1`, seed generators, PDF export) |
| `deploy/` | Dokploy / production deployment notes |

---

## App shell and provider order

`main.tsx` wraps the app in this order (outer → inner):

1. **`AppThemeProvider`** — MUI theme / skin
2. **`MessageProvider`** — global message stack
3. **`AuthProvider`** — session in `sessionStorage`
4. **`BrowserRouter`** — routes
5. **`App`** — includes **`ActivityMonitor`** and **`LoginFlashHandler`** above `<Routes>`

### Activity and inactivity

- Inactivity logout is owned by the scheduled task **`inactivity_logout`** (`api.inactivity_logout`), which stamps `inactive_logout_at` when `last-activity` is older than the task's **schedule period** (frequency = idle window; default `*/10 * * * *` → 10 minutes).
- **`ActivityMonitor`** runs on every signed-in page. It does **not** run a local logout timer.
- Activity is recorded on **clicks**, **keydown in form fields**, and **route changes** via `api.touch_last_activity` (debounced 5s).
- `api.session_status` is polled every 15s; when the job has marked the session inactive (`active: false`), the client shows a flash warning, **logout**, and redirects to **`/`**.

### Login flash messages

- **`LoginFlashHandler`** shows one-time warning/success messages on the login page after redirect (e.g. inactivity logout).

---

## Page layout shell

Most pages use the same centered card pattern:

- MUI **`Container`** (`maxWidth="md"`, `py: 6`) — except Login/Register use `maxWidth="sm"`.
- MUI **`Paper`** (`elevation={3}`, `p: 4`, `textAlign: 'center'`).
- Primary actions in a vertical **`Stack`** with `spacing={2}` and **`centeredContentStackSx`** (360px max width).
- Navigation buttons use **`fullWidth`** inside the stack.
- **Back** actions use **`variant="outlined"`**; primary navigation uses **`variant="contained"`**.

---

## Multi-section admin form pages (Add Event pattern)

Reference implementation: **`/create-event`** (`AdminAddEventPage.tsx`). Use this pattern when a long admin workflow should be split into accordion panels with per-section progress.

### Page shell

- Same centered card as other admin pages: **`Container maxWidth="md"`**, **`Paper elevation={3}`**, `py: 6`, responsive paper padding `{ xs: 2, sm: 4 }`.
- Page title: centered **`Typography variant="h4"`** (e.g. **Add Event for {event_group_code}** when a group is known).
- Optional subtitle line under the title (e.g. event group **full name** from PostgREST).
- Bottom navigation: one **Back** outlined button in **`centeredContentStackSx`** (360px column).

### Accordion sections

- Each logical block is an outlined MUI **`Accordion`** (`disableGutters`, `elevation={0}`, full width).
- **Only one** top-level accordion may be expanded at a time (`expandedSection` state).
- Section metadata is a stable **`id`**, **`title`**, and optional **`description`** (shown when the section has no custom content yet).
- Field UI belongs in dedicated **`AddEvent*Section.tsx`** components (or the equivalent prefix for another page). The page component owns **cross-section shared state** (e.g. event dates consumed by Schedule).
- Sections are **reorderable** via **`@dnd-kit`**:
  - Wrap the list in **`DndContext`** + **`SortableContext`** (`verticalListSortingStrategy`).
  - Each row uses **`useSortable`** (see **`AddEventSortableSectionAccordion.tsx`**).
  - A **`DragHandleIcon`** on the **left** of the summary row is the **only** drag target (`listeners` / `attributes` on the handle, not the whole summary).
  - Call **`stopPropagation`** on handle click so expand/collapse still works on the title/chevron.
  - Use **`PointerSensor`** with **`activationConstraint: { distance: 8 }`** to avoid accidental drags.
  - Persist order in page state (`sectionOrder`); reorder with **`arrayMove`** on drag end.
- **Inner** accordions (e.g. Schedule **Day 1**, **Day 2**, …) are independent: they may each expand/collapse without closing sibling day panels.

### Section status (per panel)

Every top-level accordion panel includes a **3-way toggle** at the bottom (**`AddEventSectionStatusToggle`**):

| Status | Behavior |
|--------|----------|
| **Not Started** | Default; no header icon |
| **In Progress** | Set automatically on the **first field edit** in that section (`onFieldEdit` callback from section components) |
| **Finalized** | **Only** when the user clicks that toggle — never set automatically |

- Editing a field after **Finalized** moves the section back to **In Progress**.
- Read-only / derived fields (e.g. **Number of Days**) must **not** call `onFieldEdit`.
- Header row (right-aligned): **TaskAlt** icon (amber) = In Progress; **CheckCircle** (green) = Finalized (`AddEventSectionStatusIcon`; uses **`@mui/icons-material`**).
- Section-specific gating is allowed: e.g. **Schedule** disables **In Progress** and **Finalized** until **Date(s)** has valid day(s); clearing dates resets Schedule to **Not Started**.

### Form fields and layout

- Text, select, and date/time inputs: **`AppTextField`** (inherits **360px** max width from **`muiFormTheme`**).
- **`datetime-local`** for event start/end; **Single Day** vs **Multi-Day** toggle controls whether the end picker is shown.
- Multi-day day count is **inclusive calendar days** (any time on a day counts that day); helpers live in **`lib/eventDates.ts`** / **`lib/eventDuration.ts`**.
- Static-list dropdowns (e.g. US states, countries): load in the section with loading spinner and inline error text.
- Phone fields: **`AppPhoneNumberField`** where applicable.
- Venue vs online contact: separate accordion panels (e.g. **Location/Venue** vs **Contact Venue**), each with its own status state.

### Schedule panel rules

- When **Date(s)** has no valid range, show a **`severity="warning"`** `Alert` asking the user to enter dates — do **not** show a placeholder **Day 1** accordion.
- When dates exist, render one inner accordion per event day (**`scheduleTimeBlocks`**, titled **Day 1**, **Day 2**, …).

### Event group context (`/create-event`)

| Item | Rule |
|------|------|
| Route | **`CREATE_EVENT_PATH`** = `/create-event`; legacy `/add-event` redirects |
| Group code | From navigation `state.eventGroupCode`, else **`sessionStorage`** (`lib/eventGroupSession.ts`) |
| Edit mode | Navigation `state.eventId` loads that event and titles the page **Edit Event for {code}**; preloads dates and other fields |
| **Add Event** / **Edit Event** button | Shared **`AddEventButton`** on event group and event detail pages; remembers group code (and optional `eventId`) on navigate |
| Back button | Edit mode → event detail `/event-groups/:code/:eventId`; create mode → `/event-groups/:code` when a group is known, else `/event-groups` |

### Dark skin: date/time picker icons

Native **`::-webkit-calendar-picker-indicator`** icons are black by default and are hard to see on dark backgrounds. Fix in **both**:

1. **`theme/muiFormTheme.ts`** — `MuiOutlinedInput` **root** overrides for `date`, `datetime-local`, and `time` inputs when `palette.mode === 'dark'`.
2. **`index.css`** — same rules scoped to **`[data-app-skin='dark']`** (set on the wrapper in **`AppThemeProvider`**).

Use **`filter: brightness(0) invert(1)`** and **`opacity: 0.87`** on the calendar indicator so it matches body text.

### Suggested file layout for a new multi-section page

| File | Role |
|------|------|
| `pages/Admin…Page.tsx` | Section order, shared state, DnD, status map, routing |
| `components/…Section.tsx` | One component per accordion panel |
| `components/…SortableSectionAccordion.tsx` | Reusable accordion + drag handle + status chrome (copy/adapt from Add Event) |
| `lib/…ts` | Pure helpers for derived state shared across panels |

---

## Environment variables (front-end)

From `front-ends/front-end-cursor/.env.example`:

| Variable | Default (local) | Purpose |
|----------|-----------------|--------|
| `VITE_POSTGREST_URL` | `http://localhost:3000` | PostgREST API base URL |
| `VITE_MAILER_URL` | `http://localhost:3001` | Password-reset mailer service |
| `VITE_REALTIME_WS_URL` | `ws://localhost:5173/realtime/ws` | WebSocket POC (dev proxy) |

PostgREST Docker: see `back-ends/postgrest/.env.example` (`PGRST_DB_URI`, `PGRST_JWT_SECRET`, CORS origins for Vite `5173` and Swagger `8080`).

---

## PostgREST API architecture

- HTTP API is generated from PostgreSQL schema **`api`** only (not raw `public` tables).
- Roles: **`anon`** (unauthenticated), **`authenticated`** (JWT bearer), **`authenticator`** (PostgREST connection).
- **Reads:** `api.*` views grant `SELECT` to `anon` and `authenticated`.
- **Writes (dev):** migration `004_postgrest_dev_writes.sql` allows open anon writes for Swagger testing.
- **Writes (prod):** migration `021_prod_grants.sql` revokes anon writes; mutations require **`authenticated`** JWT.
- **RPCs:** `api.login`, `api.register_user`, `api.change_password`, `api.generate_demo_attendees`, `api.find_user_by_username`, etc. Called via `POST /rpc/<name>` from `postgrest.ts` (or Swagger **Try it out**).
- **Security definer** RPCs use `SET search_path = public, api` and enforce role checks inside the function.
- After schema changes: `NOTIFY pgrst, 'reload schema';` in migrations (or restart PostgREST).

### Swagger UI and REST verbs (local dev)

| URL | Purpose |
|-----|---------|
| `http://localhost:8080` | **Swagger UI** (`event-system-pro-swagger` in `back-ends/postgrest/docker-compose.yml`) |
| `http://localhost:3000/` | PostgREST **OpenAPI JSON** (loaded by Swagger) |
| `http://localhost:3000/rpc/<name>` | RPC endpoints (`POST` + JSON body) |

- **GET** on `api.*` views is read-only; each request runs a single `SELECT` (no data changes).
- **PATCH** maps to SQL `UPDATE` (partial row update). PostgREST does **not** expose **PUT**.
- **POST** / **DELETE** on writable views insert or delete rows (dev: anon may write per migration `004`; prod: **`authenticated`** JWT only per `021`).
- **`api."user"`** is **read-only** over REST (even in dev). User inserts/updates go through RPCs (`register_user`, `change_password`, etc.).

### GET filters vs plain-text RPC lookup

PostgREST query parameters require an **operator prefix**:

| Intent | Example |
|--------|---------|
| Exact username | `GET /user?username=eq.batman` |
| Partial username | `GET /user?username=ilike.*bat*` |

For Swagger-friendly lookup without `eq.`, use **`POST /rpc/find_user_by_username`**:

```json
{ "p_username": "batman" }
```

Case-insensitive exact match; returns the same columns as **`api."user"`**. Granted to **`anon`** and **`authenticated`** (migration `049`).

### JWT claims used by the app

Login JWT payload includes:

- `role`: `authenticated`
- `sub`: `user_id` (string)
- `username`
- `app_roles`: array of role codes

`api.has_app_role(text)` and `api.current_user_id()` read these claims.

---

## Local database development

### Full rebuild (`scripts/rebuild-local-database.ps1`)

1. Terminate connections to `event_system_pro`
2. `DROP DATABASE` + `CREATE DATABASE`
3. Apply **`database/event-system-pro/evp_schema_postgresql.sql`** then **`baseline_reference_data.sql`** (baseline bundle)
4. Apply **`database/migrations/*.sql`** in sorted order (skips patterns in **`database/superseded-by-baseline.manifest`**)
5. Apply dev **seeds** listed in **`database/seeds/dev.manifest`** (order matters — see table below)
6. Print verification counts (tables, views, users, events)

### Dev seed bundle (`dev.manifest`)

Applied by **`rebuild-local-database.ps1`** locally and by **`deploy/scripts/seed-dev-environment.sh`** when **`SEED_DEV_DATA=true`** (Dokploy / eventsystem.fun test deploys; tracked in **`public.schema_seeds`**).

`EVENT_TYPES` and `SECRET_QUESTIONS` live in **`baseline_reference_data.sql`** (not repeated in the seed manifest). Current manifest order:

| Seed | Purpose |
|------|---------|
| `005` + `005a` | **1000** superhero/supervillain users (see below) |
| `003` | Dummy users |
| `004` | Owner account (`dancingevilgenius`) |
| `007` | App roles for `dancingevilgenius` (all ten roles) |
| `008`–`011` | Fictional demo event groups and instances |
| `016` | Merchandise POS demo |
| `012` | Demo attendees (`api.generate_demo_attendees_core` — all demo groups in recent years) |
| `017` | Re-run attendee generation for deploys that applied `012` before robot/kart were included |
| `013`–`014` | Governing body and static list |
| `015` | Local deployment info |

Legacy **`006_user_superhero_followers.sql`** and seeds `005b`/`005c`/`002*` are **not** in the manifest (superseded or folded into baseline).

Set **`SEED_DEV_DATA=false`** (or omit) on production **`eventsystem.pro`** so migrate applies schema only.

### Migrations vs seeds

| Kind | When | Tracked in prod |
|------|------|-----------------|
| **Migrations** | Schema/API changes for all environments | Yes (`deploy/scripts/migrate.sh`) |
| **Seeds** | Local dev data only | No |

### Passwordless local `psql`

`scripts/configure-local-postgres-trust.ps1` enables trust auth on localhost only (dev machine). PostgREST Docker still uses the `authenticator` role password from `.env`.

---

## Fictional demo events

Fictional **`event_group`** rows are seeded in `008`–`010` with `more_json = {"demo": true}`.

### Event instances (seed `011`)

Generated by **`scripts/generate-fictional-event-seed.py`** → `database/seeds/011_event_fictional_instances.sql`.

| Instance | Approx. timing | `start_date` anchor |
|----------|----------------|-------------------|
| **I** | ~12 months ago | June **2025** |
| **II** | ~today | June **2026** |
| **III** | ~12 months ahead | June **2027** |

Per event row:

- **3–5** `number_of_days` (deterministic random per row)
- `end_date = start_date + number_of_days`
- `name` = `event_group.full_name` + year, or full name + Roman suffix (~32% of groups)
- `location_json` includes a fictitious venue name
- `created_by = 'c-agent'`
- After insert: `event.more_json.demo` copied from parent `event_group`

Re-run safety: deletes attendees for those groups, then deletes prior fictional-group events, then re-inserts.

### Nightly demo date shift

`api.nightly_cleanup()` (migration `031`) advances **`start_date`** and **`end_date`** by **1 day** for all events whose `event_group.more_json.demo = true`. Intended for scheduled maintenance, not the front-end.

---

## JSON vs JSONB

| Use | Type | Examples in this project |
|-----|------|--------------------------|
| Query/filter/update nested keys, indexes | **`jsonb`** | `more_json`, `contest.competitors_json`, `judging_panel.judges_json` |
| Store/return blob unchanged, legacy columns | **`json`** | Some `user` JSON columns, `location_json` on `event` (varchar/json legacy) |

Prefer **`jsonb`** for new columns that will be queried or merged.

---

## Admin contests and results

### Admin contests (`/admin/contests`)

- Shows three contest buttons (**Contest 1–3**).
- Each button navigates to **`/admin/contests/contest`** (same destination for all three for now).

### Admin contest results (`/admin/contests/contest`)

- **`AdminContestResultsPage`** — admin view of contest results (see that file for current behavior).
- **Back** returns toward admin contests / admin home per page wiring.

---

## Staff and contest selection

- **`StaffPage`** = `ContestSelectionPage` with `title="Staff"` and **`contestRoute="/judging"`**.
- **`CompetitorPage`** = same layout with `title="Competitor"` and **no** `contestRoute` (buttons inert).
- Shared layout: three **Contest 1–3** buttons, **Back to Home** → `/home`.

---

## Lookup table (`_lu`) seeds

Reference/lookup tables (`event_type_lu`, `secret_question_lu`, etc.) use audit columns like other tables. Baseline and migration `024` expect **`created_by = 'c-agent'`** on `_lu` seed rows with **`modified_by` / `modified_date` NULL**.

Countries and US states are stored in **`static_list`** (`COUNTRIES`, `US_STATES`); the obsolete `country_lu` / `us_state_lu` tables were removed in migration `069`.

---

## Owner dev account

Seed **`004_user_carlos.sql`** creates **`dancingevilgenius`** (project owner). Default password: **`ChangeMeFool!`** (reset via `scripts/reset_dancingevilgenius_password.sql`). Seed **`007`** grants **all ten app roles** to that user.

---

## Superhero user seed (`005`)

Generated by **`scripts/generate-superhero-user-seed.py`** → **`database/seeds/005_user_superheroes.sql`** (+ **`005a_update_superhero_addresses.sql`**).

| Rule | Value |
|------|--------|
| Target count | **1000** users |
| Theme | Marvel / DC heroes and villains (+ synthetic codenames from **`superhero_roster_synthetic.py`**) |
| Username | Unique; normalized alphanumeric, max 64 chars |
| Name | **First** and **last** required on every row |
| Reject | Username must **not** equal normalized **`first + last`** (e.g. reject `batman` / Bat / Man; keep `batman` / Bruce / Wayne) |
| Credentials | Password = username; email = `{username}@superhero.com` |
| Re-run | `INSERT … WHERE NOT EXISTS` by username; safe to re-apply |

Regenerate after roster changes:

```bash
python scripts/generate-superhero-user-seed.py
```

Example logins: **`superman`** / **`superman`**, **`batman`** / **`batman`**.

---

## Database migrations

### File naming

- Files live in **`database/migrations/`** as **`NNN_short_description.sql`** (three-digit prefix, sorted lexically).
- Each file should be idempotent where practical (`IF NOT EXISTS`, `CREATE OR REPLACE`).
- End migrations that change the API with **`NOTIFY pgrst, 'reload schema';`** when PostgREST is running.
- After folding a migration into the baseline bundle (`evp_schema_postgresql.sql` and/or `baseline_reference_data.sql`), add its filename pattern to **`database/superseded-by-baseline.manifest`** (read by `migrate.sh` and `rebuild-local-database.ps1`). See **`database/BASELINE-REBASELINE-CHECKLIST.md`**.

### Agent-written SQL updates

When the agent updates rows in migrations (non-seed):

- Set **`modified_by = 'c-agent'`** and **`modified_date = CURRENT_TIMESTAMP`**.
- Application RPCs use **`api.set_audit_actor(username)`** before `UPDATE`; REST PATCH can use the JWT username trigger from migration `026`.

---

## Admin contest results (mock)

**`/admin/contests/contest`** (`AdminContestResultsPage`) currently shows **mock** relative-placement results:

- Data from **`buildMockContestResults()`** (fixed per page load via `useMemo`).
- Wide table layout: `Container maxWidth="lg"` (exception to the usual `md` card).
- Columns: Place, Bib, Couple, one column per mock judge sheet.
- **Back to Contests** → `/admin/contests`.

---

## Attendee `contests_json`

Optional **`contests_json`** on **`attendee`** (`json`, default `NULL`) holds per-attendee contest enrollment data. Exposed on **`api.attendee`** view. Demo attendee seed does not populate it yet.

---

## Frontend construction rules (Cursor)

### Bold text labels

Field labels (form captions, read-only field names like **Schedule**, **Last run**, **Status**) should use **`fontWeight: 700`** (or `bold`) in `sx` so they read as labels, not values. Does not apply to body copy, buttons, chips, or page titles. Cursor rule: `.cursor/rules/bold-text-labels.mdc`.

### MUI v9 styling (`sx` prop)

This project uses **@mui/material v9**. Put layout/typography CSS-like values in **`sx`**, not as legacy system props (`fontWeight`, `alignItems`, `width`, etc. on `Typography` / `Stack` / `Box`). Still OK as direct props: `variant`, `color`, `direction`, `spacing`, `component`, `onClick`, etc. Cursor rule: `.cursor/rules/mui-v9-sx-styling.mdc`. Run `npm run build` in the front-end package when touching MUI components.

---

## Technical constraints

- **Icons:** Prefer local SVG components (`CloseIcon`, `PaletteOutlinedIcon`, `DragHandleIcon`, etc.). **`@mui/icons-material`** is allowed for small status/decorative icons (e.g. Add Event section status).
- Judging entries are generated once per page load; random data does not change until the page is reloaded.
- Score digit dropdown interactions must not propagate to the accordion header.
