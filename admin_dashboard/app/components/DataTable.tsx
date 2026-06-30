"use client";

import {
  Box,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: number | string;
  /** When true and the table has an onRowClick handler, clicks on this cell do NOT bubble to the row. */
  stopPropagation?: boolean;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRowClick?: (row: T) => void;
  // Pagination
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Sorting
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  // Display
  emptyMessage?: string;
  /** Slot rendered above the table (search bars, action buttons, etc.) */
  toolbar?: ReactNode;
  skeletonRows?: number;
}

// ── Component ─────────────────────────────────────────────────

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  sortBy,
  sortDir,
  onSort,
  emptyMessage = "No data found.",
  toolbar,
  skeletonRows = 5,
}: DataTableProps<T>) {
  return (
    <Box>
      {toolbar && <Box sx={{ mb: 2 }}>{toolbar}</Box>}

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align}
                  width={col.width}
                  sortDirection={col.sortable && sortBy === col.key ? sortDir : false}
                >
                  {col.sortable && onSort ? (
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortBy === col.key ? sortDir : "asc"}
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  hover={!!onRowClick}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align}
                      onClick={
                        col.stopPropagation && onRowClick
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => onPageChange(p)}
            color="primary"
            size="small"
          />
        </Stack>
      )}
    </Box>
  );
}
