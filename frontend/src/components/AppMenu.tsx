import AssessmentIcon from "@mui/icons-material/Assessment";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Menu } from "react-admin";

export const AppMenu = () => (
  <Menu>
    <Menu.Item
      to="/archive-records"
      primaryText="Records"
      leftIcon={<ListIcon />}
    />

    <Menu.Item to="/" primaryText="Dashboard" leftIcon={<BarChartIcon />} />
    <Menu.Item
      to="/results"
      primaryText="Results"
      leftIcon={<AssessmentIcon />}
    />
    <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />} />
    <Menu.Item
      to="/archive/import"
      primaryText="Import"
      leftIcon={<UploadFileIcon />}
    />
  </Menu>
);
