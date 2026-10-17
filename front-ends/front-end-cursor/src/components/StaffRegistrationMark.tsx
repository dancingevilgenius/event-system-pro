import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { IconButton, Tooltip } from '@mui/material';
import type { StaffRegistrationMatch } from '../api/postgrest';

type StaffRegistrationMarkProps = {
  match: StaffRegistrationMatch | undefined;
  firstName: string;
  onQuickRegister?: () => void;
};

/** Registration status thumb used by event staff and the Registration desk. */
export default function StaffRegistrationMark({
  match,
  firstName,
  onQuickRegister,
}: StaffRegistrationMarkProps) {
  const name = firstName.trim();
  if (match?.status === 'registered' && match.username) {
    const label = `${name} is fully registered with username ${match.username}.`;
    return (
      <Tooltip title={label} slotProps={{ popper: { sx: { pointerEvents: 'none' } } }}>
        <ThumbUpAltIcon color="success" fontSize="small" aria-label={label} />
      </Tooltip>
    );
  }
  if (match?.quickReg) {
    const label = match.username
      ? `${name} was Quick Registered with username ${match.username}.`
      : `${name} was Quick Registered.`;
    return (
      <Tooltip title={label} slotProps={{ popper: { sx: { pointerEvents: 'none' } } }}>
        <ThumbUpAltIcon fontSize="small" aria-label={label} sx={{ color: '#fdd835' }} />
      </Tooltip>
    );
  }
  if (match?.status === 'partial') {
    return (
      <ThumbUpOffAltIcon color="action" fontSize="small" aria-label="Partially registered" />
    );
  }
  if (match?.status === 'none') {
    const label = `${name} not found in the system. Quick Register ${name}.`;
    return (
      <Tooltip title={label} slotProps={{ popper: { sx: { pointerEvents: 'none' } } }}>
        <IconButton
          type="button"
          size="small"
          aria-label={label}
          onClick={onQuickRegister}
          sx={{ p: 0.25 }}
        >
          <ThumbDownOffAltIcon color="action" fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }
  return null;
}
