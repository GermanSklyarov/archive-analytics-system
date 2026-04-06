import {
  Datagrid,
  DateField,
  DateInput,
  List,
  NumberField,
  NumberInput,
  TextField,
  TextInput,
} from "react-admin";

const filters = [
  <TextInput source="category" label="Category" alwaysOn />,
  <NumberInput source="userId" label="User ID" />,
  <NumberInput source="minValue" label="Min value" />,
  <NumberInput source="maxValue" label="Max value" />,
  <DateInput source="dateFrom" label="From date" />,
  <DateInput source="dateTo" label="To date" />,
];

export const ArchiveRecordList = () => (
  <List filters={filters} debounce={500}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="category" />
      <NumberField source="value" />
      <DateField source="created_at" />
      <TextField source="userId" />
    </Datagrid>
  </List>
);
