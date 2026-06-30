"use client";

import { Alert, Snackbar } from "@mui/material";
import { ToastState } from "../hooks/useToast";

interface ToastSnackbarProps {
  toast: ToastState;
  onClose: () => void;
}

export default function ToastSnackbar({ toast, onClose }: ToastSnackbarProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={toast.open}
      autoHideDuration={2500}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={toast.severity} sx={{ width: "100%" }}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
