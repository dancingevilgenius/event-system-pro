import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchScheduledTasks,
  runScheduledTask,
  type ScheduledTaskRow,
} from '../api/postgrest';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import { useMessages } from '../hooks/useMessages';
import { formatReadableDateTime } from '../utils/auditTimestamps';

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

function MobileScheduledTaskCard({
  task,
  running,
  onRun,
}: {
  task: ScheduledTaskRow;
  running: boolean;
  onRun: (task: ScheduledTaskRow) => void;
}) {
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
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            size="small"
            label={task.enabled ? 'Enabled' : 'Disabled'}
            color={task.enabled ? 'success' : 'default'}
            variant={task.enabled ? 'filled' : 'outlined'}
          />
          <Chip
            size="small"
            label={healthLabel(task.health)}
            color={healthChipColor(task.health)}
            variant="outlined"
          />
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Schedule
          </Typography>
          <Typography variant="body2">{displayValue(task.scheduleLabel)}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Last run
          </Typography>
          <Typography variant="body2">{formatTimestamp(task.lastFinishedAt ?? task.lastStartedAt)}</Typography>
          {task.lastStatus && (
            <Typography variant="body2" color="text.secondary">
              Status: {task.lastStatus}
            </Typography>
          )}
          {task.lastErrorMessage && (
            <Typography variant="body2" color="error">
              {task.lastErrorMessage}
            </Typography>
          )}
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
  const isMobile = useIsMobileDevice();
  const { showSuccess, showProblem, showInfo, clearMessages } = useMessages();

  const [tasks, setTasks] = useState<ScheduledTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningJobName, setRunningJobName] = useState<string | null>(null);

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

        {!loading && !error && isMobile && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No scheduled tasks found.
              </Typography>
            ) : (
              tasks.map((task) => (
                <MobileScheduledTaskCard
                  key={task.jobName}
                  task={task}
                  running={runningJobName === task.jobName}
                  onRun={(selectedTask) => void handleRunTask(selectedTask)}
                />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && !isMobile && (
          <TableContainer sx={{ overflowX: 'auto', my: 3 }}>
            <Table size="small" aria-label="Scheduled tasks">
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last run</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No scheduled tasks found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.jobName} hover>
                      <TableCell sx={{ minWidth: 220 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {task.jobName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {displayValue(task.description)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {task.rpcSchema}.{task.rpcName}()
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {displayValue(task.scheduleLabel)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip
                            size="small"
                            label={task.enabled ? 'Enabled' : 'Disabled'}
                            color={task.enabled ? 'success' : 'default'}
                            variant={task.enabled ? 'filled' : 'outlined'}
                          />
                          <Chip
                            size="small"
                            label={healthLabel(task.health)}
                            color={healthChipColor(task.health)}
                            variant="outlined"
                          />
                        </Stack>
                        {task.lastStatus && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Last: {task.lastStatus}
                          </Typography>
                        )}
                        {task.lastErrorMessage && (
                          <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                            {task.lastErrorMessage}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatTimestamp(task.lastFinishedAt ?? task.lastStartedAt)}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          disabled={runningJobName === task.jobName}
                          onClick={() => void handleRunTask(task)}
                        >
                          {runningJobName === task.jobName ? 'Running…' : 'Run now'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
    </Container>
  );
}
