import { Box, MenuItem, Select, Slider, Typography, type SelectChangeEvent } from '@mui/material';
import { Fragment } from 'react';
import {
  digitsToScore,
  formatScoreDisplay,
  SCORE_DIGIT_OPTIONS,
  type JudgingScoreDigits,
} from '../types/judgingScore';

export type JudgingScoreInputMode = 'slider' | 'dropdowns';

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
  mode: JudgingScoreInputMode;
  onDigitChange: (index: number, value: number) => void;
  onScoreChange: (value: number) => void;
};

function formatSliderValue(value: number): string {
  return value.toFixed(2);
}

export default function JudgingScoreInput({
  digits,
  mode,
  onDigitChange,
  onScoreChange,
}: JudgingScoreInputProps) {
  const handleChange = (index: number) => (event: SelectChangeEvent) => {
    onDigitChange(index, Number(event.target.value));
  };

  if (mode === 'slider') {
    return (
      <Box
        sx={{ width: '100%', minWidth: 0 }}
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>
            Raw Score
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
          >
            {formatScoreDisplay(digits)}
          </Typography>
        </Box>
        <Box sx={{ px: 1.5 }}>
          <Slider
            min={0}
            max={99.99}
            step={0.01}
            value={digitsToScore(digits)}
            aria-label="Raw score"
            valueLabelDisplay="auto"
            getAriaValueText={formatSliderValue}
            valueLabelFormat={formatSliderValue}
            onChange={(_event, value) => {
              const next = Array.isArray(value) ? value[0] : value;
              onScoreChange(Math.round(next * 100) / 100);
            }}
            sx={{ display: 'block', py: 0.5, my: 0 }}
          />
        </Box>
      </Box>
    );
  }

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
