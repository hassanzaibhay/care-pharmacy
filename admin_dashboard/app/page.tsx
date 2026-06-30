"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Probe /me to decide where bare "/" should go.
    // 401 is the expected unauthenticated response — not an error.
    fetch("/api/admin/me", { credentials: "include" })
      .then((res) => {
        window.location.href = res.ok ? "/dashboard" : "/login";
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);
  return null;
}
