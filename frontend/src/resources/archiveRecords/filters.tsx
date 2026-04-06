import { DateInput, TextInput } from "react-admin";

export const archiveFilters = [
  <TextInput source="category" alwaysOn />,
  <TextInput source="userId" />,
  <DateInput source="dateFrom" />,
  <DateInput source="dateTo" />,
];
