import { createTheme } from '@mui/material/styles';
import { skins } from '../skins';
import type { SkinId } from '../skins/types';
import { muiContainerTheme } from './muiContainerTheme';

export function createAppTheme(skinId: SkinId = 'light') {
  const skin = skins[skinId] ?? skins.light;
  return createTheme({
    ...skin.theme,
    components: {
      ...skin.theme.components,
      MuiContainer: muiContainerTheme,
    },
  });
}
