import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';

type ContestSelectionPageProps = {
  title: string;
  contestRoute?: string;
};

export default function ContestSelectionPage({
  title,
  contestRoute,
}: ContestSelectionPageProps) {
  const navigate = useNavigate();
  const contests = ['Contest 1', 'Contest 2', 'Contest 3'];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>

        <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
          {contests.map((contest) => (
            <Button
              key={contest}
              variant="contained"
              size="large"
              fullWidth
              onClick={() => contestRoute && navigate(contestRoute)}
            >
              {contest}
            </Button>
          ))}
        </Stack>

        <Stack sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
