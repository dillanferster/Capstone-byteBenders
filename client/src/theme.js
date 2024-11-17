import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#2B3754",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#1F2A40", // Darkest blue-grey
          200: "#2F3B54", // Dark blue-grey
          300: "#404B64", // Medium dark blue-grey
          400: "#E8EDF4", // Medium blue-grey
          500: "#D5DCE8", // Light medium blue-grey
          600: "#D5DCE8", // Light blue-grey
          700: "#E8EDF4", // Very light blue-grey
          800: "#F5F7FA", // Almost white with slight blue
          900: "#FFFFFF", // Pure white
        },
        greenAccent: {
          100: "#0f2922", // Darkest green
          200: "#1e5245", // Dark green
          300: "#2e7c67", // Medium dark green
          400: "#3da58a", // Medium green
          500: "#4cceac", // Main green
          600: "#70d8bd", // Light green
          700: "#94e2cd", // Lighter green
          800: "#b7ebde", // Very light green
          900: "#dbf5ee", // Lightest green
        },
        redAccent: {
          100: "#2c100f", // Darkest red
          200: "#58201e", // Dark red
          300: "#832f2c", // Medium dark red
          400: "#af3f3b", // Medium red
          500: "#db4f4a", // Main red
          600: "#e2726e", // Light red
          700: "#e99592", // Lighter red
          800: "#f1b9b7", // Very light red
          900: "#f8dcdb", // Lightest red
        },
        blueAccent: {
          100: "#2a2d64", // Start with medium-dark blue instead of very dark
          200: "#3e4396", // Dark blue but lighter than before
          300: "#535ac8", // Medium-dark blue
          400: "#6870fa", // Medium blue
          500: "#868dfb", // Medium-light blue
          600: "#a4a9fc", // Light blue
          700: "#c3c6fd", // Lighter blue
          800: "#d2d4fe", // Very light blue
          900: "#e1e2fe", // Lightest blue
        },
      }),
});

// MUI Theme Settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  });
  return theme;
};

// Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
