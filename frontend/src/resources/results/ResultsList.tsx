import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

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
      <FunctionField
        label="Filters"
        render={(record) => {
          const f = record?.request?.filters;
          if (!f) return "-";

          return Object.entries(f)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
        }}
      />
    </Datagrid>
  </List>
);
