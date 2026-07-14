import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
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
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchScheduledTasks,
  runScheduledTask,
  setScheduledTaskEnabled,
  type ScheduledTaskRow,
} from '../api/postgrest';
import { useMessages } from '../hooks/useMessages';
import { formatReadableDateTime } from '../utils/auditTimestamps';
import {
  describeScheduleInPlainEnglish,
  scheduleCode,
} from '../utils/scheduleDescription';

function displayValue(value: string | null | undefined): string {
  return value?.trim() ? value.trim() : '—';
}

function formatTimestamp(value: string | null): string {
  if (!value?.trim()) {
    return '—';
  }

  return formatReadableDateTime(value);
}

function healthChipColor(
  health: string,
): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (health) {
    case 'ok':
      return 'success';
    case 'running':
      return 'info';
    case 'disabled':
      return 'default';
    case 'never_run':
    case 'stale_success':
      return 'warning';
    case 'last_run_error':
      return 'error';
    default:
      return 'default';
  }
}

function healthLabel(health: string): string {
  switch (health) {
    case 'ok':
      return 'OK';
    case 'running':
      return 'Running';
    case 'disabled':
      return 'Disabled';
    case 'never_run':
      return 'Never run';
    case 'stale_success':
      return 'Stale';
    case 'last_run_error':
      return 'Error';
    default:
      return health;
  }
}

