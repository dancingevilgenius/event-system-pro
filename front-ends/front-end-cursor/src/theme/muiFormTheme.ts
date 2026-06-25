import { CONTENT_MAX_WIDTH } from '../constants/layout';

const fieldMaxWidth = {
  maxWidth: CONTENT_MAX_WIDTH,
  width: '100%',
};

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
  },
};
