import { Center, WrapItem, Wrap, VStack } from "@chakra-ui/react";
import { Typography } from "antd";
import RafflePage from "./RafflePage";
import { Button, Layout,Image, Modal } from "antd";
import React, { useState } from "react";
import { HStack } from "@chakra-ui/react";
import {
  ReloadOutlined,
  ControlOutlined,
  RollbackOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import DynamicRaffleFactory from 'components/BunyRaffle/DynamicRaffleFactory'


const { Content } = Layout;
const { Header } = Layout;
const { Paragraph } = Typography;

export default function RafflePageLayout({networkName}) {
  const navigate = useHistory();
  const { chainId } = useEthers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <Layout>
      <Layout>
        <Center>
          <Content
            style={{
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
//                  height: "50px",
                }}
              >
                <Center>
                  <Image width={300} src="https://buny.us-southeast-1.linodeobjects.com/TheBunyProject-white.png"/>
                </Center>
              </Header>

              <Content
                style={{
                  backgroundColor: "#f6ccd0",
                  width: "100%",
                }}
              >
           <Wrap spacing="5px" justify="center">
                  <WrapItem>
                    <Center>
                  <VStack mt={2} mb={2}>
    
                
                      <HStack gap="0px" >
                        <div style={{ fontSize: "11px" }}>
                          <Button
                            onClick={() => navigate.goBack()}
                            size="large"
                            icon={<RollbackOutlined />}
                          >
                            {" "}
                            Back{" "}
                          </Button>
                        </div>
                        <div style={{ fontSize: "11px" }}>
                          <Button
                            size="large"
                            href="/"
                            icon={<ControlOutlined />}
                          >
                            Home
                          </Button>
                        </div>
                        <div style={{ fontSize: "11px" }}>
                          <Button
                            size="large"
                            onClick={showModal}
                            icon={<PlusOutlined />}
                          >
                            Add
                          </Button>

                          <Modal
                            footer={null}
                            headerStyle={{
                              backgroundColor: "white",
                              color: "black",
                            }}
                            bodyStyle={{
                              padding: "6px",
                              backgroundColor: "#fefce2",
                              color: "black",
                            }}
                            style={{
                              padding: "5px",
                              top: "2px",
                              backgroundColor: "#fefce2",
                              color: "black",
                              border: "4px solid #9dcfb4",
                              //borderRadius: "5px",
                              width: "100%",
                              maxWidth: "350px",
                              height: "auto",
                            }}
                            //title="Basic Modal"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            networkName={networkName}
                          >
                          {/*  <div>
                              {chainId === 43113 ? (
                                <RaffleFactory
                                  refreshPage={refreshPage}
                                  networkName={networkName}
                                />
                              ) : chainId === 43114 ? (
                                <AvalancheRaffleFactory
                                  networkName={networkName}
                                  refreshPage={refreshPage}
                                />
                              ): chainId === 80001 ? (
                                <MumbaiRaffleFactory
                                  networkName={networkName}
                                  refreshPage={refreshPage}
                                />
                              ) : chainId === 4002 ? (
                                <FantomTestnetRaffleFactory
                                  networkName={networkName}
                                  refreshPage={refreshPage}
                                />
                              )
                               : chainId === 41 ? (
                                <TelosTestnetRaffleFactory
                                  handleCancel={handleCancel}
                                  refreshPage={refreshPage}
                                  networkName={networkName}
                                />
                              ) : (
                                <>
                                  <Box bg="#fdeeb3" w="100%" p={10}>
                                    <HStack bg="white">
                                      <Text>Blockchain:</Text>
                                      <div>
                                        {networkName} not yet supported.
                                      </div>
                                    </HStack>
                                    <Center>
                                      <Box p={20} m={5}>
                                        <Text>
                                          Please switch networks and try
                                          again...
                                        </Text>
                                      </Box>
                                    </Center>
                                    <Center>
                                      <Box>
                                        <ConnectButton />
                                      </Box>
                                    </Center>
                                    <Text>
                                      Submit network add request to
                                      TheBunyProject@gmail.com
                                    </Text>
                                  </Box>
                                </>
                              )}
                            </div>
                            */}
                            <DynamicRaffleFactory networkName={networkName} />
                          </Modal>
                        </div>

                        <div style={{ fontSize: "11px" }}>
                          <Button
                            size="large"
                            onClick={refreshPage}
                            icon={<ReloadOutlined />}
                          >
                            Reload
                          </Button>
                        </div>
                      </HStack>
                      </VStack>
                    </Center>
                  </WrapItem>
                </Wrap>



                <Center w="auto" bg="#8f8d9b" border="0px solid #fe9d97">
                  <Wrap m={15}>
                    <WrapItem>
                      <RafflePage refreshPage={refreshPage} />
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
