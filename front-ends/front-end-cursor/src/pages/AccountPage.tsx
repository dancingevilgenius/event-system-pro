import {
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { loadSession } from '../lib/session';

export default function AccountPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem } = useMessages();
  const [session] = useState(() => loadSession());

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    if (!session) {
      showProblem('Sign in to manage your account.');
      navigate('/', { replace: true });
    }
  }, [navigate, session, showProblem]);

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Account
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Signed in as <strong>{session.username}</strong>
        </Typography>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/changepassword')}
          >
            Change Password
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
