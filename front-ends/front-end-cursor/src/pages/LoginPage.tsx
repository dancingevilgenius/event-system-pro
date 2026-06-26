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
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';

export default function LoginPage() {
  const navigate = useNavigate();
  const { clearMessages } = useMessages();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/home');
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
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
              autoComplete="username"
            />
            <AppTextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete="current-password"
            />
            <Stack spacing={2} sx={centeredContentStackSx}>
              <Button type="submit" variant="contained" size="large" fullWidth>
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
