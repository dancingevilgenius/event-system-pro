import { useState } from 'react';
import { Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  generateDemoAttendees,
  prepareWsdcAttendeeRefresh,
  setUserWsdcId,
  startRobotRiotAttendeeChurn,
} from '../api/postgrest';
import {
  buildStoredWsdcInfo,
  findWsdcDancerById,
  formatWsdcFetchTimingMessage,
  isWsdcDancerProfile,
} from '../api/wsdcRegistry';
import BuildInfoDialog from '../components/BuildInfoDialog';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { usePocCounter } from '../hooks/usePocCounter';
import { EVENT_HOME_PATH } from '../constants/eventRoutes';

const ADMIN_BUTTONS = [
  { label: 'Events', path: EVENT_HOME_PATH },
  { label: 'Contests', path: '/admin/contests' },
  { label: 'Competitors', path: '/admin/competitors' },
  { label: 'Users', path: '/admin/search-users' },
  { label: 'Competition Entries', path: '/admin/competition-entries' },
  { label: 'Event Merchandise POS', path: '/event-merchandise-pos-demo' },
  { label: 'WSDC Find Dancer', path: '/wsdc-find-dancer' },
  { label: 'Set Event Judges', path: '/admin/set-event-judges' },
  { label: 'Governing Bodies', path: '/governing-body' },
  { label: 'Audit Log', path: '/admin/audit-log' },
  { label: 'Scheduled Tasks', path: '/admin/scheduled-tasks' },
  { label: 'Cursor Rules', path: '/admin/cursor-rules' },
  { label: 'Static Lists', path: '/static-lists' },
  { label: 'Staff', path: '/staff' },
] as const;

export default function AdminHomePage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const { showSuccess, showWarning, showProblem, showInfo, clearMessages } = useMessages();
  const { counter, error: counterError } = usePocCounter();
  const [generatingAttendees, setGeneratingAttendees] = useState(false);
  const [startingChurn, setStartingChurn] = useState(false);
  const [refreshingWsdc, setRefreshingWsdc] = useState(false);
  const [buildInfoOpen, setBuildInfoOpen] = useState(false);

  const handleTestMessages = () => {
    clearMessages();
    showSuccess('Your change has been saved.');
    showWarning('Your event starts in less than 15 min.');
    showProblem('Your sign in time has passed.');
    showInfo('You look marvelous!');
  };

  const handleGenerateAttendees = async () => {
    clearMessages();
    setGeneratingAttendees(true);

    try {
      const result = await generateDemoAttendees();

      if (!result.ok) {
        showProblem(result.message);
        return;
      }

      const groups = result.event_groups?.length
        ? ` Groups: ${result.event_groups.join(', ')}.`
        : '';

      showSuccess(`${result.message}${groups}`);
    } catch (error) {
      showProblem(
        error instanceof Error ? error.message : 'Unable to generate demo attendees.',
      );
    } finally {
      setGeneratingAttendees(false);
    }
  };

  const handleStartRobotRiotChurn = async () => {
    clearMessages();
    setStartingChurn(true);

    try {
      const result = await startRobotRiotAttendeeChurn(10);

      if (!result.ok) {
        showProblem(result.message ?? 'Unable to start attendee rotation.');
        return;
      }

      const replaced = result.first_run?.replaced;
      const first =
        typeof replaced === 'number' ? ` First tick replaced ${replaced} attendees.` : '';
      showSuccess(`${result.message ?? 'Attendee rotation started.'}${first}`);
    } catch (error) {
      showProblem(
        error instanceof Error ? error.message : 'Unable to start attendee rotation.',
      );
    } finally {
      setStartingChurn(false);
    }
  };

  const handleRefreshWsdcAttendees = async () => {
    clearMessages();
    setRefreshingWsdc(true);
    const startedAt = performance.now();

    try {
      const prepared = await prepareWsdcAttendeeRefresh();
      if (!prepared.ok) {
        showProblem(prepared.message ?? 'Unable to prepare WSDC attendee refresh.');
        return;
      }

      const targets = prepared.targets ?? [];
      let usersUpdated = 0;
      let usersFailed = 0;
      let usersSkipped = 0;

      for (const target of targets) {
        const wsdcId = String(target.wsdc_id ?? '').trim();
        if (!target.user_id || !wsdcId) {
          usersSkipped += 1;
          continue;
        }

        try {
          const profile = await findWsdcDancerById(wsdcId);
          if (!isWsdcDancerProfile(profile)) {
            usersSkipped += 1;
            continue;
          }

          const saved = await setUserWsdcId({
            userId: target.user_id,
            wsdcId,
            wsdcInfo: buildStoredWsdcInfo(wsdcId, profile),
          });

          if (saved.ok) {
            usersUpdated += 1;
          } else {
            usersFailed += 1;
          }
        } catch {
          usersFailed += 1;
        }
      }

      const events = prepared.events_count ?? 0;
      const added = prepared.attendees_added ?? 0;
      showSuccess(
        `WSDC attendee refresh finished. Updated ${usersUpdated} user(s)` +
          ` across ${events} event(s)` +
          (added > 0 ? ` (added dancingevilgenius to ${added} event(s))` : '') +
          (usersFailed > 0 ? `. Failed: ${usersFailed}` : '') +
          (usersSkipped > 0 ? `. Skipped: ${usersSkipped}` : '') +
          '.',
      );
      showInfo(formatWsdcFetchTimingMessage(performance.now() - startedAt, 'WSDC attendee refresh'));
    } catch (error) {
      showProblem(
        error instanceof Error ? error.message : 'Unable to run WSDC attendee refresh.',
      );
    } finally {
      setRefreshingWsdc(false);
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          POC counter (10s):{' '}
          {counterError
            ? 'unavailable'
            : counter === null
              ? '…'
              : counter}
        </Typography>

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {ADMIN_BUTTONS.map((button) => (
              <Button
                key={button.label}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(button.path)}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {ADMIN_BUTTONS.map((button) => (
              <Grid key={button.label} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(button.path)}
                >
                  {button.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : undefined}>
          <Button
            variant="outlined"
            fullWidth
            disabled={generatingAttendees}
            onClick={() => void handleGenerateAttendees()}
          >
            {generatingAttendees ? 'Generating Attendees…' : 'Generate Attendees'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            disabled={startingChurn}
            onClick={() => void handleStartRobotRiotChurn()}
          >
            {startingChurn
              ? 'Starting Robot Riot Rotation…'
              : 'Rotate Robot Riot Attendees (10 min)'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            disabled={refreshingWsdc}
            onClick={() => void handleRefreshWsdcAttendees()}
          >
            {refreshingWsdc ? 'Refreshing WSDC Info…' : 'Refresh WSDC Attendee Info'}
          </Button>
          <Button variant="outlined" fullWidth onClick={handleTestMessages}>
            Test Message Boxes
          </Button>
          <Button variant="outlined" fullWidth onClick={() => setBuildInfoOpen(true)}>
            Build Info
          </Button>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>

      <BuildInfoDialog open={buildInfoOpen} onClose={() => setBuildInfoOpen(false)} />
    </Container>
  );
}
