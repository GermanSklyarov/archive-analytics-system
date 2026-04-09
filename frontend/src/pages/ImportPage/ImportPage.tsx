import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-admin";

import { useImport } from "./model/useImport";
import { useImportPreview } from "./model/useImportPreview";

import { ErrorsList } from "./ui/ErrorsList";
import { FileUpload } from "./ui/FileUpload";
import { ImportResult } from "./ui/ImportResult";
import { RawPreviewTable } from "./ui/RawPreviewTable";

import type {
  ColumnMapping,
  ImportResponse,
  PreviewResponse,
  PreviewWithMappingResponse,
} from "./model/types";
import { useImportPreviewWithMapping } from "./model/useImportPreviewWithMapping";
import { MappedPreviewTable } from "./ui/MappedPreviewTable";

export function ImportPage() {
  const { runImport, loading: importing } = useImport();
  const { loading: previewLoading } = useImportPreview();
  const { runPreviewWithMapping, loading: mappingPreviewLoading } =
    useImportPreviewWithMapping();

  const [parsedPreview, setParsedPreview] =
    useState<PreviewWithMappingResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rawPreview, setRawPreview] = useState<PreviewResponse | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [mapping, setMapping] = useState<ColumnMapping>({
    value: "",
    category: "",
    created_at: "",
  });
  const resultRef = useRef<HTMLDivElement | null>(null);
  const mappedRef = useRef<HTMLDivElement | null>(null);

  const hasErrors = result
    ? result.invalid > 0
    : parsedPreview
      ? parsedPreview.invalid > 0
      : false;

  const isMappingValid =
    mapping.value && mapping.category && mapping.created_at;

  const errorCount = result?.invalid ?? parsedPreview?.invalid ?? 0;

  const handlePreview = (file: File, data: PreviewResponse) => {
    setFile(file);
    setRawPreview(data);
    setMapping(data.mapping);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;
    const res = await runImport(file, mapping);
    setResult(res);
    setOpen(true);
  };

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  useEffect(() => {
    if (!file || !isMappingValid) return;

    runPreviewWithMapping(file, mapping).then(setParsedPreview);
  }, [mapping]);

  useEffect(() => {
    if (parsedPreview) {
      mappedRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [parsedPreview]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Import Data
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FileUpload onPreview={handlePreview} />
      </Paper>

      {previewLoading && <Typography>Loading preview...</Typography>}

      {mappingPreviewLoading && <Typography>Applying mapping...</Typography>}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={hasErrors ? "warning" : "success"} variant="filled">
          {hasErrors
            ? `Imported with ${errorCount} errors`
            : "Import successful"}
        </Alert>
      </Snackbar>

      {rawPreview && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <Chip label={`Total: ${rawPreview.total}`} />
            <Chip
              label={`Valid: ${parsedPreview?.valid ?? "-"}`}
              color="success"
            />
            <Chip
              label={`Errors: ${parsedPreview?.invalid ?? "-"}`}
              color="error"
            />
          </Stack>

          {rawPreview && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Map columns
              </Typography>

              <Stack direction="row" spacing={2}>
                {["value", "category", "created_at"].map((field) => (
                  <FormControl key={field} size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{field}</InputLabel>
                    <Select
                      value={mapping[field as keyof typeof mapping]}
                      label={field}
                      onChange={(e) =>
                        setMapping((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                    >
                      {rawPreview.columns.map((col) => (
                        <MenuItem
                          key={col}
                          value={col}
                          selected={Object.values(mapping).includes(col)}
                        >
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Step 1: Check your file structure
            </Typography>

            <Typography variant="h6" gutterBottom>
              Raw data
            </Typography>

            <RawPreviewTable
              data={rawPreview.preview}
              columns={rawPreview.columns}
            />
          </Box>

          {parsedPreview && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Step 2: Validate mapped data before import
              </Typography>

              <Typography variant="h6" gutterBottom>
                Preview with mapping
              </Typography>

              <Box ref={mappedRef}>
                <MappedPreviewTable data={parsedPreview.preview} />
              </Box>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            {parsedPreview && (
              <Box sx={{ mt: 2 }}>
                <ErrorsList
                  errors={parsedPreview.errors}
                  total={parsedPreview.invalid}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!file || importing || !isMappingValid}
              onClick={handleImport}
            >
              {importing ? "Importing..." : "Import"}
            </Button>
          </Box>
        </Paper>
      )}

      {result && (
        <Box ref={resultRef}>
          <ImportResult result={result} />
        </Box>
      )}
    </Box>
  );
}
