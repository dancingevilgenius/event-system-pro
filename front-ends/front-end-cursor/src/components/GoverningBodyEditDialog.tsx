import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { GoverningBodyRow, GoverningBodyUpdate } from '../api/postgrest';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

type GoverningBodyEditDialogProps = {
  open: boolean;
  row: GoverningBodyRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (code: string, values: GoverningBodyUpdate) => void;
};

export default function GoverningBodyEditDialog({
  open,
  row,
  saving,
  onClose,
  onSave,
}: GoverningBodyEditDialogProps) {
  const isMobile = useIsMobileDevice();
  const [longName, setLongName] = useState('');
  const [shortName, setShortName] = useState('');

  useEffect(() => {
    if (open && row) {
      setLongName(row.longName);
      setShortName(row.shortName);
    }
  }, [open, row]);

  const handleSave = () => {
    if (!row) {
      return;
    }

    onSave(row.code, { longName, shortName });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        Edit Governing Body
        <IconButton aria-label="Close" onClick={onClose} disabled={saving} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          <AppTextField
            label="Code"
            value={row?.code ?? ''}
            fullWidth
            disabled
            helperText="Code cannot be changed."
          />
          <AppTextField
            label="Long name"
            value={longName}
            onChange={(event) => setLongName(event.target.value)}
            fullWidth
            autoFocus={!isMobile}
            disabled={saving}
            required
          />
          <AppTextField
            label="Short name"
            value={shortName}
            onChange={(event) => setShortName(event.target.value)}
            fullWidth
            disabled={saving}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
        <Button onClick={onClose} disabled={saving} fullWidth={isMobile}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !row}
          fullWidth={isMobile}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
