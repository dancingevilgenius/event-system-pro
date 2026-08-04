import { Button, Stack, type ButtonProps, type SxProps, type Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

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
 * Navigation control placed just below a page title.
 * Centers and constrains width to match other page action stacks.
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

  return (
    <Stack
      sx={[
        {
          mb: 3,
          ...(showXsLayout
            ? centeredContentStackSx
            : { maxWidth: 480, mx: 'auto', width: '100%' }),
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
