import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteGeneratedContestCompetitors,
  generateContestCompetitors,
  lookupStaffRegistration,
  previewQuickRegisterUsernames,
  quickRegisterUser,
  registerContestCompetitors,
  type StaffRegistrationMatch,
  type UpcomingRegistrationContest,
} from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { autoQuickRegisterAction } from '../utils/autoQuickRegister';
import { contestSkillDivisionLabel } from '../utils/duplicateContestBib';
import {
  createTestCompetitorsConfirmText,
  deleteGeneratedCompetitorsConfirmText,
  testCompetitorCount,
} from '../utils/generatedCompetitors';
import {
  quickRegistrationRegisteredMessage,
  quickRegistrationUsernameHint,
} from '../utils/quickRegistration';
import { trimSavedText } from '../utils/trimSavedText';
import AppTextField from './AppTextField';
import QuickRegisterDialog from './QuickRegisterDialog';
import RegistrationUpcomingContests, {
  type RegistrationContestPick,
} from './RegistrationUpcomingContests';
import StaffRegistrationMark from './StaffRegistrationMark';

const NEW_USER_LOOKUP_ID = 'registration-new-user';

function digitsOnlyBib(value: string): string {
  return value.replace(/\D/g, '').slice(0, 3);
}

function bibNumber(value: string): number {
  if (!/^\d{1,3}$/.test(value)) {
    return 0;
  }
  return Number(value);
}

function personIsRegistered(nameReady: boolean, match: StaffRegistrationMatch | undefined): boolean {
  if (!nameReady || !match) {
    return false;
  }
  if (match.status === 'registered' && match.username) {
    return true;
  }
  return match.quickReg;
}

