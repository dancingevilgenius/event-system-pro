import {
  DESKTOP_CONTAINER_MAX_WIDTH,
  DESKTOP_PAGE_MIN_HEIGHT,
  MD_LAYOUT_MEDIA_QUERY,
} from '../constants/layout';

/**
 * Cap large/xlarge Containers at DESKTOP_CONTAINER_MAX_WIDTH so full desktop
 * layouts fit a 1366×768 reference viewport without over-stretching.
 *
 * On tablet/desktop, keep the direct child page Paper at least
 * DESKTOP_PAGE_MIN_HEIGHT tall so short pages do not jump in height.
 */
export const muiContainerTheme = {
  styleOverrides: {
    root: {
      [`@media ${MD_LAYOUT_MEDIA_QUERY}`]: {
        '& > .MuiPaper-root': {
          minHeight: DESKTOP_PAGE_MIN_HEIGHT,
        },
      },
    },
    maxWidthLg: {
      maxWidth: DESKTOP_CONTAINER_MAX_WIDTH,
    },
    maxWidthXl: {
      maxWidth: DESKTOP_CONTAINER_MAX_WIDTH,
    },
  },
};
