import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" size="large" fullWidth>
              Login
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}
