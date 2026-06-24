import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type ContestSelectionPageProps = {
  title: string;
};

export default function ContestSelectionPage({ title }: ContestSelectionPageProps) {
  const navigate = useNavigate();
  const contests = ['Contest 1', 'Contest 2', 'Contest 3'];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>

        <Stack spacing={2} sx={{ my: 3 }}>
          {contests.map((contest) => (
            <Button key={contest} variant="contained" size="large" fullWidth>
              {contest}
            </Button>
          ))}
        </Stack>

        <Button variant="outlined" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
}
