import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountSettingsButton from '../components/AccountSettingsButton';
import { MOBILE_HEADER_ICON_SLOT } from '../components/MobileHeaderIconButton';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useJudgingHomeAccess } from '../hooks/useJudgingHomeAccess';
import { useRegistrationHomeAccess } from '../hooks/useRegistrationHomeAccess';
import type { AppRole } from '../lib/session';

const HOME_BUTTONS: { label: string; path: string; roles?: AppRole[] }[] = [
  { label: 'Staff', path: '/staff' },
  { label: 'Competitor', path: '/competitor-home' },
  { label: 'Registration', path: '/registrationHome', roles: ['REGISTRATION'] },
  { label: 'Admin', path: '/adminhome', roles: ['ADMIN'] },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const registrationByAppRole = hasAnyRole(['REGISTRATION']);
  const registrationByStaff = useRegistrationHomeAccess(!registrationByAppRole);
  const judgingAccess = useJudgingHomeAccess(true);
  const visibleButtons = HOME_BUTTONS.filter((button) => {
    if (!button.roles || hasAnyRole(button.roles)) {
      return true;
    }

    return button.path === '/registrationHome' && registrationByStaff.allowed;
  });
  const adminIndex = visibleButtons.findIndex((button) => button.path === '/adminhome');
  const homeButtons = judgingAccess.allowed
    ? [
        ...visibleButtons.slice(0, adminIndex === -1 ? visibleButtons.length : adminIndex),
        { label: 'Judging', path: '/judgingHome' },
        ...(adminIndex === -1 ? [] : visibleButtons.slice(adminIndex)),
      ]
    : visibleButtons;

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
          <AccountSettingsButton />
        </Box>

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {homeButtons.map((button) => (
              <Button
                key={button.label}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(button.path)}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {homeButtons.map((button) => (
              <Grid key={button.label} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(button.path)}
                >
                  {button.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
