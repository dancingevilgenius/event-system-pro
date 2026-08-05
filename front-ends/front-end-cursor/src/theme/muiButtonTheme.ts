import { CONTENT_MAX_WIDTH } from '../constants/layout';

/**
 * Keep action buttons at a consistent max width app-wide.
 * Matches Admin page buttons (360px column on phone; capped the same on larger screens
 * even when grid cells are wider).
 */
export const muiButtonTheme = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      maxWidth: CONTENT_MAX_WIDTH,
      // Center within wider parents (e.g. Admin md grid cells, 480px form stacks).
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
};
