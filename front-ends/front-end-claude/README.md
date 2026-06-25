# Event System Pro — Judging

A React + TypeScript + Material UI implementation of the Judging page and
related flows, built from the `application-rules.md` spec.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`) in a
browser or mobile device on the same network.

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Routes

| Route | Page |
|---|---|
| `/` | Login (any credentials accepted, no real auth yet) |
| `/home` | Home — entry point to Staff |
| `/staff` | Staff — entry point to Contest / Judging |
| `/judging` | Judging page |
| anything else | redirects to `/` |

## What's implemented

- **Competitor generation**: 20 couples per page load, unique ascending bib
  numbers (1–999), Leader/Follower drawn from a Legion of Super-Heroes /
  Shi'ar Imperial Guard–inspired name pool, with the 90/10 sex-preference
  rule, no character reused across the dataset, and names filtered against
  the banned-word list (`src/utils/nameSelection.ts`).
- **Accordion behavior**: single open panel, sort/filter freezes while a
  panel is open, re-sorts only on collapse / switching panels / changing the
  dropdown (`src/pages/JudgingPage.tsx`).
- **Raw Score**: 4 independent digit dropdowns (0–9) forming `XX.XX`,
  blank-until-touched display, "scored" defined as touched AND > 0.00
  (`src/types/judgingScore.ts`, `src/components/RawScoreInput.tsx`).
- **Assign Random Scores**: bulk dropdown action, scores 30.0–99.9, marks all
  touched, switches sort, closes any open panel.
- **Sorting/filtering**: bib #, raw score (unscored sinks to the bottom),
  leader/follower last name, Unscored Only — all with bib # as tiebreaker.
- **Duplicate score resolution**: dialog on panel close when a duplicate is
  detected, +0.1 preferred fix with a −0.1 fallback on the other couple if
  the nudge would collide, re-sorts live if sort is by Raw Score even with
  another panel still open.
- **Color picking**: 8×14 generated palette, two-stage top/bottom picker
  with auto-save on the second pick, backdrop-saves-one-pick behavior, per
  bib+role storage.
- **Progressive name shortening** in the summary row based on available
  width and swatch space.
- **Mobile-aware `AppTextField`**: scroll-into-view on focus, tap-container-
  to-focus, sensible `enterKeyHint`/`inputMode` defaults, numeric mode with
  max length for phone/zip-style fields.
- **360px content cap**, centered, used throughout.
- Local SVG icons only — no `@mui/icons-material` dependency.

## Notes / assumptions

- The character name pool is original content inspired by the two named
  universes (civilian-style first/last name pairs), not verbatim character
  names, and has been checked programmatically against the excluded-word
  list and for uniqueness.
- The color palette is procedurally generated (8 hue columns × 14
  lightness/saturation rows) rather than 112 hand-picked hex values, so it's
  a coherent swatch book rather than arbitrary colors.
- Register page and its numeric-field behavior are described in the spec but
  no Register page exists yet elsewhere in the rules doc, so it isn't
  included as a route — `AppTextField`'s `numeric`/`maxLength` props are
  ready for it when that page is built.
