import { useState } from "react";
import { previewWithMappingImportApi } from "./api";
import type { ColumnMapping } from "./types";

export function useImportPreviewWithMapping() {
  const [loading, setLoading] = useState(false);

  const runPreviewWithMapping = async (file: File, mapping: ColumnMapping) => {
    setLoading(true);

    const res = await previewWithMappingImportApi(file, mapping);

    setLoading(false);

    return res;
  };

  return { runPreviewWithMapping, loading };
}
