export type Summary = {
  avg: number;
  sum: number;
  count: number;
  min: number;
  max: number;
};

export type DataPoint = {
  date: string;
  avg: number;
};

export type CategoryDataPoint = {
  category: string;
  avg: number;
  count: number;
  sum: number;
};

export type DashboardFilters = {
  dateFrom?: string;
  dateTo?: string;
  userId?: number;
};
