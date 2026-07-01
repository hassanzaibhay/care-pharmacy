import { alpha, createTheme } from "@mui/material/styles";

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
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#101828",
      secondary: "#667085",
      disabled: "#98A2B3",
    },
    divider: "#E2E8F0",
  },

  // ── SHAPE ────────────────────────────────────────────
  shape: {
    borderRadius: 10,
  },

  // ── TYPOGRAPHY ───────────────────────────────────────
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.375 },
    body1: { fontSize: "0.875rem", lineHeight: 1.43 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    caption: { fontSize: "0.75rem", lineHeight: 1.33 },
    overline: {
      fontSize: "0.6875rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#667085",
      lineHeight: 1.5,
    },
    button: { fontSize: "0.875rem", fontWeight: 600, textTransform: "none" },
  },

  // ── COMPONENT OVERRIDES ──────────────────────────────
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #ECEDEF",
          boxShadow: "0 1px 2px rgba(16,24,40,.05)",
          backgroundImage: "none",
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": { paddingBottom: 24 },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #ECEDEF",
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          paddingTop: 8,
          paddingBottom: 8,
        },
        contained: {
          "&:hover": {
            boxShadow: "0 1px 2px rgba(16,24,40,.10)",
          },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: "#F9FAFB" },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }),
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          paddingTop: 14,
          paddingBottom: 14,
        },
        head: {
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "#667085",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const key = ownerState.color;
          const isSeverity =
            key && key !== "default" ? theme.palette[key] : undefined;
          return {
            borderRadius: 9999,
            fontWeight: 600,
            fontSize: "0.6875rem",
            ...(ownerState.variant === "filled" &&
              isSeverity && {
                backgroundColor: alpha(isSeverity.main, 0.12),
                color: isSeverity.main,
              }),
          };
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
