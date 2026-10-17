import {
  Button,
  Checkbox,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchUpcomingRegistrationContests,
  type UpcomingRegistrationContest,
} from '../api/postgrest';
import RegistrationContestRosterDialog from './RegistrationContestRosterDialog';

type ContestRole = 'leader' | 'follower';

export type RegistrationContestPick = {
  contest: UpcomingRegistrationContest;
  role: ContestRole | null;
  label: string;
};

type RegistrationUpcomingContestsProps = {
  revision?: number;
  onSelectionChange?: (picks: RegistrationContestPick[]) => void;
};

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function registeredCountsLabel(contest: UpcomingRegistrationContest): string {
  return `L:${contest.leaderCount} F:${contest.followerCount}`;
}

function contestCaption(contest: UpcomingRegistrationContest): string {
  const skill = contest.skillLevelLabel.trim() || 'contest';
  const division = contest.divisionLabel.trim();
  const eventName = contest.eventName.trim();
  return [skill, division, eventName].filter((part) => part !== '').join(', ');
}

export default function RegistrationUpcomingContests({
  revision = 0,
  onSelectionChange,
}: RegistrationUpcomingContestsProps) {
  const [contests, setContests] = useState<UpcomingRegistrationContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [roles, setRoles] = useState<Record<string, ContestRole | null>>({});
  const [rosterContest, setRosterContest] = useState<UpcomingRegistrationContest | null>(null);
  const revisionRef = useRef(revision);
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  const handleCountsChange = useCallback((
    contestId: string,
    leaderCount: number,
    followerCount: number,
    hasGeneratedCompetitors: boolean,
  ) => {
    setContests((current) => {
      const index = current.findIndex((contest) => contest.id === contestId);
      if (index < 0) {
        return current;
      }
      const existing = current[index];
      if (
        existing.leaderCount === leaderCount
        && existing.followerCount === followerCount
        && existing.hasGeneratedCompetitors === hasGeneratedCompetitors
      ) {
        return current;
      }
      return current.map((contest) =>
        contest.id === contestId
          ? { ...contest, leaderCount, followerCount, hasGeneratedCompetitors }
          : contest,
      );
    });
    setRosterContest((current) => {
      if (!current || current.id !== contestId) {
        return current;
      }
      if (
        current.leaderCount === leaderCount
        && current.followerCount === followerCount
        && current.hasGeneratedCompetitors === hasGeneratedCompetitors
      ) {
        return current;
      }
      return { ...current, leaderCount, followerCount, hasGeneratedCompetitors };
    });
  }, []);

  useEffect(() => {
    if (revisionRef.current === revision) {
      return;
    }
    revisionRef.current = revision;
    setCheckedIds({});
  }, [revision]);

  useEffect(() => {
    let cancelled = false;

    void fetchUpcomingRegistrationContests()
      .then((rows) => {
        if (!cancelled) {
          setContests(rows);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setContests([]);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load upcoming contests.');
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
  }, [revision]);

  useEffect(() => {
    const picks = contests.flatMap((contest) => {
      if (checkedIds[contest.id] !== true) {
        return [];
      }
      return [
        {
          contest,
          role: roles[contest.id] ?? null,
          label: contestCaption(contest),
        },
      ];
    });
    onSelectionChangeRef.current?.(picks);
  }, [checkedIds, contests, roles]);

  const headerSx = { fontWeight: 700, whiteSpace: 'nowrap' } as const;

  return (
    <Stack spacing={1} sx={{ mt: 3 }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
        Upcoming contests
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Contests already underway, or starting within the next 24 hours.
      </Typography>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Upcoming contests">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, width: '3rem' }} />
              <TableCell sx={headerSx}>Event</TableCell>
              <TableCell sx={headerSx}>Skill level</TableCell>
              <TableCell sx={headerSx}>Competition type</TableCell>
              <TableCell sx={headerSx}>Registered</TableCell>
              <TableCell align="right" sx={headerSx}>
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ py: 2, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                      Loading contests…
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="error" sx={{ py: 2 }}>
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : contests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No contests are coming up in the next 24 hours.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contests.map((contest) => {
                const caption = contestCaption(contest);
                const role = roles[contest.id] ?? null;

                return (
                  <TableRow key={contest.id} hover>
                    <TableCell sx={{ px: { xs: 0.5, md: 1 } }}>
                      <Checkbox
                        checked={checkedIds[contest.id] === true}
                        onChange={(event) => {
                          const selected = event.target.checked;
                          setCheckedIds((current) => ({ ...current, [contest.id]: selected }));
                        }}
                        slotProps={{
                          input: { 'aria-label': `Select ${caption}` },
                        }}
                        sx={{ p: { xs: 0.5, md: 1 } }}
                      />
                    </TableCell>
                    <TableCell>{displayValue(contest.eventName)}</TableCell>
                    <TableCell>{displayValue(contest.skillLevelLabel)}</TableCell>
                    <TableCell>{displayValue(contest.divisionLabel)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        onClick={() => setRosterContest(contest)}
                        aria-label={`Registered competitors for ${caption}`}
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                      >
                        {registeredCountsLabel(contest)}
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={role}
                        onChange={(_event, next: ContestRole | null) => {
                          setRoles((current) => ({ ...current, [contest.id]: next }));
                        }}
                        aria-label={`Role for ${caption}`}
                        sx={{
                          '& .MuiToggleButton-root': {
                            px: { xs: 1, md: 1.5 },
                            py: 0.5,
                            lineHeight: 1.4,
                            textTransform: 'none',
                          },
                        }}
                      >
                        <ToggleButton value="leader">Leader</ToggleButton>
                        <ToggleButton value="follower">Follower</ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <RegistrationContestRosterDialog
        contest={rosterContest}
        onClose={() => setRosterContest(null)}
        onCountsChange={handleCountsChange}
      />
    </Stack>
  );
}
