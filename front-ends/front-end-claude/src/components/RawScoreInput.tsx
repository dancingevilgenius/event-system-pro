import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ScoreDigitSelect } from './ScoreDigitSelect';
import { ScoreDigits, digitsToScore, scoreToDigits } from '../types/judgingScore';

interface RawScoreInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

export function RawScoreInput({ value, onChange }: RawScoreInputProps) {
  const digits = scoreToDigits(value);

  const handleDigitChange = (index: number, newDigit: number) => {
    const next = [...digits] as ScoreDigits;
    next[index] = newDigit;
    onChange(digitsToScore(next));
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
        Raw Score
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ScoreDigitSelect
          value={digits[0]}
          onChange={(d) => handleDigitChange(0, d)}
          ariaLabel="Tens digit"
        />
        <ScoreDigitSelect
          value={digits[1]}
          onChange={(d) => handleDigitChange(1, d)}
          ariaLabel="Ones digit"
        />
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>.</Typography>
        <ScoreDigitSelect
          value={digits[2]}
          onChange={(d) => handleDigitChange(2, d)}
          ariaLabel="Tenths digit"
        />
        <ScoreDigitSelect
          value={digits[3]}
          onChange={(d) => handleDigitChange(3, d)}
          ariaLabel="Hundredths digit"
        />
      </Box>
    </Box>
  );
}
