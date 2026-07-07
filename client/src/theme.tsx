import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#333333",
      paper: "#666666",
    },
    primary: {
      main: "#72c790",
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8",
    },
  },
  shape: {
    borderRadius: 18,
  },
});