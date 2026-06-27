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
import { useMessages } from '../hooks/useMessages';
import { loadSession } from '../lib/session';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [session] = useState(() => loadSession());
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    if (!session) {
      showProblem('Sign in to change your password.');
      navigate('/', { replace: true });
    }
  }, [navigate, session, showProblem]);

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

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Change Password
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Signed in as <strong>{session.username}</strong>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2} sx={centeredContentStackSx}>
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
