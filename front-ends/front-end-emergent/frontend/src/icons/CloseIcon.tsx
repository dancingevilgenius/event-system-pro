import type { SvgIconProps } from "@mui/material";
import { SvgIcon } from "@mui/material";

export function CloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </SvgIcon>
  );
}
