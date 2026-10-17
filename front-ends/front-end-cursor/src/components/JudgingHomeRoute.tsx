import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJudgingHomeAccess } from '../hooks/useJudgingHomeAccess';
import JudgingHomePage from '../pages/JudgingHomePage';

export default function JudgingHomeRoute() {
  const { session } = useAuth();
  const access = useJudgingHomeAccess(Boolean(session));

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (access.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!access.allowed) {
    return <Navigate to="/home" replace />;
  }

  return <JudgingHomePage />;
}
