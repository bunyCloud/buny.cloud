import { Layout } from "antd";
import React from "react";
import { Center } from "@chakra-ui/react";
import { Typography } from "antd";
import ListNftForm from "components/Nfts/ListNftForm";

const { Content, Header, Sider } = Layout;

const { Paragraph } = Typography;

function handleClick(e) {
  console.log("click", e);
}

const CreateMarketNFTLayout = () => (
  <Layout>
    {/*
    <Sider
      style={{ backgroundColor: "black", marginTop: "15px", zIndex: "1" }}
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <SideMenu />
    </Sider>
    */}
    <Layout>
      <Center>
        <Content
          style={{
            marginTop: "0px",
            minHeight: "800px",
            backgroundColor: "black",
          }}
        >
          <Layout>
            <Header style={{ backgroundColor: "black" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <strong>The Buny Project:</strong> Create NFT
              </p>
            </Header>

            <Content
              style={{
                backgroundColor: "black",
                color: "white",
                width: "100%",
              }}
            >
              <Center>
                <ListNftForm />
              </Center>
            </Content>
          </Layout>
        </Content>
      </Center>
    </Layout>
  </Layout>
);

export default CreateMarketNFTLayout;
