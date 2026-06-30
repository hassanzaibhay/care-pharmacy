"use client";

import { CssBaseline, ThemeProvider, StyledEngineProvider } from "@mui/material";
import type { ReactNode } from "react";
import EmotionCacheProvider from "./emotionCache";
import theme from "./theme/theme";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionCacheProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </EmotionCacheProvider>
  );
}
