# Event System Pro — Application Rules

Plain-language summary of rules, restrictions, and constraints for the **front-end-cursor** app (Judging page and related flows).

**Primary code locations**

| Area | Path |
|------|------|
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
| Routes | `front-ends/front-end-cursor/src/App.tsx` |
| Message stack UI | `front-ends/front-end-cursor/src/components/MessageStack.tsx` |
| Message provider / API | `front-ends/front-end-cursor/src/context/MessageProvider.tsx` |
| `useMessages` hook | `front-ends/front-end-cursor/src/hooks/useMessages.ts` |
| Theme switcher UI | `front-ends/front-end-cursor/src/components/ThemeSwitcher.tsx` |
| Theme provider | `front-ends/front-end-cursor/src/context/AppThemeProvider.tsx` |
| Skin definitions | `front-ends/front-end-cursor/src/skins/` |
| `useThemeSwitcher` hook | `front-ends/front-end-cursor/src/hooks/useThemeSwitcher.ts` |
| Home page | `front-ends/front-end-cursor/src/pages/HomePage.tsx` |
| Competitor placeholder page | `front-ends/front-end-cursor/src/pages/CompetitorPage.tsx` |
| Contest selection layout | `front-ends/front-end-cursor/src/pages/ContestSelectionPage.tsx` |
| Staff page | `front-ends/front-end-cursor/src/pages/StaffPage.tsx` |
| Mobile device detection | `front-ends/front-end-cursor/src/hooks/useIsMobileDevice.ts` |
| Viewport / page shell | `front-ends/front-end-cursor/index.html` |

---

## General layout and navigation

- Main content blocks (messages, buttons, fields, dropdowns) are capped at **360px** wide and centered (`CONTENT_MAX_WIDTH`).
- Default route is **Login** (`/`). Unknown URLs redirect to login.
- Staff reaches Judging via **Staff → Contest**, which navigates to `/judging`.
- Judging **Submit** and **Back to Staff** both return to `/staff`.
- Login currently accepts any credentials and navigates to `/home` (no real authentication yet).

### Home page (`/home`)

- After login, the user lands on **Home** (Staff / Competitor role selection).
- **Staff** button navigates to `/staff`.
- **Competitor** button navigates to `/competitor`.
- Other Home controls (Skin dropdown, Test Messages, Back to Login) are documented under **Theme / skin switcher** and **Message boxes**.

### Competitor page (`/competitor`) — placeholder

- Route: **`/competitor`**, opened from the **Competitor** button on Home.
- Page title: **Competitor** (`ContestSelectionPage` with `title="Competitor"`).
- Shows three full-width contest buttons: **Contest 1**, **Contest 2**, **Contest 3**.
- Contest buttons are **placeholders** — they do **not** navigate anywhere (`contestRoute` is not set).
- **Back to Home** button navigates to `/home`.
- Same layout shell as Staff (centered paper, 360px-wide button stack) but without a working contest destination yet.

---

## Message boxes

App-wide stacked alerts at the top of the screen (not Judging-specific). Wrapped by `MessageProvider` in `main.tsx`.

### Types and appearance

- Three message types: **success**, **warning**, and **problem**.
- Each type uses a distinct outlined **MUI Alert** color scheme (green, amber, red).
- The stack is **fixed** at the top center (`top: 16px`), capped at **360px** wide (`CONTENT_MAX_WIDTH`), same as other main content blocks.
- Container uses `aria-live="polite"` for screen readers.

### Stacking and dismissal

- Multiple messages can be visible **at the same time**, stacked vertically (newest appended below prior messages).
- Messages **do not auto-dismiss** — they persist until the user **clicks** one.
- Clicking a message plays a **collapse animation** (~350ms), then removes it from the stack.
- New messages **slide in** from above when added.

### API and usage

- Any page can call `useMessages()` (must be inside `MessageProvider`).
- Show messages with `showSuccess(text)`, `showWarning(text)`, or `showProblem(text)` — each returns the new message id.
- `clearMessages()` removes all messages immediately (no exit animation).
- `dismissMessage(id)` removes a single message immediately (used internally after the collapse animation).

### Page-specific behavior

- **Login** and **Register** call `clearMessages()` on mount so no stale messages carry over.
- **Home** has a **Test Messages** button that clears the stack, then shows one of each type:
  - Success: `Your change has been saved.`
  - Warning: `Your event starts in less than 15 min.`
  - Problem: `Your sign in time has passed.`

---

## Theme / skin switcher

App-wide MUI theming via **skins**. `AppThemeProvider` wraps the app in `main.tsx` (outside `MessageProvider` and the router).

### Home page placement

- The **Home** page (`/home`) exposes the skin control via `ThemeSwitcher`.
- Page layout order (top to bottom):
  1. **Staff** and **Competitor** navigation buttons
  2. **Skin** dropdown (`ThemeSwitcher`)
  3. **Test Messages** and **Back to Login** buttons
- The dropdown uses the same **360px** centered width as other main controls (`centeredContentStackSx`).

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
- All pages (Login, Register, Home, Staff, Judging, Competitor, etc.) inherit the current skin.
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

## Technical constraints

- **No `@mui/icons-material`** — icons are local SVGs (`CloseIcon`, `PaletteOutlinedIcon`, etc.).
- Judging entries are generated once per page load; random data does not change until the page is reloaded.
- Score digit dropdown interactions must not propagate to the accordion header.
