import { Box, Typography, type ButtonProps, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayoutTier } from '../hooks/useLayoutTier';
import MobileBackIconButton, { MOBILE_BACK_ICON_SLOT } from './MobileBackIconButton';
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
 * On phone-sized layouts: left-facing arrow icon on the same line as the title.
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
  const { showXsLayout } = useLayoutTier();

  if (showXsLayout) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
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
        {/* Balance the leading icon so the title stays visually centered. */}
        <Box sx={{ width: MOBILE_BACK_ICON_SLOT, flexShrink: 0 }} aria-hidden />
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
