import { Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  lookupStaffRegistration,
  previewQuickRegisterUsernames,
  quickRegisterUser,
  registerContestCompetitors,
  type StaffRegistrationMatch,
} from '../api/postgrest';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
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
  const lookupSeqRef = useRef(0);
  const firstNameRef = useRef(firstName);
  const lastNameRef = useRef(lastName);
  firstNameRef.current = firstName;
  lastNameRef.current = lastName;

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const nameReady = trimmedFirst !== '' && trimmedLast !== '';
  const registered = personIsRegistered(nameReady, match);
  const bibReady = bibNumber(bib) > 0;
  const contestChecked = picks.length > 0;
  const canRegister = registered && bibReady && contestChecked && !registering && !busy;

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
    if (!nameReady || busy) {
      return;
    }

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
        setBusy(false);
      });
  };

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

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mt: 2, alignItems: { md: 'center' } }}
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
      </Stack>

      <RegistrationUpcomingContests revision={rosterRevision} onSelectionChange={handleSelectionChange} />

      <QuickRegisterDialog
        open={dialogOpen}
        firstName={trimmedFirst}
        detail={hint}
        busy={busy}
        onClose={cancelQuickRegister}
        onConfirm={confirmQuickRegister}
      />
    </Box>
  );
}
