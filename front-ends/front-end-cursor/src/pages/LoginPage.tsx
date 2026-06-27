import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { saveSession } from '../lib/session';

export default function LoginPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      showProblem('Enter your username or email and password.');
      return;
    }

    setBusy(true);
    try {
      const result = await login(identifier.trim(), password);
      if (!result.ok) {
        showProblem(result.message);
        return;
      }
      if (result.user_id && result.username && result.email) {
        saveSession({
          user_id: result.user_id,
          username: result.username,
          email: result.email,
        });
      }
      showSuccess(result.message);
      navigate('/home');
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Event System Pro
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Sign in to your account or register as a new user.
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={2} sx={centeredContentStackSx}>
            <AppTextField
              label="Username or email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              fullWidth
              autoComplete="username"
              required
            />
            <AppTextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete="current-password"
              required
            />
            <Stack spacing={2} sx={centeredContentStackSx}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={busy}
              >
                Login
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Stack sx={centeredContentStackSx}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
