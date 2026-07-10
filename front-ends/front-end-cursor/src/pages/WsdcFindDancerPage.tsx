import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserWsdcId } from '../api/postgrest';
import { buildStoredWsdcInfo, type WsdcDancerProfile } from '../api/wsdcRegistry';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';

export default function WsdcFindDancerPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { showProblem, showSuccess } = useMessages();
  const [saving, setSaving] = useState(false);

  const handleConfirmAndSave = async (wsdcId: string, profile: WsdcDancerProfile) => {
    if (!session?.user_id) {
      showProblem('Sign in to save WSDC info.');
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

        <WsdcFindDancerSection
          enableDirectLink
          confirmLabel="Confirm and Save"
          confirming={saving}
          onConfirmWsdcId={handleConfirmAndSave}
        />

        <Stack spacing={2} sx={{ mt: 3, ...centeredContentStackSx }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
