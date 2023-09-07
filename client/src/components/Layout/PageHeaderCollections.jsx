import bunyLogo from "./bunyLogo.svg";
import {
  MoreOutlined,
  WalletTwoTone,
  FunnelPlotTwoTone,
  InteractionTwoTone,
} from "@ant-design/icons";
import avaxLogo from "../icons/avaxLogo.svg";
import { Button, Dropdown, Menu, PageHeader, Row, Tag, Typography } from "antd";
import React from "react";
import { Center } from "@chakra-ui/react";

const { Paragraph } = Typography;
const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.alipay.com/"
          >
            1st menu item
          </a>
        ),
      },
      {
        key: "2",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.taobao.com/"
          >
            2nd menu item
          </a>
        ),
      },
      {
        key: "3",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        ),
      },
    ]}
  />
);

const DropdownMenu = () => (
  <Dropdown key="more" overlay={menu} placement="bottomRight">
    <Button
      type="text"
      icon={
        <MoreOutlined
          style={{
            fontSize: 20,
          }}
        />
      }
    />
  </Dropdown>
);

const content = (
  <>
    <Paragraph>
      This dApp is currently being built on the Avalanche Fuji testnet.
    </Paragraph>
    <Paragraph>
      Sign in or register using email or connect using MetaMask browser wallet.
    </Paragraph>
    <Paragraph>
      Email registration auto generates Avalanche wallet address
    </Paragraph>
    <Paragraph>Network settings available in 'Account' menu.</Paragraph>
  </>
);

const Content = ({ children, extraContent }) => (
  <Row>
    <div
      style={{
        flex: 1,
      }}
    >
      {children}
    </div>
    <div className="image">{extraContent}</div>
  </Row>
);

const PageHeaderCollections = () => (
  <PageHeader
    title="NFT Collections"
    className="site-page-header"
    //subTitle="This is a subtitle"

    extra={
      [
        //<Button key="1">Add Network</Button>,
        //<DropdownMenu key="more" />,
      ]
    }
    //    avatar={{
    //src: 'https://buny.us-southeast-1.linodeobjects.com/buny_logo_adobe_express.svg',
    //  }}
  >
    <Content extraContent={<img src={bunyLogo} alt="content" width="50px" />}>
      {content}
    </Content>
  </PageHeader>
);

export default PageHeaderCollections;
