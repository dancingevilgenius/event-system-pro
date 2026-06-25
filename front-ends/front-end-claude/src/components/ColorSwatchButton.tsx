import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { PaletteOutlinedIcon } from './icons/PaletteOutlinedIcon';

export interface CoupleColors {
  top: string | null;
  bottom: string | null;
}

interface ColorSwatchButtonProps {
  colors: CoupleColors;
  onClick: () => void;
  size?: number;
}

/**
 * Renders either the palette icon (no colors yet) or a two-tone swatch
 * (colors exist) — both open the color dialog when clicked.
 */
export function ColorSwatchButton({ colors, onClick, size = 28 }: ColorSwatchButtonProps) {
  const hasColors = colors.top !== null || colors.bottom !== null;

  if (!hasColors) {
    return (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        aria-label="Pick colors"
        sx={{ p: 0.5 }}
      >
        <PaletteOutlinedIcon size={20} color="#5B5648" />
      </IconButton>
    );
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label="Edit colors"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          onClick();
        }
      }}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '1.5px solid rgba(20,33,61,0.25)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <Box sx={{ flex: 1, bgcolor: colors.top ?? '#E1DACB' }} />
      <Box sx={{ flex: 1, bgcolor: colors.bottom ?? '#E1DACB' }} />
    </Box>
  );
}
