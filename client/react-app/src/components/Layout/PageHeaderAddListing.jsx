import bunyLogo from "./bunyLogo.svg";
import { PageHeader, Row, Typography } from "antd";
import React from "react";

const { Paragraph } = Typography;

const content = (
  <div style={{ color: "white" }}>
    <Paragraph>
      This dApp is currently being built on the Avalanche Fuji testnet.
    </Paragraph>
    <Paragraph>Web3 email login on 'Account' menu:</Paragraph>
  </div>
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

const PageHeaderAddListing = () => (
  <PageHeader
    title="Mint & List NFT"
    className="site-page-header"
    //subTitle="This is a subtitle"
    tags={[]}
    extra={[]}
    //    avatar={{
    //src: 'https://buny.us-southeast-1.linodeobjects.com/buny_logo_adobe_express.svg',
    //  }}
  >
    <Content extraContent={<img src={bunyLogo} alt="content" width="125px" />}>
      {content}
    </Content>
  </PageHeader>
);

export default PageHeaderAddListing;
