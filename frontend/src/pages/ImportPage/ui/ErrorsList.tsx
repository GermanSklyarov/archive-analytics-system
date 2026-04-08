import { Alert, AlertTitle, List, ListItem, ListItemText } from '@mui/material';

type Props = {
  errors: string[];
  total?: number;
};

export function ErrorsList({ errors, total }: Props) {
  if (!errors.length) return null;

  const isTruncated = total && errors.length < total;

  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      <AlertTitle>
        Errors ({errors.length}
        {isTruncated && ` of ${total}`})
      </AlertTitle>

      {isTruncated && (
        <div style={{ marginBottom: 8 }}>
          Showing only first {errors.length} errors
        </div>
      )}

      <List dense>
        {errors.map((e, i) => (
          <ListItem key={i}>
            <ListItemText primary={e} />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
}