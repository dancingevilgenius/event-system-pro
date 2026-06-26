import { Box } from "@mui/material";
import type { CompetitorColors } from "@/types/judgingScore";

interface Props {
  colors: CompetitorColors;
  size?: number;
  testId?: string;
}

export function CompetitorColorSwatchBox({
  colors,
  size = 20,
  testId,
}: Props) {
  const { top, bottom } = colors;
  const hasTop = !!top;
  const hasBottom = !!bottom;
  const onlyTop = hasTop && !hasBottom;

  return (
    <Box
      data-testid={testId ?? "competitor-color-swatch-box"}
      sx={{
        width: size,
        height: size,
        borderRadius: 0.5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          flex: onlyTop ? 1 : 1,
          height: onlyTop ? "100%" : "50%",
          bgcolor: top ?? "transparent",
        }}
      />
      {!onlyTop && (
        <Box
          sx={{
            flex: 1,
            height: "50%",
            bgcolor: bottom ?? "transparent",
          }}
        />
      )}
    </Box>
  );
}
