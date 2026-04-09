import { useState } from "react";
import { importApi } from "./api";
import type { ColumnMapping, ImportResponse } from "./types";

export function useImport() {
  const [loading, setLoading] = useState(false);

  const runImport = async (
    file: File,
    mapping: ColumnMapping,
  ): Promise<ImportResponse> => {
    setLoading(true);
    try {
      return await importApi(file, mapping);
    } finally {
      setLoading(false);
    }
  };

  return { runImport, loading };
}
