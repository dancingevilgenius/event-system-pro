import type { SvgIconProps } from "@mui/material";
import { SvgIcon } from "@mui/material";

export function PaletteOutlinedIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.5A4.5 4.5 0 0 0 22 9.5C22 5.9 17.5 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
      <circle cx="10.5" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="14.5" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="17.5" cy="11" r="1.2" fill="currentColor" />
    </SvgIcon>
  );
}
