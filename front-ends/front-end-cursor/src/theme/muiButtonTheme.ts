import { CONTENT_MAX_WIDTH, MOBILE_LAYOUT_MIN_WIDTH } from '../constants/layout';

export const muiButtonTheme = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      maxWidth: CONTENT_MAX_WIDTH,
      [`@media (min-width: ${MOBILE_LAYOUT_MIN_WIDTH}px)`]: {
        maxWidth: '100%',
      },
    },
  },
};
