import { useHistory } from "react-router-dom";
import { Button, Layout } from "antd";
import React, { useState } from "react";
import { VStack } from "@chakra-ui/react";
import { Center, WrapItem, Wrap, Box, HStack } from "@chakra-ui/react";
import {
  ReloadOutlined,
  ControlOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
//import ListNftTabs from "components/Nfts/ListNftTabs";
import { Link } from "react-router-dom";
import NftPuller from "utils/nftpuller";

const { Content } = Layout;
const { Header } = Layout;

function AvatarCollectionLayout() {
  const navigate = useHistory();

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <Layout>
      <Layout>
        <Center>
          <Content
            style={{
              marginTop: "0px",
              minHeight: "800px",
              backgroundColor: "#feefd0",
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
                  <strong> The Buny Project:</strong> Avatar Collection
                </p>
              </Header>

              <Content
                style={{
                  backgroundColor: "#0047a8",
                  width: "100%",
                }}
              >
                <Wrap spacing="10px" justify="center">
                  <WrapItem>
                    <Center p={2}>
                      <Box
                        w={375}
                        bg="black"
                        color="white"
                        p={10}
                        fontSize="12px"
                      >
                        <Center>
                          <HStack gap="40px" mt={20}>
                            <div style={{ fontSize: "11px" }}>
                              <Button
                                onClick={() => navigate.goBack()}
                                size="small"
                                icon={<RollbackOutlined />}
                              />
                              <Link>
                                <p>Back</p>
                              </Link>
                            </div>
                            <div style={{ fontSize: "11px" }}>
                              <Link to="/dashboard">
                                <Button
                                  size="small"
                                  icon={<ControlOutlined />}
                                />
                                <p>Home</p>
                              </Link>
                            </div>

                            <div style={{ fontSize: "11px" }}>
                              <Button
                                size="small"
                                onClick={refreshPage}
                                icon={<ReloadOutlined />}
                              />
                              <div
                                onClick={refreshPage}
                                style={{ textAlign: "center" }}
                              >
                                <Link>Reload</Link>
                              </div>
                            </div>
                          </HStack>
                        </Center>
                      </Box>
                    </Center>
                  </WrapItem>
                </Wrap>

                <Center w="100%" p={0} bg="rgb(229 231 235)" display="flex">
                  <VStack>
                    <Center>
                      <Box>
                        <NftPuller />
                      </Box>
                    </Center>
                  </VStack>
                </Center>
              </Content>
            </Layout>
          </Content>
        </Center>
      </Layout>
    </Layout>
  );
}

export default AvatarCollectionLayout;
