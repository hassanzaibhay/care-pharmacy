"use client";

import { Box, CircularProgress, Divider, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface DetailDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  loading?: boolean;
  width?: number;
}

export default function DetailDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  loading,
  width = 520,
}: DetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width, maxWidth: "100vw", display: "flex", flexDirection: "column" } }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close panel">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          children
        )}
      </Box>
    </Drawer>
  );
}
