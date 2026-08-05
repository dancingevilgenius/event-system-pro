import {
  Button,
  Stack,
  type ButtonProps,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';
import MobileBackIconButton from './MobileBackIconButton';

type PageBackButtonProps = {
  to: string;
  label: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  /** Extra sx applied to the wrapping Stack (e.g. mt overrides). */
  stackSx?: SxProps<Theme>;
  buttonSx?: ButtonProps['sx'];
};

/**
 * Standalone back control (e.g. Judging, which has no page title).
 * On phone-sized layouts: icon-only left arrow on a rectangular background,
 * left-aligned with the centered action-button column.
 * On larger layouts: full-width labeled button.
 * Prefer `PageHeader` when a page title is present so the arrow shares the title row.
 */
export default function PageBackButton({
  to,
  label,
  variant = 'outlined',
  size,
  stackSx,
  buttonSx,
}: PageBackButtonProps) {
  const navigate = useNavigate();
  const { showXsLayout } = useLayoutTier();

  if (showXsLayout) {
    return (
      <Stack
        direction="row"
        sx={[
          { mb: 2, ...centeredContentStackSx },
          ...(stackSx ? (Array.isArray(stackSx) ? stackSx : [stackSx]) : []),
        ]}
      >
        <MobileBackIconButton label={label} onClick={() => navigate(to)} />
      </Stack>
    );
  }

  return (
    <Stack
      sx={[
        {
          mb: 3,
          maxWidth: 480,
          mx: 'auto',
          width: '100%',
        },
        ...(stackSx ? (Array.isArray(stackSx) ? stackSx : [stackSx]) : []),
      ]}
    >
      <Button
        variant={variant}
        size={size}
        fullWidth
        onClick={() => navigate(to)}
        sx={buttonSx}
      >
        {label}
      </Button>
    </Stack>
  );
}
