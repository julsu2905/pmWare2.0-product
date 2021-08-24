import { Layout } from "antd";
import SideBar from "./SideBar";
const { Header, Footer, Sider, Content } = Layout;
const Template = ({ children }) => {
  return (
    <Layout style={{ padding: "auto 20" }}>
      <Sider>
        <SideBar />
      </Sider>
      <Layout>
        <Content>{children}</Content>
        <Footer> Copyright © Project Manager Software 2021.</Footer>
      </Layout>
    </Layout>
  );
};
export default Template;
