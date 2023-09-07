import { Button, Image, Layout, Modal } from "antd";
import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { Center, WrapItem, Wrap, Text, Box, VStack } from "@chakra-ui/react";
import RaffleFactory from "components/BunyRaffle/RaffleFactory";
import TelosTestnetRaffleFactory from "components/BunyRaffle/Telos/TelosTestnetRaffleFactory";
import { HStack } from "@chakra-ui/react";
import {
  ReloadOutlined,
  ControlOutlined,
  RollbackOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import ConnectButton from "components/UseDapp/ConnectButton";
import AvalancheRaffleFactory from "components/BunyRaffle/Avalanche/AvalancheRaffleFactory";
import MultiChainDirectory from "components/BunyRaffle/MultiChainDirectory";
import FantomTestnetRaffleFactory from "components/BunyRaffle/Fantom/FantomTestnetRaffleFactory";

const { Content } = Layout;
const { Header } = Layout;

export default function MultiChainDirectoryLayout() {
  const { activateBrowserWallet, chainId,  account } =
    useEthers();

  function getNetworkName(chainId) {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 3:
        return "Ropsten Testnet";
      case 4:
        return "Rinkeby Testnet";
      case 5:
        return "Goerli Testnet";
      case 40:
        return "Telos Mainnet";
      case 41:
        return "Telos Testnet";
          case 56:
        return "Binance Smart Chain Mainnet";
    
      case 97:
        return "Binance Smart Chain Testnet";
      case 99:
        return "POA Network Core";
      case 128:
        return "Huobi ECO Chain Mainnet";
      case 137:
        return "Polygon Network";
            case 42220:
        return "Celo Mainnet";
      case 42161:
        return "Arbitrum One";
      case 43114:
        return "Avalanche";
      case 43113:
        return "Fuji Testnet";
      
      case 4689:
        return "xDai Chain";
      case 43113:
        return "Fuji Testnet";
      case 43112:
        return "Near Mainnet";
      case 80001:
        return "Mumbai Testnet";
      
      default:
        return "Unknown network";
    }
  }
  const networkName = getNetworkName(chainId);
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

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <Layout>
    <Layout>
      <Center>
        <Content
          style={{
            minHeight: "1000px",
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
                            padding: "5px",
                            backgroundColor: "white",
                            color: "black",
                          }}
                          style={{
                            padding: "5px",
                            top: "5px",
                            backgroundColor: "white",
                            color: "black",
                            border: "2px solid blue",
                            //borderRadius: "5px",
                            width: "100%",
                            maxWidth: "390px",
                            height: "auto",
                          }}
                          //title="Basic Modal"
                          open={isModalOpen}
                          onOk={handleOk}
                          onCancel={handleCancel}
                          networkName={networkName}
                        >
                          <div>
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


              <Center w="100%" bg="#a6bbc0" border="0px solid #fdeeb3">
                <Wrap m={4}>
                  <WrapItem bg="white">
                  <MultiChainDirectory />
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
