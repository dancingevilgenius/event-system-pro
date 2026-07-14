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
  useTheme,
  type PaletteMode,
} from '@mui/material';
import { useRef, type UIEvent } from 'react';
import type { AuditLogRow } from '../api/postgrest';
import { formatAuditLogActor } from '../lib/auditLogDisplay';
import { getHighlightedJsonLines } from '../utils/auditJsonDiff';
import { formatAuditJsonForDisplay, formatReadableDateTime } from '../utils/auditTimestamps';
import CloseIcon from './CloseIcon';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

type AuditLogDetailDialogProps = {
  open: boolean;
  row: AuditLogRow | null;
  onClose: () => void;
};

/** Shared by Previous data, New data, and Metadata TextFields (root + textarea). */
const JSON_FONT = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '0.8rem',
  lineHeight: 1.5,
  fontWeight: 400,
} as const;

const JSON_TEXT_FIELD_INPUT_SX = {
  alignItems: 'flex-start',
  ...JSON_FONT,
  '& textarea': {
    ...JSON_FONT,
  },
} as const;

const LIGHT_NEW_CHANGED_LINE_BG = '#d9f7d9';
const LIGHT_PREVIOUS_CHANGED_LINE_BG = '#fff3b0';
const DARK_NEW_CHANGED_LINE_BG = '#1e5c32';
const DARK_PREVIOUS_CHANGED_LINE_BG = '#735c00';

function changedLineBackground(
  kind: 'new' | 'previous',
  mode: PaletteMode,
): string {
  if (mode === 'dark') {
    return kind === 'new' ? DARK_NEW_CHANGED_LINE_BG : DARK_PREVIOUS_CHANGED_LINE_BG;
  }

  return kind === 'new' ? LIGHT_NEW_CHANGED_LINE_BG : LIGHT_PREVIOUS_CHANGED_LINE_BG;
}

function changedLineCaption(kind: 'new' | 'previous', mode: PaletteMode): string {
  if (mode === 'dark') {
    return kind === 'new'
      ? 'Dark green marks values that differ from previous data.'
      : 'Dark yellow marks values that differ from new data.';
  }

  return kind === 'new'
    ? 'Light green marks values that differ from previous data.'
    : 'Light yellow marks values that differ from new data.';
}

/** Matches MUI outlined InputBase content padding so highlight layer lines up. */
const JSON_FIELD_CONTENT_PADDING = {
  px: '14px',
  py: '16.5px',
} as const;

function formatJson(value: Record<string, unknown> | null): string {
  return formatAuditJsonForDisplay(value);
}

function formatOccurredAt(value: string): string {
  return formatReadableDateTime(value);
}

function AuditJsonTextField({
  value,
  ariaLabel,
}: {
  value: string;
  ariaLabel: string;
}) {
  return (
    <TextField
      value={value}
      multiline
      fullWidth
      minRows={4}
      slotProps={{
        htmlInput: {
          readOnly: true,
          'aria-label': ariaLabel,
        },
        input: {
          readOnly: true,
          sx: JSON_TEXT_FIELD_INPUT_SX,
        },
      }}
    />
  );
}

function HighlightedJsonTextField({
  sourceData,
  compareData,
  ariaLabel,
  changedLineBg,
  caption,
}: {
  sourceData: Record<string, unknown>;
  compareData: Record<string, unknown> | null;
  ariaLabel: string;
  changedLineBg: string;
  caption: string;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const lines = getHighlightedJsonLines(sourceData, compareData);
  const value = formatJson(sourceData);
  const hasHighlights = lines.some((line) => line.changed);

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    const backdrop = backdropRef.current;
    if (!backdrop) {
      return;
    }
    backdrop.scrollTop = event.currentTarget.scrollTop;
    backdrop.scrollLeft = event.currentTarget.scrollLeft;
  };

  return (
    <Stack spacing={1}>
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={backdropRef}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            ...JSON_FIELD_CONTENT_PADDING,
            ...JSON_FONT,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            pointerEvents: 'none',
            zIndex: 1,
            color: 'text.primary',
          }}
        >
          {lines.map((line, index) => (
            <Box
              key={`${index}-${line.text.slice(0, 24)}`}
              component="span"
              sx={{
                display: 'block',
                ...JSON_FONT,
                bgcolor: line.changed ? changedLineBg : 'transparent',
                borderRadius: 0.5,
              }}
            >
              {line.text || '\u00a0'}
            </Box>
          ))}
        </Box>

        <TextField
          value={value}
          multiline
          fullWidth
          minRows={4}
          slotProps={{
            htmlInput: {
              readOnly: true,
              'aria-label': ariaLabel,
              onScroll: handleScroll,
            },
            input: {
              readOnly: true,
              sx: {
                ...JSON_TEXT_FIELD_INPUT_SX,
                position: 'relative',
                zIndex: 2,
                bgcolor: 'transparent',
                '& textarea': {
                  ...JSON_FONT,
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                  caretColor: 'transparent',
                  background: 'transparent',
                },
              },
            },
          }}
        />
      </Box>
      {hasHighlights && (
        <Typography variant="caption" color="text.secondary">
          {caption}
        </Typography>
      )}
    </Stack>
  );
}

export default function AuditLogDetailDialog({ open, row, onClose }: AuditLogDetailDialogProps) {
  const isMobile = useIsMobileDevice();
  const theme = useTheme();

  if (!row) {
    return null;
  }

  const hasOldData = Boolean(row.oldData && Object.keys(row.oldData).length > 0);
  const hasNewData = Boolean(row.newData && Object.keys(row.newData).length > 0);
  const canCompare = hasOldData && hasNewData;

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
            <strong>Actor:</strong> {formatAuditLogActor(row)}
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
              <AuditJsonTextField ariaLabel="Metadata" value={formatJson(row.metadata)} />
            </Stack>
          )}

          {hasOldData && row.oldData && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Previous data
              </Typography>
              {canCompare ? (
                <HighlightedJsonTextField
                  sourceData={row.oldData}
                  compareData={row.newData}
                  ariaLabel="Previous data"
                  changedLineBg={changedLineBackground('previous', theme.palette.mode)}
                  caption={changedLineCaption('previous', theme.palette.mode)}
                />
              ) : (
                <AuditJsonTextField ariaLabel="Previous data" value={formatJson(row.oldData)} />
              )}
            </Stack>
          )}

          {hasNewData && row.newData && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                New data
              </Typography>
              {canCompare ? (
                <HighlightedJsonTextField
                  sourceData={row.newData}
                  compareData={row.oldData}
                  ariaLabel="New data"
                  changedLineBg={changedLineBackground('new', theme.palette.mode)}
                  caption={changedLineCaption('new', theme.palette.mode)}
                />
              ) : (
                <AuditJsonTextField ariaLabel="New data" value={formatJson(row.newData)} />
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
