import {
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
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchContestById,
  fetchContestStagePool,
  fetchEventById,
  fetchEventGroupByCode,
  type ContestListRow,
  type ContestStagePoolRow,
} from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { eventContestPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';
import { useLayoutTier } from '../hooks/useLayoutTier';

export default function AdminEventContestPoolStagePage() {
  const { containerMaxWidth } = useLayoutTier();
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
  const [contest, setContest] = useState<ContestListRow | null>(null);
  const [poolRow, setPoolRow] = useState<ContestStagePoolRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contestPath = eventContestPath(decodedGroupCode, parsedEventId, parsedContestId);

  const load = useCallback(async () => {
    if (
      !decodedGroupCode ||
      !Number.isFinite(parsedEventId) ||
      !Number.isFinite(parsedContestId)
    ) {
      setError('Stage not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [group, event, contestRow, stage] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventById(parsedEventId),
        fetchContestById(parsedContestId),
        fetchContestStagePool(parsedContestId, 'pools'),
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
      setContest(contestRow);
      setPoolRow(stage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load pools stage.');
    } finally {
      setLoading(false);
    }
  }, [decodedGroupCode, parsedContestId, parsedEventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const pools = poolRow?.pools.pools ?? [];
  const matLabel = poolRow?.pools.mat_label || 'Mat';

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader
          title={`${contest?.name || 'Contest'} — Pools`}
          backTo={contestPath}
          backLabel="Back to Contest"
        />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {groupFullName || decodedGroupCode}
          {eventLabel ? ` — ${eventLabel}` : ''}
        </Typography>

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

        {!loading && !error && !poolRow && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            No pools stage document found for this contest.
          </Typography>
        )}

        {!loading && !error && poolRow && pools.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Pools stage is empty.
          </Typography>
        )}

        {!loading &&
          !error &&
          pools.map((pool) => (
            <Stack key={pool.pool_id} spacing={1} sx={{ mb: 4 }}>
              <Typography variant="h6">
                Pool {pool.pool_id}
                {pool.mat > 0 ? ` · ${matLabel} ${pool.mat}` : ''}
                {` · ${pool.status}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pool.fighters.length} fighters · {pool.bouts.length} bouts
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Fighter</TableCell>
                    <TableCell>Username</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pool.fighters.map((fighter, index) => (
                    <TableRow key={`${pool.pool_id}-${fighter.user_id}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{fighter['display-name']}</TableCell>
                      <TableCell>{fighter.username}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          ))}
      </Paper>
    </Container>
  );
}
