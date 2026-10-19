import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useSignedInUserIdentity } from '../hooks/useSignedInUserIdentity';
import { useLayoutTier, XL_LAYOUT_QUERY } from '../hooks/useLayoutTier';
import { judgeHeaderRoleLabel } from '../lib/judgeHeaderRole';

/** Side columns match so the page title stays centered between back and initials. */
export const judgeHeaderRowSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '4.75rem minmax(0, 1fr) 4.75rem',
    md: '5.5rem minmax(0, 1fr) 5.5rem',
    lg: '6rem minmax(0, 1fr) 6rem',
  },
  [`@media ${XL_LAYOUT_QUERY}`]: {
    gridTemplateColumns: 'minmax(6rem, 14rem) minmax(0, 1fr) minmax(6rem, 14rem)',
  },
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
  columnGap: { xs: 0.5, md: 1 },
};

type JudgeHeaderInitialsProps = {
  /** True when this user is the head judge of the contest open on the page. */
  contestHeadJudge?: boolean;
};

/**
 * Signed-in judge in the judging header.
 * iPad-size and smaller: role plus initials. Full desktop: role plus
 * "Logged in user: <first initial> <last name>".
 */
export default function JudgeHeaderInitials({ contestHeadJudge = false }: JudgeHeaderInitialsProps) {
  const { session } = useAuth();
  const { showXlLayout } = useLayoutTier();
  const { initials, desktopLabel } = useSignedInUserIdentity();
  const roleLabel = judgeHeaderRoleLabel({
    appRoles: session?.roles,
    contestHeadJudge,
  });
  const showDesktopLabel = showXlLayout && desktopLabel !== '';
  const identityText = showDesktopLabel ? desktopLabel : initials;

  return (
    <Box
      sx={{
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      {identityText ? (
        <Box
          component="p"
          aria-label={showDesktopLabel ? desktopLabel : `Current ${roleLabel} ${initials}`}
          sx={{ m: 0, textAlign: 'center', maxWidth: '100%' }}
        >
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontWeight: 700,
              fontSize: { xs: '0.625rem', md: '0.75rem', lg: '0.8125rem' },
              lineHeight: 1.15,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {roleLabel}
          </Typography>
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontWeight: 700,
              fontSize: showDesktopLabel
                ? '0.8125rem'
                : { xs: '1rem', md: '1.25rem', lg: '1.5rem' },
              letterSpacing: showDesktopLabel ? 'normal' : '0.04em',
              lineHeight: showDesktopLabel ? 1.25 : 1.1,
              color: 'text.primary',
              whiteSpace: showDesktopLabel ? 'normal' : 'nowrap',
            }}
          >
            {identityText}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
