import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';

/** Matches MUI `Button` `size="large"` height so the control lines up with page actions. */
export const MOBILE_BACK_ICON_SLOT = '2.625rem'; // 42px

type MobileBackIconButtonProps = {
  label: string;
  onClick: () => void;
};

/**
 * Phone-sized back control: left arrow on a rectangular outlined background.
 * Sized to match `size="large"` action buttons and left-aligned with that column.
 */
export default function MobileBackIconButton({ label, onClick }: MobileBackIconButtonProps) {
  return (
    <Button
      variant="outlined"
      size="large"
      aria-label={label}
      onClick={onClick}
      sx={{
        flexShrink: 0,
        minWidth: MOBILE_BACK_ICON_SLOT,
        width: MOBILE_BACK_ICON_SLOT,
        height: MOBILE_BACK_ICON_SLOT,
        p: 0,
      }}
    >
      <ArrowBackIcon />
    </Button>
  );
}
