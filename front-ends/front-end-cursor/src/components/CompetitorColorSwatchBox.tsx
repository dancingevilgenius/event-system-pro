import { Box } from '@mui/material';
import type { CompetitorColorRecord } from '../types/competitorColors';

export const COLOR_SWATCH_SIZE = 20;

type CompetitorColorSwatchBoxProps = {
  colors: CompetitorColorRecord;
  size?: number;
};

export default function CompetitorColorSwatchBox({
  colors,
  size = COLOR_SWATCH_SIZE,
}: CompetitorColorSwatchBoxProps) {
  const { top, bottom } = colors;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 0.5,
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {top && !bottom ? (
        <Box sx={{ flex: 1, bgcolor: top }} />
      ) : (
        <>
          {top ? <Box sx={{ flex: 1, bgcolor: top }} /> : null}
          {bottom ? <Box sx={{ flex: 1, bgcolor: bottom }} /> : null}
        </>
      )}
    </Box>
  );
}
