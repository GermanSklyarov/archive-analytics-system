import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { Summary } from "../model/types";

type Props = {
  summary: Summary | null;
};

export const SummaryCards = ({ summary }: Props) => (
  <Grid container spacing={2} mb={2}>
    <Grid size={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Average</Typography>
          <Typography variant="h4">
            {summary?.avg?.toFixed(2) ?? "-"}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h4">{summary?.sum ?? "-"}</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Count</Typography>
          <Typography variant="h4">{summary?.count ?? "-"}</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Min</Typography>
          <Typography variant="h4">{summary?.min ?? "-"}</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">Max</Typography>
          <Typography variant="h4">{summary?.max ?? "-"}</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);
