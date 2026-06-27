import {
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';

export default function AccountPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

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
