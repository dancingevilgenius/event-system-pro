import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserPersonName } from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import { userInitials } from '../utils/userInitials';
import MobileHeaderIconButton from './MobileHeaderIconButton';

/**
 * Account settings icon with the signed-in user's initials to its left.
 * Initials stay hidden until a first and last name (or a two-word display name) is known.
 */
export default function AccountSettingsButton() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [initials, setInitials] = useState('');

  useEffect(() => {
    if (!session) {
      setInitials('');
      return;
    }

    let cancelled = false;
    void fetchUserPersonName(session.user_id)
      .then((name) => {
        if (!cancelled) {
          setInitials(userInitials(name));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInitials('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
      {initials ? (
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
      <Tooltip title="Account settings">
        <span>
          <MobileHeaderIconButton label="Account settings" onClick={() => navigate('/account')}>
            <ManageAccountsIcon />
          </MobileHeaderIconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
