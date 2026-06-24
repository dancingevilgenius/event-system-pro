import { createContext } from 'react';
import type { SkinDefinition, SkinId } from '../skins/types';

export type AppThemeContextValue = {
  skinId: SkinId;
  currentSkin: SkinDefinition;
  skins: SkinDefinition[];
  setSkinId: (skinId: SkinId) => void;
};

export const AppThemeContext = createContext<AppThemeContextValue | null>(null);
