import { createTheme, type Theme } from "@mui/material";
import { lightSkin } from "@/skins/light";
import { darkSkin } from "@/skins/dark";
import type { Skin } from "@/skins/light";

export const skins: Skin[] = [lightSkin, darkSkin];

export const DEFAULT_SKIN_ID = "light";
export const LEGACY_SKIN_ID = "default";
export const SKIN_STORAGE_KEY = "event-system-pro.skin-id";

export function resolveSkinId(stored: string | null | undefined): string {
  if (!stored || stored === LEGACY_SKIN_ID) return DEFAULT_SKIN_ID;
  return skins.some((s) => s.id === stored) ? stored : DEFAULT_SKIN_ID;
}

export function getSkin(id: string): Skin {
  return skins.find((s) => s.id === id) ?? lightSkin;
}

export function createAppTheme(skin: Skin): Theme {
  return createTheme(skin.themeOptions);
}

export type { Skin };
