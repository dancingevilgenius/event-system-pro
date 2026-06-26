# Event System Pro — PRD

## Original Problem Statement
"I have a .md document. Build it with React/TypeScript and MaterialUI."
Document: application-rules.md (Event System Pro — Application Rules)

## Stack
- React 19 + TypeScript (CRA + craco)
- MUI v9 (no @mui/icons-material — local SVG icons)
- react-router v7
- Frontend-only (no backend; data generated once per page load)

## Pages / Routes
- `/` Login (any creds → /home)
- `/register` Register (any data → /)
- `/home` Role chooser + Skin dropdown + Test Messages + Back to Login
- `/staff` Contest 1/2/3 → /judging
- `/competitor` Contest 1/2/3 (placeholders, no navigation)
- `/judging` Main judging UI (20 couples)

## Implemented Features
- 360px centered narrow column on every page
- Theme switcher (Light/Dark) persisted to localStorage
- Message stack: success/warning/problem, stacked, click-to-dismiss with collapse anim
- Login/Register with mobile-friendly AppTextField (numeric inputMode, enterKeyHint, scrollIntoView)
- Judging: 20 couples, unique bib (1-999), Legion+Shi'ar character names, 90/10 sex pick rule, word exclusions
- Raw Score (4 digit dropdowns) with touched tracking
- Accordion (one open at a time, freezes order, propagation stopped on inner controls)
- Sort/Filter: Bib, Raw Score, Leader/Follower Last, Unscored Only, Assign Random Scores
- Auto switch to Sort by Raw Score on first 100%
- Duplicate score detection + resolution dialog (+0.1 or fallback -0.1)
- Color picking (8×14 palette, top + bottom, square split swatch, backdrop save, X cancel)
- Progressive name shortening via ResizeObserver
- Percent Complete bar → Submit at 100%

## Backlog (P1)
- Tighten color dialog backdrop logic (save partial when one color was picked)
- Polish dark theme palette + accent
- Subtle motion on accordion expand
- Add jest/RTL coverage

## Backlog (P2)
- Replace placeholders on /competitor with real contest screens
- Real authentication (currently login accepts any input)
- Persist judging session to localStorage (currently regenerated per load by design)

