import type { SxProps, Theme } from "@mui/material";

export const CONTENT_MAX_WIDTH = 360;

export const centeredContentStackSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: `${CONTENT_MAX_WIDTH}px`,
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 1.5,
};

export const pageContainerSx: SxProps<Theme> = {
  py: 6,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
