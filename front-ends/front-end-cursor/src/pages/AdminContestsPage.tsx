import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';

const CONTESTS = ['Contest 1', 'Contest 2', 'Contest 3'] as const;

export default function AdminContestsPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contests
        </Typography>

        <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
          {CONTESTS.map((contest) => (
            <Button
              key={contest}
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/admin/contests/contest')}
            >
              {contest}
            </Button>
          ))}
        </Stack>

        <Stack sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
