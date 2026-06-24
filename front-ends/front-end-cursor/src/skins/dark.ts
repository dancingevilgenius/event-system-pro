import type { SkinDefinition } from './types';

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
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
  },
};
