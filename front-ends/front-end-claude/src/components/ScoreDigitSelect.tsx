import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface ScoreDigitSelectProps {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function ScoreDigitSelect({ value, onChange, ariaLabel }: ScoreDigitSelectProps) {
  const handleChange = (e: SelectChangeEvent<number>) => {
    onChange(Number(e.target.value));
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="small"
      // Score digit interactions must never bubble up and toggle the
      // accordion header.
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      MenuProps={{
        onClick: (e) => e.stopPropagation(),
      }}
      inputProps={{ 'aria-label': ariaLabel }}
      sx={{
        minWidth: 44,
        fontWeight: 700,
        '& .MuiSelect-select': { py: 0.75, px: 1, textAlign: 'center' },
      }}
    >
      {DIGITS.map((d) => (
        <MenuItem key={d} value={d} onClick={(e) => e.stopPropagation()}>
          {d}
        </MenuItem>
      ))}
    </Select>
  );
}
