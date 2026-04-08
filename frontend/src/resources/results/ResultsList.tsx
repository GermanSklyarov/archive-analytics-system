import { Datagrid, DateField, List, NumberField, ReferenceField, TextField } from "react-admin";

export const ResultsList = () => (
  <List>
    <Datagrid rowClick="show">
      <NumberField source="id" />
      <TextField source="aggregationType" label="Type" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" showTime />

      <TextField source="dateFrom" />
      <TextField source="dateTo" />
    </Datagrid>
  </List>
);
