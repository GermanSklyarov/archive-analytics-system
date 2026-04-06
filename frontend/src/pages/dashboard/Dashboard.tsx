import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { SummaryCards } from "./ui/SummaryCards";

import {
  getAnalyticsByCategory,
  getAnalyticsByDate,
  getSummary,
} from "./model/api";

import { useLocation, useNavigate } from "react-router-dom";
import { ImportButton } from "../../components/ImportButton";
import type {
  CategoryDataPoint,
  DashboardFilters,
  DataPoint,
  Summary,
} from "./model/types";
import { AnalyticsByCategoryChart } from "./ui/AnalyticsByCategoryChart";
import { AnalyticsChart } from "./ui/AnalyticsChart";

export const Dashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (key: keyof DashboardFilters, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const getInitialFilters = (): DashboardFilters => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");

    if (!filterParam) return {};

    try {
      return JSON.parse(filterParam);
    } catch {
      return {};
    }
  };

  const [filters, setFilters] = useState<DashboardFilters>(getInitialFilters());

  useEffect(() => {
    const params = new URLSearchParams();

    if (Object.keys(filters).length > 0) {
      params.set("filter", JSON.stringify(filters));
    }

    navigate({ search: params.toString() }, { replace: true });
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");

    if (!filterParam) return;

    try {
      const parsed = JSON.parse(filterParam);

      setFilters((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(parsed)) {
          return prev;
        }
        return parsed;
      });
    } catch (error) {
      console.error("Error parsing filter:", error);
    }
  }, [location.search]);

  useEffect(() => {
    getSummary(filters).then(setSummary);
    getAnalyticsByDate(filters).then(setData);
    getAnalyticsByCategory(filters).then(setCategoryData);
  }, [filters]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      <ImportButton />

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Date from"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.dateFrom || ""}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
        />

        <TextField
          label="Date to"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.dateTo || ""}
          onChange={(e) => handleChange("dateTo", e.target.value)}
        />

        <TextField
          label="User ID"
          type="number"
          value={filters.userId || ""}
          onChange={(e) =>
            handleChange(
              "userId",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        />

        <Button variant="outlined" onClick={() => setFilters({})}>
          Reset
        </Button>
      </Box>

      <SummaryCards summary={summary} />

      <AnalyticsChart data={data} />

      <AnalyticsByCategoryChart data={categoryData} />

      <Button onClick={() => navigate("/results")}>View Results History</Button>
    </div>
  );
};
