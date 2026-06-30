"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { useMediaQuery, useTheme } from "@mui/material";

interface SidebarContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  // defaultMatches: false → server renders desktop layout; avoids hydration mismatch
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { defaultMatches: false });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapsed: () => setCollapsed((p) => !p),
        mobileOpen,
        toggleMobile: () => setMobileOpen((p) => !p),
        closeMobile: () => setMobileOpen(false),
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}
