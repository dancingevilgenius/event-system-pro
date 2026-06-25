import { IconButton } from '@mui/material';
import type { MouseEvent } from 'react';
import type { CompetitorColorRecord } from '../types/competitorColors';
import CompetitorColorSwatchBox, { COLOR_SWATCH_SIZE } from './CompetitorColorSwatchBox';

type CompetitorColorSwatchProps = {
  colors: CompetitorColorRecord;
  ariaLabel: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function CompetitorColorSwatch({
  colors,
  ariaLabel,
  onClick,
}: CompetitorColorSwatchProps) {
  return (
    <IconButton
      size="small"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseDown={(event) => event.stopPropagation()}
      sx={{ p: 0.5, width: 30, height: 30, flexShrink: 0 }}
    >
      <CompetitorColorSwatchBox colors={colors} size={COLOR_SWATCH_SIZE} />
    </IconButton>
  );
}
