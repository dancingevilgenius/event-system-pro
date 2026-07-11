import { Alert, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUserForWsdcMatch, saveWsdcForMatchingUser } from '../api/postgrest';
import {
  buildStoredWsdcInfo,
  normalizeWsdcId,
  type WsdcDancerProfile,
} from '../api/wsdcRegistry';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';

export default function WsdcFindDancerPage() {
  const navigate = useNavigate();
  const { showProblem, showSuccess } = useMessages();
  const [saving, setSaving] = useState(false);
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [canConfirmSave, setCanConfirmSave] = useState(false);
  const [noAccountWarning, setNoAccountWarning] = useState<string | null>(null);
  const [matchNote, setMatchNote] = useState<string | null>(null);

  const resetMatchState = useCallback(() => {
    setCanConfirmSave(false);
    setNoAccountWarning(null);
    setMatchNote(null);
    setCheckingMatch(false);
  }, []);

  const handleProfileChange = useCallback(
    (profile: WsdcDancerProfile | null) => {
      if (!profile) {
        resetMatchState();
        return;
      }

      const firstName = profile.dancer_first?.trim() || '';
      const lastName = profile.dancer_last?.trim() || '';
      const wsdcId = normalizeWsdcId(profile.dancer_wsdcid);

      setCheckingMatch(true);
      setCanConfirmSave(false);
      setNoAccountWarning(null);
      setMatchNote(null);

      void findUserForWsdcMatch({
        wsdcId,
        firstName,
        lastName,
      })
        .then((result) => {
          if (!result.ok) {
            setCanConfirmSave(false);
            setNoAccountWarning(null);
            setMatchNote(result.message ?? 'Unable to check for a matching account.');
            return;
          }

          if (result.matched) {
            setCanConfirmSave(true);
            setNoAccountWarning(null);
            const who = result.display_name || result.username || `user ${result.user_id}`;
            const how =
              result.match_by === 'wsdc_id'
                ? 'WSDC #'
                : result.match_by === 'name'
                  ? 'first and last name'
                  : String(result.match_by ?? 'match');
            setMatchNote(`Matched Event System Pro account: ${who} (by ${how}).`);
            return;
          }

          setCanConfirmSave(false);
          if (result.ambiguous) {
            setNoAccountWarning(null);
            setMatchNote(result.message ?? 'Multiple matching accounts found.');
            return;
          }

          setMatchNote(null);
          setNoAccountWarning(
            `World Swing Dance Council dancer found for ${firstName} ${lastName}.  They do not have an account in Event System Pro.`,
          );
        })
        .catch((error) => {
          setCanConfirmSave(false);
          setNoAccountWarning(null);
          setMatchNote(
            error instanceof Error ? error.message : 'Unable to check for a matching account.',
          );
        })
        .finally(() => {
          setCheckingMatch(false);
        });
    },
    [resetMatchState],
  );

  const handleConfirmAndSave = async (wsdcId: string, profile: WsdcDancerProfile) => {
    if (!canConfirmSave) {
      return;
    }

    setSaving(true);
    try {
      const result = await saveWsdcForMatchingUser({
        wsdcId,
        wsdcInfo: buildStoredWsdcInfo(wsdcId, profile),
        firstName: profile.dancer_first,
        lastName: profile.dancer_last,
      });
      if (!result.ok) {
        showProblem(result.message);
        return;
      }
      showSuccess(result.message);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Unable to save WSDC info.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          WSDC Find Dancer
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Confirm and Save writes to the user account with an exact WSDC # match, or else an exact
          first and last name match.
        </Typography>

        <WsdcFindDancerSection
          enableDirectLink
          confirmLabel="Confirm and Save"
          confirming={saving}
          confirmDisabled={!canConfirmSave || checkingMatch}
          onConfirmWsdcId={handleConfirmAndSave}
          onProfileChange={handleProfileChange}
        />

        {checkingMatch && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Checking for a matching Event System Pro account…
          </Typography>
        )}

        {!checkingMatch && noAccountWarning && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {noAccountWarning}
          </Alert>
        )}

        {!checkingMatch && matchNote && !noAccountWarning && (
          <Alert severity={canConfirmSave ? 'info' : 'warning'} sx={{ mt: 2 }}>
            {matchNote}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mt: 3, ...centeredContentStackSx }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
