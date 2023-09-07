import { useHistory } from "react-router-dom";
import { Button, Layout, Modal, Typography } from "antd";
import React, { useState } from "react";
import { Center, WrapItem, Wrap, Box, HStack } from "@chakra-ui/react";
import All3DNfts from "components/Nfts/All3DNfts";
import {
  ReloadOutlined,
  ControlOutlined,
  RollbackOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
//import ListNftTabs from "components/Nfts/ListNftTabs";
import ListNftForm from "./../Nfts/ListNftForm";
import { Link } from "react-router-dom";
const { Content } = Layout;
const { Header } = Layout;

function Market3DLayout() {
  const [trigger, setTrigger] = useState(0);
  const navigate = useHistory();
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

<ListNftForm />
                          </Modal>
                        </div>

                        <div style={{ fontSize: "11px" }}>
                          <Button
                            size="large"
                            onClick={() =>
                                  setTrigger((trigger) => trigger + 1)
                                }
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
                      <All3DNfts trigger={trigger} />
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

export default Market3DLayout;
