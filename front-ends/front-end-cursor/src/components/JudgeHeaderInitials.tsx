import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchUserPersonName } from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import { judgeHeaderRoleLabel } from '../lib/judgeHeaderRole';
import { signedInUserInitials } from '../utils/userInitials';

/** Side columns match so the page title stays centered between back and initials. */
export const judgeHeaderRowSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '4.75rem minmax(0, 1fr) 4.75rem',
    md: '5.5rem minmax(0, 1fr) 5.5rem',
    lg: '6rem minmax(0, 1fr) 6rem',
    xl: '6rem minmax(0, 1fr) 6rem',
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
 * Current-judge initials for the judging page header.
 * Reads the signed-in user's name, then falls back to the session username.
 */
export default function JudgeHeaderInitials({ contestHeadJudge = false }: JudgeHeaderInitialsProps) {
  const { session } = useAuth();
  const [initials, setInitials] = useState('');
  const roleLabel = judgeHeaderRoleLabel({
    appRoles: session?.roles,
    contestHeadJudge,
  });

  useEffect(() => {
    if (!session) {
      setInitials('');
      return;
    }

    const username = session.username;
    setInitials(signedInUserInitials({ username }));

    let cancelled = false;
    void fetchUserPersonName(session.user_id)
      .then((name) => {
        if (!cancelled) {
          setInitials(signedInUserInitials({ ...name, username }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInitials(signedInUserInitials({ username }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

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
      {initials ? (
        <Box
          component="p"
          aria-label={`Current ${roleLabel} ${initials}`}
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
              fontSize: { xs: '1rem', md: '1.25rem', lg: '1.5rem' },
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              color: 'text.primary',
              whiteSpace: 'nowrap',
            }}
          >
            {initials}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
