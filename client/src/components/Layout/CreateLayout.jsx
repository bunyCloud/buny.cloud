import { Layout } from "antd";
import React from "react";
import Create from "components/Create";
import { Center } from "@chakra-ui/react";

const { Content, Header } = Layout;

const ListingLayout = () => (
  <Layout>
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
                <Create />
              </Center>
            </Content>
          </Layout>
        </Content>
      </Center>
    </Layout>
  </Layout>
);
export default ListingLayout;
