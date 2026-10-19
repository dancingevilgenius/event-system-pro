import { Box, Tooltip, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { formatBackTooltip } from '../utils/backTooltip';
import AccountSettingsButton from './AccountSettingsButton';
import MobileBackIconButton from './MobileBackIconButton';
import { MOBILE_HEADER_ICON_SLOT } from './MobileHeaderIconButton';

type PageHeaderProps = {
  title: ReactNode;
  backTo: string;
  backLabel: string;
  /** Applied to the title Typography. */
  titleSx?: SxProps<Theme>;
};

/**
 * Page title with back, signed-in identity, and account icon.
 * iPad-size and smaller show initials. Full desktop shows "Logged in user: C Garcia".
 * Phone: icons align to the centered action-button column.
 * Larger: icons align to the full content width (same edges as action grids).
 */
export default function PageHeader({ title, backTo, backLabel, titleSx }: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const { showXsLayout } = useLayoutTier();

  const showAccountLink = Boolean(session) && location.pathname !== '/account';
  const backTooltip = formatBackTooltip(backLabel);

  return (
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
      <Tooltip title={backTooltip}>
        <span>
          <MobileBackIconButton label={backTooltip} onClick={() => navigate(backTo)} />
        </span>
      </Tooltip>
      <Typography
        variant="h4"
        component="h1"
        sx={[
          { flex: 1, textAlign: 'center', minWidth: 0 },
          ...(titleSx ? (Array.isArray(titleSx) ? titleSx : [titleSx]) : []),
        ]}
      >
        {title}
      </Typography>
      {session ? (
        <AccountSettingsButton showAccountLink={showAccountLink} />
      ) : (
        <Box sx={{ width: MOBILE_HEADER_ICON_SLOT, flexShrink: 0 }} aria-hidden />
      )}
    </Box>
  );
}
