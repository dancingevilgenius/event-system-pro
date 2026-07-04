import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { AuditLogRow } from '../api/postgrest';
import { formatAuditJsonForDisplay, formatReadableDateTime } from '../utils/auditTimestamps';
import CloseIcon from './CloseIcon';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

type AuditLogDetailDialogProps = {
  open: boolean;
  row: AuditLogRow | null;
  onClose: () => void;
};

function formatJson(value: Record<string, unknown> | null): string {
  return formatAuditJsonForDisplay(value);
}

function formatOccurredAt(value: string): string {
  return formatReadableDateTime(value);
}

export default function AuditLogDetailDialog({ open, row, onClose }: AuditLogDetailDialogProps) {
  const isMobile = useIsMobileDevice();

  if (!row) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={isMobile}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        Audit Event #{row.auditId}
        <IconButton aria-label="Close audit detail" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2">
            <strong>When:</strong> {formatOccurredAt(row.occurredAt)}
          </Typography>
          <Typography variant="body2">
            <strong>Action:</strong> {row.action}
          </Typography>
          <Typography variant="body2">
            <strong>Actor:</strong> {row.actorUsername || '—'}
            {row.actorUserId != null ? ` (user_id ${row.actorUserId})` : ''}
          </Typography>
          <Typography variant="body2">
            <strong>Table:</strong> {row.tableName || '—'}
          </Typography>
          <Typography variant="body2">
            <strong>Record:</strong> {row.recordKey || '—'}
          </Typography>

          {row.metadata && Object.keys(row.metadata).length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Metadata</Typography>
              <TextField
                value={formatJson(row.metadata)}
                multiline
                fullWidth
                minRows={3}
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                  },
                }}
              />
            </Stack>
          )}

          {row.oldData && Object.keys(row.oldData).length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Previous data</Typography>
              <TextField
                value={formatJson(row.oldData)}
                multiline
                fullWidth
                minRows={4}
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                  },
                }}
              />
            </Stack>
          )}

          {row.newData && Object.keys(row.newData).length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">New data</Typography>
              <TextField
                value={formatJson(row.newData)}
                multiline
                fullWidth
                minRows={4}
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                  },
                }}
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} fullWidth={isMobile}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
