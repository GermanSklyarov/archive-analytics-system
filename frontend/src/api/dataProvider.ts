import type { DataProvider } from "react-admin";

const API_URL = "/api";

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
      sortBy: field,
      order: order,
    });

    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await fetch(`${API_URL}/${resource}?${query}`);
    const json = await res.json();

    return {
      data: json.data ?? json,
      total: json.total ?? json.length ?? 0,
    };
  },

  importFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/archive-records/import", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Import failed");
    }

    return response.json();
  },

getOne: async (resource, params) => {
  const response = await fetch(`${API_URL}/${resource}/${params.id}`);
  const json = await response.json();

  return {
    data: json,
  };
},

  // пока заглушки
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  update: async () => ({ data: {} }),
  updateMany: async () => ({ data: [] }),
  create: async () => ({ data: {} }),
  delete: async () => ({ data: {} }),
  deleteMany: async () => ({ data: [] }),
};
