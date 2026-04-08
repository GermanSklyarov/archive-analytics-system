import axios from "axios";
import type { ImportResponse, PreviewResponse } from "./types";

export const previewImportApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post<PreviewResponse>(
    "/api/archive-records/preview",
    formData,
  );

  return data;
};

export const importApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post<ImportResponse>(
    "/api/archive-records/import",
    formData,
  );

  return data;
};
