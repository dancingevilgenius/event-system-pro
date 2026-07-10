import { Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserWsdcId, setUserWsdcId } from '../api/postgrest';
import { buildStoredWsdcInfo, type WsdcDancerProfile } from '../api/wsdcRegistry';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import ContestSelectionPage from './ContestSelectionPage';

export default function CompetitorPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { showProblem, showSuccess } = useMessages();
  const [savedWsdcId, setSavedWsdcId] = useState<string | null>(null);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContests, setShowContests] = useState(false);

  const loadSaved = useCallback(async () => {
    if (!session?.user_id) {
      setSavedWsdcId(null);
      setLoadingSaved(false);
      return;
    }

    setLoadingSaved(true);
    try {
      const wsdcId = await fetchUserWsdcId(session.user_id);
      setSavedWsdcId(wsdcId);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Unable to load saved WSDC ID.');
    } finally {
      setLoadingSaved(false);
    }
  }, [session?.user_id, showProblem]);

  useEffect(() => {
    void loadSaved();
  }, [loadSaved]);

  const handleConfirm = async (wsdcId: string, profile: WsdcDancerProfile) => {
    if (!session?.user_id) {
      showProblem('Sign in to save your WSDC ID.');
      return;
    }

    setSaving(true);
    try {
      const result = await setUserWsdcId({
        userId: session.user_id,
        wsdcId,
        wsdcInfo: buildStoredWsdcInfo(wsdcId, profile),
      });
      if (!result.ok) {
        showProblem(result.message);
        return;
      }
      setSavedWsdcId(wsdcId);
      showSuccess(result.message);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Unable to save WSDC ID.');
    } finally {
      setSaving(false);
    }
  };

  if (showContests) {
    return <ContestSelectionPage title="Competitor" />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Competitor
        </Typography>

        {savedWsdcId && (
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Saved on your account: <strong>WSDC #{savedWsdcId}</strong>
          </Typography>
        )}

        {!loadingSaved && (
          <WsdcFindDancerSection
            title="Look up WSDC points"
            description="Duplicate names are resolved by WSDC # (direct link: ?wsdc=12345)."
            initialWsdcId={savedWsdcId}
            enableDirectLink
            confirmLabel="Save WSDC # to my account"
            confirming={saving}
            onConfirmWsdcId={handleConfirm}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="contained" size="large" fullWidth onClick={() => setShowContests(true)}>
            Continue to Contests
          </Button>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
