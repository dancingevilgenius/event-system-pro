import { Button, Container, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';

export default function HomePage() {
  const navigate = useNavigate();
  const { showSuccess, showWarning, showProblem, clearMessages } = useMessages();

  const handleTestMessages = () => {
    clearMessages();
    showSuccess('Your change has been saved.');
    showWarning('Your event starts in less than 15 min.');
    showProblem('Your sign in time has passed.');
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
        </Stack>

        <Stack spacing={2} sx={{ mb: 3, alignItems: 'center', width: '100%' }}>
          <ThemeSwitcher fullWidth />
          <Button variant="text" fullWidth onClick={handleTestMessages}>
            Test Messages
          </Button>
        </Stack>

        <Stack sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/')}>
            Back to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
