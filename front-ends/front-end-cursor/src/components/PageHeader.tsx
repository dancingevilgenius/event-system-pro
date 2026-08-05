import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Typography, type ButtonProps, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import MobileBackIconButton from './MobileBackIconButton';
import MobileHeaderIconButton, { MOBILE_HEADER_ICON_SLOT } from './MobileHeaderIconButton';
import PageBackButton from './PageBackButton';

type PageHeaderProps = {
  title: ReactNode;
  backTo: string;
  backLabel: string;
  backVariant?: ButtonProps['variant'];
  /** Applied to the title Typography (desktop and mobile). */
  titleSx?: SxProps<Theme>;
};

/**
 * Page title with back navigation.
 * On phone-sized layouts: back arrow, title, and (when signed in) account icon
 * on one row, aligned to the centered action-button column.
 * On larger layouts: title, then a full-width text back button underneath.
 */
export default function PageHeader({
  title,
  backTo,
  backLabel,
  backVariant = 'outlined',
  titleSx,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const { showXsLayout } = useLayoutTier();

  const showAccountIcon = Boolean(session) && location.pathname !== '/account';

  if (showXsLayout) {
    return (
      <Box
        sx={{
          ...centeredContentStackSx,
          display: 'flex',
          flexDirection: 'row',
          mb: 3,
        }}
      >
        <MobileBackIconButton label={backLabel} onClick={() => navigate(backTo)} />
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
        {showAccountIcon ? (
          <MobileHeaderIconButton label="Account" onClick={() => navigate('/account')}>
            <ManageAccountsIcon />
          </MobileHeaderIconButton>
        ) : (
          <Box sx={{ width: MOBILE_HEADER_ICON_SLOT, flexShrink: 0 }} aria-hidden />
        )}
      </Box>
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={[{ textAlign: 'center' }, ...(titleSx ? (Array.isArray(titleSx) ? titleSx : [titleSx]) : [])]}
      >
        {title}
      </Typography>
      <PageBackButton to={backTo} label={backLabel} variant={backVariant} />
    </>
  );
}
