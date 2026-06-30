"use client";

import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function HeaderBar({ title }: { title: string }) {
  const [userName, setUserName] = useState<string>("Admin");

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
          <Box
            component="img"
            src="/app_logo.png"
            alt="Care Pharmacy"
            sx={{ height: 36, width: 36, borderRadius: 8, boxShadow: 1, bgcolor: "white" }}
          />
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={600}>
          Welcome {userName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
