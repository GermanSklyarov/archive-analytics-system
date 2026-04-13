import {
  AutocompleteInput,
  DateInput,
  Filter,
  NumberInput,
  TextInput,
  type FilterProps,
} from "react-admin";
import { useArchiveMeta } from "../../hooks/useArchiveMeta";

export const ArchiveFilters = (props: FilterProps) => {
  const { data: meta } = useArchiveMeta();

  return (
    <Filter {...props}>
      <AutocompleteInput
        source="tag"
        label="Tag"
        choices={meta?.tags ?? []}
        optionText={(choice) => `${choice.value} (${choice.count})`}
        optionValue="value"
        filterToQuery={(searchText) => ({ tag: searchText })}
        alwaysOn
      />

      <TextInput source="category" label="Category" alwaysOn />

      <NumberInput source="userId" label="User ID" />

      <NumberInput source="minValue" label="Min value" />
      <NumberInput source="maxValue" label="Max value" />

      <DateInput source="dateFrom" label="From date" />
      <DateInput source="dateTo" label="To date" />

      <AutocompleteInput
        source="unit"
        label="Unit"
        choices={meta?.units ?? []}
        optionText={(choice) => `${choice.value} (${choice.count})`}
        optionValue="value"
        filterToQuery={(searchText) => ({ tag: searchText })}
      />
    </Filter>
  );
};
