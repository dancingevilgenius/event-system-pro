import { CssBaseline, ThemeProvider } from '@mui/material';
import { type ReactNode, useMemo, useState } from 'react';
import {
  DEFAULT_SKIN_ID,
  SKIN_STORAGE_KEY,
  skinList,
  skins,
} from '../skins';
import type { SkinId } from '../skins/types';
import { createAppTheme } from '../theme/createAppTheme';
import { AppThemeContext } from './AppThemeContext';

function readStoredSkinId(): SkinId {
  const stored = localStorage.getItem(SKIN_STORAGE_KEY);
  if (stored === 'default') {
    return DEFAULT_SKIN_ID;
  }
  if (stored && stored in skins) {
    return stored as SkinId;
  }
  return DEFAULT_SKIN_ID;
}

type AppThemeProviderProps = {
  children: ReactNode;
};

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [skinId, setSkinIdState] = useState<SkinId>(readStoredSkinId);

  const setSkinId = (nextSkinId: SkinId) => {
    setSkinIdState(nextSkinId);
    localStorage.setItem(SKIN_STORAGE_KEY, nextSkinId);
  };

  const theme = useMemo(() => createAppTheme(skinId), [skinId]);
  const currentSkin = skins[skinId];

  const value = useMemo(
    () => ({
      skinId,
      currentSkin,
      skins: skinList,
      setSkinId,
    }),
    [skinId, currentSkin],
  );

  return (
    <AppThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}
