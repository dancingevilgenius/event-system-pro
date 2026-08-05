import { DESKTOP_CONTAINER_MAX_WIDTH } from '../constants/layout';

/**
 * Cap large/xlarge Containers at DESKTOP_CONTAINER_MAX_WIDTH so full desktop
 * layouts do not stretch beyond 1000px.
 */
export const muiContainerTheme = {
  styleOverrides: {
    maxWidthLg: {
      maxWidth: DESKTOP_CONTAINER_MAX_WIDTH,
    },
    maxWidthXl: {
      maxWidth: DESKTOP_CONTAINER_MAX_WIDTH,
    },
  },
};
