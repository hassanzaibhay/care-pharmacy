"use client";

import { Component, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
          </Box>
        )
      );
    }
    return this.props.children;
  }
}
