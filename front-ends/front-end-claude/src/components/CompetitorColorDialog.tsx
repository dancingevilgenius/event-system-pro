import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { CloseIcon } from './icons/CloseIcon';
import { JUDGING_COLOR_PALETTE, PALETTE_COLUMNS } from '../data/judgingColorPalette';
import { CoupleColors } from './ColorSwatchButton';

interface CompetitorColorDialogProps {
  open: boolean;
  firstName: string;
  existingColors: CoupleColors;
  onSave: (colors: CoupleColors) => void;
  onClose: () => void;
}

type PickStage = 'top' | 'bottom';

export function CompetitorColorDialog({
  open,
  firstName,
  existingColors,
  onSave,
  onClose,
}: CompetitorColorDialogProps) {
  // Local draft state — only committed via onSave, so a true cancel (X)
  // never mutates the couple's stored colors.
  const [draft, setDraft] = useState<CoupleColors>(existingColors);
  const [stage, setStage] = useState<PickStage>('top');

  // Reset draft/stage each time the dialog opens, showing prior selections.
  useEffect(() => {
    if (open) {
      setDraft(existingColors);
      setStage('top');
    }
    // existingColors is intentionally read only at open-time, not tracked
    // live, since this dialog owns its own draft until save/cancel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSwatchClick = (hex: string) => {
    if (stage === 'top') {
      setDraft((prev) => ({ ...prev, top: hex }));
      setStage('bottom');
    } else {
      const finalColors: CoupleColors = { ...draft, bottom: hex };
      setDraft(finalColors);
      onSave(finalColors);
    }
  };

  const handleBackdropClick = () => {
    // After one pick in this session, clicking the backdrop saves that one
    // color and closes. If nothing has been picked yet (still on "top"
    // stage with no top set), treat it as a cancel.
    if (stage === 'bottom') {
      onSave(draft);
    } else {
      onClose();
    }
  };

  const title =
    stage === 'top' ? `Pick Top Color for ${firstName}` : `Pick Bottom Color ${firstName}`;

  return (
    <Dialog
      open={open}
      onClose={handleBackdropClick}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        {title}
        <IconButton onClick={onClose} aria-label="Cancel" size="small">
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PALETTE_COLUMNS}, 1fr)`,
            gap: 0.75,
          }}
        >
          {JUDGING_COLOR_PALETTE.map((color) => {
            const isSelected = draft.top === color.hex || draft.bottom === color.hex;
            return (
              <Box
                key={color.id}
                role="button"
                tabIndex={0}
                aria-label={color.name}
                onClick={() => handleSwatchClick(color.hex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSwatchClick(color.hex);
                }}
                sx={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 1,
                  bgcolor: color.hex,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #14213D' : '1px solid rgba(0,0,0,0.08)',
                  boxSizing: 'border-box',
                }}
              />
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
