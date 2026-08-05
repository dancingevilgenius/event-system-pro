import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileHeaderIconButton, {
  MOBILE_BACK_ICON_SLOT,
  MOBILE_HEADER_ICON_SLOT,
} from './MobileHeaderIconButton';

export { MOBILE_BACK_ICON_SLOT, MOBILE_HEADER_ICON_SLOT };

type MobileBackIconButtonProps = {
  label: string;
  onClick: () => void;
};

/**
 * Back control: left arrow on a rectangular outlined background.
 * Sized to match `size="large"` action buttons on all screen sizes.
 */
export default function MobileBackIconButton({ label, onClick }: MobileBackIconButtonProps) {
  return (
    <MobileHeaderIconButton label={label} onClick={onClick}>
      <ArrowBackIcon />
    </MobileHeaderIconButton>
  );
}
