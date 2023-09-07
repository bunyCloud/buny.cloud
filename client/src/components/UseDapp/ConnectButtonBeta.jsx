import { useClipboard, useToast } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { Box, Flex, Center, Text, HStack, VStack } from '@chakra-ui/react'
import {
  useEthers,
  Mainnet,
  Sepolia,
  Avalanche,
  Polygon,
  Mumbai,
  AvalancheTestnet,
  Arbitrum,
    ArbitrumGoerli,
  Optimism,
  OptimismKovan,
  Fantom,
  FantomTestnet,
} from '@usedapp/core'
import { Avatar, Button, Modal } from 'antd'
import { useState } from 'react'
import 'subcomponents/hoverButton.scss'
import { Tag } from 'antd-mobile'
import { Telos, TelosTestnet, BSC, BSCTestnet } from './UseDappCore'
import { Tabs } from 'antd'
import UserActivity from 'components/Snowtrace/UserActivity'
import AllChainNativeBalance from 'components/Tokens/AllChainNativeBalance'

export default function ConnectButtonBeta() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { activateBrowserWallet, chainId, switchNetwork, account, deactivate } = useEthers()

  const toast = useToast()
  const { onCopy, value, setValue, hasCopied } = useClipboard(account)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  function getNetworkName(chainId) {
    switch (chainId) {
      case 1:
        return 'Ethereum'
      case 3:
        return 'Ropsten '
      case 11155111:
        return 'Sepolia '
      case 5:
        return 'Goerli '
      case 40:
        return 'Telos'
      case 41:
        return 'Telos '
      case 42:
        return 'Kovan '
      case 56:
        return 'BSC Mainnet'
      case 97:
        return 'BSC Testnet '
      case 137:
        return 'Polygon'
      case 250:
        return 'Fantom'
      case 4002:
        return 'Fantom Testnet'
      case 42220:
        return 'Celo Mainnet'
      case 42161:
        return 'Arbitrum One'
      case 43113:
        return 'Fuji'
      case 80001:
        return 'Mumbai'
      case 43114:
        return 'Avalanche'
      case 43113:
        return 'Fuji'
      default:
        return 'Unknown network'
    }
  }

  function refreshPage() {
    setTimeout(() => {
      window.location.reload()
    }, 100) // 5000 milliseconds = 5 seconds
  }

  const networkName = getNetworkName(chainId)
  const walletItems = [
    {
      key: '1',
      label: 'Balance',
      children:[<>
        <AllChainNativeBalance />
      </>]
    },
    {
      key: '2',
      label: 'Transactions',
      children:[<>
        <UserActivity />
      </>]
    }
  ]

  const items = [
    {
      key: '1',
      label: `Network`,
      children: [
        <>
          <VStack>
            
            <VStack w={'auto'}>
              <div style={{ color: 'black', fontSize: '12px' }}>
                <Tag color="green">
                  <HStack>
                    <div>{networkName}</div>
                    <div>{chainId}</div>
                  </HStack>
                </Tag>
              </div>
              <div>
                <Avatar src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Mainnet.chainId)}
                  disabled={chainId === Mainnet.chainId}>
                  Ethereum
                </Button>

                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Sepolia.chainId)}
                  disabled={chainId === Sepolia.chainId}>
                  Sepolia
                </Button>
              </div>
              <div>
                <Avatar src="https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png" />

                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Avalanche.chainId)}
                  disabled={chainId === Avalanche.chainId}>
                  Avalanche
                </Button>
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(AvalancheTestnet.chainId)}
                  disabled={chainId === AvalancheTestnet.chainId}>
                  Fuji
                </Button>
              </div>

              <div>
                <Avatar src="https://assets-global.website-files.com/60ae1fd65f7b76f18ddd0bec/61044a5f70f5bbeb24b995ea_Symbol%202%402x.png" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Telos.chainId)}
                  disabled={chainId === Telos.chainId}>
                  Telos
                </Button>

                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(TelosTestnet.chainId)}
                  disabled={chainId === TelosTestnet.chainId}>
                  Testnet
                </Button>
              </div>
              <div>
                <Avatar src="https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Polygon.chainId)}
                  disabled={chainId === Polygon.chainId}>
                  Polygon
                </Button>
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Mumbai.chainId)}
                  disabled={chainId === Mumbai.chainId}>
                  Mumbai
                </Button>
              </div>
              <div>
                <Avatar src="https://assets-cdn.trustwallet.com/blockchains/smartchain/info/logo.png" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(BSC.chainId)}
                  disabled={chainId === BSC.chainId}>
                  BSC
                </Button>
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(BSCTestnet.chainId)}
                  disabled={chainId === BSCTestnet.chainId}>
                  Testnet
                </Button>
              </div>
              <div>
                <Avatar src="https://metaverse-marauders.s3.eu-west-3.amazonaws.com/arbitrum_4366c46586.svg" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Arbitrum.chainId)}
                  disabled={chainId === Arbitrum.chainId}>
                  Arbitrum
                </Button>
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(ArbitrumGoerli.chainId)}
                  disabled={chainId === ArbitrumGoerli.chainId}>
                  a.Rinkeby
                </Button>
              </div>
              <div>
                <Avatar src="https://altcoinsbox.com/wp-content/uploads/2023/03/optimism-logo.jpg" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Optimism.chainId)}
                  disabled={chainId === Optimism.chainId}>
                  Optimism
                </Button>
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(OptimismKovan.chainId)}
                  disabled={chainId === OptimismKovan.chainId}>
                  o.Kovan
                </Button>
              </div>
              <div>
                <Avatar src="https://s3.coinmarketcap.com/static/img/portraits/62d51d9af192d82df8ff3a83.png" />
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(Fantom.chainId)}
                  disabled={chainId === Fantom.chainId}>
                  Fantom
                </Button>
                <Button
                  style={{ width: '80px', fontSize: '12px' }}
                  onClick={() => switchNetwork(FantomTestnet.chainId)}
                  disabled={chainId === FantomTestnet.chainId}>
                  Testnet
                </Button>
              </div>
              <hr />
            </VStack>
          </VStack>
        </>,
      ],
    },
    {
      key: '2',
      label: `Wallet`,
      children: [
        <>
            <div style={{ color: 'black', fontSize: '12px' }}>
              
              <Center>

              <VStack>
                <Tag color="green">
                                  <HStack>
                <div>Connected to:</div>
                    <div>{networkName}</div>
                    <div>({chainId})</div>
                  </HStack>
              
                </Tag>
                <HStack>
                <Text color="black" fontSize="12px" fontWeight="semibold" lineHeight="1.1">
                  {account}
                </Text>
                <Button size="small" style={{backgroundColor:'transparent', padding:'2px', border:'0px solid white'}} onClick={handleCopy}>
                  <CopyIcon mr={1} />
                </Button>
                </HStack>
               
                </VStack>
                </Center>
              

                <Tabs style={{ marginLeft: '8px' }} tabBarExtraContent={operations} items={walletItems} />

              </div>
        </>,
      ],
    },
  ]

  
  const showModal = () => {
    setOpen(true)
  }
  const handleOk = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }
  function handleConnectWallet() {
    setIsLoggedIn(false)
    activateBrowserWallet()
    setIsLoggedIn(true)
  }
  function handleCopy() {
    onCopy()
    toast({
      render: () => (
        <Box color="white" p={3} bg="blue.500">
          Address copied to clipboard!
        </Box>
      ),
      duration: 1800,
      isClosable: true,
    })
  }

  function handleDeactivateAccount() {
    deactivate()
    onClose()
  }

  const operations = (
    <Button type="primary" size="small" style={{ marginRight: '50px' }} onClick={handleDeactivateAccount}>
      Disconnect
    </Button>
  )

  const WalletContent = () => (
    <>
      <Button
        //size="medium"
        block
        style={{
          width:'auto',
         //border:'2px solid #ad8897',
          fontSize: '12px',
          //marginTop:'20px',
          height:'auto',
          backgroundColor:'transparent',
        }}
        onClick={showModal}>
        <HStack>
          <Center>
            <Tag color="green">Connected</Tag>
          </Center>
          <div> {networkName}</div>
          <div style={{ fontSize: '12px' }}>
            {account && `${account.slice(0, 5)}...${account.slice(account.length - 4, account.length)}`}
          </div>
        </HStack>
      </Button>
      <Modal
        width="360px"
        style={{ top: 5, float: 'right', padding:'4px' }}
        bodyStyle={{
          padding: '5px',
        }}
        open={open}
        //title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="link"
            //type="primary"
            loading={loading}
            onClick={refreshPage}>
            Reload
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Ok
          </Button>,
        ]}>
        <Tabs style={{ marginLeft: '8px' }} tabBarExtraContent={operations} items={items} />
      </Modal>
    </>
  )

  return account ? (
    <VStack>
      <Box mb={5} px="3">
        <div>{account ? <WalletContent /> : <p>Connect wallet.</p>}</div>
      </Box>
    </VStack>
  ) : (
    <div
      >
      <Button
        size="large"
        onClick={handleConnectWallet}
        /*
    
      */
        className="pulse">
        Connect
      </Button>
    </div>
  )
}
