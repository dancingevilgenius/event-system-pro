import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  createAppTheme,
  getSkin,
  resolveSkinId,
  skins,
  SKIN_STORAGE_KEY,
  type Skin,
} from "@/skins";

interface ThemeSwitcherCtx {
  skinId: string;
  setSkin: (id: string) => void;
  skins: Skin[];
  currentSkin: Skin;
}

export const ThemeSwitcherContext = createContext<ThemeSwitcherCtx | null>(
  null
);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [skinId, setSkinIdState] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    return resolveSkinId(window.localStorage.getItem(SKIN_STORAGE_KEY));
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SKIN_STORAGE_KEY, skinId);
    } catch {
      /* noop */
    }
  }, [skinId]);

  const setSkin = useCallback((id: string) => {
    setSkinIdState(resolveSkinId(id));
  }, []);

  const currentSkin = getSkin(skinId);
  const theme = useMemo(() => createAppTheme(currentSkin), [currentSkin]);

  const value: ThemeSwitcherCtx = {
    skinId,
    setSkin,
    skins,
    currentSkin,
  };

  return (
    <ThemeSwitcherContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSwitcherContext.Provider>
  );
}
