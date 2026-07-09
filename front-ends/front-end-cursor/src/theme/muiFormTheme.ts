import type { Theme } from '@mui/material/styles';
import { CONTENT_MAX_WIDTH, MOBILE_LAYOUT_MIN_WIDTH } from '../constants/layout';

const fieldMaxWidth = {
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  [`@media (min-width: ${MOBILE_LAYOUT_MIN_WIDTH}px)`]: {
    maxWidth: '100%',
  },
};

const dateTimeInputTypes = ['date', 'datetime-local', 'time'] as const;

const darkDateTimeInputStyles = {
  ...Object.fromEntries(
    dateTimeInputTypes.map((type) => [
      `& input[type="${type}"]`,
      { colorScheme: 'dark' },
    ]),
  ),
  ...Object.fromEntries(
    dateTimeInputTypes.map((type) => [
      `& input[type="${type}"]::-webkit-calendar-picker-indicator`,
      {
        filter: 'brightness(0) invert(1)',
        opacity: 0.87,
        cursor: 'pointer',
      },
    ]),
  ),
} as const;

export const muiFormControlTheme = {
  styleOverrides: {
    root: fieldMaxWidth,
  },
};

export const muiTextFieldTheme = {
  styleOverrides: {
    root: fieldMaxWidth,
  },
};

export const muiOutlinedInputTheme = {
  styleOverrides: {
    input: {
      fontSize: '16px',
    },
    root: ({ theme }: { theme: Theme }) =>
      theme.palette.mode === 'dark' ? darkDateTimeInputStyles : {},
  },
};
