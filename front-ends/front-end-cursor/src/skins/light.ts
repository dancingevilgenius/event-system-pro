import type { SkinDefinition } from './types';
import { muiButtonTheme } from '../theme/muiButtonTheme';
import { muiFormControlTheme, muiOutlinedInputTheme, muiTextFieldTheme } from '../theme/muiFormTheme';

export const lightSkin: SkinDefinition = {
  id: 'light',
  label: 'Light',
  theme: {
    palette: {
      mode: 'light',
      primary: {
        main: '#1565c0',
      },
      secondary: {
        main: '#6a1b9a',
      },
      background: {
        default: '#f5f7fb',
        paper: '#ffffff',
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
      MuiOutlinedInput: muiOutlinedInputTheme,
      MuiPaper: {
        defaultProps: {
          elevation: 2,
        },
      },
    },
  },
};
