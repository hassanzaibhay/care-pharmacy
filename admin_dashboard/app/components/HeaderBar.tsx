"use client";

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useSidebar } from "../contexts/SidebarContext";

export default function HeaderBar({ title }: { title: string }) {
  const [userName, setUserName] = useState<string>("Admin");
  const { isMobile, toggleMobile } = useSidebar();

  useEffect(() => {
    // Fetch the current admin identity from /me (cookie-authed).
    // 401 is expected when unauthenticated — not an error, just keep the fallback.
    fetch("/api/admin/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.name) setUserName(data.data.name);
      })
      .catch(() => {
        // network failure — keep "Admin" fallback
      });
  }, []);

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          {/* Hamburger — mobile only */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobile}
              aria-label="Open navigation menu"
              sx={{ mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component="img"
            src="/app_logo.png"
            alt="Care Pharmacy"
            sx={{ height: 36, width: 36, borderRadius: 1, boxShadow: 1, bgcolor: "background.paper" }}
          />
          {/* Theme h6 owns fontWeight (600) — no inline override needed */}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium" }}>
          Welcome {userName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
