import {
  Box,
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
import { getHighlightedNewDataLines } from '../utils/auditJsonDiff';
import { formatAuditJsonForDisplay, formatReadableDateTime } from '../utils/auditTimestamps';
import CloseIcon from './CloseIcon';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

type AuditLogDetailDialogProps = {
  open: boolean;
  row: AuditLogRow | null;
  onClose: () => void;
};

const JSON_FIELD_SX = {
  fontFamily: 'monospace',
  fontSize: '0.8rem',
} as const;

const CHANGED_LINE_BG = '#d9f7d9';

function formatJson(value: Record<string, unknown> | null): string {
  return formatAuditJsonForDisplay(value);
}

function formatOccurredAt(value: string): string {
  return formatReadableDateTime(value);
}

function ReadOnlyJsonField({ value }: { value: string }) {
  return (
    <TextField
      value={value}
      multiline
      fullWidth
      minRows={4}
      slotProps={{
        input: {
          readOnly: true,
          sx: JSON_FIELD_SX,
        },
      }}
    />
  );
}

function HighlightedNewDataField({
  oldData,
  newData,
}: {
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown>;
}) {
  const lines = getHighlightedNewDataLines(oldData, newData);
  const hasHighlights = lines.some((line) => line.changed);

  return (
    <Box
      role="textbox"
      aria-readonly="true"
      aria-label="New data"
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        px: 1.5,
        py: 1.25,
        minHeight: 96,
        maxHeight: 360,
        overflow: 'auto',
        bgcolor: 'background.paper',
        ...JSON_FIELD_SX,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {lines.map((line, index) => (
        <Box
          key={`${index}-${line.text.slice(0, 24)}`}
          component="span"
          sx={{
            display: 'block',
            bgcolor: line.changed ? CHANGED_LINE_BG : 'transparent',
            borderRadius: 0.5,
            px: line.changed ? 0.5 : 0,
            mx: line.changed ? -0.5 : 0,
          }}
        >
          {line.text || '\u00a0'}
        </Box>
      ))}
      {hasHighlights && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, fontFamily: 'inherit' }}
        >
          Light green marks values that differ from previous data.
        </Typography>
      )}
    </Box>
  );
}

export default function AuditLogDetailDialog({ open, row, onClose }: AuditLogDetailDialogProps) {
  const isMobile = useIsMobileDevice();

  if (!row) {
    return null;
  }

  const hasOldData = Boolean(row.oldData && Object.keys(row.oldData).length > 0);
  const hasNewData = Boolean(row.newData && Object.keys(row.newData).length > 0);

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
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Metadata
              </Typography>
              <ReadOnlyJsonField value={formatJson(row.metadata)} />
            </Stack>
          )}

          {hasOldData && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Previous data
              </Typography>
              <ReadOnlyJsonField value={formatJson(row.oldData)} />
            </Stack>
          )}

          {hasNewData && row.newData && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                New data
              </Typography>
              {hasOldData ? (
                <HighlightedNewDataField oldData={row.oldData} newData={row.newData} />
              ) : (
                <ReadOnlyJsonField value={formatJson(row.newData)} />
              )}
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
