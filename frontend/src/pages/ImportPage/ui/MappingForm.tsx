import {
  Autocomplete,
  Box,
  FormControl,
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

      <Stack direction="row" useFlexGap spacing={2} flexWrap="wrap">
        {["value", "category", "created_at"].map((field) => (
          <FormControl key={field} size="small" sx={{ minWidth: 160 }}>
            <InputLabel>{field}</InputLabel>
            <Select
              value={mapping[field as keyof ColumnMapping]}
              label={field}
              onChange={(e) =>
                update({ [field]: e.target.value } as Partial<ColumnMapping>)
              }
            >
              {columns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>tag</InputLabel>
          <Select
            value={mapping.tag}
            label="tag"
            onChange={(e) => update({ tag: e.target.value })}
          >
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
            value={mapping.unit}
            label="unit"
            onChange={(e) => update({ unit: e.target.value })}
          >
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
