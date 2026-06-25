import { Box, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';
import { Fragment } from 'react';
import {
  SCORE_DIGIT_OPTIONS,
  type JudgingScoreDigits,
} from '../types/judgingScore';

const DIGIT_SELECT_SHARE = '20%';

const digitSelectSx = {
  flex: `0 0 ${DIGIT_SELECT_SHARE}`,
  width: DIGIT_SELECT_SHARE,
  minWidth: 0,
  '& .MuiSelect-select': {
    py: 0.5,
    pl: 1,
    pr: '24px !important',
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'left',
  },
} as const;

type JudgingScoreInputProps = {
  digits: JudgingScoreDigits;
  onDigitChange: (index: number, value: number) => void;
};

export default function JudgingScoreInput({
  digits,
  onDigitChange,
}: JudgingScoreInputProps) {
  const handleChange = (index: number) => (event: SelectChangeEvent) => {
    onDigitChange(index, Number(event.target.value));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
        gap: 0.5,
      }}
    >
      <Typography
        component="span"
        variant="body2"
        sx={{ flexShrink: 0, fontWeight: 500 }}
      >
        Raw Score
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        {digits.map((digit, index) => (
          <Fragment key={index}>
            {index === 1 || index === 3 ? (
              <Box sx={{ width: '3px', flexShrink: 0 }} aria-hidden />
            ) : null}

            {index === 2 ? (
              <Typography
                component="span"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  px: 0.25,
                  userSelect: 'none',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                .
              </Typography>
            ) : null}

            <Select
              size="small"
              value={String(digit)}
              onChange={handleChange(index)}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              sx={digitSelectSx}
            >
              {SCORE_DIGIT_OPTIONS.map((option) => (
                <MenuItem key={option} value={String(option)}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
