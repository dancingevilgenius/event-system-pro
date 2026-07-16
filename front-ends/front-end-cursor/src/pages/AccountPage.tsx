import {
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppTextField from '../components/AppTextField';
import ShowRolesDialog from '../components/ShowRolesDialog';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { MESSAGE_AUTO_DISMISS_OPTIONS } from '../lib/messagePreferences';

export default function AccountPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { messageAutoDismissMs, setMessageAutoDismissMs } = useMessages();
  const [rolesOpen, setRolesOpen] = useState(false);

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
          <ThemeSwitcher fullWidth />

          <AppTextField
            select
            label="Message display time"
            value={String(messageAutoDismissMs)}
            onChange={(event) => {
              setMessageAutoDismissMs(Number.parseInt(event.target.value, 10));
            }}
            fullWidth
            helperText="How long success, warning, and error messages stay visible."
          >
            {MESSAGE_AUTO_DISMISS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </AppTextField>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => setRolesOpen(true)}
          >
            Show Roles
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/changepassword')}
          >
            Change Password
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => navigate('/secret-questions')}
          >
            Password Recovery
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>

      <ShowRolesDialog
        open={rolesOpen}
        roles={session.roles}
        onClose={() => setRolesOpen(false)}
      />
    </Container>
  );
}
