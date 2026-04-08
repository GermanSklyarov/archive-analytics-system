import { Datagrid, EmailField, List, TextField } from "react-admin";

export const UsersList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="role" />
    </Datagrid>
  </List>
);
