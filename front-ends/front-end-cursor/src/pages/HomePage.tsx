import { Button, Container, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { centeredContentStackSx } from '../constants/layout';

export default function HomePage() {
  const navigate = useNavigate();

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

        <Stack spacing={2} sx={{ mb: 3, alignItems: 'center', width: '100%' }}>
          <ThemeSwitcher fullWidth />
        </Stack>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/')}>
            Back to Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
