import { NavLink } from 'react-router-dom'
import 'antd/dist/antd.css'
import './style.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Alert, Image, Layout } from 'antd'
import { nftAddress, TBunyNftAddress } from 'contracts/config/networkAddress.jsx'
import AccountDrawer from 'components/AccountDrawer'
import CreateLayout from 'components/Layout/CreateLayout'
import FooterMenu from 'components/Layout/FooterMenu'
import DashboardLayout from 'components/Layout/DashboardLayout'
import IpfsLayout from 'components/Layout/IpfsLayout'
import ContractLoaderLayout from 'components/Layout/ContractLoaderLayout'
import CreateMarketNFTLayout from 'components/Layout/CreateMarketNFTLayout'
import Market3DLayout from 'components/Layout/Market3DLayout'
import ProductPageLayoutA from 'components/Layout/ProductPageLayoutA'
import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react'
import RafflePageLayout from 'components/Layout/RafflePageLayout'
import CollectionDirectoryLayout from 'components/Layout/CollectionDirectoryLayout'
import CollectionPageLayout from './components/Layout/CollectionPageLayout'
import HelpLayout from 'components/Layout/HelpLayout'
import MyListingsLayout from './components/Layout/MyListingsLayout'
import MySoldListingsLayout from 'components/Layout/MySoldListingsLayout'
import MyPurchasesLayout from 'components/Layout/MyPurchasesLayout'
import { ethers } from 'ethers'
import RaffleDirectoryLayout from './components/Layout/RaffleDirectoryLayout'
import ConnectButtonBeta from 'components/UseDapp/ConnectButtonBeta'
import BunyBankApp from 'components/BunyBank/telos/BunyBankApp'
import MultiChainDirectoryLayout from 'components/Layout/MultiChainDirectoryLayout'
import { useEthers, DAppProvider } from '@usedapp/core'
import DynamicRafflePageLayout from 'components/Layout/DynamicRafflePageLayout'

function getNetworkName(chainId) {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet'
    case 3:
      return 'Ropsten Testnet'
    case 4:
      return 'Rinkeby Testnet'
    case 5:
      return 'Goerli Testnet'
    case 40:
      return 'Telos Mainnet'
    case 41:
      return 'Telos Testnet'
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
    case 42220:
      return 'Celo Mainnet'
    case 42161:
      return 'Arbitrum One'
    case 43114:
      return 'Avalanche'
    case 43113:
      return 'Fuji Testnet'

    case 4689:
      return 'xDai Chain'
    case 43112:
      return 'Near Mainnet'
    case 80001:
      return 'Mumbai Testnet'

    default:
      return 'Unknown network'
  }
}

