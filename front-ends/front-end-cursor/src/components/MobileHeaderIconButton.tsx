import { Button } from '@mui/material';
import type { ReactNode } from 'react';

/** Matches MUI `Button` `size="large"` height so header icons line up with page actions. */
export const MOBILE_HEADER_ICON_SLOT = '2.625rem'; // 42px

/** @deprecated Use MOBILE_HEADER_ICON_SLOT */
export const MOBILE_BACK_ICON_SLOT = MOBILE_HEADER_ICON_SLOT;

type MobileHeaderIconButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

/**
 * Square outlined icon control for page header rows (back, account, etc.).
 * Sized to match `size="large"` action buttons on all screen sizes.
 */
export default function MobileHeaderIconButton({
  label,
  onClick,
  children,
}: MobileHeaderIconButtonProps) {
  return (
    <Button
      variant="outlined"
      size="large"
      aria-label={label}
      onClick={onClick}
      sx={{
        flexShrink: 0,
        minWidth: MOBILE_HEADER_ICON_SLOT,
        width: MOBILE_HEADER_ICON_SLOT,
        height: MOBILE_HEADER_ICON_SLOT,
        p: 0,
      }}
    >
      {children}
    </Button>
  );
}
