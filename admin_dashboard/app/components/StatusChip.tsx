"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

// ── StatusChip ────────────────────────────────────────────────

const statusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("cancel")) return { color: "error", variant: "filled" as const };
  if (s.includes("deliver") || s.includes("complete"))
    return { color: "success", variant: "filled" as const };
  if (s.includes("processing") || s.includes("progress"))
    return { color: "info", variant: "filled" as const };
  if (s.includes("paid")) return { color: "warning", variant: "filled" as const };
  if (s.includes("pending")) return { color: "warning", variant: "outlined" as const };
  return { color: "default", variant: "outlined" as const };
};

export default function StatusChip({ label }: { label: string }) {
  const { color, variant } = statusColor(label);
  return (
    <Chip
      size="small"
      color={
        color === "default"
          ? undefined
          : (color as "primary" | "success" | "error" | "warning" | "info")
      }
      variant={variant}
      label={label}
      sx={{ textTransform: "capitalize" }}
    />
  );
}

// ── RatingDisplay ────────────────────────────────────────────
// Fractional star fill using clip-path. theme.palette.warning.main colours the fill.

export function RatingDisplay({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Box sx={{ position: "relative", width: 18, height: 18, display: "inline-flex" }}>
        <StarRoundedIcon
          fontSize="small"
          sx={{ position: "absolute", inset: 0, color: "action.disabled" }}
        />
        <StarRoundedIcon
          fontSize="small"
          sx={{
            position: "absolute",
            inset: 0,
            color: "warning.main",
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
          }}
        />
      </Box>
      <Typography variant="body2">{value.toFixed(1)}</Typography>
    </Stack>
  );
}
