/** Shared max width for messages, buttons, fields, and dropdowns. */
export const CONTENT_MAX_WIDTH = 360;

export const centeredContentStackSx = {
  alignItems: 'center',
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  mx: 'auto',
} as const;

/** @deprecated Use centeredContentStackSx */
export const centeredButtonStackSx = centeredContentStackSx;
