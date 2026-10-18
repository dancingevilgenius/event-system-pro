import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  fetchJudgingContestPairs,
  fetchJudgingContestRoster,
  saveJudgingContestPairs,
  type ContestRosterPerson,
  type ContestRosterRole,
} from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import InfoMessageBox from './InfoMessageBox';
import type { JudgingHomeContest } from '../lib/judgingHome';
import {
  canManageContestPairs,
  orderSavedContestPairs,
  randomizeContestPairs,
  readStoredContestPairs,
  storedContestPairs,
  type ContestPair,
  type StoredContestPair,
} from '../lib/judgingPairs';
import { generatedCompetitorsForPairIds } from '../utils/generatedCompetitors';
import { compareRosterByBib } from '../utils/rosterBibOrder';

function rosterFullName(person: ContestRosterPerson): string {
  const name = [person.firstName, person.lastName].filter((part) => part.trim() !== '').join(' ');
  return name === '' ? 'Unnamed competitor' : name;
}

function rosterBibLabel(person: ContestRosterPerson): string {
  if (typeof person.bib === 'number' && Number.isFinite(person.bib)) {
    return String(person.bib);
  }
  return '—';
}

function contestDialogTitle(contest: JudgingHomeContest): string {
  return [contest.eventName, contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' · ');
}

function peopleInRole(people: ContestRosterPerson[], role: ContestRosterRole): ContestRosterPerson[] {
  return people.filter((person) => person.role === role).sort(compareRosterByBib);
}

/** Pair ids that are no longer on the roster still name the generated Leader and Follower rows. */
function withSavedGeneratedPairs(
  people: ContestRosterPerson[],
  stored: readonly StoredContestPair[],
): ContestRosterPerson[] {
  const known = new Set(people.map((person) => person.id));
  const missing = stored.flatMap((pair) => [pair.leader_id, pair.follower_id]).filter((id) => !known.has(id));
  const extras = generatedCompetitorsForPairIds(missing).filter((person) => !known.has(person.id));
  if (extras.length === 0) {
    return people;
  }
  return [
    ...people,
    ...extras.map((person) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      role: person.role,
      origin: { kind: 'event-json' as const },
      bib: person.bib,
    })),
  ];
}

function peopleInOrder(people: ContestRosterPerson[], ids: string[]): ContestRosterPerson[] {
  const byId = new Map(people.map((person) => [person.id, person]));
  return ids.flatMap((id) => {
    const person = byId.get(id);
    return person ? [person] : [];
  });
}

function RosterPersonRow({ person }: { person: ContestRosterPerson }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        minHeight: 40,
        px: 1,
        py: 0.75,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          minWidth: 28,
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
          color: 'text.secondary',
        }}
      >
        {rosterBibLabel(person)}
      </Typography>
      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {rosterFullName(person)}
      </Typography>
    </Stack>
  );
}

function RosterColumn({ title, people }: { title: string; people: ContestRosterPerson[] }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: { xs: 180, md: 240 },
        p: { xs: 1.5, md: 2 },
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {people.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            None registered
          </Typography>
        ) : (
          people.map((person) => <RosterPersonRow key={person.id} person={person} />)
        )}
      </Stack>
    </Box>
  );
}

type JudgingContestPairsDialogProps = {
  contest: JudgingHomeContest | null;
  /** Score opened this dialog because couples are not saved yet. */
  continueToScore?: boolean;
  onClose: () => void;
  onSaved?: (pairs: StoredContestPair[]) => void;
};

