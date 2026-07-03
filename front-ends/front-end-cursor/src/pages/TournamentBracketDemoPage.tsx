import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDemoBracketCompetitors } from '../api/postgrest';
import TournamentBracketViewDialog from '../components/TournamentBracketViewDialog';
import {
  buildInitialBracket,
  roundLabel,
  serializeBracketState,
  setMatchOutcome,
  type BracketMatch,
  type BracketState,
} from '../utils/tournamentBracket';

type MatchCardProps = {
  match: BracketMatch;
  onSelectWinner: (matchId: string, winnerId: number) => void;
};

function CompetitorSlot({
  competitor,
  isWinner,
  isLoser,
  disabled,
  onPickWinner,
}: {
  competitor: { userId: number; label: string } | null;
  isWinner: boolean;
  isLoser: boolean;
  disabled: boolean;
  onPickWinner: () => void;
}) {
  if (!competitor) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
        TBD
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        border: 1,
        borderColor: isWinner ? 'success.main' : 'divider',
        borderRadius: 1,
        px: 1.5,
        py: 1,
        bgcolor: isWinner ? 'success.light' : isLoser ? 'action.hover' : 'background.paper',
        opacity: isLoser ? 0.7 : 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: isWinner ? 700 : 400 }}>
        {competitor.label}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          variant={isWinner ? 'contained' : 'outlined'}
          color="success"
          disabled={disabled}
          onClick={onPickWinner}
        >
          Winner
        </Button>
        {isLoser && <Chip size="small" label="Loser" color="default" />}
      </Stack>
    </Stack>
  );
}

function MatchCard({ match, onSelectWinner }: MatchCardProps) {
  const ready = Boolean(match.slotA && match.slotB);

  return (
    <Paper variant="outlined" sx={{ p: 1.5, minWidth: 220 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Match {match.matchIndex + 1}
      </Typography>
      <Stack spacing={1}>
        <CompetitorSlot
          competitor={match.slotA}
          isWinner={match.winnerId !== null && match.slotA?.userId === match.winnerId}
          isLoser={match.loserId !== null && match.slotA?.userId === match.loserId}
          disabled={!ready}
          onPickWinner={() => {
            if (match.slotA) {
              onSelectWinner(match.id, match.slotA.userId);
            }
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          vs
        </Typography>
        <CompetitorSlot
          competitor={match.slotB}
          isWinner={match.winnerId !== null && match.slotB?.userId === match.winnerId}
          isLoser={match.loserId !== null && match.slotB?.userId === match.loserId}
          disabled={!ready}
          onPickWinner={() => {
            if (match.slotB) {
              onSelectWinner(match.id, match.slotB.userId);
            }
          }}
        />
      </Stack>
    </Paper>
  );
}

export default function TournamentBracketDemoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bracket, setBracket] = useState<BracketState | null>(null);
  const [viewBracketOpen, setViewBracketOpen] = useState(false);

  const bracketJson = useMemo(
    () => (bracket ? serializeBracketState(bracket) : null),
    [bracket],
  );

  useEffect(() => {
    let cancelled = false;

    fetchDemoBracketCompetitors()
      .then((competitors) => {
        if (cancelled) {
          return;
        }

        if (competitors.length < 16) {
          setError(`Need at least 16 users in the database (found ${competitors.length}).`);
          return;
        }

        setBracket(buildInitialBracket(competitors.slice(0, 16)));
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const finalMatch = bracket?.rounds[3]?.[0];
  const champion =
    finalMatch?.winnerId != null
      ? finalMatch.slotA?.userId === finalMatch.winnerId
        ? finalMatch.slotA
        : finalMatch.slotB
      : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Tournament Bracket Demo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Single elimination · 16 random demo users · pick a winner for each match
        </Typography>

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && bracket && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(4, minmax(220px, 1fr))',
              },
              gap: 2,
              overflowX: 'auto',
            }}
          >
            {bracket.rounds.map((round, roundIndex) => (
              <Stack key={roundLabel(roundIndex)} spacing={2}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {roundLabel(roundIndex)}
                </Typography>
                {round.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onSelectWinner={(matchId, winnerId) => {
                      setBracket((current) =>
                        current ? setMatchOutcome(current, matchId, winnerId) : current,
                      );
                    }}
                  />
                ))}
              </Stack>
            ))}
          </Box>
        )}

        {champion && (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            Champion: {champion.label}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
          <Button
            variant="contained"
            disabled={!bracketJson}
            onClick={() => setViewBracketOpen(true)}
          >
            View Bracket
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Login
          </Button>
        </Stack>
      </Paper>

      {bracket && (
        <TournamentBracketViewDialog
          open={viewBracketOpen}
          onClose={() => setViewBracketOpen(false)}
          bracket={bracket}
        />
      )}
    </Container>
  );
}
