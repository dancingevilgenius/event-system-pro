import { Button, Container, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../api/postgrest';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { setFlashSuccess } from '../lib/authMessages';

export default function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showProblem } = useMessages();
  const [busy, setBusy] = useState(false);

  const handleLogOff = async () => {
    setBusy(true);
    try {
      const result = await logoutApi();
      logout();
      if (!result.ok) {
        showProblem(result.message);
        navigate('/');
        return;
      }
      setFlashSuccess(result.message);
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      logout();
      showProblem(error instanceof Error ? error.message : 'Sign out failed.');
      navigate('/');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Stack spacing={2} sx={{ mb: 3, ...centeredContentStackSx }}>
          <Button variant="contained" size="large" fullWidth onClick={() => navigate('/staff')}>
            Staff
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/competitor')}
          >
            Competitor
          </Button>
          <Button variant="contained" size="large" fullWidth onClick={() => navigate('/adminhome')}>
            Admin
          </Button>
          <Button variant="contained" size="large" fullWidth onClick={() => navigate('/account')}>
            Account
          </Button>
        </Stack>

        <Stack spacing={2} sx={{ mb: 3, ...centeredContentStackSx }}>
          <ThemeSwitcher fullWidth />
        </Stack>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth disabled={busy} onClick={handleLogOff}>
            Log Off
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
