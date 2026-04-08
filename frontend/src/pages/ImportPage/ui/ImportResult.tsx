import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { ImportResponse } from "../model/types";
import { ErrorsList } from "./ErrorsList";

export const ImportResult = ({ result }: { result: ImportResponse }) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Import Result
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip label={`Inserted: ${result.inserted}`} color="success" />
          <Chip label={`Skipped: ${result.skipped}`} />
          <Chip label={`Errors: ${result.invalid}`} color="error" />
        </Stack>

        {result.invalid > 0 && <ErrorsList errors={result.errors} />}
      </CardContent>
    </Card>
  );
};
