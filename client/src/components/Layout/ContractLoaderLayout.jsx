import { Layout } from "antd";
import React from "react";
import { Box, Center } from "@chakra-ui/react";
import OwnerLoadContract from "components/OwnerLoadContract";

import { useHistory } from "react-router-dom";
import { WrapItem, Wrap } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import HeaderNotice from "components/Notification/HeaderNotice";

export default function ContractLoaderLayout(props) {
  const { Content, Header } = Layout;
  const navigate = useHistory();

  return (
    <Layout>
      <Layout>
        <Center>
          <Content
            style={{
              marginTop: "0px",
              height: "100%",
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
                  <strong> The Buny Project:</strong> Read/Write SmartContract
                  Loader
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
                      <HeaderNotice />
                    </Center>
                  </WrapItem>
                </Wrap>
                <Wrap spacing="5px" justify="center">
                  <WrapItem>
                    <Center>
                      <Box>
                        <Link to={"/3d-nft-marketplace"}>
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
                      <OwnerLoadContract
                        contractAddress={props.contractAddress}
                      />
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
}
