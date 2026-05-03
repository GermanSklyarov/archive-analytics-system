import {
  Alert,
  Box,
  Chip,
  Paper,
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

import { useArchiveMeta } from "../../hooks/useArchiveMeta";
import type {
  ColumnMapping,
  ImportResponse,
  PreviewResponse,
  PreviewWithMappingResponse,
} from "./model/types";
import { useImportPreviewWithMapping } from "./model/useImportPreviewWithMapping";
import { MappedPreviewTable } from "./ui/MappedPreviewTable";
import { MappingForm } from "./ui/MappingForm";

export function ImportPage() {
  const { runImport, loading: importing } = useImport();
  const { loading: previewLoading } = useImportPreview();
  const { runPreviewWithMapping, loading: mappingPreviewLoading } =
    useImportPreviewWithMapping();
  const { data: meta } = useArchiveMeta();

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
    tag: "",
    unit: "",
    manualTag: "",
    manualUnit: "",
  });
  const resultRef = useRef<HTMLDivElement | null>(null);
  const mappedRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);

  const hasErrors = result
    ? result.invalid > 0
    : parsedPreview
      ? parsedPreview.invalid > 0
      : false;

  const isMappingValid =
    (mapping.tag === "manual" ? Boolean(mapping.manualTag?.trim()) : true) &&
    (mapping.unit === "manual" ? Boolean(mapping.manualUnit?.trim()) : true);

  const errorCount = result?.invalid ?? parsedPreview?.invalid ?? 0;

  const handlePreview = (file: File, data: PreviewResponse) => {
    setFile(file);
    setRawPreview(data);

    const nextMapping: ColumnMapping = {
      value: data.mapping.value ?? "",
      category: data.mapping.category ?? "",
      created_at: data.mapping.created_at ?? "",
      tag: data.mapping.tag ?? "",
      unit: data.mapping.unit ?? "",
      manualTag: "",
      manualUnit: "",
    };

    setMapping(nextMapping);
    setResult(null);
    hasScrolledRef.current = false;
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
    if (mapping.tag === "manual" && !mapping.manualTag?.trim()) return;

    const timeout = setTimeout(() => {
      runPreviewWithMapping(file, mapping).then(setParsedPreview);
    }, 400);

    return () => clearTimeout(timeout);
  }, [mapping, file, isMappingValid]);

  useEffect(() => {
    if (parsedPreview && !hasScrolledRef.current) {
      mappedRef.current?.scrollIntoView({ behavior: "smooth" });
      hasScrolledRef.current = true;
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
              label={`Mode: ${parsedPreview?.mode ?? rawPreview.mode ?? "auto"}`}
              color="info"
            />
            <Chip
              label={`Generated: ${parsedPreview?.generated ?? rawPreview.generated ?? rawPreview.total}`}
              color="secondary"
            />
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
            <MappingForm
              columns={rawPreview.columns}
              mapping={mapping}
              meta={meta}
              onChange={setMapping}
            />
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Step 1: Check your file structure
            </Typography>

            {rawPreview.mode === "wide" && (
              <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
                Wide-table mode detected. Each numeric metric column will be
                imported as a separate category for each date row.
              </Alert>
            )}

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
