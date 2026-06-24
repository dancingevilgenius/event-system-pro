import { createTheme } from '@mui/material/styles';
import { skins } from '../skins';
import type { SkinId } from '../skins/types';

export function createAppTheme(skinId: SkinId = 'default') {
  const skin = skins[skinId] ?? skins.default;
  return createTheme(skin.theme);
}
