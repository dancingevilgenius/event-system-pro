import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applySchemaMigration,
  fetchSchemaMigrations,
  type ApplySchemaMigrationResult,
  type SchemaMigrationRow,
} from '../api/postgrest';
import AuditTrailCard from '../components/AuditTrailCard';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { diagnoseMigrationFailure } from '../lib/migrationFailure';
import { formatReadableDateTime } from '../utils/auditTimestamps';

const FAILURE_REVIEW_MS = 700;

type MigrationFailureDialog = {
  script: string;
  thinking: boolean;
  message: string;
  detail: string | null;
  cause: string | null;
  steps: string[];
};

function displayValue(value: string | null | undefined): string {
  return value?.trim() ? value.trim() : 'Not recorded';
}

function formatAppliedAt(value: string | null): string {
  if (!value?.trim()) {
    return 'Not recorded';
  }

  return formatReadableDateTime(value);
}

function AppliedStatus({
  applied,
  busy,
  onApply,
}: {
  applied: boolean;
  busy: boolean;
  onApply: () => void;
}) {
  if (applied) {
    return (
      <Typography variant="body2" color="success" sx={{ fontWeight: 700 }}>
        Applied
      </Typography>
    );
  }

  return (
    <Button variant="outlined" size="small" disabled={busy} onClick={onApply}>
      Apply
    </Button>
  );
}

