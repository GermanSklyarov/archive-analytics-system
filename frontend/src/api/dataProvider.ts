import type { DataProvider } from "react-admin";
import { http } from "./ http";

const API_URL = "/api";

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {};
    const { field = "id", order = "ASC" } = params.sort ?? {};
    const filter = params.filter ?? {};

    const query = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
      sortBy: field,
      order: order,
    });

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await http(`${API_URL}/${resource}?${query}`);

    if (Array.isArray(res)) {
      return {
        data: res,
        total: res.length,
      };
    }

    return {
      data: res.data ?? [],
      total: res.total ?? 0,
    };
  },

  importFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const json = await http(`${API_URL}/archive-records/import`, {
      method: "POST",
      body: formData,
    });

    return json;
  },

  getOne: async (resource, params) => {
    const json = await http(`${API_URL}/${resource}/${params.id}`);

    return {
      data: json,
    };
  },

  getMany: async (resource, params) => {
    const res = await fetch(
      `${API_URL}/${resource}?ids=${params.ids.join(",")}`,
    );
    const json = await res.json();

    return { data: json.data ?? json };
  },

  // пока заглушки
  getManyReference: async () => ({ data: [], total: 0 }),
  update: async (resource, params) => {
    const json = await http(`${API_URL}/${resource}/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.data),
    });

    return { data: json };
  },
  updateMany: async () => ({ data: [] }),
  create: async (resource, params) => {
    const json = await http(`${API_URL}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.data),
    });

    return { data: json };
  },

  delete: async (resource, params) => {
    const response = await fetch(`/api/${resource}/${params.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    return { data };
  },

  deleteMany: async (resource, params) => {
    await http(`/api/${resource}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: params.ids }),
    });

    return { data: params.ids };
  },
};
