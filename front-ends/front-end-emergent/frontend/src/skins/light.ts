import type { ThemeOptions } from "@mui/material";
import { CONTENT_MAX_WIDTH } from "@/constants/layout";

export interface Skin {
  id: string;
  label: string;
  themeOptions: ThemeOptions;
}

const baseFont =
  "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const muiOutlinedInputTheme = {
  styleOverrides: {
    input: {
      fontSize: 16,
    },
  },
};

export const muiButtonTheme = {
  styleOverrides: {
    root: {
      maxWidth: `${CONTENT_MAX_WIDTH}px`,
      width: "100%",
      textTransform: "none" as const,
      borderRadius: 10,
      fontWeight: 600,
      letterSpacing: "0.01em",
      paddingTop: 10,
      paddingBottom: 10,
    },
  },
};

export const muiFormTheme = {
  styleOverrides: {
    root: {
      maxWidth: `${CONTENT_MAX_WIDTH}px`,
      width: "100%",
    },
  },
};

export const lightSkin: Skin = {
  id: "light",
  label: "Light",
  themeOptions: {
    palette: {
      mode: "light",
      primary: { main: "#3D5AFE" },
      secondary: { main: "#FF6F61" },
      background: {
        default: "#F7F6F2",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#1A1A1A",
        secondary: "#54545C",
      },
      divider: "rgba(0,0,0,0.08)",
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: baseFont,
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 700 },
      button: { textTransform: "none" },
    },
    components: {
      MuiButton: muiButtonTheme,
      MuiFormControl: muiFormTheme,
      MuiOutlinedInput: muiOutlinedInputTheme,
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  },
};

export default lightSkin;
