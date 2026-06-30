"use client";

import { CssBaseline, ThemeProvider, StyledEngineProvider } from "@mui/material";
import type { ReactNode } from "react";
import EmotionCacheProvider from "./emotionCache";
import theme from "./theme/theme";
import { SidebarProvider } from "./contexts/SidebarContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionCacheProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* SidebarProvider is inside ThemeProvider so useMediaQuery has theme breakpoints */}
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </EmotionCacheProvider>
  );
}
