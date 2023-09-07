import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import {
  FileAddOutlined,
  RightOutlined,
  ShoppingOutlined,
  FundViewOutlined,
  QuestionCircleOutlined,
  MonitorOutlined,
  FolderAddOutlined,
  MessageOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import OwnerLoadContract from "components/OwnerLoadContract";

const { Header, Content, Footer, Sider } = Layout;

export default function HelpContractLoader() {
  const onChange = (key) => {
    console.log(key);
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem(<Link>Help</Link>, "1", <UserOutlined />),
    getItem(
      <Link to={"/help/loader"}>Contract Loader</Link>,
      "2",
      <ShoppingOutlined />,
    ),
    getItem(<Link>Network</Link>, "3", <FileAddOutlined />),
  ];

  const onClick = (e) => {
    console.log("click ", e);
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "transparent" }} />
        <Content style={{ margin: "4px 16px 0" }}>
          <div
            style={{ padding: 24, minHeight: 360, background: "transparent" }}
          >
            Contract Loader
          </div>
          <OwnerLoadContract />
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}
