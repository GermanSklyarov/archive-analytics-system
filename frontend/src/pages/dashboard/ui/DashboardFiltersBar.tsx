import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { ImportMetaResponse } from "../../../types/meta";
import type { User } from "../../../types/user";
import type { DashboardFilters } from "../model/types";

type Props = {
  filters: DashboardFilters;
  users: User[];
  meta: ImportMetaResponse | null;
  isDirty: boolean;
  onChange: (key: keyof DashboardFilters, value: unknown) => void;
  onReset: () => void;
  onApply: () => void;
};

export const DashboardFiltersBar = ({
  filters,
  users,
  meta,
  isDirty,
  onChange,
  onReset,
  onApply,
}: Props) => (
  <Box
    sx={{
      mb: 3,
      display: "grid",
      gap: 2,
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(6, minmax(0, 1fr)) auto",
      },
      alignItems: "start",
    }}
  >
    <TextField
      fullWidth
      size="small"
      label="Date from"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={filters.dateFrom || ""}
      onChange={(e) => onChange("dateFrom", e.target.value)}
    />

    <TextField
      fullWidth
      size="small"
      label="Date to"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={filters.dateTo || ""}
      onChange={(e) => onChange("dateTo", e.target.value)}
    />

    <Select
      fullWidth
      size="small"
      displayEmpty
      value={filters.userId || ""}
      onChange={(e) =>
        onChange("userId", e.target.value ? Number(e.target.value) : undefined)
      }
    >
      <MenuItem value="">All users</MenuItem>
      {users.map((u) => (
        <MenuItem key={u.id} value={u.id}>
          {u.name}
        </MenuItem>
      ))}
    </Select>

    <Autocomplete
      fullWidth
      size="small"
      options={meta?.categories ?? []}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.value} (${option.count})`
      }
      value={
        meta?.categories?.find((c) => c.value === filters.category) ?? null
      }
      onChange={(_, value) => {
        if (typeof value === "string") {
          onChange("category", value);
        } else {
          onChange("category", value?.value);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Category" />}
    />

    <Autocomplete
      fullWidth
      size="small"
      options={meta?.tags ?? []}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.value} (${option.count})`
      }
      value={meta?.tags?.find((t) => t.value === filters.tag) ?? null}
      onChange={(_, value) => {
        if (typeof value === "string") {
          onChange("tag", value);
        } else {
          onChange("tag", value?.value);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Tag" />}
    />

    <Autocomplete
      fullWidth
      size="small"
      options={meta?.units ?? []}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.value} (${option.count})`
      }
      value={meta?.units?.find((t) => t.value === filters.unit) ?? null}
      onChange={(_, value) => {
        if (typeof value === "string") {
          onChange("unit", value);
        } else {
          onChange("unit", value?.value);
        }
      }}
      renderInput={(params) => <TextField {...params} label="Unit" />}
    />

    <Stack
      direction={{ xs: "row", lg: "column" }}
      spacing={1}
      sx={{ minWidth: { lg: 120 } }}
    >
      <Button disabled={!isDirty} variant="contained" onClick={onApply}>
        Apply
      </Button>
      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    </Stack>
  </Box>
);
