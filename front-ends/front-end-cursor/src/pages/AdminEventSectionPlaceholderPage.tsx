import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AddEventButton from '../components/AddEventButton';
import { centeredContentStackSx } from '../constants/layout';
import { eventDetailPath } from '../constants/eventRoutes';

type AdminEventSectionPlaceholderPageProps = {
  title: string;
};

export default function AdminEventSectionPlaceholderPage({
  title,
}: AdminEventSectionPlaceholderPageProps) {
  const navigate = useNavigate();
  const { eventGroupCode = '', eventId = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
  }>();

  const parsedEventId = Number.parseInt(eventId, 10);
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const eventBasePath = eventDetailPath(decodedGroupCode, parsedEventId);

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
          {decodedGroupCode && <AddEventButton eventGroupCode={decodedGroupCode} />}
          <Button variant="outlined" fullWidth onClick={() => navigate(eventBasePath)}>
            Back to Event
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
