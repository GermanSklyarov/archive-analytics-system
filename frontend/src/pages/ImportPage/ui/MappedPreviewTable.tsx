import {
  Box,
  Chip,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useMemo, useState } from "react";

import JsonView from "@uiw/react-json-view";
import type { MappedPreviewRow } from "../model/types";

type Props = {
  data: MappedPreviewRow[];
};

export function MappedPreviewTable({ data }: Props) {
  const [onlyErrors, setOnlyErrors] = useState(false);

  const rows = useMemo(() => {
    return onlyErrors ? data.filter((r) => !r.isValid) : data;
  }, [onlyErrors, data]);

  if (!data.length) return null;

  return (
    <Paper sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
      <Box sx={{ px: 2, pt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={onlyErrors}
              onChange={(e) => setOnlyErrors(e.target.checked)}
            />
          }
          label="Show only errors"
        />
      </Box>

      <Typography variant="body2" sx={{ px: 2, pb: 2 }}>
        Showing {rows.length} rows
      </Typography>

      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Metadata</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const d = row.data;

            return (
              <Fragment key={row.index}>
                <TableRow
                  hover
                  sx={{
                    bgcolor:
                      !row.isValid || !d ? "rgba(255, 0, 0, 0.06)" : "inherit",
                  }}
                >
                  <TableCell>
                    <Chip
                      label={row.isValid ? "OK" : "Error"}
                      color={row.isValid ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {d?.category ? (
                      <Chip label={d.category} size="small" />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>{d?.value ?? "-"}</TableCell>

                  <TableCell>
                    {d?.userId ? (
                      <Chip label={`#${d.userId}`} size="small" />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {d?.created_at
                      ? new Date(d.created_at).toLocaleString()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {d?.metadata ? (
                      <Box
                        sx={{
                          pl: 1.5,
                          borderLeft: "2px solid",
                          borderColor: "divider",
                        }}
                      >
                        <JsonView
                          value={d.metadata}
                          collapsed={2}
                          displayDataTypes={false}
                          displayObjectSize={false}
                          style={{
                            background: "transparent",
                            fontSize: 12,
                            opacity: 0.85,
                          }}
                        />
                      </Box>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>

                {!row.isValid && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="error" sx={{ pl: 2 }}>
                        {row.errors?.join(", ") || "Unknown error"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
