import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

export const MOBILE_BACK_ICON_SLOT = 48;
const BACK_ICON_FONT_SIZE = '2rem';

type MobileBackIconButtonProps = {
  label: string;
  onClick: () => void;
};

/**
 * Phone-sized back control: left arrow on a rectangular background
 * (replaces the circular ArrowCircleLeft glyph).
 */
export default function MobileBackIconButton({ label, onClick }: MobileBackIconButtonProps) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      edge="start"
      sx={{
        flexShrink: 0,
        width: MOBILE_BACK_ICON_SLOT,
        height: MOBILE_BACK_ICON_SLOT,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
        '&:hover': {
          bgcolor: 'action.selected',
        },
      }}
    >
      <ArrowBackIcon sx={{ fontSize: BACK_ICON_FONT_SIZE }} />
    </IconButton>
  );
}
