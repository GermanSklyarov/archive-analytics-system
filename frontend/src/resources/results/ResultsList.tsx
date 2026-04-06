import { Datagrid, DateField, List, NumberField, TextField } from "react-admin";

export const ResultsList = () => (
  <List>
    <Datagrid rowClick="show">
      <NumberField source="id" />
      <TextField source="aggregationType" label="Type" />
      <NumberField source="userId" />
      <DateField source="created_at" showTime />

      <TextField source="dateFrom" />
      <TextField source="dateTo" />
    </Datagrid>
  </List>
);
