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
  MenuItem,
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
  setScheduledTaskSchedule,
  type ScheduledTaskRow,
} from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import { useMessages } from '../hooks/useMessages';
import { formatReadableDateTime } from '../utils/auditTimestamps';
import {
  describeScheduleInPlainEnglish,
  scheduleCode,
} from '../utils/scheduleDescription';
import {
  SCHEDULE_FREQUENCY_OPTIONS,
  buildCronFromPreset,
  needsTimeOfDay,
  parseSchedulePreset,
  staleAfterForFrequency,
  type ScheduleFrequency,
  type SchedulePeriod,
  type ScheduleTimeOfDay,
} from '../utils/schedulePresets';

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

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => index);

function ScheduleDialog({
  task,
  open,
  onClose,
  onSaved,
}: {
  task: ScheduledTaskRow | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { showSuccess, showProblem, clearMessages } = useMessages();
  const [frequency, setFrequency] = useState<ScheduleFrequency | 'custom'>('custom');
  const [time, setTime] = useState<ScheduleTimeOfDay>({
    hour12: 12,
    minute: 0,
    period: 'AM',
  });
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    const parsed = parseSchedulePreset(task);
    setFrequency(parsed.frequency);
    setTime(parsed.time);
    setDayOfWeek(parsed.dayOfWeek);
    setDayOfMonth(parsed.dayOfMonth);
    setMonth(parsed.month);
  }, [open, task]);

  const previewTask: ScheduledTaskRow | null = task
    ? {
        ...task,
        scheduleCron:
          frequency === 'custom'
            ? task.scheduleCron
            : buildCronFromPreset(frequency, time, { dayOfWeek, dayOfMonth, month }),
        intervalSeconds: frequency === 'custom' ? task.intervalSeconds : null,
        scheduleLabel:
          frequency === 'custom'
            ? task.scheduleLabel
            : buildCronFromPreset(frequency, time, { dayOfWeek, dayOfMonth, month }),
      }
    : null;

  const code = previewTask ? scheduleCode(previewTask) : '—';
  const explanation = previewTask
    ? describeScheduleInPlainEnglish(previewTask)
    : 'No schedule is configured for this task.';
  const showTimeSelectors = needsTimeOfDay(frequency);

  const saveSchedule = async (nextFrequency: ScheduleFrequency, nextTime: ScheduleTimeOfDay) => {
    if (!task) {
      return;
    }

    clearMessages();
    setSaving(true);

    const cron = buildCronFromPreset(nextFrequency, nextTime, {
      dayOfWeek,
      dayOfMonth,
      month,
    });

    try {
      const result = await setScheduledTaskSchedule(
        task.jobName,
        cron,
        staleAfterForFrequency(nextFrequency),
      );

      if (!result.ok) {
        showProblem(result.message ?? `Unable to update schedule for ${task.jobName}.`);
        return;
      }

      showSuccess(result.message ?? `Schedule for ${task.jobName} updated.`);
      await onSaved();
    } catch (saveError) {
      showProblem(
        saveError instanceof Error
          ? saveError.message
          : `Unable to update schedule for ${task.jobName}.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = (value: string) => {
    if (!SCHEDULE_FREQUENCY_OPTIONS.some((option) => option.value === value)) {
      return;
    }

    const nextFrequency = value as ScheduleFrequency;
    setFrequency(nextFrequency);
    void saveSchedule(nextFrequency, time);
  };

  const handleTimeChange = (patch: Partial<ScheduleTimeOfDay>) => {
    if (frequency === 'custom') {
      return;
    }

    const nextTime = { ...time, ...patch };
    setTime(nextTime);
    void saveSchedule(frequency, nextTime);
  };

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

          <AppTextField
            select
            label="Frequency"
            value={frequency === 'custom' ? '' : frequency}
            onChange={(event) => handleFrequencyChange(event.target.value)}
            disabled={saving || !task}
            fullWidth
            helperText={
              frequency === 'custom'
                ? 'Current schedule is custom. Choose a frequency to replace it.'
                : 'Changing frequency saves the cron schedule immediately.'
            }
          >
            {frequency === 'custom' && (
              <MenuItem value="">
                <em>Custom schedule</em>
              </MenuItem>
            )}
            {SCHEDULE_FREQUENCY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </AppTextField>

          {showTimeSelectors && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <AppTextField
                select
                label="Hour"
                value={String(time.hour12)}
                onChange={(event) =>
                  handleTimeChange({ hour12: Number(event.target.value) })
                }
                disabled={saving}
                fullWidth
              >
                {HOUR_OPTIONS.map((hour) => (
                  <MenuItem key={hour} value={String(hour)}>
                    {hour}
                  </MenuItem>
                ))}
              </AppTextField>

              <AppTextField
                select
                label="Minute"
                value={String(time.minute)}
                onChange={(event) =>
                  handleTimeChange({ minute: Number(event.target.value) })
                }
                disabled={saving}
                fullWidth
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <MenuItem key={minute} value={String(minute)}>
                    {String(minute).padStart(2, '0')}
                  </MenuItem>
                ))}
              </AppTextField>

              <AppTextField
                select
                label="AM/PM"
                value={time.period}
                onChange={(event) =>
                  handleTimeChange({ period: event.target.value as SchedulePeriod })
                }
                disabled={saving}
                fullWidth
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </AppTextField>
            </Stack>
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
              sx={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            >
              {code}
            </Typography>
          </Box>
          <Typography variant="body1">{explanation}</Typography>
          {saving && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Saving schedule…
              </Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button variant="contained" onClick={onClose} fullWidth disabled={saving}>
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

          <ReadOnlyField label="Enabled">
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
                        'aria-label': `${task.jobName} Enabled ${task.isEnabled ? 'true' : 'false'}`,
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

  const loadTasks = useCallback(async (options?: { quiet?: boolean }) => {
    const quiet = options?.quiet === true;
    if (!quiet) {
      setLoading(true);
    }
    setError(null);

    try {
      const rows = await fetchScheduledTasks();
      setTasks(rows);
      setScheduleDialogTask((current) => {
        if (!current) {
          return current;
        }
        return rows.find((row) => row.jobName === current.jobName) ?? current;
      });
      return rows;
    } catch (loadError) {
      setTasks([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load scheduled tasks.');
      return [];
    } finally {
      if (!quiet) {
        setLoading(false);
      }
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

  const applyRunTimestamps = (
    jobName: string,
    startedAt: string | undefined,
    finishedAt: string | undefined,
    status: string | undefined,
    errorMessage?: string | null,
  ) => {
    if (!startedAt && !finishedAt) {
      return;
    }

    setTasks((current) =>
      current.map((row) =>
        row.jobName === jobName
          ? {
              ...row,
              lastStartedAt: startedAt ?? row.lastStartedAt,
              lastFinishedAt: finishedAt ?? startedAt ?? row.lastFinishedAt,
              lastStatus: status ?? row.lastStatus,
              lastErrorMessage:
                status === 'error' ? (errorMessage ?? row.lastErrorMessage) : null,
            }
          : row,
      ),
    );
  };

  const handleRunTask = async (task: ScheduledTaskRow) => {
    clearMessages();
    setRunningJobName(task.jobName);

    // Reflect click time immediately on screen while the RPC runs.
    const clickTime = new Date().toISOString();
    applyRunTimestamps(task.jobName, clickTime, clickTime, 'running');

    try {
      const result = await runScheduledTask(task.jobName);

      applyRunTimestamps(
        task.jobName,
        result.started_at,
        result.finished_at,
        result.status,
        result.error_message,
      );

      if (!result.ok) {
        showProblem(result.error_message ?? result.message ?? `Unable to run ${task.jobName}.`);
        await loadTasks({ quiet: true });
        return;
      }

      const status = result.status ?? 'ok';
      if (status === 'skipped') {
        showInfo(`${task.jobName} skipped (already running or nothing to do).`);
      } else {
        showSuccess(`${task.jobName} finished (${status}).`);
      }

      await loadTasks({ quiet: true });
    } catch (runError) {
      showProblem(runError instanceof Error ? runError.message : `Unable to run ${task.jobName}.`);
      await loadTasks({ quiet: true });
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

      <ScheduleDialog
        task={scheduleDialogTask}
        open={scheduleDialogTask !== null}
        onClose={() => setScheduleDialogTask(null)}
        onSaved={async () => {
          await loadTasks({ quiet: true });
        }}
      />
    </Container>
  );
}
