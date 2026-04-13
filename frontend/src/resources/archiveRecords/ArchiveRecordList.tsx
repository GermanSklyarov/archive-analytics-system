import { Datagrid, DateField, List, NumberField, TextField } from "react-admin";
import { ArchiveFilters } from "./ArchiveFilters";

export const ArchiveRecordList = () => (
  <List filters={<ArchiveFilters children={null} />} debounce={500}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="category" />
      <NumberField source="value" />
      <DateField source="created_at" />
      <TextField source="userId" />
      <TextField source="tag" />
      <TextField source="unit" />
    </Datagrid>
  </List>
);
