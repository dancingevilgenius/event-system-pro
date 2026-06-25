import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppTextField } from '../components/AppTextField';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No real authentication yet — any credentials are accepted.
    navigate('/home');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'primary.main',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 0.5, mb: 0.5 }}
        >
          Event System Pro
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'rgba(250,248,244,0.7)', mb: 4 }}
        >
          Sign in to continue
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <AppTextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <AppTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
            Log In
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
