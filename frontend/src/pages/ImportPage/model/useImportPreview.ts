import { useState } from "react";
import { previewImportApi } from "./api";
import type { PreviewResponse } from "./types";

export function useImportPreview() {
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File): Promise<PreviewResponse> => {
    setLoading(true);
    try {
      return await previewImportApi(file);
    } finally {
      setLoading(false);
    }
  };

  return { loading, uploadFile };
}