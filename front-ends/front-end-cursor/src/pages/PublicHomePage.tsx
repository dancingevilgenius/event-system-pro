import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

export default function PublicHomePage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
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

        <Stack
          spacing={2}
          sx={
            showXsLayout
              ? centeredContentStackSx
              : { maxWidth: 480, mx: 'auto', width: '100%' }
          }
        >
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
