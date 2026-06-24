# Front Ends

This folder contains multiple React front-end applications for Event System Pro.

| Project | Stack | Description |
|---------|-------|-------------|
| [front-end-cursor](./front-end-cursor) | React, Vite, TypeScript, MUI | Primary front-end scaffold |

Each app uses **React (Vite)** and will communicate with backend services via **REST**.

## front-end-cursor

```bash
cd front-end-cursor
npm install
npm run dev
```

### Routes

| Path | Page |
|------|------|
| `/` | Login / Register entry |
| `/register` | New user registration (name, address, phone) |
| `/home` | Placeholder page after login |

### Theming / skins

Skins live in `src/skins/`. Each skin exports MUI `ThemeOptions`. The active skin is managed by `AppThemeProvider` and persisted to `localStorage`.

```tsx
import { useThemeSwitcher } from './hooks/useThemeSwitcher';

const { skinId, setSkin, skins } = useThemeSwitcher();
```

Add a new skin by creating `src/skins/my-skin.ts`, registering it in `src/skins/index.ts`, and extending the `SkinId` union in `src/skins/types.ts`.
