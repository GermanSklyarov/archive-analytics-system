import axios from "axios";
import type {
  ColumnMapping,
  ImportResponse,
  PreviewResponse,
  PreviewWithMappingResponse,
} from "./types";

export const previewImportApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post<PreviewResponse>(
    "/api/archive-records/preview",
    formData,
  );

  return data;
};

export const previewWithMappingImportApi = async (
  file: File,
  mapping: ColumnMapping,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mapping", JSON.stringify(mapping));

  const { data } = await axios.post<PreviewWithMappingResponse>(
    "/api/archive-records/preview-with-mapping",
    formData,
  );

  return data;
};

export const importApi = async (file: File, mapping: ColumnMapping) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mapping", JSON.stringify(mapping));

  const { data } = await axios.post<ImportResponse>(
    "/api/archive-records/import",
    formData,
  );

  return data;
};
