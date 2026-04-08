import {
  ArrayField,
  Button,
  Datagrid,
  DateField,
  ListButton,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  useNavigate,
  useRecordContext,
} from "react-admin";
import { AnalyticsByCategoryChart } from "../../pages/dashboard/ui/AnalyticsByCategoryChart";
import { AnalyticsChart } from "../../pages/dashboard/ui/AnalyticsChart";
import { SummaryCards } from "../../pages/dashboard/ui/SummaryCards";

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

const ResultDataView = () => {
  const record = useRecordContext();

  if (!record) return null;

  if (record.aggregationType === "by-category") {
    return (
      <>
        <AnalyticsByCategoryChart data={record.data} />

        <ArrayField source="data">
          <Datagrid>
            <TextField source="category" />
            <NumberField source="avg" />
            <NumberField source="count" />
          </Datagrid>
        </ArrayField>
      </>
    );
  }

  if (record.aggregationType === "summary") {
    return <SummaryCards summary={record.data} />;
  }

  if (record.aggregationType === "by-date") {
    return <AnalyticsChart data={record.data} />;
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(record.data, null, 2)}
    </pre>
  );
};

export const ResultsShow = () => (
  <Show actions={<ResultsShowActions />}>
    <SimpleShowLayout sx={{ maxWidth: 600 }}>
      <NumberField source="id" />
      <TextField source="aggregationType" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" showTime />

      <TextField source="dateFrom" />
      <TextField source="dateTo" />

      <ResultDataView />
    </SimpleShowLayout>
  </Show>
);
