import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { RawPreviewRow } from "../model/types";

type Props = {
  data: RawPreviewRow[];
  columns: string[];
};

export function RawPreviewTable({ data, columns }: Props) {
  if (!data.length) return null;

  return (
    <Paper sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="body2">Showing {data.length} rows</Typography>
      </Box>

      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.index}
              sx={{
                bgcolor: row.isValid ? "inherit" : "rgba(255, 0, 0, 0.06)",
              }}
            >
              {columns.map((col) => (
                <TableCell key={col}>
                  {row.raw[col] !== undefined ? String(row.raw[col]) : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
