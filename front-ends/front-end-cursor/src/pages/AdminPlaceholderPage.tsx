import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';

type AdminPlaceholderPageProps = {
  title: string;
  backPath?: string;
  backLabel?: string;
};

export default function AdminPlaceholderPage({
  title,
  backPath = '/adminhome',
  backLabel = 'Back to Admin',
}: AdminPlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Coming soon.
        </Typography>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate(backPath)}>
            {backLabel}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
