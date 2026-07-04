import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useState } from 'react';
import { createEventGroup } from '../api/postgrest';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';

type AddEventGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

type FormState = {
  eventGroupCode: string;
  fullName: string;
  shortName: string;
};

const EMPTY_FORM: FormState = {
  eventGroupCode: '',
  fullName: '',
  shortName: '',
};

export default function AddEventGroupDialog({
  open,
  onClose,
  onCreated,
}: AddEventGroupDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(EMPTY_FORM);
    setError(null);
  }, [open]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const eventGroupCode = form.eventGroupCode.trim();
    const fullName = form.fullName.trim();
    const shortName = form.shortName.trim();

    if (!eventGroupCode) {
      setError('Event group code is required.');
      return;
    }

    if (!fullName) {
      setError('Full name is required.');
      return;
    }

    if (!shortName) {
      setError('Short name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createEventGroup({ eventGroupCode, fullName, shortName });
      onCreated();
      onClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'Unable to create event group.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5, position: 'relative' }}>
        Add Event Group
        <IconButton
          aria-label="Close add event group dialog"
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: 'auto', width: '100%' }}>
            <AppTextField
              label="Event Group Code"
              value={form.eventGroupCode}
              onChange={(event) => updateField('eventGroupCode', event.target.value)}
              fullWidth
              required
              autoComplete="off"
            />
            <AppTextField
              label="Full Name"
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              fullWidth
              required
              autoComplete="off"
            />
            <AppTextField
              label="Short Name"
              value={form.shortName}
              onChange={(event) => updateField('shortName', event.target.value)}
              fullWidth
              required
              autoComplete="off"
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
