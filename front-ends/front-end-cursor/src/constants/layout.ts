/** Shared max width for messages, buttons, fields, and dropdowns. */
export const CONTENT_MAX_WIDTH = 360;

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