export default function AdminMigrationsPage() {
  const { showXsLayout, showMdLayout, containerMaxWidth } = useLayoutTier();
  const { showSuccess } = useMessages();
  const [rows, setRows] = useState<SchemaMigrationRow[]>([]);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [detailRow, setDetailRow] = useState<SchemaMigrationRow | null>(null);
  const [failureDialog, setFailureDialog] = useState<MigrationFailureDialog | null>(null);
  const [failureOpen, setFailureOpen] = useState(false);
  const failureToken = useRef(0);

  const pendingCount = rows.filter((row) => !row.applied).length;
  const visibleRows = showMissingOnly ? rows.filter((row) => !row.applied) : rows;
  const busy = runningScript !== null;

  const loadMigrations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchSchemaMigrations();
      setRows(result.migrations);
      setCheckedAt(result.checkedAt);
    } catch (loadError) {
      setRows([]);
      setCheckedAt(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load migration scripts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMigrations();
  }, [loadMigrations]);

  const showFailure = useCallback(async (script: string, result: ApplySchemaMigrationResult | Error) => {
    const message = result instanceof Error
      ? result.message
      : result.message?.trim() || `Unable to apply ${script}.`;
    const detail = result instanceof Error ? null : result.detail?.trim() || null;
    const hint = result instanceof Error ? null : result.hint?.trim() || null;
    const token = failureToken.current + 1;
    failureToken.current = token;

    setFailureDialog({
      script,
      thinking: true,
      message,
      detail,
      cause: null,
      steps: [],
    });
    setFailureOpen(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, FAILURE_REVIEW_MS);
    });

    if (failureToken.current !== token) {
      return;
    }

    const report = diagnoseMigrationFailure(script, { message, detail, hint });
    setFailureDialog({
      script,
      thinking: false,
      message,
      detail,
      cause: report.cause,
      steps: report.steps,
    });
  }, []);

  const applyOne = useCallback(
    async (script: string) => {
      setRunningScript(script);
      try {
        const result = await applySchemaMigration(script);
        if (!result.ok) {
          await showFailure(script, result);
          return false;
        }

        showSuccess(`${script} successfully applied`);
        setRows((current) =>
          current.map((row) => (row.script === script ? { ...row, applied: true } : row)),
        );
        return true;
      } catch (applyError) {
        await showFailure(
          script,
          applyError instanceof Error ? applyError : new Error(`Unable to apply ${script}.`),
        );
        return false;
      } finally {
        setRunningScript(null);
      }
    },
    [showFailure, showSuccess],
  );

  const handleApply = async (script: string) => {
    const applied = await applyOne(script);
    if (applied) {
      await loadMigrations();
    }
  };

  const handleRunMissing = async () => {
    const missing = rows.filter((row) => !row.applied);
    if (missing.length === 0) {
      return;
    }

    setRunningAll(true);

    try {
      for (const row of missing) {
        const applied = await applyOne(row.script);
        if (!applied) {
          break;
        }
      }
    } finally {
      setRunningAll(false);
      await loadMigrations();
    }
  };

  const closeFailureDialog = () => {
    failureToken.current += 1;
    setFailureOpen(false);
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Migrations" backTo="/adminhome" backLabel="Back to Admin" />

        <Stack spacing={2} sx={{ mb: 2, alignItems: { xs: 'center', md: 'flex-start' } }}>
          <FormControlLabel
            control={
              <Switch
                checked={showMissingOnly}
                onChange={(event) => setShowMissingOnly(event.target.checked)}
                slotProps={{
                  input: { 'aria-label': 'Show missing migration scripts' },
                }}
              />
            }
            label="Missing"
            sx={{ m: 0, '& .MuiFormControlLabel-label': { fontWeight: 700 } }}
          />
          <Button
            variant="contained"
            onClick={() => void handleRunMissing()}
            disabled={loading || busy || pendingCount === 0}
            fullWidth={showXsLayout}
            sx={{ minWidth: { md: 280 } }}
          >
            {runningAll && runningScript ? `Running ${runningScript}…` : 'Run missing Migrations'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {loading
              ? 'Checking migration scripts…'
              : `${rows.length} scripts. ${pendingCount} still needed.`}
            {!loading && checkedAt ? ` Last check ${formatAppliedAt(checkedAt)}.` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The midnight check records which scripts are still needed. It does not run them.
          </Typography>
        </Stack>

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" align="center" sx={{ py: 4 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && showXsLayout && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {visibleRows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                {showMissingOnly ? 'No missing migration scripts.' : 'No migration scripts found.'}
              </Typography>
            ) : (
              visibleRows.map((row) => (
                <AuditTrailCard
                  key={row.script}
                  columns={2}
                  actionsAlign="right"
                  actionsInGrid
                  fields={[
                    { key: 'number', label: 'Number', value: row.number },
                    { key: 'script', label: 'Script', value: row.script, columnSpan: 2 },
                  ]}
                  actions={
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={busy}
                        onClick={() => setDetailRow(row)}
                      >
                        Details
                      </Button>
                      <AppliedStatus
                        applied={row.applied}
                        busy={busy}
                        onApply={() => void handleApply(row.script)}
                      />
                    </Stack>
                  }
                />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && showMdLayout && (
          <TableContainer sx={{ overflowX: 'auto', my: 3 }}>
            <Table size="small" aria-label="Migration scripts">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Script</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Applied</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {showMissingOnly ? 'No missing migration scripts.' : 'No migration scripts found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map((row) => (
                    <TableRow key={row.script} hover>
                      <TableCell>{row.number}</TableCell>
                      <TableCell sx={{ wordBreak: 'break-word' }}>{row.script}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={busy}
                          onClick={() => setDetailRow(row)}
                        >
                          Details
                        </Button>
                      </TableCell>
                      <TableCell>
                        <AppliedStatus
                          applied={row.applied}
                          busy={busy}
                          onApply={() => void handleApply(row.script)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={detailRow !== null}
        onClose={() => setDetailRow(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pr: 6 }}>
          {detailRow?.script ?? 'Migration'}
          <IconButton
            aria-label="Close migration details"
            onClick={() => setDetailRow(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailRow && (
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Details
                </Typography>
                <Typography variant="body2">{detailRow.details || 'Not recorded'}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Applied
                </Typography>
                <Typography variant="body2">{formatAppliedAt(detailRow.appliedAt)}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Applied by
                </Typography>
                <Typography variant="body2">{displayValue(detailRow.appliedBy)}</Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={failureOpen}
        onClose={closeFailureDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          transition: { onExited: () => setFailureDialog(null) },
        }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          {failureDialog ? `${failureDialog.script} failed` : 'Migration failed'}
          <IconButton
            aria-label="Close migration failure"
            onClick={closeFailureDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {failureDialog && (
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <ErrorOutlinedIcon color="error" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Error
                  </Typography>
                </Stack>
                <Typography variant="body2">{failureDialog.message}</Typography>
                {failureDialog.detail && (
                  <Typography variant="body2">{failureDialog.detail}</Typography>
                )}
              </Stack>

              {failureDialog.thinking && (
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={22} />
                  <Typography variant="body2">Thinking about problem resolution</Typography>
                </Stack>
              )}

              {!failureDialog.thinking && failureDialog.cause && (
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Cause
                  </Typography>
                  <Typography variant="body2">{failureDialog.cause}</Typography>
                </Stack>
              )}

              {!failureDialog.thinking && failureDialog.steps.length > 0 && (
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Steps to resolve
                  </Typography>
                  <Stack component="ol" spacing={0.5} sx={{ m: 0, pl: 3 }}>
                    {failureDialog.steps.map((step) => (
                      <Typography key={step} component="li" variant="body2">
                        {step}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFailureDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
