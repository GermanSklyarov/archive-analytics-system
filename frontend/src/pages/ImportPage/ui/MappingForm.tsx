import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { ImportMetaResponse } from "../../../types/meta";
import type { ColumnMapping } from "../model/types";

type Props = {
  columns: string[];
  mapping: ColumnMapping;
  meta?: ImportMetaResponse | null;
  onChange: (mapping: ColumnMapping) => void;
};

export function MappingForm({ columns, mapping, meta, onChange }: Props) {
  const update = (patch: Partial<ColumnMapping>) =>
    onChange({ ...mapping, ...patch });

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Map columns
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        If you leave <strong>value</strong> empty, the system will switch to
        wide-table mode and convert every numeric column into a separate
        category.
      </Typography>

      <Stack direction="row" useFlexGap spacing={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>value</InputLabel>
          <Select
            value={mapping.value ?? ""}
            label="value"
            onChange={(e) => update({ value: e.target.value || undefined })}
          >
            <MenuItem value="">Auto from numeric columns</MenuItem>
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Leave empty for wide imports</FormHelperText>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>category</InputLabel>
          <Select
            value={mapping.category ?? ""}
            label="category"
            onChange={(e) =>
              update({ category: e.target.value || undefined })
            }
          >
            <MenuItem value="">Auto</MenuItem>
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Auto uses the value column name or metric header
          </FormHelperText>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>created_at</InputLabel>
          <Select
            value={mapping.created_at ?? ""}
            label="created_at"
            onChange={(e) =>
              update({ created_at: e.target.value || undefined })
            }
          >
            <MenuItem value="">Use current date</MenuItem>
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>tag</InputLabel>
          <Select
            value={mapping.tag ?? ""}
            label="tag"
            onChange={(e) => update({ tag: e.target.value })}
          >
            <MenuItem value="">Auto</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>unit</InputLabel>
          <Select
            value={mapping.unit ?? ""}
            label="unit"
            onChange={(e) => update({ unit: e.target.value })}
          >
            <MenuItem value="">Auto</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {mapping.tag === "manual" && (
          <Autocomplete
            freeSolo
            options={meta?.tags ?? []}
            getOptionLabel={(o) =>
              typeof o === "string" ? o : `${o.value} (${o.count})`
            }
            onChange={(_, value) =>
              update({
                manualTag:
                  typeof value === "string" ? value : (value?.value ?? ""),
              })
            }
            inputValue={mapping.manualTag}
            onInputChange={(_, value) => update({ manualTag: value })}
            renderInput={(params) => (
              <TextField {...params} label="Tag" size="small" />
            )}
          />
        )}

        {mapping.unit === "manual" && (
          <Autocomplete
            freeSolo
            options={meta?.units ?? []}
            getOptionLabel={(o) =>
              typeof o === "string" ? o : `${o.value} (${o.count})`
            }
            onChange={(_, value) =>
              update({
                manualUnit:
                  typeof value === "string" ? value : (value?.value ?? ""),
              })
            }
            inputValue={mapping.manualUnit}
            onInputChange={(_, value) => update({ manualUnit: value })}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Unit" />
            )}
          />
        )}
      </Stack>
    </Box>
  );
}
