import { Avalanche, Sepolia, Mumbai, Arbitrum, FantomTestnet, Optimism } from '@usedapp/core'
import { Center, WrapItem, Wrap, Box } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import raffleFactory from 'contracts/sepolia/BunyRaffleFactory.json'
import {
  FujiRaffleFactoryAddress,
  SepoliaRaffleFactoryAddress,
  TelosTestnetRaffleFactoryAddress,
  avalancheRaffleFactoryAddress,
  FantomTestnetRaffleFactoryAddress,
  TelosRaffleFactoryAddress,
  MumbaiRaffleFactoryAddress,
} from 'contracts/config/networkAddress'
import { Col, Row, Statistic } from 'antd'
import { Card, Modal } from 'antd'
import { Avatar, Button, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Telos, BSC } from 'components/UseDapp/UseDappCore'
import DynamicRaffleFactory from './DynamicRaffleFactory'

export default function MultiChainDirectory() {
  const { activateBrowserWallet, chainId, switchNetwork, account } = useEthers()
  const { Meta } = Card
  const [fujiCount, setFujiCount] = useState()
  const [ttCount, setTtCount] = useState()
  const [bscCount, setBscCount] = useState()
  const [testnetBscCount, setTestnetBscCount] = useState()
  const [avaxCount, setAvaxCount] = useState()
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
        return 'Fantom opera'
      case 4002:
        return 'Fantom'
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
  function refreshPage() {
    window.location.reload(false)
  }
  const networkName = getNetworkName(chainId)
  const [polygonCount, setPolygonCount] = useState()
  const [testnetPolygonCount, setTestnetPolygonCount] = useState()
  const [arbitrumCount, setArbitrumCount] = useState()
  const [optimismCount, setOptimismCount] = useState()
  const [telosRaffleCount, setTcount] = useState()
  const [mumbaiCount, setMumbaiCount] = useState()
  const [fantomCount, setFantomCount] = useState()
  const [fantomTestnetCount, setFantomTestnetCount] = useState()
  const [ethCount, setEthCount] = useState();
  const [sepoliaCount, setSepoliaCount] = useState();


  // check network & switch parameters
  const telosChainId = '40'
  const telosNetworkConfig = {
    chainId: '0x28',
    chainName: 'Telos Mainnet',
    nativeCurrency: {
      name: 'TLOS',
      symbol: 'TLOS',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.telos.net/evm'],
    blockExplorerUrls: ['https://teloscan.io/'],
  }

  function checkAndConnectToTelos() {
    const { account, activate, chainId, addNetwork, switchChain } = useDApp()

    if (!account) {
      // User is not connected to any wallet, show a message or prompt to connect.
      return
    }

    if (chainId !== telosChainId) {
      // User is connected to a different chain, try to switch to Telos.
      if (window.ethereum) {
        window.ethereum
          .request({
            method: 'wallet_addEthereumChain',
            params: [telosNetworkConfig],
          })
          .then(() => {
            // Chain added, switch to it.
            switchChain(telosChainId)
          })
          .catch((error) => {
            console.error(error)
            // Show an error message or prompt the user to add the network manually.
          })
      } else {
        // Metamask not detected, show an error message or prompt the user to install it.
      }
    }
  }

  async function fetchFantomTestnetRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network')
    const contract = new ethers.Contract(FantomTestnetRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setFantomTestnetCount(count.toString())
    console.log(`Checking Avalance testnet raffle count = ${count}`)
    console.log(count.toString())
  }

  async function fetchAvalancheRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')
    const contract = new ethers.Contract(avalancheRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setAvaxCount(count.toString())
    console.log(`Checking Avalance testnet raffle count = ${count}`)
    console.log(count.toString())
  }

  async function fetchFujiRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
    const contract = new ethers.Contract(FujiRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setFujiCount(count.toString())
    console.log(`Checking Avalance testnet raffle count = ${count}`)
    console.log(count.toString())
  }

  async function fetchTTRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
    const contract = new ethers.Contract(TelosTestnetRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setTtCount(count.toString())
    console.log(`Checking Telos testnet raffle count = ${count}`)
    console.log(count.toString())
  }

  async function fetchSepoliaRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
    const contract = new ethers.Contract(SepoliaRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setSepoliaCount(count.toString())
    console.log(`Checking Sepolia raffle count = ${count}`)
    console.log(count.toString())
  }


  async function fetchTelosRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')
    const contract = new ethers.Contract(TelosRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setTcount(count.toString())
    console.log(`Checking Telos raffle count = ${count}`)
    console.log(count.toString())
  }

  async function fetchMumbaiRaffleCount() {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mumbai.infura.io/v3/00eecaae285845319b8f09c7354157ef'
    )
    const contract = new ethers.Contract(MumbaiRaffleFactoryAddress, raffleFactory.abi, provider)
    const count = await contract.collectionCount()
    setMumbaiCount(count.toString())
    console.log(`Checking Mumbai raffle count = ${count}`)
    console.log(count.toString())
  }

  useEffect(() => {
    fetchFantomTestnetRaffleCount()
  }, [])

  useEffect(() => {
    fetchMumbaiRaffleCount()
  }, [])

  useEffect(() => {
    fetchTelosRaffleCount()
  }, [])

  useEffect(() => {
    fetchFujiRaffleCount()
  }, [])

  useEffect(() => {
    fetchTTRaffleCount()
  }, [])

  useEffect(() => {
    fetchAvalancheRaffleCount()
  }, [])

  useEffect(() => {
    fetchSepoliaRaffleCount()
  }, [])

  return (
    <Box bg="white" color="black" p={10}>
      <Center bg="#8f8d9b" border="8px solid #ffd7db">
        <Wrap m={6} w="auto" justify="center" maxWidth={900}>
        <WrapItem bg="#f6ccd0" w={250}>
            <Card
              hoverable
              style={{ width: '100%' }}
              bordered={false}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== Sepolia.chainId) {
                            switchNetwork(Sepolia.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === Sepolia.chainId ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button onClick={showModal} icon={<PlusOutlined />}>
                      Create
                    </Button>
                  </Center>
                </>,
              ]}>
              <Modal
                footer={null}
                headerStyle={{
                  backgroundColor: 'white',
                  color: 'black',
                }}
                bodyStyle={{
                  padding: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                }}
                style={{
                  padding: '5px',
                  top: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '2px solid blue',
                  //borderRadius: "5px",
                  width: '100%',
                  maxWidth: '390px',
                  height: 'auto',
                }}
                //title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                networkName={networkName}>
           {/*
                <div>
                  {chainId === 43113 ? (
                    <RaffleFactory refreshPage={refreshPage} networkName={networkName} />
                  ) : chainId === 43114 ? (
                    <AvalancheRaffleFactory networkName={networkName} refreshPage={refreshPage} />
                  ) : chainId === 41 ? (
                    <TelosTestnetRaffleFactory
                      handleCancel={handleCancel}
                      refreshPage={refreshPage}
                      networkName={networkName}
                    />
                  ) : chainId === 40 ? (
                    <TelosRaffleFactory
                      handleCancel={handleCancel}
                      refreshPage={refreshPage}
                      networkName={networkName}
                    />
                  ) : chainId === 56 ? (
                    <>
                      <Box bg="#fdeeb3" w="100%" p={10}>
                        <HStack bg="white">
                          <Text>Network:</Text>
                          <div>{networkName} launching soon!</div>
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
                  ) : chainId === 80001 ? (
                    <MumbaiRaffleFactory refreshPage={refreshPage} networkName={networkName} />
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
                */}
                <DynamicRaffleFactory />
              </Modal>
              <Meta
                avatar={<Avatar src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png" />}
                title="Ethereum"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={ethCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={sepoliaCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              hoverable
              style={{ width: '100%' }}
              bordered={false}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== Avalanche.chainId) {
                            switchNetwork(Avalanche.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === Avalanche.chainId ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button onClick={showModal} icon={<PlusOutlined />}>
                      Create
                    </Button>
                  </Center>
                </>,
              ]}>
              <Modal
                footer={null}
                headerStyle={{
                  backgroundColor: 'white',
                  color: 'black',
                }}
                bodyStyle={{
                  padding: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                }}
                style={{
                  padding: '5px',
                  top: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '2px solid blue',
                  //borderRadius: "5px",
                  width: '100%',
                  maxWidth: '390px',
                  height: 'auto',
                }}
                //title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                networkName={networkName}>
           {/*
                <div>
                  {chainId === 43113 ? (
                    <RaffleFactory refreshPage={refreshPage} networkName={networkName} />
                  ) : chainId === 43114 ? (
                    <AvalancheRaffleFactory networkName={networkName} refreshPage={refreshPage} />
                  ) : chainId === 41 ? (
                    <TelosTestnetRaffleFactory
                      handleCancel={handleCancel}
                      refreshPage={refreshPage}
                      networkName={networkName}
                    />
                  ) : chainId === 40 ? (
                    <TelosRaffleFactory
                      handleCancel={handleCancel}
                      refreshPage={refreshPage}
                      networkName={networkName}
                    />
                  ) : chainId === 56 ? (
                    <>
                      <Box bg="#fdeeb3" w="100%" p={10}>
                        <HStack bg="white">
                          <Text>Network:</Text>
                          <div>{networkName} launching soon!</div>
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
                  ) : chainId === 80001 ? (
                    <MumbaiRaffleFactory refreshPage={refreshPage} networkName={networkName} />
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
                */}
                <DynamicRaffleFactory />
              </Modal>
              <Meta
                avatar={<Avatar src="https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png" />}
                title="Avalanche"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={avaxCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={fujiCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              bordered={false}
              hoverable
              style={{ width: '100%' }}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== Telos.chainId) {
                            switchNetwork(Telos.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === Telos.chainId ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button
                      style={{ width: '80px', fontSize: '12px' }}
                      onClick={() => {
                        if (chainId !== Telos.chainId) {
                          switchNetwork(Telos.chainId)
                        } else {
                          showModal()
                        }
                      }}>
                      {chainId === Telos.chainId ? 'Create' : 'Connect'}
                    </Button>
                  </Center>
                </>,
              ]}>
              <Meta
                avatar={
                  <Avatar src="https://assets-global.website-files.com/60ae1fd65f7b76f18ddd0bec/61044a5f70f5bbeb24b995ea_Symbol%202%402x.png" />
                }
                title="Telos"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={telosRaffleCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={ttCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              bordered={false}
              hoverable
              style={{ width: '100%' }}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== 56) {
                            switchNetwork(56)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === 56 ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button
                      style={{ width: '80px', fontSize: '12px' }}
                      onClick={() => {
                        if (chainId !== BSC.chainId) {
                          switchNetwork(BSC.chainId)
                        } else {
                          showModal()
                        }
                      }}>
                      {chainId === BSC.chainId ? 'Create' : 'Create'}
                    </Button>
                  </Center>
                </>,
              ]}>
              <Meta
                avatar={<Avatar src="https://assets-cdn.trustwallet.com/blockchains/smartchain/info/logo.png" />}
                title="Binance (BSC)"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={bscCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={testnetBscCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              bordered={false}
              hoverable
              style={{ width: '100%' }}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== Mumbai.chainId) {
                            switchNetwork(Mumbai.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === Mumbai.chainId ? 'View' : 'Create'}
                      </Button>
                    </Tooltip>
                    <Button
                      style={{ width: '80px', fontSize: '12px' }}
                      onClick={() => {
                        if (chainId !== Mumbai.chainId) {
                          switchNetwork(Mumbai.chainId)
                        } else {
                          showModal()
                        }
                      }}>
                      {chainId === Mumbai.chainId ? 'Create' : 'Create'}
                    </Button>
                  </Center>
                </>,
              ]}>
              <Meta
                avatar={<Avatar src="https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png" />}
                title="Polygon"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={polygonCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={mumbaiCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              bordered={false}
              hoverable
              style={{ width: '100%' }}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== Arbitrum.chainId) {
                            switchNetwork(Arbitrum.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === Arbitrum.chainId ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button
                      style={{ width: '80px', fontSize: '12px' }}
                      onClick={() => {
                        if (chainId !== Arbitrum.chainId) {
                          switchNetwork(Arbitrum.chainId)
                        } else {
                          showModal()
                        }
                      }}>
                      {chainId === Arbitrum.chainId ? 'Create' : 'Create'}
                    </Button>
                  </Center>
                </>,
              ]}>
              <Meta
                avatar={<Avatar src="https://metaverse-marauders.s3.eu-west-3.amazonaws.com/arbitrum_4366c46586.svg" />}
                title="Arbitrum"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={arbitrumCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={arbitrumCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              bordered={false}
              hoverable
              style={{ width: '100%' }}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== Optimism.chainId) {
                            switchNetwork(Optimism.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === Optimism.chainId ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button onClick={showModal} icon={<PlusOutlined />}>
                      Create
                    </Button>
                  </Center>
                </>,
              ]}>
              <Meta
                avatar={<Avatar src="https://altcoinsbox.com/wp-content/uploads/2023/03/optimism-logo.jpg" />}
                title="Optimism"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={optimismCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={optimismCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
          <WrapItem bg="#f6ccd0" w={250}>
            <Card
              bordered={false}
              hoverable
              style={{ width: '100%' }}
              actions={[
                <>
                  <Center gap={16}>
                    <Tooltip title="View">
                      <Button
                        style={{ width: '80px', fontSize: '12px' }}
                        onClick={() => {
                          if (chainId !== FantomTestnet.chainId) {
                            switchNetwork(FantomTestnet.chainId)
                          }
                          window.location.href = '/buny-raffle'
                        }}>
                        {chainId === FantomTestnet.chainId ? 'View' : 'Connect'}
                      </Button>
                    </Tooltip>
                    <Button onClick={showModal} icon={<PlusOutlined />}>
                      Create
                    </Button>
                  </Center>
                </>,
              ]}>
              <Meta
                avatar={<Avatar src="https://seeklogo.com/images/F/fantom-ftm-logo-3566C53917-seeklogo.com.png" />}
                title="Fantom"
                description={[
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Mainnet"
                            value={fantomCount}
                            precision={0}
                            valueStyle={{
                              color: '#3f8600',
                              textAlign: 'center',
                            }}

                            //suffix="%"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} bodyStyle={{padding:'2px'}}>
                          <Statistic
                            title="Testnet"
                            value={fantomTestnetCount}
                            precision={0}
                            valueStyle={{
                              color: '#cf1322',
                              textAlign: 'center',
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </>,
                ]}
              />
            </Card>
          </WrapItem>
        </Wrap>
      </Center>
    </Box>
  )
}
