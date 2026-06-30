"use client";

import { useState } from "react";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

const closed: ToastState = { open: false, message: "", severity: "success" };

export function useToast() {
  const [toast, setToast] = useState<ToastState>(closed);

  const showToast = (message: string, severity: ToastSeverity = "success") =>
    setToast({ open: true, message, severity });

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  return { toast, showToast, closeToast };
}
