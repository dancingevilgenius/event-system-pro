import type { SkinDefinition } from './types';
import { muiButtonTheme } from '../theme/muiButtonTheme';
import { muiFormControlTheme, muiTextFieldTheme } from '../theme/muiFormTheme';

export const darkSkin: SkinDefinition = {
  id: 'dark',
  label: 'Dark',
  theme: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#ce93d8',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: muiButtonTheme,
      MuiFormControl: muiFormControlTheme,
      MuiTextField: muiTextFieldTheme,
    },
  },
};
