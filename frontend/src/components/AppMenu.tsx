import BarChartIcon from "@mui/icons-material/BarChart";
import ListIcon from "@mui/icons-material/List";
import { Menu } from "react-admin";

export const AppMenu = () => (
  <Menu>
    <Menu.Item
      to="/archive-records"
      primaryText="Records"
      leftIcon={<ListIcon />}
    />

    <Menu.Item to="/" primaryText="Dashboard" leftIcon={<BarChartIcon />} />
    <Menu.Item to="/results" primaryText="Results" leftIcon={<ListIcon />} />
  </Menu>
);
