import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { purgeAuditLog } from '../api/postgrest';
import { isValidAuditPurgeSecret } from '../lib/deployment';
import CloseIcon from './CloseIcon';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

type PurgeAuditLogDialogProps = {
  open: boolean;
  totalCount: number;
  onClose: () => void;
  onPurged: (message: string) => void;
};

export default function PurgeAuditLogDialog({
  open,
  totalCount,
  onClose,
  onPurged,
}: PurgeAuditLogDialogProps) {
  const [secret, setSecret] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSecret('');
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const handleClose = () => {
    if (submitting) {
      return;
    }
    onClose();
  };

  const handlePurge = async () => {
    setError(null);

    if (!isValidAuditPurgeSecret(secret)) {
      setError('Invalid confirmation secret.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await purgeAuditLog(secret);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      onPurged(result.message);
      onClose();
    } catch (purgeError) {
      setError(purgeError instanceof Error ? purgeError.message : 'Unable to purge audit log.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        Delete all audit trail records
        <IconButton
          aria-label="Close purge audit log dialog"
          onClick={handleClose}
          size="small"
          disabled={submitting}
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
          <Typography variant="body1" color="error">
            This permanently deletes all {totalCount} audit event(s) in this environment. One
            AUDIT_PURGE record will remain.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Enter the confirmation secret to continue.
          </Typography>

          <TextField
            label="Confirmation secret"
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            fullWidth
            autoComplete="off"
            disabled={submitting}
            slotProps={{
              input: {
                'aria-label': 'Audit purge confirmation secret',
              },
            }}
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
          <Button variant="outlined" onClick={handleClose} disabled={submitting} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void handlePurge()}
            disabled={submitting || secret.trim() === ''}
            fullWidth
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Delete all audit records'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
