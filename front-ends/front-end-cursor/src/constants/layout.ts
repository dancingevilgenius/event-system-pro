/** Shared max width for messages, buttons, fields, and dropdowns. */
export const CONTENT_MAX_WIDTH = 360;

/**
 * Reference desktop CSS viewport — older 15″ laptop panel (1366 × 768).
 * Use this size when checking xl / full-desktop layouts in devtools.
 */
export const DESKTOP_REFERENCE_VIEWPORT_WIDTH = 1366;
export const DESKTOP_REFERENCE_VIEWPORT_HEIGHT = 768;

/** Max width for page Containers on large desktop viewports. */
export const DESKTOP_CONTAINER_MAX_WIDTH = 1000;

/** Min height for page shell Papers on tablet/desktop (md+). */
export const DESKTOP_PAGE_MIN_HEIGHT = 500;

/** Matches useLayoutTier MD_LAYOUT_QUERY — tablet and up. */
export const MD_LAYOUT_MEDIA_QUERY = '(min-width:768px)';

/** Min viewport width for full-width panel layout (pairs with useIsMobileDevice 768px). */
export const MOBILE_LAYOUT_MIN_WIDTH = 769;

/** Full width on desktop; narrow centered column on mobile. */
export const mobileColumnSx = {
  width: '100%',
  boxSizing: 'border-box',
  maxWidth: CONTENT_MAX_WIDTH,
  mx: 'auto',
  [`@media (min-width: ${MOBILE_LAYOUT_MIN_WIDTH}px)`]: {
    maxWidth: '100%',
    mx: 0,
  },
} as const;

export const centeredContentStackSx = {
  alignItems: 'center',
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  mx: 'auto',
} as const;

/** @deprecated Use centeredContentStackSx */
export const centeredButtonStackSx = centeredContentStackSx;
