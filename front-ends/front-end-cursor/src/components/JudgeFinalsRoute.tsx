import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJudgingHomeAccess } from '../hooks/useJudgingHomeAccess';
import { canOpenJudgeFinals } from '../lib/judgingFinalsEntries';
import JudgingPage from '../pages/JudgingPage';

export default function JudgeFinalsRoute() {
  const { session } = useAuth();
  const access = useJudgingHomeAccess(Boolean(session));
  const allowed = session
    ? canOpenJudgeFinals({
      appRoles: session.roles,
      judgingHomeAllowed: access.allowed,
    })
    : false;

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (!allowed && access.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!allowed) {
    return <Navigate to="/home" replace />;
  }

  return <JudgingPage />;
}
