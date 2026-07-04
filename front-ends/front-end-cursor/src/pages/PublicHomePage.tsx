import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';

export default function PublicHomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event System Pro
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Competition and event management for organizers, staff, and competitors.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
          More features coming soon.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
          Host: {window.location.hostname}
        </Typography>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="contained" size="large" fullWidth onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="outlined" size="large" fullWidth onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button variant="outlined" size="large" fullWidth onClick={() => navigate('/demo')}>
            Demo
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
