import { Layout } from "antd";
import React from "react";
import { Box, Link, Center, HStack } from "@chakra-ui/react";
import { WrapItem, Wrap } from "@chakra-ui/react";
import { Typography } from "antd";
import { useHistory } from "react-router-dom";
import TestnetNotice from "components/Notification/HashboxNotice";
import { Button } from "antd";
import {
  ReloadOutlined,
  ControlOutlined,
  RollbackOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import IpfsTabBar from "components/Ipfs/IpfsTabBar";

const { Content, Header, Sider } = Layout;

const { Paragraph } = Typography;

function IpfsLayout() {
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
                  <strong> The Buny Project:</strong> Raffle Directory
                </p>
              </Header>

              <Content
                style={{
                  backgroundColor: "#f6ccd0",
                  width: "100%",
                }}
              >
                <Wrap spacing="px" justify="center">
                  <WrapItem>
                    <Center>
                      <TestnetNotice />
                    </Center>
                  </WrapItem>
                </Wrap>
                <Wrap spacing="5px" justify="center">
                  <WrapItem>
                    <Center>
                      <HStack gap="10px" mt={20}>
                        <div style={{ fontSize: "11px" }}>
                          <Button
                            onClick={() => navigate.goBack()}
                            size="small"
                            icon={<RollbackOutlined />}
                          >
                            {" "}
                            Back{" "}
                          </Button>
                        </div>
                        <div style={{ fontSize: "11px" }}>
                          <Button
                            size="small"
                            href="/dashboard"
                            icon={<ControlOutlined />}
                          >
                            Home
                          </Button>
                        </div>

                        <div style={{ fontSize: "11px" }}>
                          <Button
                            size="small"
                            onClick={refreshPage}
                            icon={<ReloadOutlined />}
                          >
                            Reload
                          </Button>
                        </div>
                      </HStack>
                    </Center>
                  </WrapItem>
                </Wrap>

                <Center bg="#bbdccb" m={20}>
                  <IpfsTabBar />
                </Center>
              </Content>
            </Layout>
          </Content>
        </Center>
      </Layout>
    </Layout>
  );
}
export default IpfsLayout;
