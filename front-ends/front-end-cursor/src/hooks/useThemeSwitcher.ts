import { useContext } from 'react';
import { AppThemeContext } from '../context/AppThemeContext';
import type { SkinId } from '../skins/types';

export function useThemeSwitcher() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useThemeSwitcher must be used within AppThemeProvider');
  }

  const { skinId, currentSkin, skins, setSkinId } = context;

  return {
    skinId,
    currentSkin,
    skins,
    setSkinId,
    setSkin: (skinId: SkinId) => setSkinId(skinId),
  };
}
