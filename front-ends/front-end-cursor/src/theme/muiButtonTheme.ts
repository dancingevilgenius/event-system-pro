import { CONTENT_MAX_WIDTH } from '../constants/layout';

/**
 * Keep action buttons at a consistent max width app-wide.
 * Matches Admin page buttons (CONTENT_MAX_WIDTH / 360px), including on desktop
 * where they previously expanded to fill wider stacks or grid cells.
 */
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
