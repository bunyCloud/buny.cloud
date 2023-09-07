import { Typography, Layout } from "antd";
import React from "react";
import { Center, Box, WrapItem, Wrap } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import AvatarPage from "./AvatarPage";

const { Content } = Layout;
const { Header, Footer } = Layout;
const { Paragraph } = Typography;

const AvatarPageLayout = (props) => (
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
            <Header
              style={{
                backgroundColor: "black",
                textAlign: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <p style={{ fontSize: "14px", color: "white" }}>
                <strong> The Buny Project:</strong> Avatars
              </p>
            </Header>

            <Content
              style={{
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <Wrap spacing="px" justify="center">
                <WrapItem>
                  <Center>
                    <p style={{ fontSize: "12px" }}>
                      Dapp in beta and should be considered experimental.
                    </p>
                  </Center>
                </WrapItem>
              </Wrap>
              <Wrap spacing="5px" justify="center">
                <WrapItem>
                  <Center>
                    <Box>
                      <Link to={"/nft-marketplace"}>
                        <ArrowBackIcon />
                        Back
                      </Link>
                    </Box>
                  </Center>
                </WrapItem>
              </Wrap>
              <Center w="100%" p={1} bg="black">
                <Wrap>
                  <WrapItem>
                    <AvatarPage />
                  </WrapItem>
                </Wrap>
              </Center>
            </Content>
          </Layout>
        </Content>
      </Center>
    </Layout>
  </Layout>
);

export default AvatarPageLayout;
