import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Button, Container, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../api/postgrest';
import MobileHeaderIconButton, {
  MOBILE_HEADER_ICON_SLOT,
} from '../components/MobileHeaderIconButton';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { setFlashSuccess } from '../lib/authMessages';

export default function HomePage() {
  const navigate = useNavigate();
  const { logout, hasAnyRole } = useAuth();
  const { showProblem } = useMessages();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [busy, setBusy] = useState(false);
  const isAdmin = hasAnyRole(['ADMIN']);

  const handleLogOff = async () => {
    setBusy(true);
    try {
      const result = await logoutApi();
      logout();
      if (!result.ok) {
        showProblem(result.message);
        navigate('/');
        return;
      }
      setFlashSuccess(result.message);
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      logout();
      showProblem(error instanceof Error ? error.message : 'Sign out failed.');
      navigate('/');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mb: 3,
            width: '100%',
            ...(showXsLayout ? centeredContentStackSx : { mx: 0 }),
          }}
        >
          <Box sx={{ width: MOBILE_HEADER_ICON_SLOT, flexShrink: 0 }} aria-hidden />
          <Typography
            variant="h4"
            component="h1"
            sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}
          >
            Home
          </Typography>
          <Tooltip title="Account settings">
            <span>
              <MobileHeaderIconButton label="Account settings" onClick={() => navigate('/account')}>
                <ManageAccountsIcon />
              </MobileHeaderIconButton>
            </span>
          </Tooltip>
        </Box>

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            <Button variant="contained" size="large" fullWidth onClick={() => navigate('/staff')}>
              Staff
            </Button>
            <Button variant="contained" size="large" fullWidth onClick={() => navigate('/competitor')}>
              Competitor
            </Button>
            {isAdmin && (
              <Button variant="contained" size="large" fullWidth onClick={() => navigate('/adminhome')}>
                Admin
              </Button>
            )}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button variant="contained" size="large" fullWidth onClick={() => navigate('/staff')}>
                Staff
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button variant="contained" size="large" fullWidth onClick={() => navigate('/competitor')}>
                Competitor
              </Button>
            </Grid>
            {isAdmin && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Button variant="contained" size="large" fullWidth onClick={() => navigate('/adminhome')}>
                  Admin
                </Button>
              </Grid>
            )}
          </Grid>
        )}

        <Stack
          spacing={2}
          sx={
            showXsLayout
              ? centeredContentStackSx
              : { maxWidth: 480, mx: 'auto', width: '100%' }
          }
        >
          <Button variant="outlined" fullWidth disabled={busy} onClick={handleLogOff}>
            Log Off
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
