import { useContext } from "react";
import { ThemeSwitcherContext } from "@/context/AppThemeProvider";

export function useThemeSwitcher() {
  const ctx = useContext(ThemeSwitcherContext);
  if (!ctx) {
    throw new Error("useThemeSwitcher must be used inside AppThemeProvider");
  }
  return ctx;
}