export default function JudgingContestPairsDialog({
  contest,
  continueToScore = false,
  onClose,
  onSaved,
}: JudgingContestPairsDialogProps) {
  const { session } = useAuth();
  const canManagePairs = canManageContestPairs({
    appRoles: session?.roles,
    contestHeadJudge: contest?.canToggleLock === true,
  });
  const [people, setPeople] = useState<ContestRosterPerson[]>([]);
  const [loadedPairs, setLoadedPairs] = useState<StoredContestPair[]>([]);
  const [followerOrder, setFollowerOrder] = useState<string[] | null>(null);
  const [pairs, setPairs] = useState<ContestPair[]>([]);
  const [randomized, setRandomized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const contestId = contest?.id ?? null;

  useEffect(() => {
    if (!contest || contestId === null) {
      setPeople([]);
      setLoadedPairs([]);
      setFollowerOrder(null);
      setPairs([]);
      setRandomized(false);
      setError(null);
      setSavedMessage(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setSavedMessage(null);
    setPeople([]);
    setLoadedPairs([]);
    setFollowerOrder(null);
    setPairs([]);
    setRandomized(false);

    void Promise.allSettled([
      fetchJudgingContestRoster(contest),
      fetchJudgingContestPairs(contest),
    ]).then(([rosterResult, pairsResult]) => {
      if (cancelled) {
        return;
      }
      if (rosterResult.status === 'fulfilled') {
        setPeople(rosterResult.value);
      } else {
        setPeople([]);
        const reason = rosterResult.reason;
        setError(reason instanceof Error ? reason.message : 'Unable to load contest roster.');
      }
      if (pairsResult.status === 'fulfilled') {
        setLoadedPairs(pairsResult.value);
      } else if (rosterResult.status === 'fulfilled') {
        setLoadedPairs([]);
        const reason = pairsResult.reason;
        setError(reason instanceof Error ? reason.message : 'Unable to load contest pairs.');
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [contest, contestId]);

  const rosterPeople = withSavedGeneratedPairs(people, readStoredContestPairs(loadedPairs));
  const leadersByBib = peopleInRole(rosterPeople, 'leader');
  const followersByBib = peopleInRole(rosterPeople, 'follower');
  const savedLayout = orderSavedContestPairs(leadersByBib, followersByBib, loadedPairs);
  const showingSavedPairs = savedLayout !== null && followerOrder === null;
  const leaders = showingSavedPairs ? savedLayout.leaders : leadersByBib;
  const followers = followerOrder === null
    ? (showingSavedPairs ? savedLayout.followers : followersByBib)
    : peopleInOrder(followersByBib, followerOrder);

  function randomize() {
    if (!canManagePairs) {
      return;
    }
    const next = randomizeContestPairs(leadersByBib, followersByBib);
    setFollowerOrder(next.followers.map((person) => person.id));
    setPairs(next.pairs);
    setRandomized(true);
    setSavedMessage(null);
    setError(null);
  }

  function savePairs() {
    if (!canManagePairs || !contest || !randomized || saving) {
      return;
    }
    setSaving(true);
    setError(null);
    setSavedMessage(null);
    const stored = storedContestPairs(pairs);
    void saveJudgingContestPairs(contest, pairs)
      .then(() => {
        setSavedMessage(stored.length === 1 ? 'Saved 1 pair.' : `Saved ${stored.length} pairs.`);
        if (continueToScore) {
          onSaved?.(stored);
        }
      })
      .catch((saveError: unknown) => {
        setError(saveError instanceof Error ? saveError.message : 'Unable to save contest pairs.');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <Dialog
      open={contest !== null}
      onClose={() => {
        if (!saving) {
          onClose();
        }
      }}
      fullWidth
      maxWidth="md"
      aria-labelledby="judging-pairs-title"
    >
      <DialogTitle id="judging-pairs-title">
        {contest ? contestDialogTitle(contest) : 'Registered competitors'}
      </DialogTitle>
      <DialogContent>
        {continueToScore && canManagePairs ? (
          <Box sx={{ mb: 2 }}>
            <InfoMessageBox>
              Click Randomize at least once, then click Save Pairs.
            </InfoMessageBox>
          </Box>
        ) : null}
        {!loading && showingSavedPairs ? (
          <Box sx={{ mb: 2 }}>
            <InfoMessageBox>
              These couples have previously been randomized.
            </InfoMessageBox>
          </Box>
        ) : null}
        {canManagePairs ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={loading || saving}
              onClick={randomize}
              sx={{ textTransform: 'none' }}
            >
              Randomize
            </Button>
            <Button
              type="button"
              variant="contained"
              disabled={!randomized || loading || saving}
              onClick={savePairs}
              sx={{ textTransform: 'none' }}
            >
              Save Pairs
            </Button>
          </Stack>
        ) : null}
        {loading ? (
          <Stack direction="row" spacing={1} sx={{ py: 3, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading roster…
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <RosterColumn title="Leaders" people={leaders} />
            <RosterColumn title="Followers" people={followers} />
          </Stack>
        )}
        {error ? (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : null}
        {savedMessage ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {savedMessage}
          </Typography>
        ) : null}
        {saving ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Saving pairs…
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button type="button" onClick={onClose} disabled={saving}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
