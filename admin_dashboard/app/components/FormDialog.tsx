"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  children: ReactNode;
  loading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg";
}

export default function FormDialog({
  open,
  title,
  onClose,
  onSave,
  saveLabel = "Save",
  children,
  loading,
  maxWidth = "md",
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography component="span" variant="h6">
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} /> : undefined}
        >
          {saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
