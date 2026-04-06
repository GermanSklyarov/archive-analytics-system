import { Admin, Resource } from "react-admin";
import { dataProvider } from "../api/dataProvider";
import { AppLayout } from "../components/AppLayout";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ArchiveRecordList } from "../resources/archiveRecords";
import { ResultsList } from "../resources/results/ResultsList";
import { ResultsShow } from "../resources/results/ResultsShow";

export default function App() {
  return (
    <Admin dataProvider={dataProvider} layout={AppLayout} dashboard={Dashboard}>
      <Resource name="archive-records" list={ArchiveRecordList} />
      <Resource name="results" list={ResultsList} show={ResultsShow} />
    </Admin>
  );
}
