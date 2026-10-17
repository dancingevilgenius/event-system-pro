import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRegistrationHomeAccess } from '../hooks/useRegistrationHomeAccess';
import RegistrationHomePage from '../pages/RegistrationHomePage';

export default function RegistrationHomeRoute() {
  const { session, hasAnyRole } = useAuth();
  const allowedByAppRole = hasAnyRole(['REGISTRATION']);
  const staffAccess = useRegistrationHomeAccess(Boolean(session) && !allowedByAppRole);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (allowedByAppRole || staffAccess.allowed) {
    return <RegistrationHomePage />;
  }

  if (staffAccess.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Navigate to="/home" replace />;
}
