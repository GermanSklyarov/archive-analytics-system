import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { RectangleProps } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryDataPoint } from "../model/types";

type Props = {
  data: CategoryDataPoint[];
};

type BarPayload = RectangleProps & {
  payload?: CategoryDataPoint;
};

export const AnalyticsByCategoryChart = ({ data }: Props) => {
  const navigate = useNavigate();

  const handleClick = (data: BarPayload) => {
    if (!data.payload) return;

    const { category } = data.payload;

    navigate(
      `/archive-records?filter=${encodeURIComponent(
        JSON.stringify({ category }),
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
          Average by Category
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.toSorted((a, b) => b.avg - a.avg)}>
            <CartesianGrid />

            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, `Category: ${name}`]}
            />

            <Legend />

            <Bar
              dataKey="avg"
              name="Average"
              cursor="pointer"
              onClick={handleClick}
            />

            <Bar
              dataKey="count"
              name="Count"
              cursor="pointer"
              onClick={handleClick}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
