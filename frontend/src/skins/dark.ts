import type { Skin } from "@/skins/light";
import {
  muiButtonTheme,
  muiFormTheme,
  muiOutlinedInputTheme,
} from "@/skins/light";

const baseFont =
  "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const darkSkin: Skin = {
  id: "dark",
  label: "Dark",
  themeOptions: {
    palette: {
      mode: "dark",
      primary: { main: "#8AB4FF" },
      secondary: { main: "#FFB088" },
      background: {
        default: "#15161A",
        paper: "#1E2026",
      },
      text: {
        primary: "#F2F3F5",
        secondary: "#9CA0AB",
      },
      divider: "rgba(255,255,255,0.1)",
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

export default darkSkin;
