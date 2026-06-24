import { Button, Container, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
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

        <Stack spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <ThemeSwitcher />
        </Stack>

        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
}
