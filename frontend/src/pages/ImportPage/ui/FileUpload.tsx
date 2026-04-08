import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import type { PreviewResponse } from "../model/types";
import { useImportPreview } from "../model/useImportPreview";

type Props = {
  onPreview: (file: File, data: PreviewResponse) => void;
};

export function FileUpload({ onPreview }: Props) {
  const { uploadFile, loading } = useImportPreview();

  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const res = await uploadFile(file);
    onPreview(file, res);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      onClick={() => document.getElementById("fileInput")?.click()}
      sx={(theme) => ({
        border: "2px dashed",
        borderColor: dragActive
          ? theme.palette.primary.main
          : theme.palette.grey[400],
        borderRadius: 3,
        p: 4,
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s",
        bgcolor: dragActive
          ? theme.palette.action.hover
          : theme.palette.background.paper,
      })}
    >
      <input
        id="fileInput"
        type="file"
        hidden
        accept=".xlsx,.csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {loading ? (
        <CircularProgress size={24} />
      ) : fileName ? (
        <>
          <Typography fontWeight={500}>{fileName}</Typography>
          <Typography variant="body2" color="text.secondary">
            File uploaded successfully
          </Typography>
        </>
      ) : (
        <>
          <Typography fontWeight={500}>Drag & drop file here</Typography>
          <Typography variant="body2" color="text.secondary">
            or click to upload (.xlsx, .csv)
          </Typography>
        </>
      )}
    </Box>
  );
}
