import { Alert, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUserForWsdcMatch, saveWsdcForMatchingUser } from '../api/postgrest';
import {
  buildStoredWsdcInfo,
  formatWsdcFetchTimingMessage,
  normalizeWsdcId,
  type WsdcDancerProfile,
} from '../api/wsdcRegistry';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';

export default function WsdcFindDancerPage() {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);
  const { showProblem, showSuccess } = useMessages();
  const [saving, setSaving] = useState(false);
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [canConfirmSave, setCanConfirmSave] = useState(false);
  const [noAccountWarning, setNoAccountWarning] = useState<string | null>(null);
  const [matchNote, setMatchNote] = useState<string | null>(null);
  const [storedWsdcNote, setStoredWsdcNote] = useState<string | null>(null);
  const [fetchTimingNote, setFetchTimingNote] = useState<string | null>(null);

  const buildStoredWsdcNote = useCallback((firstName: string, lastUpdate: string) => {
    return `We have WSDC# info for ${firstName} from ${lastUpdate}`;
  }, []);

  const resetMatchState = useCallback(() => {
    setCanConfirmSave(false);
    setNoAccountWarning(null);
    setMatchNote(null);
    setStoredWsdcNote(null);
    setFetchTimingNote(null);
    setCheckingMatch(false);
  }, []);

  const handleFetchStart = useCallback(() => {
    setFetchTimingNote(null);
  }, []);

  const handleFetchComplete = useCallback((elapsedMs: number) => {
    setFetchTimingNote(formatWsdcFetchTimingMessage(elapsedMs));
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
      setStoredWsdcNote(null);

      void findUserForWsdcMatch({
        wsdcId,
        firstName,
        lastName,
      })
        .then((result) => {
          if (!result.ok) {
            setCanConfirmSave(false);
            setNoAccountWarning(null);
            setStoredWsdcNote(null);
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

            if (result.has_stored_wsdc && result.stored_last_update_datetime) {
              const storedFirst =
                result.stored_dancer_first?.trim() || firstName || who.split(/\s+/)[0] || 'this dancer';
              setStoredWsdcNote(buildStoredWsdcNote(storedFirst, result.stored_last_update_datetime));
            } else {
              setStoredWsdcNote(null);
            }
            return;
          }

          setCanConfirmSave(false);
          setStoredWsdcNote(null);
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
          setStoredWsdcNote(null);
          setMatchNote(
            error instanceof Error ? error.message : 'Unable to check for a matching account.',
          );
        })
        .finally(() => {
          setCheckingMatch(false);
        });
    },
    [buildStoredWsdcNote, resetMatchState],
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

      const saved = result.wsdc;
      const lastUpdate =
        typeof saved?.last_update_datetime === 'string' ? saved.last_update_datetime.trim() : '';
      if (lastUpdate) {
        const storedFirst =
          (typeof saved?.dancer_first === 'string' && saved.dancer_first.trim()) ||
          profile.dancer_first?.trim() ||
          'this dancer';
        setStoredWsdcNote(buildStoredWsdcNote(storedFirst, lastUpdate));
      }
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

        <WsdcFindDancerSection
          title=""
          enableDirectLink
          confirmLabel="Confirm and Save"
          confirming={saving}
          confirmDisabled={!canConfirmSave || checkingMatch}
          onConfirmWsdcId={handleConfirmAndSave}
          onProfileChange={handleProfileChange}
          showFetchTiming={isAdmin}
          onFetchStart={handleFetchStart}
          onFetchComplete={handleFetchComplete}
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

        {!checkingMatch && storedWsdcNote && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {storedWsdcNote}
          </Alert>
        )}

        {isAdmin && fetchTimingNote && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {fetchTimingNote}
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
