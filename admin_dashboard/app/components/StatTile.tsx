"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { ReactNode } from "react";

interface BaseProps {
  label: string;
  value: string | number;
}

interface IconVariant extends BaseProps {
  variant: "icon";
  icon: ReactNode;
}

interface CardVariant extends BaseProps {
  variant: "card";
  icon?: ReactNode;
}

interface CompactVariant extends BaseProps {
  variant: "compact";
}

export type StatTileProps = IconVariant | CardVariant | CompactVariant;

/**
 * Three layout variants:
 * - "icon"    — horizontal row: icon + label above value (dashboard Insights grid)
 * - "card"    — standalone MuiCard with optional icon (full-width stat widgets)
 * - "compact" — inline label / value pair (dense areas)
 *
 * Typography weights come from the theme — no fontWeight overrides here.
 */
export default function StatTile(props: StatTileProps) {
  if (props.variant === "icon") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          p: 1.25,
          borderRadius: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {props.icon}
        <Box>
          <Typography variant="body2" color="text.secondary">
            {props.label}
          </Typography>
          <Typography variant="h5" color="primary">
            {props.value}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (props.variant === "card") {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {props.icon}
            <Typography variant="body2" color="text.secondary">
              {props.label}
            </Typography>
          </Box>
          <Typography variant="h4" color="primary">
            {props.value}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // compact
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
      <Typography variant="body1">{props.value}</Typography>
    </Box>
  );
}
