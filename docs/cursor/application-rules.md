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
| Duplicate score dialog | `front-ends/front-end-cursor/src/components/DuplicateScoreDialog.tsx` |
| Progress bar | `front-ends/front-end-cursor/src/components/PercentCompleteBar.tsx` |
| Layout constants | `front-ends/front-end-cursor/src/constants/layout.ts` |
| Routes | `front-ends/front-end-cursor/src/App.tsx` |

---

## General layout and navigation

- Main content blocks (messages, buttons, fields, dropdowns) are capped at **360px** wide and centered (`CONTENT_MAX_WIDTH`).
- Default route is **Login** (`/`). Unknown URLs redirect to login.
- Staff reaches Judging via **Staff → Contest**, which navigates to `/judging`.
- Judging **Submit** and **Back to Staff** both return to `/staff`.
- Login currently accepts any credentials and navigates to `/home` (no real authentication yet).

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
- **Collapsed row** shows: `bib # | color swatches + names | score`
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
- Colors are chosen from a fixed palette (**8 columns × 14 rows**).
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

---

## Name display in summary row

- Names are shown as `Leader · Follower`.
- If space is tight, names shorten progressively:
  1. Both full first names
  2. Leader initial + follower full
  3. Leader full + follower initial
  4. Both initials
- Shortening accounts for space taken by color swatches.

---

## Mobile and form behavior (Login / Register)

- **AppTextField** on mobile:
  - Scrolls focused field into view when the keyboard opens
  - Tapping the field container focuses the input
  - Default `enterKeyHint`: **done** (single-line) or **enter** (multiline)
  - Default `inputMode`: **text** (password fields excluded)
- Register numeric fields use `inputMode: numeric` with max lengths on phone/zip fields.

---

## Technical constraints

- **No `@mui/icons-material`** — icons are local SVGs (`CloseIcon`, `PaletteOutlinedIcon`, etc.).
- Judging entries are generated once per page load; random data does not change until the page is reloaded.
- Score digit dropdown interactions must not propagate to the accordion header.
