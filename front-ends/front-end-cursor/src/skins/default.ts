import type { SkinDefinition } from './types';

export const defaultSkin: SkinDefinition = {
  id: 'default',
  label: 'Default',
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
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 2,
        },
      },
    },
  },
};
