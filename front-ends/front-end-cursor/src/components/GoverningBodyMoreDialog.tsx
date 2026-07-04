import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { GoverningBodyRow } from '../api/postgrest';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

type GoverningBodyMoreDialogProps = {
  open: boolean;
  row: GoverningBodyRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (code: string, moreJson: Record<string, string>) => void;
};

function formatFieldLabel(key: string): string {
  return key;
}

function getChangedFieldKeys(
  originalValues: Record<string, string>,
  fieldValues: Record<string, string>,
): string[] {
  const keys = new Set([...Object.keys(originalValues), ...Object.keys(fieldValues)]);

  return [...keys]
    .filter((key) => (originalValues[key] ?? '') !== (fieldValues[key] ?? ''))
    .sort((a, b) => a.localeCompare(b));
}

export default function GoverningBodyMoreDialog({
  open,
  row,
  saving,
  onClose,
  onSave,
}: GoverningBodyMoreDialogProps) {
  const isMobile = useIsMobileDevice();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fieldKeys = useMemo(
    () => Object.keys(fieldValues).sort((a, b) => a.localeCompare(b)),
    [fieldValues],
  );

  const changedFieldKeys = useMemo(
    () => getChangedFieldKeys(originalValues, fieldValues),
    [originalValues, fieldValues],
  );

  useEffect(() => {
    if (!open) {
      setConfirmOpen(false);
      return;
    }

    if (row) {
      const snapshot = { ...row.moreJson };
      setFieldValues(snapshot);
      setOriginalValues(snapshot);
      setConfirmOpen(false);
    }
  }, [open, row]);

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((current) => ({ ...current, [key]: value }));
  };

  const handleSaveClick = () => {
    if (changedFieldKeys.length === 0) {
      return;
    }

    setConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    if (saving) {
      return;
    }

    setConfirmOpen(false);
  };

  const handleConfirmSave = () => {
    if (!row) {
      return;
    }

    onSave(row.code, fieldValues);
  };

  const confirmationMessage =
    changedFieldKeys.length > 0
      ? `Do you want to save edits to fields: ${changedFieldKeys.join(' ')}?`
      : '';

  return (
    <>
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
          {row?.shortName.trim() || row?.code || 'Governing Body'}
          <IconButton aria-label="Close" onClick={onClose} disabled={saving} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {fieldKeys.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No fields in more_json for this governing body.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {fieldKeys.map((key) => (
                <AppTextField
                  key={key}
                  label={formatFieldLabel(key)}
                  value={fieldValues[key] ?? ''}
                  onChange={(event) => handleFieldChange(key, event.target.value)}
                  fullWidth
                  disabled={saving}
                />
              ))}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
          <Button onClick={onClose} disabled={saving} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveClick}
            disabled={saving || fieldKeys.length === 0 || changedFieldKeys.length === 0}
            fullWidth={isMobile}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelConfirm} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmationMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
          <Button onClick={handleCancelConfirm} disabled={saving} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSave}
            disabled={saving}
            fullWidth={isMobile}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
