import { useEffect, useState } from "react";
import { getArchiveMeta } from "../api/archiveRecords";
import type { ImportMetaResponse } from "../types/meta";

export function useArchiveMeta() {
  const [data, setData] = useState<ImportMetaResponse | null>(null);

  useEffect(() => {
    getArchiveMeta().then(setData);
  }, []);

  return { data };
}
