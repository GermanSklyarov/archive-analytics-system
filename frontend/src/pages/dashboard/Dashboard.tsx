import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { SummaryCards } from "./ui/SummaryCards";

import {
  getAnalyticsByCategory,
  getAnalyticsByDate,
  getSummary,
} from "./model/api";

import { useLocation, useNavigate } from "react-router-dom";
import { dataProvider } from "../../api/dataProvider";
import { ImportButton } from "../../components/ImportButton";
import type { User } from "../../types/user";
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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, dateData, categoryRes] = await Promise.all([
        getSummary(filters),
        getAnalyticsByDate(filters),
        getAnalyticsByCategory(filters),
      ]);

      setSummary(summaryRes);
      setData(dateData);
      setCategoryData(categoryRes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dataProvider
      .getList<User>("users", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "id", order: "ASC" },
        filter: {},
      })
      .then(({ data }) => setUsers(data));
  }, []);

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
    loadData();
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

        <Select
          value={filters.userId || ""}
          onChange={(e) =>
            handleChange(
              "userId",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        >
          <MenuItem value="">All users</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </Select>

        <Button variant="outlined" onClick={() => setFilters({})}>
          Reset
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <SummaryCards summary={summary} />
          <AnalyticsChart data={data} />
          <AnalyticsByCategoryChart data={categoryData} />
        </>
      )}

      <Button onClick={() => navigate("/results")}>View Results History</Button>
    </div>
  );
};
