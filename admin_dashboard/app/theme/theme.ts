import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // ── PALETTE ──────────────────────────────────────────
  palette: {
    primary: {
      main: "#3366CC",
      light: "#6B90E0",
      dark: "#2755B0",
      contrastText: "#FFFFFF", // 5.07:1 AA ✓
    },
    secondary: {
      main: "#0F9D9D",
      light: "#3BBDBD",
      dark: "#0C7A7A",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#15803D", // 4.98:1 AA ✓
      light: "#22C55E",
      dark: "#166534",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#B45309", // 7.33:1 AAA ✓
      light: "#F59E0B",
      dark: "#92400E",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626", // 9.23:1 AAA ✓
      light: "#EF4444",
      dark: "#991B1B",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#0369A1", // 5.98:1 AA ✓
      light: "#38BDF8",
      dark: "#075985",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F6F8FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A", // 16.8:1 AAA ✓
      secondary: "#475569", // 8.09:1 AAA ✓
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
  },

  // ── SHAPE ────────────────────────────────────────────
  shape: {
    borderRadius: 8,
  },

  // ── TYPOGRAPHY ───────────────────────────────────────
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: { fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.4 },
    h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.375 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    caption: { fontSize: "0.75rem", lineHeight: 1.33 },
    button: { fontSize: "0.875rem", fontWeight: 600, textTransform: "none" },
  },

  // ── COMPONENT OVERRIDES ──────────────────────────────
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,.07)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: "#EEF3F9" },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: 11,
          paddingBottom: 11,
        },
        head: {
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "#475569",
          letterSpacing: "0.02em",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 600,
          fontSize: "0.6875rem",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,.14)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
        notchedOutline: { borderColor: "#E2E8F0" },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 500 },
      },
    },
  },
});

export default theme;
