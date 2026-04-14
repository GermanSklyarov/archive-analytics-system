import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Select,
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
  <Box display="flex" gap={2} mb={2}>
    <TextField
      label="Date from"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={filters.dateFrom || ""}
      onChange={(e) => onChange("dateFrom", e.target.value)}
    />

    <TextField
      label="Date to"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={filters.dateTo || ""}
      onChange={(e) => onChange("dateTo", e.target.value)}
    />

    <Select
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
      sx={{ minWidth: 200 }}
    />

    <Autocomplete
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
      sx={{ minWidth: 200 }}
    />

    <Button disabled={!isDirty} onClick={onApply}>
      Apply
    </Button>
    <Button variant="outlined" onClick={onReset}>
      Reset
    </Button>
  </Box>
);
