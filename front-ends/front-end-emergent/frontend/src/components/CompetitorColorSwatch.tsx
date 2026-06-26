import { IconButton } from "@mui/material";
import { CompetitorColorSwatchBox } from "@/components/CompetitorColorSwatchBox";
import { PaletteOutlinedIcon } from "@/icons/PaletteOutlinedIcon";
import type { CompetitorColors } from "@/types/judgingScore";

interface Props {
  colors: CompetitorColors;
  onClick: (e: React.MouseEvent) => void;
  testId?: string;
}

export function CompetitorColorSwatch({ colors, onClick, testId }: Props) {
  const hasColors = !!colors.top || !!colors.bottom;
  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      data-testid={testId ?? "competitor-color-swatch-btn"}
      sx={{ p: 0.5 }}
    >
      {hasColors ? (
        <CompetitorColorSwatchBox colors={colors} size={20} />
      ) : (
        <PaletteOutlinedIcon fontSize="small" />
      )}
    </IconButton>
  );
}
