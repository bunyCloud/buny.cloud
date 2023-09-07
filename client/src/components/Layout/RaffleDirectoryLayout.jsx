import { Button, Image, Layout, Modal } from 'antd'
import React, { useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Center, WrapItem, Wrap, VStack, Text, Box } from '@chakra-ui/react'
import { HStack } from '@chakra-ui/react'
import RaffleDirectory from './../BunyRaffle/RaffleDirectory'
import AvalancheRaffleDirectory from './../BunyRaffle/Avalanche/AvalancheRaffleDirectory'
import TelosTestnetRaffleDirectory from './../BunyRaffle/Telos/TelosTestnetRaffleDirectory'
import { ReloadOutlined, ControlOutlined, RollbackOutlined, PlusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import ConnectButton from 'components/UseDapp/ConnectButton'
import TelosRaffleDirectory from './../BunyRaffle/Telos/TelosRaffleDirectory'
import MumbaiRaffleDirectory from 'components/BunyRaffle/Polygon/MumbaiRaffleDirectory'
import FantomTestnetRaffleDirectory from 'components/BunyRaffle/Fantom/FantomTestnetRaffleDirectory'
import DynamicRaffleFactory from 'components/BunyRaffle/DynamicRaffleFactory'
import SepoliaRaffleDirectory from 'components/BunyRaffle/Sepolia/SepoliaRaffleDirectory'

const { Content } = Layout
const { Header } = Layout

export default function RaffleDirectoryLayout() {
  const { activateBrowserWallet, chainId, switchNetwork, account } = useEthers()

  function getNetworkName(chainId) {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet'
      case 3:
        return 'Ropsten Testnet'
      case 11155111:
        return 'Sepolia Testnet'
      case 5:
        return 'Goerli Testnet'
      case 40:
        return 'Telos Mainnet'
      case 41:
        return 'Telos Testnet'
      case 42:
        return 'Kovan Testnet'
      case 56:
        return 'Binance Smart Chain Mainnet'
      case 77:
        return 'POA Network Sokol'
      case 97:
        return 'Binance Smart Chain Testnet'
      case 99:
        return 'POA Network Core'
      case 128:
        return 'Huobi ECO Chain Mainnet'
      case 137:
        return 'Polygon Network'
      case 246:
        return 'Energy Web Chain'
      case 250:
        return 'Fantom Opera'
      case 4002:
        return 'Fantom Testnet'
      case 42220:
        return 'Celo Mainnet'
      case 42161:
        return 'Arbitrum One'
      case 43114:
        return 'Avalanche'
      case 43113:
        return 'Fuji Testnet'
      case 44787:
        return 'Edgeware Mainnet'
      case 4689:
        return 'xDai Chain'
      case 1666600000:
        return 'Harmony Mainnet'
      case 1666600001:
        return 'Harmony Testnet'
      case 1666600002:
        return 'Harmony Pangolin Testnet'
      case 31337:
        return 'Localhost 8545'
      case 43113:
        return 'Fuji Testnet'
      case 43112:
        return 'Near Mainnet'
      case 80001:
        return 'Mumbai Testnet'
      case 1666700000:
        return 'Moonbeam Mainnet'
      case 1666700001:
        return 'Moonbase Alpha Testnet'

      default:
        return 'Unknown network'
    }
  }

  const networkName = getNetworkName(chainId)

  const [trigger, setTrigger] = useState(0)
  const navigate = useHistory()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  function refreshPage() {
    setTimeout(() => {
      window.location.reload()
    }, 2000) // 5000 milliseconds = 5 seconds
  }

  return (
    <Layout>
      <Layout>
        <Center>
          <Content
            style={{
              minHeight: '800px',
              backgroundColor: 'black',
            }}>
            <Layout>
              <Header
                style={{
                  backgroundColor: 'black',
                  textAlign: 'center',
                  width: '100%',
                  //                  height: "50px",
                }}>
                <Center>
                  <Image width={300} src="https://buny.us-southeast-1.linodeobjects.com/TheBunyProject-white.png" />
                </Center>
              </Header>

              <Content
                style={{
                  backgroundColor: '#f6ccd0',
                  width: '100%',
                }}>
                <Wrap spacing="5px" justify="center">
                  <WrapItem>
                    <Center>
                      <VStack mt={2} mb={2}>
                        <HStack gap="0px">
                          <div style={{ fontSize: '11px' }}>
                            <Button onClick={() => navigate.goBack()} size="large" icon={<RollbackOutlined />}>
                              {' '}
                              Back{' '}
                            </Button>
                          </div>
                          <div style={{ fontSize: '11px' }}>
                            <Button size="large" href="/" icon={<ControlOutlined />}>
                              Home
                            </Button>
                          </div>
                          <div style={{ fontSize: '11px' }}>
                            <Button size="large" onClick={showModal} icon={<PlusOutlined />}>
                              Add
                            </Button>

                            <Modal
                              footer={null}
                              headerStyle={{
                                backgroundColor: 'white',
                                color: 'black',
                              }}
                              bodyStyle={{
                                padding: '6px',
                                backgroundColor: '#fefce2',
                                color: 'black',
                              }}
                              style={{
                                padding: '5px',
                                top: '2px',
                                backgroundColor: '#fefce2',
                                color: 'black',
                                border: '4px solid #9dcfb4',
                                //borderRadius: "5px",
                                width: '100%',
                                maxWidth: '350px',
                                height: 'auto',
                              }}
                              //title="Basic Modal"
                              open={isModalOpen}
                              onOk={handleOk}
                              onCancel={handleCancel}
                              networkName={networkName}>
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

                          <div style={{ fontSize: '11px' }}>
                            <Button size="large" onClick={refreshPage} icon={<ReloadOutlined />}>
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
                      <div>
                        {chainId === 43113 ? (
                          <RaffleDirectory trigger={trigger} />
                        ) : chainId === 11155111 ? (
                          <SepoliaRaffleDirectory chainId={chainId} account={account} trigger={trigger} />
                        ) : chainId === 43114 ? (
                          <AvalancheRaffleDirectory trigger={trigger} />
                        ) : chainId === 41 ? (
                          <TelosTestnetRaffleDirectory trigger={trigger} />
                        ) : chainId === 40 ? (
                          <TelosRaffleDirectory trigger={trigger} />
                        ) : chainId === 4002 ? (
                          <FantomTestnetRaffleDirectory trigger={trigger} />
                        ) : chainId === 80001 ? (
                          <MumbaiRaffleDirectory trigger={trigger} />
                        ) : (
                          <>
                            <Box bg="#fdeeb3" w="100%" p={10}>
                              <HStack bg="white">
                                <Text>Blockchain:</Text>
                                <div>{networkName} not yet supported.</div>
                              </HStack>
                              <Center>
                                <Box p={20} m={5}>
                                  <Text>Please switch networks and try again...</Text>
                                </Box>
                              </Center>
                              <Center>
                                <Box>
                                  <ConnectButton />
                                </Box>
                              </Center>
                              <Text>Submit network add request to TheBunyProject@gmail.com</Text>
                            </Box>
                          </>
                        )}
                      </div>
                    </WrapItem>
                  </Wrap>
                </Center>
              </Content>
            </Layout>
          </Content>
        </Center>
      </Layout>
    </Layout>
  )
}
