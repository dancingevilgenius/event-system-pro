import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchContestById,
  fetchEventById,
  fetchEventGroupByCode,
  type ContestListRow,
} from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import {
  eventContestStagePath,
  eventContestsPath,
} from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';
import { useLayoutTier } from '../hooks/useLayoutTier';

function stageButtonLabel(stage: string): string {
  if (stage === 'pools') {
    return 'Pools';
  }
  if (stage === 'primary_elim') {
    return 'Elimination Bracket';
  }
  return stage
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function AdminEventContestPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const { eventGroupCode = '', eventId = '', contestId = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
    contestId: string;
  }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const parsedEventId = Number.parseInt(eventId, 10);
  const parsedContestId = Number.parseInt(contestId, 10);

  const [groupFullName, setGroupFullName] = useState('');
  const [eventLabel, setEventLabel] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [contest, setContest] = useState<ContestListRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contestsPath = eventContestsPath(decodedGroupCode, parsedEventId);

  const stages = useMemo(() => {
    if (!contest) {
      return [];
    }
    return contest.stages.length > 0 ? contest.stages : ['pools', 'primary_elim'];
  }, [contest]);

  const load = useCallback(async () => {
    if (
      !decodedGroupCode ||
      !Number.isFinite(parsedEventId) ||
      !Number.isFinite(parsedContestId)
    ) {
      setError('Contest not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [group, event, contestRow] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventById(parsedEventId),
        fetchContestById(parsedContestId),
      ]);

      if (!group) {
        setError('Event group not found.');
        return;
      }
      if (!event || event.eventGroupCode !== decodedGroupCode) {
        setError('Event not found for this group.');
        return;
      }
      if (!contestRow || contestRow.eventId !== parsedEventId) {
        setError('Contest not found for this event.');
        return;
      }

      setGroupFullName(group.fullName);
      setEventLabel(formatEventMonthYear(event.startDate));
      setEventCode(event.eventCode);
      setContest(contestRow);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load contest.');
    } finally {
      setLoading(false);
    }
  }, [decodedGroupCode, parsedContestId, parsedEventId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader
          title={contest?.name || 'Contest'}
          backTo={contestsPath}
          backLabel="Back to Contests"
        />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          {groupFullName || decodedGroupCode}
          {eventLabel ? ` — ${eventLabel}` : ''}
        </Typography>
        {eventCode ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {eventCode}
          </Typography>
        ) : null}

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ py: 4, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {!loading && !error && contest && (
          <>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Stages
            </Typography>
            <Stack
              spacing={2}
              sx={{
                mb: 4,
                ...(showXsLayout
                  ? centeredContentStackSx
                  : { maxWidth: 480, mx: 'auto', width: '100%' }),
              }}
            >
              {stages.map((stage) => (
                <Button
                  key={stage}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() =>
                    navigate(
                      eventContestStagePath(
                        decodedGroupCode,
                        parsedEventId,
                        parsedContestId,
                        stage,
                      ),
                    )
                  }
                >
                  {stageButtonLabel(stage)}
                </Button>
              ))}
            </Stack>

            <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
              Participants ({contest.competitors.length})
            </Typography>
            {contest.competitors.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                No participants assigned yet.
              </Typography>
            ) : (
              <Table size="small" sx={{ maxWidth: 720, mx: 'auto' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contest.competitors.map((competitor, index) => (
                    <TableRow key={competitor.userId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{competitor.displayName}</TableCell>
                      <TableCell>{competitor.username}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