export default function RegistrationNewUserForm() {
  const { showXsLayout } = useLayoutTier();
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);
  const { showProblem, showSuccess } = useMessages();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [match, setMatch] = useState<StaffRegistrationMatch | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [bib, setBib] = useState('');
  const [picks, setPicks] = useState<RegistrationContestPick[]>([]);
  const [rosterRevision, setRosterRevision] = useState(0);
  const [registering, setRegistering] = useState(false);
  const [generateContest, setGenerateContest] = useState<UpcomingRegistrationContest | null>(null);
  const [contestAction, setContestAction] = useState<'create' | 'delete'>('create');
  const [generating, setGenerating] = useState(false);
  const [competitorCountText, setCompetitorCountText] = useState('');
  const lookupSeqRef = useRef(0);
  const firstNameRef = useRef(firstName);
  const lastNameRef = useRef(lastName);
  const confirmQuickRegisterRef = useRef<() => void>(() => {});
  const quickRegisterInFlightRef = useRef(false);
  const attemptedAutoQuickRegisterRef = useRef(new Set<string>());
  firstNameRef.current = firstName;
  lastNameRef.current = lastName;

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const nameReady = trimmedFirst !== '' && trimmedLast !== '';
  const registered = personIsRegistered(nameReady, match);
  const bibReady = bibNumber(bib) > 0;
  const assignedRole = picks.find((pick) => pick.role === 'leader' || pick.role === 'follower')?.role ?? null;
  const contestChecked = picks.length > 0;
  const canRegister = registered && bibReady && contestChecked && !registering && !busy;
  const selectedContest = picks.length === 1 ? picks[0].contest : null;
  const deleteMode = selectedContest?.hasGeneratedCompetitors === true;
  const canRunContestAction = isAdmin && selectedContest !== null && !generating;
  const competitorCount = testCompetitorCount(competitorCountText);
  const contestActionLabel = deleteMode
    ? 'Delete Generated Competitors'
    : 'Create/Register Test Competitors';

  const handleSelectionChange = useCallback((next: RegistrationContestPick[]) => {
    setPicks(next);
  }, []);

  useEffect(() => {
    if (!nameReady) {
      lookupSeqRef.current += 1;
      setMatch(undefined);
      setDialogOpen(false);
      return;
    }

    setMatch(undefined);
    const seq = lookupSeqRef.current + 1;
    lookupSeqRef.current = seq;
    const timer = window.setTimeout(() => {
      void lookupStaffRegistration([
        { id: NEW_USER_LOOKUP_ID, firstName: trimmedFirst, lastName: trimmedLast },
      ])
        .then((matches) => {
          if (lookupSeqRef.current !== seq) {
            return;
          }
          setMatch(matches[NEW_USER_LOOKUP_ID]);
        })
        .catch(() => {
          if (lookupSeqRef.current !== seq) {
            return;
          }
          setMatch(undefined);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [nameReady, trimmedFirst, trimmedLast]);

  useEffect(() => {
    const action = autoQuickRegisterAction({
      firstName: trimmedFirst,
      lastName: trimmedLast,
      bib,
      role: assignedRole,
      eligible: nameReady && match?.status === 'none' && !registered,
      attemptedKeys: [...attemptedAutoQuickRegisterRef.current],
    });
    if (!action.run || action.attemptKey === null || busy || quickRegisterInFlightRef.current) {
      return;
    }

    const attemptKey = action.attemptKey;
    const timer = window.setTimeout(() => {
      const latest = autoQuickRegisterAction({
        firstName: firstNameRef.current.trim(),
        lastName: lastNameRef.current.trim(),
        bib,
        role: assignedRole,
        eligible: nameReady && match?.status === 'none' && !registered,
        attemptedKeys: [...attemptedAutoQuickRegisterRef.current],
      });
      if (
        !latest.run
        || latest.attemptKey !== attemptKey
        || busy
        || quickRegisterInFlightRef.current
      ) {
        return;
      }
      attemptedAutoQuickRegisterRef.current.add(attemptKey);
      confirmQuickRegisterRef.current();
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [assignedRole, bib, busy, match, nameReady, trimmedFirst, trimmedLast]);

  useEffect(() => {
    if (!dialogOpen) {
      setHint(null);
      return;
    }

    let cancelled = false;
    void previewQuickRegisterUsernames([
      { id: NEW_USER_LOOKUP_ID, firstName: trimmedFirst, lastName: trimmedLast },
    ])
      .then((people) => {
        if (cancelled) {
          return;
        }
        const person = people[0];
        if (!person?.ok || !person.incremented) {
          setHint(null);
          return;
        }
        setHint(
          quickRegistrationUsernameHint(
            `${person.firstName} ${person.lastName}`,
            person.baseUsername,
            person.username,
            'will',
          ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setHint(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dialogOpen, trimmedFirst, trimmedLast]);

  const trimField = (field: 'first' | 'last') => {
    if (field === 'first') {
      const trimmed = trimSavedText(firstNameRef.current);
      if (trimmed !== firstNameRef.current) {
        setFirstName(trimmed);
      }
      return;
    }

    const trimmed = trimSavedText(lastNameRef.current);
    if (trimmed !== lastNameRef.current) {
      setLastName(trimmed);
    }
  };

  const cancelQuickRegister = () => {
    if (busy) {
      return;
    }
    setDialogOpen(false);
  };

  const confirmQuickRegister = () => {
    if (!nameReady || busy || quickRegisterInFlightRef.current) {
      return;
    }

    quickRegisterInFlightRef.current = true;
    const registeredFirst = trimmedFirst;
    const registeredLast = trimmedLast;
    setBusy(true);

    void quickRegisterUser(registeredFirst, registeredLast)
      .then(async (result) => {
        if (!result.ok || !result.username || !result.password) {
          showProblem(result.message || 'Unable to quick register.');
          return;
        }

        const usernameHint = quickRegistrationUsernameHint(
          `${registeredFirst} ${registeredLast}`,
          result.base_username?.trim() || result.password,
          result.username,
          'uses',
        );
        showSuccess(
          [quickRegistrationRegisteredMessage(registeredFirst, registeredLast), usernameHint]
            .filter(Boolean)
            .join(' '),
        );

        const quickMatch: StaffRegistrationMatch = {
          status: 'partial',
          username: result.username,
          isAdmin: false,
          quickReg: true,
        };
        setMatch(quickMatch);
        setDialogOpen(false);

        const seq = lookupSeqRef.current + 1;
        lookupSeqRef.current = seq;
        try {
          const matches = await lookupStaffRegistration([
            { id: NEW_USER_LOOKUP_ID, firstName: registeredFirst, lastName: registeredLast },
          ]);
          if (lookupSeqRef.current !== seq) {
            return;
          }
          const lookedUp = matches[NEW_USER_LOOKUP_ID];
          setMatch(lookedUp && lookedUp.status !== 'none' ? lookedUp : quickMatch);
        } catch {
          if (lookupSeqRef.current === seq) {
            setMatch(quickMatch);
          }
        }
      })
      .catch((error: unknown) => {
        showProblem(error instanceof Error ? error.message : 'Unable to quick register.');
      })
      .finally(() => {
        quickRegisterInFlightRef.current = false;
        setBusy(false);
      });
  };
  confirmQuickRegisterRef.current = confirmQuickRegister;

  const registerCompetitor = () => {
    if (!canRegister || !match) {
      return;
    }

    const missingRole = picks.filter((pick) => pick.role === null);
    if (missingRole.length > 0) {
      showProblem(`Select Leader or Follower for ${missingRole.map((pick) => pick.label).join(', ')}.`);
      return;
    }

    const personId = match.username?.trim() || `${trimmedFirst} ${trimmedLast}`;
    const bibValue = bibNumber(bib);
    const selected = picks.flatMap((pick) =>
      pick.role === null
        ? []
        : [
            {
              contest: pick.contest,
              role: pick.role,
              personId,
              firstName: trimmedFirst,
              lastName: trimmedLast,
              bib: bibValue,
            },
          ],
    );
    if (selected.length === 0) {
      return;
    }

    setRegistering(true);
    void registerContestCompetitors(selected)
      .then(() => {
        showSuccess(`Registered ${trimmedFirst} ${trimmedLast}.`);
        setBib('');
        setRosterRevision((current) => current + 1);
      })
      .catch((error: unknown) => {
        showProblem(error instanceof Error ? error.message : 'Unable to register competitor.');
      })
      .finally(() => {
        setRegistering(false);
      });
  };

  const openContestAction = () => {
    if (!isAdmin || generating || picks.length !== 1) {
      return;
    }
    const contest = picks[0].contest;
    setContestAction(contest.hasGeneratedCompetitors ? 'delete' : 'create');
    setCompetitorCountText('');
    setGenerateContest(contest);
  };

  const closeContestAction = () => {
    if (generating) {
      return;
    }
    setGenerateContest(null);
    setCompetitorCountText('');
  };

  const confirmContestAction = () => {
    if (!generateContest || generating) {
      return;
    }
    const count = competitorCount;
    if (contestAction === 'create' && count === null) {
      return;
    }

    const contest = generateContest;
    const action = contestAction;
    const label = contestSkillDivisionLabel(contest) || 'this contest';
    setGenerating(true);
    let request: Promise<void>;
    if (action === 'delete') {
      request = deleteGeneratedContestCompetitors(contest).then((result) => {
        showSuccess(
          result.scratched === 1
            ? `Scratched 1 generated test competitor from ${label}.`
            : `Scratched ${result.scratched} generated test competitors from ${label}.`,
        );
      });
    } else if (count !== null) {
      request = generateContestCompetitors(contest, count).then((result) => {
        showSuccess(
          `Added ${result.leadersAdded} leaders and ${result.followersAdded} followers to ${label}.`,
        );
      });
    } else {
      setGenerating(false);
      return;
    }

    void request
      .then(() => {
        setGenerateContest(null);
        setCompetitorCountText('');
        setRosterRevision((current) => current + 1);
      })
      .catch((error: unknown) => {
        showProblem(
          error instanceof Error
            ? error.message
            : action === 'delete'
              ? 'Unable to delete generated competitors.'
              : 'Unable to create test competitors.',
        );
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  const columnLabelSx = {
    fontWeight: 700,
    display: { xs: 'none', md: 'block' },
  } as const;

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr) 7rem' },
          columnGap: 2,
          rowGap: 1.5,
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={columnLabelSx}>
          First name
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={columnLabelSx}>
          Last name
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ...columnLabelSx, textAlign: 'center' }}
        >
          Registered
        </Typography>

        <AppTextField
          label={showXsLayout ? 'First name' : undefined}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          fullWidth
          autoComplete="off"
          name="registration-new-first-name"
          slotProps={{
            inputLabel: showXsLayout ? { sx: { fontWeight: 700 } } : undefined,
            htmlInput: {
              'aria-label': 'First name',
              onBlur: () => trimField('first'),
            },
          }}
        />
        <AppTextField
          label={showXsLayout ? 'Last name' : undefined}
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          fullWidth
          autoComplete="off"
          name="registration-new-last-name"
          slotProps={{
            inputLabel: showXsLayout ? { sx: { fontWeight: 700 } } : undefined,
            htmlInput: {
              'aria-label': 'Last name',
              onBlur: () => trimField('last'),
            },
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', md: 'center' },
            minHeight: 40,
          }}
        >
          {showXsLayout ? (
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Registered
            </Typography>
          ) : null}
          <StaffRegistrationMark
            firstName={trimmedFirst}
            match={nameReady ? match : undefined}
            onQuickRegister={
              nameReady && match?.status === 'none' ? () => setDialogOpen(true) : undefined
            }
          />
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          gap: 2,
          width: '100%',
        }}
      >
        <AppTextField
          label="Bib Number"
          value={bib}
          onChange={(event) => setBib(digitsOnlyBib(event.target.value))}
          autoComplete="off"
          name="registration-new-bib"
          sx={{ width: { xs: '100%', md: '12rem' } }}
          slotProps={{
            inputLabel: { sx: { fontWeight: 700 } },
            htmlInput: {
              'aria-label': 'Bib Number',
              inputMode: 'numeric',
              maxLength: 3,
              pattern: '[0-9]*',
            },
          }}
        />
        <Button
          type="button"
          variant="contained"
          disabled={!canRegister}
          onClick={registerCompetitor}
          sx={{ flexShrink: 0, height: 56, textTransform: 'none' }}
        >
          Register Competitor
        </Button>
      </Box>
      {isAdmin ? (
        <Button
          type="button"
          variant="contained"
          disabled={!canRunContestAction}
          onClick={openContestAction}
          sx={{
            mt: 2,
            width: '100%',
            maxWidth: 'min(760px, 100%)',
            minHeight: 56,
            height: { md: 56 },
            textTransform: 'none',
            whiteSpace: 'normal',
          }}
        >
          {contestActionLabel}
        </Button>
      ) : null}

      <RegistrationUpcomingContests revision={rosterRevision} onSelectionChange={handleSelectionChange} />

      <QuickRegisterDialog
        open={dialogOpen}
        firstName={trimmedFirst}
        detail={hint}
        busy={busy}
        onClose={cancelQuickRegister}
        onConfirm={confirmQuickRegister}
      />

      <Dialog
        open={generateContest !== null}
        onClose={closeContestAction}
        fullWidth
        maxWidth={false}
        aria-labelledby="test-competitors-title"
        slotProps={{
          paper: {
            sx: {
              maxWidth: 760,
            },
          },
        }}
      >
        <DialogTitle id="test-competitors-title">
          {contestAction === 'delete' ? 'Delete generated competitors' : 'Create/Register test competitors'}
        </DialogTitle>
        <DialogContent>
          {contestAction === 'delete' ? (
            <Typography variant="body1">
              {generateContest ? deleteGeneratedCompetitorsConfirmText(generateContest) : ''}
            </Typography>
          ) : (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body1">
                {generateContest && competitorCount !== null
                  ? createTestCompetitorsConfirmText(generateContest, competitorCount)
                  : 'This will scratch the current competitors, then add the leaders and followers you enter.'}
              </Typography>
              <AppTextField
                label="Count of both leaders and followers to create"
                value={competitorCountText}
                onChange={(event) => setCompetitorCountText(event.target.value.replace(/\D/g, '').slice(0, 3))}
                fullWidth
                autoComplete="off"
                error={competitorCountText !== '' && competitorCount === null}
                helperText={
                  competitorCountText !== '' && competitorCount === null
                    ? 'Enter a whole number from 1 to 199.'
                    : ' '
                }
                name="registration-test-competitor-count"
                slotProps={{
                  inputLabel: { sx: { fontWeight: 700 } },
                  htmlInput: {
                    'aria-label': 'Count of both leaders and followers to create',
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  },
                }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {contestAction === 'delete' ? (
            <>
              <Button type="button" onClick={closeContestAction} disabled={generating} sx={{ textTransform: 'none' }}>
                No
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={confirmContestAction}
                disabled={generating}
                sx={{ textTransform: 'none' }}
              >
                Yes
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={closeContestAction} disabled={generating} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={confirmContestAction}
                disabled={generating || competitorCount === null}
                sx={{ textTransform: 'none' }}
              >
                Generate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
