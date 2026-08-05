import { Container, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AddEventButton from '../components/AddEventButton';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { eventDetailPath } from '../constants/eventRoutes';
import { useLayoutTier } from '../hooks/useLayoutTier';

type AdminEventSectionPlaceholderPageProps = {
  title: string;
};

export default function AdminEventSectionPlaceholderPage({
  title,
}: AdminEventSectionPlaceholderPageProps) {
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const { eventGroupCode = '', eventId = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
  }>();

  const parsedEventId = Number.parseInt(eventId, 10);
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const eventBasePath = eventDetailPath(decodedGroupCode, parsedEventId);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader title={title} backTo={eventBasePath} backLabel="Back to Event" />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Coming soon.
        </Typography>

        {decodedGroupCode ? (
          <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : { maxWidth: 480, mx: 'auto', width: '100%' }}>
            <AddEventButton eventGroupCode={decodedGroupCode} />
          </Stack>
        ) : null}
      </Paper>
    </Container>
  );
}
