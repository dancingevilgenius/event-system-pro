import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { CloseIcon } from "@/icons/CloseIcon";
import { JUDGING_COLOR_PALETTE } from "@/data/judgingColorPalette";
import type { CompetitorColors } from "@/types/judgingScore";

interface Props {
  open: boolean;
  firstName: string;
  initialColors: CompetitorColors;
  onSave: (colors: CompetitorColors) => void;
  onCancel: () => void;
}

export function CompetitorColorDialog({
  open,
  firstName,
  initialColors,
  onSave,
  onCancel,
}: Props) {
  const [phase, setPhase] = useState<"top" | "bottom">("top");
  const [topColor, setTopColor] = useState<string | undefined>(
    initialColors.top
  );
  const [bottomColor, setBottomColor] = useState<string | undefined>(
    initialColors.bottom
  );
  const [touchedThisSession, setTouchedThisSession] = useState(false);

  useEffect(() => {
    if (open) {
      setPhase("top");
      setTopColor(initialColors.top);
      setBottomColor(initialColors.bottom);
      setTouchedThisSession(false);
    }
  }, [open, initialColors.top, initialColors.bottom]);

  const handlePick = (color: string) => {
    if (phase === "top") {
      setTopColor(color);
      setTouchedThisSession(true);
      setPhase("bottom");
    } else {
      setBottomColor(color);
      onSave({ top: topColor, bottom: color });
    }
  };

  const handleCloseX = () => {
    onCancel();
  };

  const handleBackdropClose = (
    _e: object,
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick") {
      if (touchedThisSession) {
        onSave({ top: topColor, bottom: bottomColor });
      } else {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const title =
    phase === "top"
      ? `Pick Top Color for ${firstName}`
      : `Pick Bottom Color ${firstName}`;

  return (
    <Dialog
      open={open}
      onClose={handleBackdropClose}
      fullWidth
      maxWidth="xs"
      data-testid="competitor-color-dialog"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
          fontSize: "1.1rem",
        }}
      >
        <span data-testid="color-dialog-title">{title}</span>
        <IconButton
          onClick={handleCloseX}
          size="small"
          data-testid="color-dialog-close"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1.5 }}
        >
          {phase === "top"
            ? "Tap a color for the top half."
            : "Tap a color for the bottom half."}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 0.75,
          }}
        >
          {JUDGING_COLOR_PALETTE.flat().map((color) => {
            const selected =
              (phase === "top" && color === topColor) ||
              (phase === "bottom" && color === bottomColor);
            return (
              <Box
                key={color}
                role="button"
                aria-label={`color ${color}`}
                data-testid={`color-cell-${color}`}
                onClick={() => handlePick(color)}
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  bgcolor: color,
                  borderRadius: 0.75,
                  border: selected
                    ? "2px solid"
                    : "1px solid",
                  borderColor: selected ? "primary.main" : "divider",
                  cursor: "pointer",
                  transition: "transform 120ms ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
