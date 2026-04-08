import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import { dataProvider } from "../api/dataProvider";
import { AppLayout } from "../components/AppLayout";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ImportPage } from "../pages/ImportPage/ImportPage";
import { ArchiveRecordList } from "../resources/archiveRecords";
import { ResultsList } from "../resources/results/ResultsList";
import { ResultsShow } from "../resources/results/ResultsShow";
import { UsersList } from "../resources/users/UsersList";

export default function App() {
  return (
    <Admin dataProvider={dataProvider} layout={AppLayout} dashboard={Dashboard}>
      <Resource name="archive-records" list={ArchiveRecordList} />
      <Resource name="results" list={ResultsList} show={ResultsShow} />
      <Resource name="users" list={UsersList} />

      <CustomRoutes>
        <Route path="/archive/import" element={<ImportPage />} />
      </CustomRoutes>
    </Admin>
  );
}
