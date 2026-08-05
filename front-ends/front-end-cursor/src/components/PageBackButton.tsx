import { Stack, Tooltip, type SxProps, type Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { formatBackTooltip } from '../utils/backTooltip';
import MobileBackIconButton from './MobileBackIconButton';

type PageBackButtonProps = {
  to: string;
  label: string;
  /** Extra sx applied to the wrapping Stack (e.g. mt overrides). */
  stackSx?: SxProps<Theme>;
};

/**
 * Standalone back control (e.g. Judging, which has no page title).
 * Icon-only left arrow on all screen sizes; tooltip uses "Back to X page".
 */
export default function PageBackButton({ to, label, stackSx }: PageBackButtonProps) {
  const navigate = useNavigate();
  const { showXsLayout } = useLayoutTier();
  const backTooltip = formatBackTooltip(label);

  return (
    <Stack
      direction="row"
      sx={[
        {
          mb: 2,
          width: '100%',
          ...(showXsLayout ? centeredContentStackSx : {}),
        },
        ...(stackSx ? (Array.isArray(stackSx) ? stackSx : [stackSx]) : []),
      ]}
    >
      <Tooltip title={backTooltip}>
        <span>
          <MobileBackIconButton label={backTooltip} onClick={() => navigate(to)} />
        </span>
      </Tooltip>
    </Stack>
  );
}
