import { CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AdminEventContestBracketStagePage from './AdminEventContestBracketStagePage';
import AdminEventContestPoolStagePage from './AdminEventContestPoolStagePage';
import PageHeader from '../components/PageHeader';
import { eventContestPath } from '../constants/eventRoutes';
import { useLayoutTier } from '../hooks/useLayoutTier';

/**
 * Routes stage views by stage key under
 * /event-groups/:code/:eventId/contests/:contestId/stages/:stage
 */
export default function AdminEventContestStagePage() {
  const { containerMaxWidth } = useLayoutTier();
  const { eventGroupCode = '', eventId = '', contestId = '', stage = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
    contestId: string;
    stage: string;
  }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const decodedStage = decodeURIComponent(stage);
  const parsedEventId = Number.parseInt(eventId, 10);
  const parsedContestId = Number.parseInt(contestId, 10);
  const contestPath = eventContestPath(decodedGroupCode, parsedEventId, parsedContestId);

  if (decodedStage === 'pools') {
    return <AdminEventContestPoolStagePage />;
  }

  if (decodedStage === 'primary_elim' || decodedStage.includes('elim')) {
    return <AdminEventContestBracketStagePage />;
  }

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Stage" backTo={contestPath} backLabel="Back to Contest" />
        <Stack sx={{ py: 4, alignItems: 'center' }}>
          {decodedStage ? (
            <Typography variant="body2" color="text.secondary">
              No viewer is configured for stage “{decodedStage}”.
            </Typography>
          ) : (
            <CircularProgress size={32} />
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
