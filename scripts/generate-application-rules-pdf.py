"""Generate Application Rules PDF for Event System Pro."""

from pathlib import Path

from fpdf import FPDF

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "docs" / "cursor" / "application-rules.pdf"

PALETTE_ROWS: list[tuple[str, list[tuple[str, str]]]] = [
    (
        "Row 1 - Neutral (black to white)",
        [
            ("#000000", "rgb(0, 0, 0)"),
            ("#1f1f1f", "rgb(31, 31, 31)"),
            ("#3d3d3d", "rgb(61, 61, 61)"),
            ("#5c5c5c", "rgb(92, 92, 92)"),
            ("#7a7a7a", "rgb(122, 122, 122)"),
            ("#999999", "rgb(153, 153, 153)"),
            ("#d9d9d9", "rgb(217, 217, 217)"),
            ("#ffffff", "rgb(255, 255, 255)"),
        ],
    ),
    (
        "Row 2 - Blue gradient",
        [
            ("#193a56", "rgb(25, 58, 86)"),
            ("#1d4a76", "rgb(29, 74, 118)"),
            ("#205898", "rgb(32, 88, 152)"),
            ("#2264bb", "rgb(34, 100, 187)"),
            ("#236ede", "rgb(35, 110, 222)"),
            ("#3e7ce7", "rgb(62, 124, 231)"),
            ("#5a8cf0", "rgb(90, 140, 240)"),
            ("#789ef6", "rgb(120, 158, 246)"),
        ],
    ),
    (
        "Row 3 - Purple gradient",
        [
            ("#3c1f5a", "rgb(60, 31, 90)"),
            ("#502477", "rgb(80, 36, 119)"),
            ("#662895", "rgb(102, 40, 149)"),
            ("#7f29b5", "rgb(127, 41, 181)"),
            ("#9a2ad5", "rgb(154, 42, 213)"),
            ("#b041e0", "rgb(176, 65, 224)"),
            ("#c359e9", "rgb(195, 89, 233)"),
            ("#d573f1", "rgb(213, 115, 241)"),
        ],
    ),
    (
        "Row 4 - Red gradient",
        [
            ("#4d181e", "rgb(77, 24, 30)"),
            ("#6b1d24", "rgb(107, 29, 36)"),
            ("#8c1f27", "rgb(140, 31, 39)"),
            ("#ae2027", "rgb(174, 32, 39)"),
            ("#d21f23", "rgb(210, 31, 35)"),
            ("#e62e2e", "rgb(230, 46, 46)"),
            ("#ef4d48", "rgb(239, 77, 72)"),
            ("#f66b63", "rgb(246, 107, 99)"),
        ],
    ),
    (
        "Row 5 - Brown gradient",
        [
            ("#3a2a21", "rgb(58, 42, 33)"),
            ("#4d3627", "rgb(77, 54, 39)"),
            ("#60432c", "rgb(96, 67, 44)"),
            ("#744f31", "rgb(116, 79, 49)"),
            ("#8a5d34", "rgb(138, 93, 52)"),
            ("#a16c36", "rgb(161, 108, 54)"),
            ("#b87b37", "rgb(184, 123, 55)"),
            ("#cb8c3d", "rgb(203, 140, 61)"),
        ],
    ),
    (
        "Row 6 - Green gradient",
        [
            ("#1e471f", "rgb(30, 71, 31)"),
            ("#246229", "rgb(36, 98, 41)"),
            ("#297f34", "rgb(41, 127, 52)"),
            ("#2c9e40", "rgb(44, 158, 64)"),
            ("#2dbe4d", "rgb(45, 190, 77)"),
            ("#36d762", "rgb(54, 215, 98)"),
            ("#4ce27d", "rgb(76, 226, 125)"),
            ("#64eb97", "rgb(100, 235, 151)"),
        ],
    ),
    (
        "Row 7 - Yellow gradient",
        [
            ("#997528", "rgb(153, 117, 40)"),
            ("#b78f29", "rgb(183, 143, 41)"),
            ("#d6ab2b", "rgb(214, 171, 43)"),
            ("#e0be41", "rgb(224, 190, 65)"),
            ("#e9cf58", "rgb(233, 207, 88)"),
            ("#f1dd70", "rgb(241, 221, 112)"),
            ("#f7ea8b", "rgb(247, 234, 139)"),
            ("#fbf4a6", "rgb(251, 244, 166)"),
        ],
    ),
    (
        "Row 8 - Neon assortment",
        [
            ("#fa2d9a", "rgb(250, 45, 154)"),
            ("#fce620", "rgb(252, 230, 32)"),
            ("#1bf513", "rgb(27, 245, 19)"),
            ("#07f7c7", "rgb(7, 247, 199)"),
            ("#19cdfa", "rgb(25, 205, 250)"),
            ("#b729f3", "rgb(183, 41, 243)"),
            ("#91fc16", "rgb(145, 252, 22)"),
            ("#fa6a2d", "rgb(250, 106, 45)"),
        ],
    ),
]


class RulesPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 14)
        self.cell(0, 10, "Event System Pro - Application Rules", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def section_title(self, title: str):
        self.ln(4)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(0, 0, 0)
        self.multi_cell(self.epw, 7, title)
        self.ln(1)

    def subsection_title(self, title: str):
        self.ln(2)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 10)
        self.multi_cell(self.epw, 6, title)

    def body_text(self, text: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.multi_cell(self.epw, 5, text)
        self.ln(1)

    def bullet(self, text: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.multi_cell(self.epw, 5, f"  -  {text}")

    def palette_row_table(self, title: str, cells: list[tuple[str, str]]) -> None:
        self.subsection_title(title)
        self.set_font("Helvetica", "", 7)
        for col, (hex_value, rgb_value) in enumerate(cells, start=1):
            self.set_x(self.l_margin)
            self.multi_cell(self.epw, 3.5, f"  Col {col}: {hex_value}  {rgb_value}")
        self.ln(1)


def build_pdf() -> None:
    pdf = RulesPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    pdf.body_text(
        "Plain-language summary of rules, restrictions, and constraints "
        "for the Event System Pro front-end and related database/demo-data conventions."
    )

    pdf.section_title("General layout and navigation")
    for item in [
        "Main content blocks (messages, buttons, fields, dropdowns) are capped at 360px wide and centered.",
        "Default route is Login (/). Unknown URLs redirect to login.",
        "Public routes: /, /register, /forgot-password.",
        "Protected routes require a signed-in session (see Authentication and Roles).",
        "Staff reaches Judging via Staff -> Contest, which goes to /judging.",
        "Judging Submit and Back to Staff both return to /staff.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Authentication and session")
    for item in [
        "Login calls PostgREST RPC api.login with username or email and password.",
        "Passwords verified with bcrypt on the server.",
        "On success: session in sessionStorage (esp_session) with user_id, username, email, roles, JWT token.",
        "Authenticated API calls send Authorization: Bearer <token>.",
        "Logout clears session and returns to /.",
        "Sign in again after DB auth or role changes so JWT includes current roles.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Roles and route guards")
    pdf.body_text(
        "Seven roles: admin, staff, judge, headjudge, registration, floorcoordinator, competitor."
    )
    for item in [
        "ProtectedRoute: no session -> /; missing role -> /home.",
        "Admin role passes any role check.",
        "/home, /account, /changepassword: any signed-in user.",
        "/staff, /judging: staff or admin.",
        "/competitor: competitor or admin.",
        "/adminhome, /admin/*: admin only.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Home page (/home)")
    for item in [
        "After login, user lands on Home (role hub).",
        "Buttons: Staff (/staff), Competitor (/competitor), Admin (/adminhome), Account (/account).",
        "Skin dropdown (ThemeSwitcher) below navigation buttons.",
        "Back to Login logs out and returns to /.",
        "Test Messages is on Admin home, not Home.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Admin section")
    for item in [
        "Admin home: Event Details, Contests, Competitors, Competition Entries, Staff, Generate Attendees.",
        "Generate Attendees calls api.generate_demo_attendees (admin JWT); regenerates demo attendee_id 1-3000.",
        "Test Messages on Admin home shows one success, warning, and problem alert.",
        "Event Details and Competition Entries are placeholders.",
        "Contests page navigates to /admin/contests/contest (results).",
        "Admin competitors: paginated user table; 25 rows desktop, 10 mobile.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Competitor page (/competitor) - placeholder")
    for item in [
        "Opened from the Competitor button on Home.",
        'Page title: Competitor (ContestSelectionPage with title="Competitor").',
        "Three full-width buttons: Contest 1, Contest 2, Contest 3.",
        "Contest buttons are placeholders - they do not navigate anywhere (no contestRoute).",
        "Back to Home button navigates to /home.",
        "Same layout shell as Staff but without a working contest destination yet.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Message boxes")
    pdf.body_text(
        "App-wide stacked alerts at the top of the screen (not Judging-specific). "
        "Wrapped by MessageProvider in main.tsx."
    )
    pdf.subsection_title("Types and appearance")
    for item in [
        "Three message types: success, warning, and problem.",
        "Each type uses a distinct outlined MUI Alert color scheme (green, amber, red).",
        "Fixed at top center (top: 16px), capped at 360px wide (CONTENT_MAX_WIDTH).",
        "Container uses aria-live: polite for screen readers.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Stacking and dismissal")
    for item in [
        "Multiple messages can be visible at the same time, stacked vertically.",
        "Messages do not auto-dismiss - they persist until the user clicks one.",
        "Clicking a message plays a collapse animation (~350ms), then removes it.",
        "New messages slide in from above when added.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("API and usage")
    for item in [
        "Any page can call useMessages() (must be inside MessageProvider).",
        "Show messages with showSuccess(text), showWarning(text), or showProblem(text).",
        "clearMessages() removes all messages immediately (no exit animation).",
        "dismissMessage(id) removes a single message immediately (after collapse animation).",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Page-specific behavior")
    for item in [
        "Login, Register, and Forgot password call clearMessages() on mount.",
        "Admin home has a Test Messages button that clears the stack, then shows one of each type:",
        "  Success: Your change has been saved.",
        "  Warning: Your event starts in less than 15 min.",
        "  Problem: Your sign in time has passed.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Theme / skin switcher")
    pdf.body_text(
        "App-wide MUI theming via skins. AppThemeProvider wraps the app in main.tsx."
    )
    pdf.subsection_title("Home page placement")
    for item in [
        "Home page (/home) exposes the skin control via ThemeSwitcher.",
        "Layout order: Staff and Competitor buttons, then Skin dropdown, then Test Messages and Back to Login.",
        "Dropdown uses the same 360px centered width as other main controls.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Dropdown behavior")
    for item in [
        'MUI Select with label "Skin" (FormControl, size small, full width).',
        "Two options: Light and Dark.",
        "Changing the selection updates the active skin immediately across the entire app.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Persistence")
    for item in [
        "Selected skin id saved to localStorage key event-system-pro.skin-id.",
        "On load, stored value is applied; invalid or missing values fall back to Light.",
        "Legacy stored value default is treated as Light.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("App-wide application")
    for item in [
        "AppThemeProvider builds MUI theme from active skin and supplies ThemeProvider + CssBaseline.",
        "All pages inherit the current skin.",
        "useThemeSwitcher() exposes skinId, setSkin, skins, and currentSkin.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Judging page - competitor data")
    for item in [
        "Each session shows 20 couples (accordion rows).",
        "Each couple has a bib number (1-999, unique within the set, sorted ascending), a Leader, and a Follower (first + last name).",
        "Names come from Legion of Super-Heroes (DC) and Shi'ar Imperial Guard (Marvel-inspired) pools.",
        "Each character has a sex value (male or female) based on common comic portrayals.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Name selection rules")
    for item in [
        "Leader: pick a male character 90% of the time.",
        "Follower: pick a female character 90% of the time.",
        "The other 10% can be anyone still available in the pool.",
        "A character may appear only once in the whole dataset, in either Leader or Follower slot.",
        "Names are excluded if first or last name contains any whole word: boy, girl, lad, lass, man, woman (also ladd).",
    ]:
        pdf.bullet(item)

    pdf.section_title("Accordion behavior")
    for item in [
        "Only one panel can be open at a time.",
        "Collapsed row (accordion title): bib # | leader swatch * names * follower swatch | score.",
        "Leader color cell (when set) is to the left of the leader name.",
        "Follower color cell (when set) is to the right of the follower name.",
        "Names between swatches: Leader * Follower.",
        "Expanded row shows: Raw Score first, then leader and follower rows (with color picking).",
        "Clicking inside expanded details does not collapse the accordion.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Sort/filter freeze while editing")
    for item in [
        "While a panel is open, the list does not re-sort or re-filter, even if scores change or the sort/filter dropdown changes.",
        "Re-sort/re-filter happens when the user collapses the open panel or opens a different panel.",
        "Changing the sort/filter dropdown always closes any open panel and applies the new option immediately.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Raw scores")
    for item in [
        'Label is "Raw Score".',
        "Entered with 4 digit dropdowns (0-9), displayed as XX.XX (e.g. 87.43).",
        "Score range: 0.00 to 99.99.",
        "Summary score area is blank until the score has been touched/changed.",
        "Once any digit changes, the score shows in the collapsed header immediately.",
        "A couple counts as scored only if raw score is greater than 0.0 (not merely touched at 0.00).",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Assign Random Scores")
    for item in [
        "Dropdown action (not a persistent sort mode).",
        "Sets every couple to a random score between 30.0 and 99.9.",
        "Marks all as touched, switches sort to Sort by Raw Score, and closes any open panel.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Sorting and filtering")
    pdf.body_text("Dropdown options:")
    for item in [
        "Sort by Bib #: ascending bib number (default).",
        "Sort by Raw Score: highest score first; unscored/touched-at-zero at bottom; bib # breaks ties.",
        "Sort by Leader's Last Name: A-Z; bib # breaks ties.",
        "Sort by Follower's Last Name: A-Z; bib # breaks ties.",
        "Unscored Only: hides couples with a non-zero raw score.",
        "Assign Random Scores: bulk random scoring (see above).",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Additional sort rules")
    for item in [
        "When 100% complete is first reached, sort automatically switches to Sort by Raw Score.",
        "Unscored Only treats a couple as unscored if never touched, or touched but still <= 0.0.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Progress and submit")
    for item in [
        'Top of page shows Percent Complete bar (replaces old "Judging" header).',
        "Progress = couples with non-zero raw score / 20 x 100.",
        "Text: Percent Complete: X%.",
        "At 100%, the bar becomes a Submit button.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Duplicate raw scores")
    pdf.body_text(
        "When an accordion closes (collapse, switch panels, or change sort/filter while one was open), "
        "if that couple's raw score matches another couple's score (> 0), open the Duplicate Score dialog."
    )
    pdf.subsection_title("Dialog rules")
    for item in [
        "Title: Duplicate Score.",
        "Close X in top-right (dismisses without changing scores).",
        "Two choices using leader and follower first names: put the current couple higher, or put the other couple higher.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Resolution logic")
    for item in [
        "Preferred fix: raise the chosen couple's score by +0.1.",
        "If +0.1 would collide with someone else's score: leave the chosen couple alone and lower the other duplicate couple by 0.1 instead.",
        "Scores stay within 0.00-99.99.",
        "After a choice, if sort is Sort by Raw Score, the list re-sorts to reflect new scores (including when another panel is still open).",
    ]:
        pdf.bullet(item)

    pdf.section_title("Color picking")
    for item in [
        "Each leader and follower can have two colors: top and bottom.",
        "Colors are chosen from a fixed palette (8 columns x 8 rows).",
        "Palette source: front-ends/front-end-cursor/src/data/judgingColorPalette.ts.",
        "Color picker dialog width matches accordion content (360px max).",
        "Palette icon opens the dialog if no colors yet; swatch opens it if colors exist.",
        "First click sets top color; second click sets bottom color, then auto-save and close.",
        "Titles: Pick Top Color for {firstname}, then Pick Bottom Color {firstname}.",
        "X cancels without saving.",
        "Reopening shows prior selections; first click replaces top, second replaces bottom.",
        "After one pick in a session, clicking the backdrop saves that one color and closes.",
        "Color swatches appear in the collapsed summary when at least one color is set.",
        "Colors are stored per bib + role (leader or follower).",
        "Hover a swatch in the dialog to see its HEX and RGB designation.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Color palette (8 x 8)")
    pdf.body_text(
        "Rows are listed top to bottom; columns left to right. Row 1 uses fixed hex values. "
        "Rows 2-7 are hue gradients (stored as HSL in code); HEX and RGB below are rendered equivalents. "
        "Row 8 is a fixed neon assortment (HSL in code)."
    )
    for row_title, cells in PALETTE_ROWS:
        pdf.palette_row_table(row_title, cells)

    pdf.subsection_title("Color swatch shape")
    for item in [
        "Each competitor's colors are shown in a square swatch cell (20x20px).",
        "Top color fills the top half of the square; bottom color fills the bottom half.",
        "The cell is split horizontally (top over bottom), not side-by-side.",
        "In the expanded accordion, the swatch (or palette icon) is on the left of each leader/follower name; name is to the right.",
        "In the collapsed accordion title, the same split square cells appear when colors are set.",
        "Leader swatch: immediately to the left of the leader (first) name.",
        "Follower swatch: immediately to the right of the follower (second) name.",
        "If only top is set (no bottom yet), top fills the entire square until bottom is chosen.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Name display in summary row")
    for item in [
        "Names are shown as Leader * Follower in the collapsed accordion title.",
        "Leader color swatch (when set) is to the left of the leader name.",
        "Follower color swatch (when set) is to the right of the follower name.",
        "If space is tight, names shorten progressively: both full -> leader initial -> follower initial -> both initials.",
        "Shortening accounts for space taken by color swatches.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Mobile-friendly layout")
    pdf.body_text(
        "The app is designed to be usable on phones as well as desktop - "
        "narrow, centered content rather than wide multi-column layouts."
    )
    pdf.subsection_title("Viewport and page shell")
    for item in [
        "index.html: width=device-width, initial-scale=1.0, interactive-widget=resizes-content.",
        "body uses min-height 100vh with no default margin.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Narrow centered column")
    for item in [
        "Primary content capped at 360px (CONTENT_MAX_WIDTH) and centered.",
        "Applies to messages, buttons, fields, dropdowns, and centeredContentStackSx stacks.",
        "MUI theme caps buttons and form controls at 360px.",
        "Pages use Container (sm on Login/Register, md elsewhere) with py: 6.",
        "Buttons in stacks use fullWidth within the centered column.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Touch and small screens")
    for item in [
        "useIsMobileDevice: coarse pointer, or screen <= 768px and touch-capable.",
        "Layout uses the narrow column; no separate desktop/mobile page layouts.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Dialogs and overlays")
    for item in [
        "Modals use Dialog fullWidth maxWidth xs.",
        "Message stack fixed at top with horizontal padding (px: 2).",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Judging on narrow widths")
    for item in [
        "Accordion summary names shorten when space is tight (ResizeObserver).",
        "Same accordion UI at all breakpoints; no mobile-only Judging layout.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Mobile and form behavior (Login / Register)")
    for item in [
        "AppTextField on mobile scrolls focused field into view when keyboard opens.",
        "Tapping the field container focuses the input.",
        "Default enterKeyHint: done (single-line) or enter (multiline).",
        "Default inputMode: text (password fields excluded).",
        "Register numeric fields use inputMode: numeric with max lengths on phone/zip fields.",
        "Outlined inputs use 16px font size to reduce unwanted zoom on focus (especially iOS).",
    ]:
        pdf.bullet(item)

    pdf.section_title("Database audit columns")
    pdf.body_text("Every public table uses created_date, created_by, modified_date, modified_by.")
    for item in [
        "created_date: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP.",
        "created_by: varchar(128) NOT NULL.",
        "modified_date / modified_by: NULL on insert; set on update.",
        "Do not use epoch placeholder defaults (1970-01-01, etc.).",
        "Seeds: created_by = c-agent; leave modified_* NULL.",
        "App users: created_by = username on register; modified_by = username on update.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Demo data and more_json")
    for item in [
        "event_group, event, and attendee each have more_json (jsonb).",
        'Demo flag key is "demo" (boolean), not is_demo.',
        "event_group: seeded with demo true/false.",
        "event: demo copied from parent event_group.",
        "attendee: demo copied from parent event on seed insert.",
        "charter table renamed to club; event.host_charter_id renamed to host_club_id.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Attendee demo data")
    for item in [
        "attendee_id 1-3000 reserved for demo seed data; production rows must be > 3000.",
        "Seed selects 5 random demo event_group trios (15 events) x 200 attendees = 3000 rows.",
        "created_date: 1-90 days before event start_date (same calendar year as event).",
        "Re-run deletes only attendee_id <= 3000; preserves rows above 3000.",
        "Admin Generate Attendees calls api.generate_demo_attendees (admin JWT required).",
        "CLI seed: database/seeds/012_attendee_seed.sql calls generate_demo_attendees_core.",
        "PostgREST needs PGRST_JWT_SECRET matching database app.jwt_secret for authenticated RPCs.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Repository layout")
    for item in [
        "front-ends/front-end-cursor: primary React + Vite + MUI app.",
        "back-ends/postgrest: PostgREST + Swagger + Mailpit + mailer (Docker).",
        "database/migrations: incremental schema/API; database/seeds: local dev data only.",
        "scripts/rebuild-local-database.ps1: full local DB rebuild.",
        "deploy/: Dokploy / production notes.",
    ]:
        pdf.bullet(item)

    pdf.section_title("App shell and provider order")
    for item in [
        "main.tsx order: AppThemeProvider -> MessageProvider -> AuthProvider -> BrowserRouter -> App.",
        "ActivityMonitor and LoginFlashHandler render above Routes in App.",
        "Inactivity timeout: 10 minutes; activity on clicks, form keydown, route changes.",
        "Server sync: touch_last_activity (30s debounce), session_status (every 15s).",
        "On expiry: warning message, logout, redirect to /.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Page layout shell")
    for item in [
        "Container maxWidth md (sm on Login/Register), Paper elevation 3, centered Stack.",
        "centeredContentStackSx: 360px max width, mx auto.",
        "Primary buttons: contained fullWidth; back buttons: outlined fullWidth.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Multi-section admin form pages (Add Event pattern)")
    pdf.body_text(
        "Reference: /create-event (AdminAddEventPage.tsx). Use for long admin workflows "
        "split into accordion panels with per-section progress."
    )
    pdf.subsection_title("Page shell")
    for item in [
        "Container maxWidth md, Paper elevation 3, centered h4 title (e.g. Add Event for {event_group_code}).",
        "Optional subtitle (event group full name); single Back outlined button at bottom.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Accordion sections")
    for item in [
        "Outlined MUI Accordion per logical block; only one top-level panel expanded at a time.",
        "Field UI in dedicated AddEvent*Section.tsx components; page owns cross-section shared state.",
        "Reorderable via @dnd-kit: DndContext + SortableContext; drag handle (DragHandleIcon) on left of summary only.",
        "stopPropagation on handle click; PointerSensor activation distance 8px; sectionOrder state + arrayMove.",
        "Inner accordions (e.g. Schedule Day 1, Day 2) expand independently.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Section status")
    for item in [
        "3-way toggle at bottom: Not Started (default), In Progress, Finalized.",
        "First field edit auto-sets In Progress (onFieldEdit); Finalized only via user toggle.",
        "Header icons: TaskAlt amber = In Progress; CheckCircle green = Finalized.",
        "Read-only fields must not call onFieldEdit. Schedule gates In Progress/Finalized until Date(s) valid.",
    ]:
        pdf.bullet(item)

    pdf.subsection_title("Form fields, schedule, and event group context")
    for item in [
        "AppTextField for text/select/datetime-local; 360px max via muiFormTheme.",
        "Single Day vs Multi-Day toggle; inclusive calendar-day count in lib/eventDates.ts.",
        "Schedule: warning Alert when no dates; inner day accordions when dates exist.",
        "Route /create-event; event_group_code from navigation state or sessionStorage.",
        "AddEventButton on all /event-groups/:code pages.",
        "Dark skin: lighten native calendar picker icons in muiFormTheme.ts and index.css [data-app-skin=dark].",
    ]:
        pdf.bullet(item)

    pdf.section_title("Environment variables (front-end)")
    for item in [
        "VITE_POSTGREST_URL (default http://localhost:3000).",
        "VITE_MAILER_URL (default http://localhost:3001).",
        "VITE_REALTIME_WS_URL (WebSocket POC).",
    ]:
        pdf.bullet(item)

    pdf.section_title("PostgREST API architecture")
    for item in [
        "HTTP API from PostgreSQL schema api only.",
        "Roles: anon, authenticated (JWT), authenticator (connection).",
        "Dev: migration 004 allows anon writes for Swagger.",
        "Prod: migration 021 revokes anon writes; JWT required for mutations.",
        "RPCs via POST /rpc/<name>; security definer functions enforce role checks.",
        "JWT claims: role=authenticated, sub=user_id, username, app_roles array.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Local database development")
    for item in [
        "rebuild-local-database.ps1: drop DB, baseline, migrations (skip superseded 005-007, 015, 027, 030), seeds 002-012.",
        "Migrations run in prod; seeds are local dev only.",
        "configure-local-postgres-trust.ps1: passwordless psql on localhost (dev only).",
    ]:
        pdf.bullet(item)

    pdf.section_title("Fictional demo events")
    for item in [
        "event_group seeds 008-010 with more_json.demo = true.",
        "Seed 011 generated by scripts/generate-fictional-event-seed.py.",
        "Three instances per group: ~2025, ~2026, ~2027 (June anchors).",
        "3-5 event days; end_date = start_date + days; event.more_json.demo from group.",
        "Re-run deletes attendees then events for fictional groups before re-insert.",
        "api.nightly_cleanup shifts demo event dates forward 1 day (scheduled maintenance).",
    ]:
        pdf.bullet(item)

    pdf.section_title("JSON vs JSONB")
    for item in [
        "Use jsonb for queryable/mergeable columns (more_json, competitors_json, judges_json).",
        "Use json for legacy blobs (some user columns, location_json).",
        "Prefer jsonb for new columns that will be queried.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Staff and contest selection")
    for item in [
        "StaffPage: ContestSelectionPage title=Staff, contestRoute=/judging.",
        "CompetitorPage: same layout, no contestRoute (buttons inert).",
        "Admin contests: three buttons all navigate to /admin/contests/contest.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Lookup tables and owner account")
    for item in [
        "_lu tables: created_by = c-agent on seed rows; modified_* NULL.",
        "dancingevilgenius dev account (seed 004); default password ChangeMeFool!",
        "Seed 007 grants all seven app roles to dancingevilgenius.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Database migrations")
    for item in [
        "Files: database/migrations/NNN_description.sql; sorted by prefix.",
        "Prefer idempotent DDL; NOTIFY pgrst reload schema after API changes.",
        "Superseded migrations skipped by rebuild-local-database.ps1 when folded into baseline.",
        "Agent UPDATE in migrations: modified_by = c-agent, modified_date = CURRENT_TIMESTAMP.",
        "App RPCs use api.set_audit_actor(username) before UPDATE.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Admin contest results (mock)")
    for item in [
        "/admin/contests/contest uses buildMockContestResults() (mock data per page load).",
        "Wide table layout (Container maxWidth lg); Place, Bib, Couple, judge columns.",
        "Back to Contests returns to /admin/contests.",
    ]:
        pdf.bullet(item)

    pdf.section_title("Technical constraints (implicit but enforced)")
    for item in [
        "Prefer local SVG icons (CloseIcon, DragHandleIcon, etc.); @mui/icons-material allowed for small status icons.",
        "Judging entries are generated once per page load (random bib numbers and names are fixed for that visit).",
        "Score digit dropdown clicks must not toggle the accordion (stopPropagation).",
    ]:
        pdf.bullet(item)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(OUTPUT_PATH)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
