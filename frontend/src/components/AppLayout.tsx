import { Layout, type LayoutProps } from "react-admin";
import { AppMenu } from "./AppMenu";

export const AppLayout = (props: LayoutProps) => (
  <Layout {...props} menu={AppMenu} />
);
