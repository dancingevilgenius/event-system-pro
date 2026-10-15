import { Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchUserPersonName, fetchUserWsdcId, setUserWsdcId } from '../api/postgrest';
import { buildStoredWsdcInfo, type WsdcDancerProfile } from '../api/wsdcRegistry';
import PageHeader from '../components/PageHeader';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import ContestSelectionPage from './ContestSelectionPage';

function formatWsdcPageTitle(firstName: string, lastName: string): string {
  const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  return name ? `${name} WSDC` : 'WSDC';
}

export default function CompetitorPage() {
  const { session } = useAuth();
  const { showProblem, showSuccess } = useMessages();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [savedWsdcId, setSavedWsdcId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContests, setShowContests] = useState(false);

  const loadSaved = useCallback(async () => {
    if (!session?.user_id) {
      setSavedWsdcId(null);
      setPageTitle('WSDC');
      setLoadingSaved(false);
      return;
    }

    setLoadingSaved(true);
    try {
      const [wsdcId, name] = await Promise.all([
        fetchUserWsdcId(session.user_id),
        fetchUserPersonName(session.user_id),
      ]);
      setSavedWsdcId(wsdcId);
      setPageTitle(formatWsdcPageTitle(name.firstName, name.lastName));
    } catch (error) {
      setPageTitle('WSDC');
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
    return <ContestSelectionPage title={pageTitle} />;
  }

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title={pageTitle} backTo="/home" backLabel="Back to Home" />

        {savedWsdcId && (
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            Saved on your account: <strong>WSDC #{savedWsdcId}</strong>
          </Typography>
        )}

        <Stack sx={showXsLayout ? centeredContentStackSx : { maxWidth: 480, mx: 'auto', width: '100%' }}>
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
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : { maxWidth: 480, mx: 'auto', width: '100%' }}>
          <Button variant="contained" size="large" fullWidth onClick={() => setShowContests(true)}>
            Continue to Contests
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
