import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type DotProps,
} from "recharts";
import type { DashboardFilters, DataPoint } from "../model/types";

type Props = {
  data: DataPoint[];
  filters: DashboardFilters;
};

export const AnalyticsChart = ({ data, filters }: Props) => {
  const navigate = useNavigate();

  type DotPayload = DotProps & {
    payload?: DataPoint;
  };

  const handleClick = (data: DotPayload) => {
    if (!data.payload) return;

    const { payload } = data;

    const dateFrom = new Date(payload.date);
    const dateTo = new Date(payload.date);

    dateTo.setHours(23, 59, 59, 999);

    navigate(
      `/archive-records?filter=${encodeURIComponent(
        JSON.stringify({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          tag: filters.tag,
          unit: filters.unit,
          userId: filters.userId,
        }),
      )}`,
    );
  };

  if (!data || data.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        No data available for the selected filters
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Average by Date
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avg"
              dot={{
                r: 6,
                cursor: "pointer",
                strokeWidth: 2,
                onClick: handleClick,
              }}
            />
            <Line dataKey="count" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
