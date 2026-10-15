import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { AppRoleRow } from '../api/postgrest';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';

type EditRoleLabelsDialogProps = {
  open: boolean;
  row: AppRoleRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (roleCode: string, labels: string[]) => void;
};

export function labelsToDraft(labels: string[]): string {
  return labels.join(', ');
}

export function draftToLabels(draft: string): string[] {
  return draft
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '');
}

export default function EditRoleLabelsDialog({
  open,
  row,
  saving,
  onClose,
  onSave,
}: EditRoleLabelsDialogProps) {
  const isMobile = useIsMobileDevice();
  const [draft, setDraft] = useState('');
  const [originalDraft, setOriginalDraft] = useState('');

  useEffect(() => {
    if (!open || !row) {
      return;
    }

    const nextDraft = labelsToDraft(row.labels);
    setDraft(nextDraft);
    setOriginalDraft(nextDraft);
  }, [open, row]);

  const hasChanges = draft !== originalDraft;

  const handleSave = () => {
    if (!row || !hasChanges) {
      return;
    }

    onSave(row.roleCode, draftToLabels(draft));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        {row?.roleCode ?? 'Role'}
        <IconButton aria-label="Close" onClick={onClose} disabled={saving} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <AppTextField
          label="Labels"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          fullWidth
          multiline
          minRows={4}
          disabled={saving}
          helperText="Separate labels with commas."
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          fullWidth
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
