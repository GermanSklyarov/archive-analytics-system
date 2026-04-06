import {
  Button,
  DateField,
  FunctionField,
  ListButton,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  useNavigate,
  useRecordContext,
} from "react-admin";

const ResultsShowActions = () => {
  const record = useRecordContext();
  const navigate = useNavigate();

  if (!record) return null;

  const handleRerun = () => {
    const filters = {
      userId: record.userId,
      dateFrom: record.dateFrom,
      dateTo: record.dateTo,
    };

    navigate(`/?filter=${encodeURIComponent(JSON.stringify(filters))}`);
  };

  return (
    <TopToolbar>
      <ListButton />
      <Button label="Re-run" onClick={handleRerun} />
    </TopToolbar>
  );
};

export const ResultsShow = () => (
  <Show actions={<ResultsShowActions />}>
    <SimpleShowLayout sx={{ maxWidth: 600 }}>
      <NumberField source="id" />
      <TextField source="aggregationType" />
      <NumberField source="userId" />
      <DateField source="created_at" showTime />

      <TextField source="dateFrom" />
      <TextField source="dateTo" />

      <FunctionField
        label="Data"
        render={(record) => (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(record.data, null, 2)}
          </pre>
        )}
      />
    </SimpleShowLayout>
  </Show>
);
