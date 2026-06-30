"use client";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSidebar } from "../contexts/SidebarContext";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Orders", href: "/orders", icon: <ReceiptLongIcon /> },
  { label: "Reviews", href: "/reviews", icon: <RateReviewIcon /> },
  { label: "Users", href: "/users", icon: <PeopleIcon /> },
  { label: "Medicines", href: "/medicines", icon: <MedicalServicesIcon /> },
  { label: "Config", href: "/config", icon: <SettingsIcon /> },
];

const DRAWER_EXPANDED = 230;
const DRAWER_COLLAPSED = 74;
// Must match the AppBar Toolbar height (MUI default = 64px).
const HEADER_HEIGHT = 64;

export default function Sidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile, isMobile } = useSidebar();

  const isCollapsed = collapsed && !isMobile;
  const drawerWidth = isCollapsed ? DRAWER_COLLAPSED : DRAWER_EXPANDED;

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    } catch (_) {
      // best-effort — navigate regardless
    }
    router.push("/login");
  };

  const navigate = (href: string) => {
    router.push(href);
    if (isMobile) closeMobile();
  };

  // Shared paper styles — colours are theme tokens; no hardcoded hex values.
  const paperSx = {
    width: drawerWidth,
    boxSizing: "border-box" as const,
    borderRight: "none",
    bgcolor: "primary.main",
    color: "primary.contrastText",
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    ...(isMobile
      ? {}
      : {
          position: "fixed" as const,
          top: HEADER_HEIGHT,
          left: 0,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        pt: 1.5,
      }}
    >
      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 0.5 }}>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.href === "/dashboard" && (pathname === "/" || pathname === ""));

          return (
            <Tooltip
              key={item.href}
              title={isCollapsed ? item.label : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={active}
                onClick={() => navigate(item.href)}
                sx={(t) => ({
                  borderRadius: 1,
                  mx: isCollapsed ? 1 : 2,
                  mb: 0.5,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 1.2 : 2,
                  color: alpha(t.palette.primary.contrastText, 0.92),
                  transition: t.transitions.create(
                    ["background", "color", "padding"],
                    { duration: t.transitions.duration.shorter }
                  ),
                  "&.Mui-selected": {
                    bgcolor: "background.paper",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "&:hover": { bgcolor: "background.paper" },
                  },
                  "&:hover": {
                    bgcolor: active
                      ? "background.paper"
                      : alpha(t.palette.primary.contrastText, 0.1),
                  },
                })}
                aria-current={active ? "page" : undefined}
              >
                <ListItemIcon
                  sx={(t) => ({
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 1.5,
                    justifyContent: "center",
                    color: active
                      ? "primary.main"
                      : alpha(t.palette.primary.contrastText, 0.9),
                  })}
                >
                  {item.icon}
                </ListItemIcon>

                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: "body2",
                      // Active items use the theme's button fontWeight (600) — genuine
                      // one-off: colour alone distinguishes active state on collapsed view,
                      // but weight is needed for the expanded label.
                      fontWeight: active
                        ? theme.typography.button.fontWeight
                        : undefined,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {/* Logout */}
      <Stack sx={{ px: isCollapsed ? 1 : 2, pb: 2 }}>
        <Tooltip title={isCollapsed ? "Logout" : ""} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={(t) => ({
              borderRadius: 1,
              bgcolor: alpha(t.palette.error.main, 0.22),
              color: "primary.contrastText",
              justifyContent: isCollapsed ? "center" : "flex-start",
              px: isCollapsed ? 1.2 : 2,
              "&:hover": {
                bgcolor: alpha(t.palette.error.main, 0.42),
              },
            })}
            aria-label="Logout"
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 1.5,
                justifyContent: "center",
                color: "primary.contrastText",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  noWrap: true,
                  variant: "body2",
                  fontWeight: theme.typography.button.fontWeight,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Stack>

      {/* Collapse / expand toggle — desktop only */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: -14,
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <IconButton
              size="small"
              onClick={toggleCollapsed}
              sx={{
                bgcolor: "background.paper",
                borderRadius: "50%",
                boxShadow: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "background.default" },
              }}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRightIcon color="primary" fontSize="small" />
              ) : (
                <ChevronLeftIcon color="primary" fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  // ── Mobile: temporary overlay drawer ─────────────────────────
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": paperSx }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // ── Desktop: permanent drawer, collapsible ───────────────────
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": paperSx,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
