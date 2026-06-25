import { createTheme } from '@mui/material/styles';

/**
 * Design tokens
 * Navy:    #14213D  — chrome, headers, primary actions
 * Gold:    #E8B84B  — score accents, progress, the "in progress" state
 * Success: #3C8C6E  — 100% complete / submit state
 * Paper:   #FAF8F4  — warm off-white background
 * Ink:     #20242C  — body text
 * Hairline:#E1DACB  — dividers on warm background
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14213D',
      light: '#2C3E63',
      dark: '#0A1226',
      contrastText: '#FAF8F4',
    },
    secondary: {
      main: '#E8B84B',
      light: '#F0CD7B',
      dark: '#C99A2E',
      contrastText: '#14213D',
    },
    success: {
      main: '#3C8C6E',
      contrastText: '#FAF8F4',
    },
    background: {
      default: '#FAF8F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#20242C',
      secondary: '#5B5648',
    },
    divider: '#E1DACB',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 700, letterSpacing: 0.2 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          overflow: 'hidden',
          '&:before': { display: 'none' },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});
