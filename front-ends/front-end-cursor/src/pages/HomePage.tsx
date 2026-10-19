import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFloorParentTitle } from '../api/postgrest';
import AccountSettingsButton from '../components/AccountSettingsButton';
import { MOBILE_HEADER_ICON_SLOT } from '../components/MobileHeaderIconButton';
import OpenJudgeTabsDialog from '../components/OpenJudgeTabsDialog';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useJudgingHomeAccess } from '../hooks/useJudgingHomeAccess';
import { useRegistrationHomeAccess } from '../hooks/useRegistrationHomeAccess';
import { DEFAULT_FLOOR_PARENT_TITLE, type FloorParentTitle } from '../lib/floorParent';
import type { AppRole } from '../lib/session';

const HOME_BUTTONS: { label: string; path: string; roles?: AppRole[] }[] = [
  { label: 'Staff', path: '/staff' },
  { label: 'Competitor', path: '/competitor-home' },
  { label: 'Registration', path: '/registrationHome', roles: ['REGISTRATION'] },
  { label: 'Admin', path: '/adminhome', roles: ['ADMIN'] },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { session, hasAnyRole } = useAuth();
  const [floorParentTitle, setFloorParentTitle] = useState<FloorParentTitle>(DEFAULT_FLOOR_PARENT_TITLE);
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const registrationByAppRole = hasAnyRole(['REGISTRATION']);
  const isAdmin = hasAnyRole(['ADMIN']);
  const [openJudgeTabs, setOpenJudgeTabs] = useState(false);
  const registrationByStaff = useRegistrationHomeAccess(!registrationByAppRole);
  const judgingAccess = useJudgingHomeAccess(true);
  const visibleButtons = HOME_BUTTONS.filter((button) => {
    if (!button.roles || hasAnyRole(button.roles)) {
      return true;
    }

    return button.path === '/registrationHome' && registrationByStaff.allowed;
  });
  const adminIndex = visibleButtons.findIndex((button) => button.path === '/adminhome');
  const roleButtons = judgingAccess.allowed
    ? [
        ...visibleButtons.slice(0, adminIndex === -1 ? visibleButtons.length : adminIndex),
        { label: 'Judging', path: '/judgingHome' },
        ...(adminIndex === -1 ? [] : visibleButtons.slice(adminIndex)),
      ]
    : visibleButtons;
  const homeButtons = [
    ...roleButtons,
    { label: floorParentTitle, path: '/floor-parent-home' },
    { label: 'Results', path: '/results' },
  ];

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;
    void fetchFloorParentTitle(session.user_id)
      .then((saved) => {
        if (!cancelled) {
          setFloorParentTitle(saved);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFloorParentTitle(DEFAULT_FLOOR_PARENT_TITLE);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

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
            {isAdmin && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => setOpenJudgeTabs(true)}
              >
                Open Judge Tabs
              </Button>
            )}
            {homeButtons.map((button) => (
              <Button
                key={button.path}
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
            {isAdmin && (
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setOpenJudgeTabs(true)}
                >
                  Open Judge Tabs
                </Button>
              </Grid>
            )}
            {homeButtons.map((button) => (
              <Grid key={button.path} size={{ xs: 12, md: 6, lg: 4 }}>
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
      {isAdmin && (
        <OpenJudgeTabsDialog open={openJudgeTabs} onClose={() => setOpenJudgeTabs(false)} />
      )}
    </Container>
  );
}
