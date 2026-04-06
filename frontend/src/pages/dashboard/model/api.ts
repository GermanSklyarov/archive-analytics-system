import type { DashboardFilters } from "./types";

const buildQuery = (filters?: DashboardFilters) => {
  const params = new URLSearchParams();

  if (!filters) return "";

  if (filters.userId !== undefined) {
    params.append("userId", String(filters.userId));
  }

  if (filters.dateFrom) {
    params.append("dateFrom", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.append("dateTo", filters.dateTo);
  }

  return params.toString();
};

export const getSummary = async (filters?: DashboardFilters) => {
  const res = await fetch(`/api/analytics/summary?${buildQuery(filters)}`);
  return res.json();
};

export const getAnalyticsByDate = async (filters?: DashboardFilters) => {
  const res = await fetch(`/api/analytics/by-date?${buildQuery(filters)}`);
  return res.json();
};

export const getAnalyticsByCategory = async (filters?: DashboardFilters) => {
  const res = await fetch(`/api/analytics/by-category?${buildQuery(filters)}`);
  return res.json();
};
