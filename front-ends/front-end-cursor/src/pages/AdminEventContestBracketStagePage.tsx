import {
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchContestById,
  fetchContestStageBracket,
  fetchEventById,
  fetchEventGroupByCode,
  type ContestListRow,
  type ContestStageBracketRow,
} from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { eventContestPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';
import type { ContestStageBracketMatch } from '../lib/contestStageBrackets';
import { useLayoutTier } from '../hooks/useLayoutTier';

function slotLabel(
  match: ContestStageBracketMatch,
  side: 'slot_a' | 'slot_b',
): string {
  const slot = match[side];
  if (!slot) {
    return 'TBD';
  }
  return slot['display-name'] || slot.username;
}

export default function AdminEventContestBracketStagePage() {
  const { containerMaxWidth } = useLayoutTier();
  const { eventGroupCode = '', eventId = '', contestId = '', stage = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
    contestId: string;
    stage: string;
  }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const decodedStage = decodeURIComponent(stage) || 'primary_elim';
  const parsedEventId = Number.parseInt(eventId, 10);
  const parsedContestId = Number.parseInt(contestId, 10);

  const [groupFullName, setGroupFullName] = useState('');
  const [eventLabel, setEventLabel] = useState('');
  const [contest, setContest] = useState<ContestListRow | null>(null);
  const [bracketRow, setBracketRow] = useState<ContestStageBracketRow | null>(null);
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
      const [group, event, contestRow, stageRow] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventById(parsedEventId),
        fetchContestById(parsedContestId),
        fetchContestStageBracket(parsedContestId, decodedStage),
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
      setBracketRow(stageRow);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load bracket stage.');
    } finally {
      setLoading(false);
    }
  }, [decodedGroupCode, decodedStage, parsedContestId, parsedEventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const bracket = bracketRow?.bracket;

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader
          title={`${contest?.name || 'Contest'} — Elimination`}
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

        {!loading && !error && !bracketRow && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            No elimination bracket found for this contest.
          </Typography>
        )}

        {!loading && !error && bracket && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip label={`${bracket.format}`} />
              <Chip label={`Size ${bracket.size}`} />
              <Chip label={bracket.score_a_label} color="error" variant="outlined" />
              <Chip label={bracket.score_b_label} color="primary" variant="outlined" />
              {bracket.overtime_label ? (
                <Chip label={bracket.overtime_label} variant="outlined" />
              ) : null}
            </Stack>

            {bracket.rounds.map((round) => (
              <Stack key={round.name} spacing={1.5}>
                <Typography variant="h6">{round.name}</Typography>
                {round.matches.map((match) => {
                  const winnerId = match.winner?.user_id ?? null;
                  return (
                    <Paper key={match.id} variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {match.id}
                      </Typography>
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: winnerId === match.slot_a?.user_id ? 700 : 400,
                            fontStyle: match.slot_a ? 'normal' : 'italic',
                            color: match.slot_a ? 'text.primary' : 'text.secondary',
                          }}
                        >
                          {slotLabel(match, 'slot_a')}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: winnerId === match.slot_b?.user_id ? 700 : 400,
                            fontStyle: match.slot_b ? 'normal' : 'italic',
                            color: match.slot_b ? 'text.primary' : 'text.secondary',
                          }}
                        >
                          {slotLabel(match, 'slot_b')}
                        </Typography>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            ))}

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Champion:{' '}
              {bracket.champion
                ? bracket.champion['display-name'] || bracket.champion.username
                : 'TBD (filled after pools advance)'}
            </Typography>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
