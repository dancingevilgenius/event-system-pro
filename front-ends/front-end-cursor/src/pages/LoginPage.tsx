import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPendingMigrationCount, login } from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { sessionFromLoginResult } from '../lib/loginSuccess';
import { pendingMigrationsMessage } from '../lib/pendingMigrations';

export default function LoginPage() {
  const navigate = useNavigate();
  const { session, setSession } = useAuth();
  const { showProblem, showSuccess } = useMessages();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const redirectHomeAfterLogin = useRef(false);

  useEffect(() => {
    if (!redirectHomeAfterLogin.current || !session) {
      return;
    }

    redirectHomeAfterLogin.current = false;
    navigate('/home', { replace: true });
  }, [navigate, session]);

  const passwordInputType = showPassword ? 'text' : 'password';

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

      const success = sessionFromLoginResult(result);
      if (!success) {
        showProblem(result.message || 'Login failed.');
        return;
      }

      setSession(success.session);
      showSuccess(result.message);
      redirectHomeAfterLogin.current = true;

      if (success.session.roles.includes('ADMIN')) {
        try {
          const pendingMessage = pendingMigrationsMessage(await fetchPendingMigrationCount());
          if (pendingMessage) {
            showProblem(pendingMessage, { sticky: true, id: 'pending-migrations' });
          }
        } catch {
          // Login already succeeded. A failed migration check should not block home.
        }
      }
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Login failed.');
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
        <PageHeader
          title="Event System Pro"
          backTo="/home-page"
          backLabel="Back to Home"
        />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Sign in to your account or register as a new user.
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={2} sx={formStackSx}>
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
              type={passwordInputType}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete="current-password"
              required
            />
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </Button>
            <Stack spacing={2} sx={formStackSx}>
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

        <Stack sx={formStackSx}>
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
