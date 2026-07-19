import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1f1f1f",
      paper: "#3d3d3d",
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