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
import { PreviewTable } from "./ui/PreviewTable";

import type { ImportResponse, PreviewResponse } from "./model/types";

export function ImportPage() {
  const { runImport, loading: importing } = useImport();
  const { loading: previewLoading } = useImportPreview();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [open, setOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const previewHasErrors = (preview?.invalid ?? 0) > 0;
  const resultHasErrors = (result?.invalid ?? 0) > 0;

  const hasErrors = result ? resultHasErrors : previewHasErrors;

  const handlePreview = (file: File, data: PreviewResponse) => {
    setFile(file);
    setPreview(data);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;
    const res = await runImport(file);
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

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Import Data
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FileUpload onPreview={handlePreview} />
      </Paper>

      {previewLoading && <Typography>Loading preview...</Typography>}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={hasErrors ? "warning" : "success"} variant="filled">
          {hasErrors
            ? `Imported with ${result?.invalid ?? preview?.invalid} errors`
            : "Import successful"}
        </Alert>
      </Snackbar>

      {preview && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <Chip label={`Total: ${preview.total}`} />
            <Chip label={`Valid: ${preview.valid}`} color="success" />
            <Chip label={`Errors: ${preview.invalid}`} color="error" />
          </Stack>

          <PreviewTable data={preview.preview} />
          <Box sx={{ mt: 2 }}>
            <ErrorsList errors={preview.errors} total={preview.invalid} />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!file || importing}
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
