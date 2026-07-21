import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  if (!session) {
    return null;
  }

  const passwordInputType = showPasswords ? 'text' : 'password';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oldPassword) {
      showProblem('Enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      showProblem('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showProblem('New password and confirmation do not match.');
      return;
    }

    setBusy(true);
    try {
      const result = await changePassword(session.user_id, oldPassword, newPassword);
      if (!result.ok) {
        showProblem(result.message);
        return;
      }

      showSuccess(result.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswords(false);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Password change failed.');
    } finally {
      setBusy(false);
    }
  };

  const formStackSx = showXsLayout
    ? centeredContentStackSx
    : { maxWidth: 480, mx: 'auto', width: '100%' };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Change Password
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Signed in as <strong>{session.username}</strong>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2} sx={formStackSx}>
            <AppTextField
              label="Old password"
              type={passwordInputType}
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              fullWidth
              autoComplete="current-password"
              required
            />
            <AppTextField
              label="New password"
              type={passwordInputType}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              fullWidth
              autoComplete="new-password"
              required
            />
            <AppTextField
              label="Confirm password"
              type={passwordInputType}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
              autoComplete="new-password"
              required
            />
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => setShowPasswords((visible) => !visible)}
            >
              {showPasswords ? 'Hide passwords' : 'Show passwords'}
            </Button>
            <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
              Change password
            </Button>
            <Button variant="text" fullWidth onClick={() => navigate('/account')}>
              Back to Account
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
