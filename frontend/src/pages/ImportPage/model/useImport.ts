import { useState } from "react";
import { importApi } from "./api";
import type { ImportResponse } from "./types";

export function useImport() {
  const [loading, setLoading] = useState(false);

  const runImport = async (file: File): Promise<ImportResponse> => {
    setLoading(true);
    try {
      return await importApi(file);
    } finally {
      setLoading(false);
    }
  };

  return { runImport, loading };
}