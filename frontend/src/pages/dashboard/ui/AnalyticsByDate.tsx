import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { Title } from "react-admin";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const AnalyticsByDate = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/analytics/by-date")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <Card>
      <CardContent>
        <Title title="Analytics by Date" />

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avg" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