const { Header } = Layout
const styles = {
  content: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Roboto, sans-serif',
    color: '#041836',
    backgroundColor: 'black',
    //marginTop: "30px",
  },
  header: {
    position: 'fixed',
    backgroundColor: 'white',

    zIndex: 2,
    width: '100%',
    display: 'flex',
    height: '45px',
    //border: '3px solid #b4dde3',
    justifyContent: 'space-between',
    //alignItems: "center",
    fontFamily: 'Roboto, sans-serif',
    borderBottom: '3px solid #ad8897',
    borderTop: '3px solid #ad8897',

    //marginTop: "6px",
    //marginBottom: "-25px",
  },
  headerRight: {
    display: 'flex',
    //padding: "15px",
    marginRight: '-50px',
    //alignItems: "center",
    fontSize: '12px',
    fontWeight: '600',
  },
}
function App(props) {
  const { account, chainId } = useEthers()
  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')
  //const providerTelos = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')
  const networkName = getNetworkName(chainId)

  return (
    <Layout style={{ overflow: 'auto' }}>
      <Router>
        <Header style={styles.header}>
          <HStack>
            <div
              style={{
                display: 'flex',
              }}>
              <NavLink to="/">
                <model-viewer
                  camera-orbit="calc(0rad + env(window-scroll-y) * 4rad)"
                  style={{
                    width: '45px',
                    height: '45px',
                    marginLeft: '-45px',
                    marginTop: '1px',
                    backgroundColor: 'transparent',
                  }}
                  src={'https://ipfs.io/ipfs/QmXLxRtVQYKDSJD9bGhAmnbtgT465yN5D52KqWDtYLns9R'}></model-viewer>
              </NavLink>
            </div>
          </HStack>

          <div style={styles.headerRight}>
            <HStack>
              <ConnectButtonBeta />

              <AccountDrawer />
            </HStack>
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/buny-raffle">
              <VStack mt={50} border="3px solid white">
                <Center>
                  <RaffleDirectoryLayout />
                </Center>
              </VStack>
            </Route>
            <Route path="/buny-bank">
              <BunyBankApp />
            </Route>

            <Route path="/raffle-directory">
              <VStack mt={50} border="3px solid white">
                <Center>
                  <MultiChainDirectoryLayout />
                </Center>
              </VStack>
            </Route>
            <Route path="/TheBunyProject">
              <Center>
                <Box
                  width={'100%'}
                  maxWidth={800}
                  minWidth={360}
                  bg="black"
                  color="white"
                  p={5}
                  height={'100vh'}
                  m={5}
                  mt={50}>
                  <h6 style={{ color: 'white' }}>The Buny Project</h6>
                  <Box m={10} p={5} bg={'white'} color="black" fontSize={'12px'}>
                    <HStack>
                      <strong>Name:</strong>
                      <div>
                        <p>The Buny Project</p>
                      </div>
                    </HStack>

                    <HStack>
                      <strong>URL:</strong>
                      <div>
                        <p>https://buny.cloud</p>
                      </div>
                    </HStack>

                    <HStack>
                      <strong>Email:</strong>
                      <div>
                        <p>admin@buny.cloud</p>
                      </div>
                    </HStack>
                  </Box>
                  <h6 style={{ color: 'white' }}>What is the goal?</h6>
                  <Box m={10} p={10} bg={'white'} color="black" fontSize={'12px'}>
                    <Text>
                      The goal of The Buny Project is to build a fully decentralized, self sustaining, permanent, public
                      SmartContract service utility.
                    </Text>
                    <Text>
                      The goal of the Buny Project is to build a fully decentralized virtual ecosystem for all relevent
                      smartcontractual agreements in demand.
                    </Text>
                    <Text>
                      The goal of the Buny Project is to build a fully decentralized, fair, opportuity driven, universal
                      platform for cross-chain, cross-border support.
                    </Text>
                  </Box>
                  <h6 style={{ color: 'white' }}>When is the mainnet launch date?</h6>
                  <Box m={10} p={10} bg={'white'} color="black" fontSize={'12px'}>
                    <p>Forever and always. There is no end and there is no beginning. </p>
                  </Box>
                </Box>
              </Center>
            </Route>
            <Route path="/nft-marketplace">
              <VStack mt={50} border="3px solid white">
                <Center>
                  <Market3DLayout />
                </Center>
              </VStack>
            </Route>

            <Route path="/ipfs">
              <IpfsLayout />
            </Route>

            <Route path="/create-market-nft">
              <CreateMarketNFTLayout />
            </Route>

            <Route path="/collection/:contractAddress">
              <CollectionPageLayout provider={provider} />
            </Route>

            <Route path={`/token/${nftAddress}/:tokenId`}>
              <VStack mt={50} border="3px solid white">
                <Center>
                  <ProductPageLayoutA />
                </Center>
              </VStack>
            </Route>
     
            <Route path={`/raffle/:raffleAddress`}>
              <VStack mt={50} border="3px solid white">
                <Center>
                  <RafflePageLayout networkName={networkName} />
                </Center>
              </VStack>
            </Route>
            <Route path={`/raffle/telos/:raffleAddress`}>
              <VStack mt={50} border="3px solid white">
                <Center>
                  <DynamicRafflePageLayout networkName={networkName} provider='https://mainnet.telos.net/evm' />
                </Center>
              </VStack>
            </Route>
            <Route path="/dashboard">
              <DashboardLayout />
            </Route>
            <Route path="/my-listings">
              <MyListingsLayout />
            </Route>
            <Route path="/my-sales">
              <MySoldListingsLayout />
            </Route>
            <Route path="/my-items">
              <MyPurchasesLayout />
            </Route>
            <Route path="/help">
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'black',
                  height: '100%',
                  marginTop: '55px',
                  maxWidth: '800px',
                }}>
                <HelpLayout />
              </div>
            </Route>

            <Route path="/">
              <VStack mt={50} border="3px solid white">
                <Center>
                  <MultiChainDirectoryLayout />
                </Center>
              </VStack>
            </Route>
          </Switch>
        </div>
      </Router>
      <FooterMenu />
    </Layout>
  )
}

export default App
