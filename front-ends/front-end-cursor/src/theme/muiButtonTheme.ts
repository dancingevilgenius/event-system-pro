import { CONTENT_MAX_WIDTH } from '../constants/layout';

export const muiButtonTheme = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      maxWidth: CONTENT_MAX_WIDTH,
    },
  },
};
