import { Heading, HStack, Button, Wrap, Text, WrapItem } from '@chakra-ui/react'
import { Layout } from 'antd'
import { Box, Center } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import BunyBankInterface from './BunyBankInterface'
import { ReloadOutlined, ControlOutlined, RollbackOutlined } from '@ant-design/icons'
import { TelosBunyBankAddress } from 'contracts/config/networkAddress'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import BunyBankTelos from 'contracts/telosTestnet/BunyBankTelos.json'
import { useClipboard, IconButton } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { List } from 'antd';
import { Tag, Tabs } from 'antd-mobile'


const { Sider } = Layout
const { Content, Footer } = Layout
const { Header } = Layout

const styles = {
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    WebkitBoxPack: 'center',
    justifyContent: 'center',
    //margin: "10px auto",
    width: '100%',
    backgroundColor: 'black',
  },
}

function BunyBankApp() {
  const { activateBrowserWallet, chainId, switchNetwork, account } = useEthers()
  const { onCopy, value, setValue, hasCopied } = useClipboard(TelosBunyBankAddress)
  const [depositEvents, setDepositEvents] = useState([]);

  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')

  const [contractBalance, setBalance] = useState('')
const [withdrawEvents, setWithdrawEvents] = useState([]);
  function refreshPage() {
    window.location.reload(false)
  }


  async function getContractBalance() {
    const contract = new ethers.Contract(TelosBunyBankAddress, BunyBankTelos.abi, provider)
    const balance = await contract.getBalance()
    setBalance(ethers.utils.formatEther(balance).toString())
  }

  const getDepositEvents = async () => {
    const contract = new ethers.Contract(TelosBunyBankAddress, BunyBankTelos.abi, provider);
      // Fetch past events
      const events = await contract.queryFilter('Deposit', 0, -3).then((results) => {
        const pastEvents = results.map((result) => {
          return {
            event: result.event,
            data: result.args,
            key: result.blockNumber + result.logIndex,
          }

        }
        )
        console.log(pastEvents);
        setDepositEvents(pastEvents)

      })
  
    
  };

  const getWithdrawEvents = async () => {
    const contract = new ethers.Contract(TelosBunyBankAddress, BunyBankTelos.abi, provider);
      // Fetch past events
      const events = await contract.queryFilter('Withdrawal', 0, -3).then((results) => {
        const pastEvents = results.map((result) => {
          return {
            event: result.event,
            data: result.args,
            key: result.blockNumber + result.logIndex,
          }

        }
        )
        console.log(pastEvents);
        setWithdrawEvents(pastEvents)

      })
  
    
  };

  useEffect(() => {
    getDepositEvents();
    getWithdrawEvents();
    getContractBalance();
    //getOwner1Balance();
    //getOwner2Balance();
  }, []);
  //const formatBalance =
  return (
    <>
      <Layout style={{}}>
        <Center>
          <Content
            style={{
              height: 'auto',
              backgroundColor: 'black',
            }}>
            <Layout>
              <Header style={{ backgroundColor: 'black' }}>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  <strong>The Buny Project:</strong> Buny Bank
                </p>
              </Header>

              <Center>
                <Content
                  style={{
                    backgroundColor: '#f6ccd0',
                    width: 'auto',
                  }}>
    
                  <Wrap spacing="5px" justify="center">
                    <WrapItem>
                      <Center>
                        <HStack gap="10px" mt={20}>
                          <div style={{ fontSize: '11px' }}>
                            <Button onClick={() => navigate.goBack()} size="small" icon={<RollbackOutlined />}>
                              {' '}
                              Back{' '}
                            </Button>
                          </div>
                          <div style={{ fontSize: '11px' }}>
                            <Button size="small" href="/dashboard" icon={<ControlOutlined />}>
                              Home
                            </Button>
                          </div>

                          <div style={{ fontSize: '11px' }}>
                            <Button size="small" onClick={refreshPage} icon={<ReloadOutlined />}>
                              Reload
                            </Button>
                          </div>
                        </HStack>
                      </Center>
                    </WrapItem>
                  </Wrap>

                  <Center w="auto" bg="#b4dde3" border="0px solid #fe9d97">
                    <Wrap m={5} >
                      <WrapItem justify="center" maxWidth={300}>
                        <Box bg="white" w="100%" p={15} h="400px" mb={15}>
                          <BunyBankInterface />
                        </Box>
                      </WrapItem>
                      <WrapItem w={'auto'} maxWidth={375}>
                        <Box bg="#b4dde3" w="100%" maxWidth="350px" h="100%">
                          <Box w="auto" p={10} bg="white" h="40px" border="2px solid #bbdccb" m={2}>
                            <HStack>
                              <Heading as="h6">Bank</Heading>
                              <Text fontSize="12px">
                                <HStack>
                                  <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                                    {TelosBunyBankAddress &&
                                      `${TelosBunyBankAddress.slice(0, 18)}...${TelosBunyBankAddress.slice(
                                        TelosBunyBankAddress.length - 18,
                                        TelosBunyBankAddress.length
                                      )}`}
                                  </div>
                                  <IconButton
                                  style={{marginBottom:'10px'}}
                                    onClick={onCopy}
                                    variant="outline"
                                    colorScheme="teal"
                                    aria-label="Copy to clipboard"
                                    icon={<CopyIcon />}>
                                    {hasCopied ? 'Copied!' : 'Copy'}
                                  </IconButton>
                                </HStack>
                              </Text>
                            </HStack>
                          </Box>
                          <Box w="auto" p={10} bg="white" h="40px" border="2px solid #bbdccb" m={2}>
                            <HStack>
                              <Heading as="h6">Balance</Heading>
                              <div
                              style={{
                                marginBottom:'8px',
                              }}
                              >{contractBalance} /TLOS</div>
                            </HStack>
                          </Box>
                          <Box w="auto" p={4} bg="white" h="100%" border="2px solid #bbdccb" m={2}>
                            <Heading as="h6">Events</Heading>
                            <Tabs>
          <Tabs.Tab title='Deposits' key='deposit'>
          <Box>
                            <Text fontSize="12px">Most recent deposit events.</Text>
                            <List
                              itemLayout="vertical"
              grid={{
                gutter: 6,
                xs: 1,
                sm: 1,
                column: 1,
              }}
    itemLayout="vertical"
    dataSource={depositEvents}
    renderItem={(item, index) => (
      <List.Item
      style={{
                      border: "4px solid #bbdccb",
                      width: "370px",
                      backgroundColor: "white",
                      //width: '100%',
                      //maxWidth: '385px',
                      padding: "2px",
                      display: "flex",
                    }}
      >
        <List.Item.Meta
     //     avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
          title={<div style={{marginBottom:'-10px',fontSize:'12px'}}>Deposit: {(ethers.utils.formatEther(item.data[1].toString()))}/ TLOS</div>}
          description={
            <>
              <div style={{fontSize:'12px', marginBottom:'-10px'}}>
              <HStack>
              <Tag style={{marginRight:'2px'}}>
              Depositor:</Tag>
              <a href={`https://testnet.teloscan.io/address/${item.data[0]}/`}>
              <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                                    {item.data[0] &&
                                      `${item.data[0].slice(0, 16)}...${item.data[0].slice(
                                        item.data[0].length - 16,
                                        item.data[0].length
                                      )}`}
                                  </div>
              </a>
              </HStack>
              </div>
             
            </>
          }
        />
      </List.Item>
    )}
  />
    </Box>
          </Tabs.Tab>
          <Tabs.Tab title='Withdrawals' key='withdrawals'>
          <Box>
                            <Text fontSize="12px">Most recent deposit events.</Text>
                            <List
                              itemLayout="vertical"
              grid={{
                gutter: 6,
                xs: 1,
                sm: 1,
                column: 1,
              }}
    itemLayout="vertical"
    dataSource={withdrawEvents}
    renderItem={(item, index) => (
      <List.Item
      style={{
                      border: "4px solid #bbdccb",
                      width: "370px",
                      backgroundColor: "white",
                      //width: '100%',
                      //maxWidth: '385px',
                      padding: "2px",
                      display: "flex",
                    }}
      >
        <List.Item.Meta
     //     avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
          title={<div style={{marginBottom:'-10px',fontSize:'12px'}}>Withdrawal: {(ethers.utils.formatEther(item.data[1].toString()))}/ TLOS</div>}
          description={
            <>
              <div style={{fontSize:'12px', marginBottom:'-10px'}}>
              <HStack>
              <Tag style={{marginRight:'2px'}}>
              Caller:</Tag>
              <a href={`https://testnet.teloscan.io/address/${item.data[0]}/`}>
              <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                                    {item.data[0] &&
                                      `${item.data[0].slice(0, 16)}...${item.data[0].slice(
                                        item.data[0].length - 16,
                                        item.data[0].length
                                      )}`}
                                  </div>
              </a>
              </HStack>
              </div>
              
             
            </>
          }
        />
      </List.Item>
    )}
  />
    </Box>
          </Tabs.Tab>
          <Tabs.Tab title='Tx. Logs' key='log'>
             Tx. Log
          </Tabs.Tab>
        </Tabs>

                          </Box>
                        </Box>
                      </WrapItem>
                    </Wrap>
                  </Center>
                </Content>
              </Center>
            </Layout>
          </Content>
        </Center>
      </Layout>
    </>
  )
}

export default BunyBankApp
