import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CloseIcon from './CloseIcon';
import {
  JUDGING_COLOR_PALETTE,
  PALETTE_GRID_COLS,
} from '../data/judgingColorPalette';
import { type LegionMember } from '../data/legionNames';
import type { CompetitorColorRecord } from '../types/competitorColors';

type CompetitorColorDialogProps = {
  competitor: LegionMember | null;
  open: boolean;
  initialColors: CompetitorColorRecord;
  onClose: () => void;
  onSave: (colors: CompetitorColorRecord) => void;
};

type PaletteSelectionState = {
  topIndex: number | null;
  bottomIndex: number | null;
  sessionClickCount: number;
};

function isLightColor(color: string): boolean {
  if (color === '#ffffff' || color === '#d9d9d9') {
    return true;
  }

  const match = color.match(/hsl\(\s*[\d.]+\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (!match) {
    return false;
  }

  const lightness = Number(match[2]);
  return lightness >= 62;
}

function paletteIndexForColor(color: string | null): number | null {
  if (!color) {
    return null;
  }

  const index = JUDGING_COLOR_PALETTE.indexOf(color);
  return index >= 0 ? index : null;
}

function recordToSelectionState(record: CompetitorColorRecord): PaletteSelectionState {
  return {
    topIndex: paletteIndexForColor(record.top),
    bottomIndex: paletteIndexForColor(record.bottom),
    sessionClickCount: 0,
  };
}

function selectionStateToRecord(state: PaletteSelectionState): CompetitorColorRecord {
  return {
    top: state.topIndex !== null ? JUDGING_COLOR_PALETTE[state.topIndex] : null,
    bottom:
      state.bottomIndex !== null ? JUDGING_COLOR_PALETTE[state.bottomIndex] : null,
  };
}

const emptySelectionState: PaletteSelectionState = {
  topIndex: null,
  bottomIndex: null,
  sessionClickCount: 0,
};

export default function CompetitorColorDialog({
  competitor,
  open,
  initialColors,
  onClose,
  onSave,
}: CompetitorColorDialogProps) {
  const [selection, setSelection] = useState<PaletteSelectionState>(emptySelectionState);

  useEffect(() => {
    if (open) {
      setSelection(recordToSelectionState(initialColors));
    }
  }, [open, competitor, initialColors]);

  if (!competitor) {
    return null;
  }

  const { topIndex, bottomIndex, sessionClickCount } = selection;
  const isTopTurn = sessionClickCount % 2 === 0;
  const dialogTitle = isTopTurn
    ? `Pick Top Color for ${competitor.first}`
    : `Pick Bottom Color ${competitor.first}`;

  const handleCancel = () => {
    onClose();
  };

  const handleDialogClose = (
    _event: object,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick' && sessionClickCount === 1) {
      onSave(selectionStateToRecord(selection));
      onClose();
      return;
    }

    handleCancel();
  };

  const handleCellClick = (index: number) => {
    setSelection((current) => {
      const isTopTurn = current.sessionClickCount % 2 === 0;

      if (isTopTurn) {
        return {
          ...current,
          topIndex: index,
          sessionClickCount: current.sessionClickCount + 1,
        };
      }

      const next = {
        topIndex: current.topIndex,
        bottomIndex: index,
        sessionClickCount: current.sessionClickCount + 1,
      };

      onSave(selectionStateToRecord(next));
      onClose();
      return next;
    });
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        {dialogTitle}
        <IconButton
          aria-label="Close color picker"
          onClick={handleCancel}
          size="small"
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, px: 1, pb: 1 }}>
        <Box
          role="grid"
          aria-label="Color palette"
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PALETTE_GRID_COLS}, 1fr)`,
            gap: 0.25,
          }}
        >
          {JUDGING_COLOR_PALETTE.map((color, index) => {
            const isSelected = index === topIndex || index === bottomIndex;
            const light = isLightColor(color);

            return (
              <IconButton
                key={`${color}-${index}`}
                role="gridcell"
                aria-label={`Color ${index + 1}`}
                aria-pressed={isSelected}
                onClick={() => handleCellClick(index)}
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  minWidth: 0,
                  p: 0,
                  borderRadius: 0.5,
                  bgcolor: color,
                  border: 2,
                  borderStyle: 'solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  boxShadow: isSelected ? 3 : 0,
                  '&:hover': {
                    bgcolor: color,
                    opacity: 0.9,
                  },
                  '&::after': isSelected
                    ? {
                        content: '""',
                        position: 'absolute',
                        inset: 4,
                        border: 2,
                        borderColor: light ? 'text.primary' : 'common.white',
                        borderRadius: 0.25,
                        pointerEvents: 'none',
                      }
                    : undefined,
                }}
              />
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
