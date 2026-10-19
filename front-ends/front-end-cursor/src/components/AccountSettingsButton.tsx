import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSignedInUserIdentity } from '../hooks/useSignedInUserIdentity';
import { useLayoutTier } from '../hooks/useLayoutTier';
import MobileHeaderIconButton from './MobileHeaderIconButton';

type AccountSettingsButtonProps = {
  /** Hide the account gear when the page is already Account. The identity still shows. */
  showAccountLink?: boolean;
};

/**
 * Signed-in identity plus the account settings icon.
 * iPad-size and smaller: initials. Full desktop (1280px+): "Logged in user: C Garcia".
 */
export default function AccountSettingsButton({ showAccountLink = true }: AccountSettingsButtonProps) {
  const navigate = useNavigate();
  const { showXlLayout } = useLayoutTier();
  const { initials, desktopLabel } = useSignedInUserIdentity();
  const showDesktopLabel = showXlLayout && desktopLabel !== '';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.75,
        flexShrink: 0,
        minWidth: 0,
        maxWidth: showDesktopLabel ? '18rem' : 'none',
      }}
    >
      {showDesktopLabel ? (
        <Typography
          component="span"
          aria-label={desktopLabel}
          sx={{
            fontWeight: 700,
            fontSize: '0.875rem',
            lineHeight: 1.25,
            textAlign: 'right',
            color: 'text.primary',
          }}
        >
          {desktopLabel}
        </Typography>
      ) : initials ? (
        <Typography
          component="span"
          aria-label={`Signed in, initials ${initials}`}
          sx={{
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '0.04em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: 'text.primary',
          }}
        >
          {initials}
        </Typography>
      ) : null}
      {showAccountLink ? (
        <Tooltip title="Account settings">
          <span>
            <MobileHeaderIconButton label="Account settings" onClick={() => navigate('/account')}>
              <ManageAccountsIcon />
            </MobileHeaderIconButton>
          </span>
        </Tooltip>
      ) : null}
    </Box>
  );
}
