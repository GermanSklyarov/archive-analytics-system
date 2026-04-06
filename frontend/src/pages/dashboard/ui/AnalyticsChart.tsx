import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-admin";
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
import type { DataPoint } from "../model/types";

type Props = {
  data: DataPoint[];
};

export const AnalyticsChart = ({ data }: Props) => {
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
        }),
      )}`,
    );
  };

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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
