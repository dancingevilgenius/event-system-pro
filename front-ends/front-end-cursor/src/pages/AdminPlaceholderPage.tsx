import { Container, Paper, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';

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
  const { containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader title={title} backTo={backPath} backLabel={backLabel} />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Coming soon.
        </Typography>
      </Paper>
    </Container>
  );
}
