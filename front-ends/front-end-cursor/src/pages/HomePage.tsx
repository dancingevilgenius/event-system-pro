import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This is a placeholder home page. Event management features will be added here.
        </Typography>

        <Stack spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Try switching skins
          </Typography>
          <ThemeSwitcher />
        </Stack>

        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
}