function ReadOnlyField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        component="div"
        sx={{ fontWeight: 700 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function ScheduleExplainDialog({
  task,
  open,
  onClose,
}: {
  task: ScheduledTaskRow | null;
  open: boolean;
  onClose: () => void;
}) {
  const code = task ? scheduleCode(task) : '—';
  const explanation = task
    ? describeScheduleInPlainEnglish(task)
    : 'No schedule is configured for this task.';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        Schedule
        <IconButton
          aria-label="Close schedule dialog"
          onClick={onClose}
          size="small"
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
        <Stack spacing={2}>
          {task && (
            <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {task.jobName}
            </Typography>
          )}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
              sx={{ fontWeight: 700 }}
            >
              Schedule code
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
            >
              {code}
            </Typography>
          </Box>
          <Typography variant="body1">{explanation}</Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ScheduledTaskCard({
  task,
  running,
  togglingEnabled,
  onRun,
  onExplainSchedule,
  onToggleEnabled,
}: {
  task: ScheduledTaskRow;
  running: boolean;
  togglingEnabled: boolean;
  onRun: (task: ScheduledTaskRow) => void;
  onExplainSchedule: (task: ScheduledTaskRow) => void;
  onToggleEnabled: (task: ScheduledTaskRow, isEnabled: boolean) => void;
}) {
  const code = scheduleCode(task);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" component="h2">
            {task.jobName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {displayValue(task.description)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {task.rpcSchema}.{task.rpcName}()
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          <ReadOnlyField label="Schedule">
            <Button
              variant="outlined"
              size="small"
              onClick={() => onExplainSchedule(task)}
              aria-label={`Explain schedule ${code}`}
              sx={{
                mt: 0.25,
                maxWidth: '100%',
                justifyContent: 'flex-start',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                textTransform: 'none',
              }}
            >
              <Box
                component="span"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {code}
              </Box>
            </Button>
          </ReadOnlyField>

          <ReadOnlyField label="Last run">
            <Typography variant="body2">
              {formatTimestamp(task.lastFinishedAt ?? task.lastStartedAt)}
            </Typography>
            {task.lastStatus && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {task.lastStatus}
              </Typography>
            )}
            {task.lastErrorMessage && (
              <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                {task.lastErrorMessage}
              </Typography>
            )}
          </ReadOnlyField>

          <ReadOnlyField label="is_enabled">
            <Stack spacing={0.75} sx={{ mt: 0.25 }}>
              <FormControlLabel
                sx={{ ml: 0, mr: 0, alignItems: 'center' }}
                control={
                  <Switch
                    checked={task.isEnabled}
                    disabled={togglingEnabled}
                    onChange={(_, checked) => onToggleEnabled(task, checked)}
                    slotProps={{
                      input: {
                        'aria-label': `${task.jobName} is_enabled ${task.isEnabled ? 'true' : 'false'}`,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    }}
                  >
                    {task.isEnabled ? 'true' : 'false'}
                  </Typography>
                }
              />
              <Chip
                size="small"
                label={healthLabel(task.health)}
                color={healthChipColor(task.health)}
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              />
            </Stack>
          </ReadOnlyField>
        </Box>

        <Button
          variant="contained"
          size="small"
          disabled={running}
          onClick={() => onRun(task)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {running ? 'Running…' : 'Run now'}
        </Button>
      </Stack>
    </Paper>
  );
}

export default function AdminScheduledTasksPage() {
  const navigate = useNavigate();
  const { showSuccess, showProblem, showInfo, clearMessages } = useMessages();

  const [tasks, setTasks] = useState<ScheduledTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningJobName, setRunningJobName] = useState<string | null>(null);
  const [togglingJobName, setTogglingJobName] = useState<string | null>(null);
  const [scheduleDialogTask, setScheduleDialogTask] = useState<ScheduledTaskRow | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rows = await fetchScheduledTasks();
      setTasks(rows);
    } catch (loadError) {
      setTasks([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load scheduled tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const handleToggleEnabled = async (task: ScheduledTaskRow, isEnabled: boolean) => {
    clearMessages();
    setTogglingJobName(task.jobName);

    const previous = task.isEnabled;
    setTasks((current) =>
      current.map((row) =>
        row.jobName === task.jobName
          ? {
              ...row,
              isEnabled,
              health: isEnabled
                ? row.health === 'disabled'
                  ? 'never_run'
                  : row.health
                : 'disabled',
            }
          : row,
      ),
    );

    try {
      const result = await setScheduledTaskEnabled(task.jobName, isEnabled);

      if (!result.ok) {
        setTasks((current) =>
          current.map((row) =>
            row.jobName === task.jobName ? { ...row, isEnabled: previous } : row,
          ),
        );
        showProblem(result.message ?? `Unable to update ${task.jobName}.`);
        return;
      }

      showSuccess(result.message ?? `${task.jobName} updated.`);
      await loadTasks();
    } catch (toggleError) {
      setTasks((current) =>
        current.map((row) =>
          row.jobName === task.jobName ? { ...row, isEnabled: previous } : row,
        ),
      );
      showProblem(
        toggleError instanceof Error ? toggleError.message : `Unable to update ${task.jobName}.`,
      );
    } finally {
      setTogglingJobName(null);
    }
  };

  const handleRunTask = async (task: ScheduledTaskRow) => {
    clearMessages();
    setRunningJobName(task.jobName);

    try {
      const result = await runScheduledTask(task.jobName);

      if (!result.ok) {
        showProblem(result.error_message ?? result.message ?? `Unable to run ${task.jobName}.`);
        return;
      }

      const status = result.status ?? 'ok';
      if (status === 'skipped') {
        showInfo(`${task.jobName} skipped (already running or nothing to do).`);
      } else {
        showSuccess(`${task.jobName} finished (${status}).`);
      }

      await loadTasks();
    } catch (runError) {
      showProblem(runError instanceof Error ? runError.message : `Unable to run ${task.jobName}.`);
    } finally {
      setRunningJobName(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Scheduled Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          {tasks.length} task{tasks.length === 1 ? '' : 's'}
        </Typography>

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

        {!loading && !error && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No scheduled tasks found.
              </Typography>
            ) : (
              tasks.map((task) => (
                <ScheduledTaskCard
                  key={task.jobName}
                  task={task}
                  running={runningJobName === task.jobName}
                  togglingEnabled={togglingJobName === task.jobName}
                  onRun={(selectedTask) => void handleRunTask(selectedTask)}
                  onExplainSchedule={setScheduleDialogTask}
                  onToggleEnabled={(selectedTask, isEnabled) =>
                    void handleToggleEnabled(selectedTask, isEnabled)
                  }
                />
              ))
            )}
          </Stack>
        )}

        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => void loadTasks()}
            sx={{ minWidth: 200 }}
          >
            Refresh
          </Button>
          <Button variant="outlined" onClick={() => navigate('/adminhome')} sx={{ minWidth: 200 }}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>

      <ScheduleExplainDialog
        task={scheduleDialogTask}
        open={scheduleDialogTask !== null}
        onClose={() => setScheduleDialogTask(null)}
      />
    </Container>
  );
}
