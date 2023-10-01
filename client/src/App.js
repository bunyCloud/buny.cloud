import './App.css'
import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import { HStack, IconButton, Box, Image, Grid, GridItem, Center, Text } from '@chakra-ui/react'
import { Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { AppContext } from './AppContext'
import AddressMenu from './components/Header/AddressMenu'
import NetworkSwitcherIconOnly from './components/Header/NetworkSwitcherIconOnly'
import useSessionStorageState from 'use-session-storage-state'
import AccountAddressMenu from './components/Header/AccountAddressMenu'
import BunyDescription from './components/TokenBound/text/BunyDescription'
import AccountDashboard from './components/TokenBound/AccountDashboard'
import AccountLogin from './components/TokenBound/AccountLogin'
import MultiSigWithdrawal from './components/MultiSigWithdrawal'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import UserStorage from './components/Users/UserStorage'
import UserKeyStorage from './contracts/UserKeyStorage.json'
import UserKeyTable from './components/Users/UserKeyTable'
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton } from '@chakra-ui/react'
import FetchPublicEncryptionKey from './components/Users/FetchPublicEncryptionKey'
import ViewMessages from './components/Users/ViewMessages'
import MintFormLayout from './components/MintFormLayout'
import { useSDK } from '@metamask/sdk-react'
import ConnectMetaMask from './components/Header/ConnectMetaMask'

function App() {
  const [chainId, setChainId] = useState(41)
    const [account, setAccount] = useState('')
  const [rpcUrl,setRpcUrl] = useState('https://testnet15.telos.caleos.io/evm')
  const [balance, setBalance] = useState('')
  const [tokenContract, setTokenContract] = useState(null)
  const [tokenId, setTokenId] = useState(null)
  const [connectedNetwork, setConnectedNetwork] = useState(null)
  const [avatarImage, setAvatarImage] = useState(null)
  const [accountName, setAccountName] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)
  const [avatarName, setAvatarName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [setHasProvider] = useState(null)
  const [nftOwner, setNftOwner] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
  const [logged, setLogged] = useState(false)
  const [signature] = useSessionStorageState(null)
  const { hasProvider } = useSDK()
  const [publicKey, setPublicKey] = useState()


  const handleNftDetails = (nftOwner, nftSymbol, avatarImage, avatarName) => {
    setNftOwner(nftOwner)
    setNftSymbol(nftSymbol)
    //setTotalSupply(totalSupply.toString())
    setAvatarImage(avatarImage)
    setAvatarName(avatarName)
  }

  const handleEncryptionKey = (key) => {
    setPublicKey(key)
  }

  const handleDisconnect = () => {
    setLogged(false)
    setAccount(null)
  }

 
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Ethereum'
      case 40:
        return 'Telos'
      case 41:
        return 'Telos Testnet'
      case 43114:
        return 'Avalanche'
      default:
        return 'Unknown Network'
    }
  }

  useEffect(() => {
    if (!window.ethereum) {
      console.log('Provider not found.');
      return; // Exit the function early if no provider is found
    }
    const networkName = getNetworkName(chainId)
    console.log(`Connected to: ${networkName}`)
    setConnectedNetwork(networkName)
  }, [chainId])

  // This function will be passed to the child component
  const updateAccountAddress = (address) => {
    setAccountAddress(address)
  }

  return (
    <AppContext.Provider
      value={{
        logged,
        setLogged,
        account,
        setAccount,
        chainId,
        setChainId,
        accountAddress,
        setAccountAddress,
        rpcUrl,
            setRpcUrl,
        avatarImage,
        setAvatarImage,
        tokenContract,
        setTokenContract,
        tokenId,
        setTokenId,
        accountName,
        setAccountName,
      }}>
      <>
        <Layout style={{ overflow: 'hidden' }}>
          <Box w="100%" borderTop="0px solid white" bg="#6a14fc">
            <Grid borderBottom="4px solid silver" width="100%" templateColumns="repeat(4, 1fr)" gap={0} position={'fixed'} zIndex={'banner'} bg="#6a14fc">
              <GridItem colSpan={2} >
                <Image w={'80px'} h={'40px'} mt={0} mb={1} src="/bunyLogo2.png" />
              </GridItem>

              <GridItem colStart={4} colEnd={6} color='white' >
                <HStack gap={1} justify={'right'} mt={1}>
                  <NetworkSwitcherIconOnly />
                  <div>
                    {account && !signature && (
                      <>
                            <AddressMenu handleDisconnect={handleDisconnect} balance={balance} />
                          </>
                        )}
                        {!account && (
                      <>
                        <ConnectMetaMask />
                      </>
                    )}

                    {accountAddress && signature && (
                      <>
                        <AccountAddressMenu handleDisconnect={handleDisconnect} />
                      </>
                    )}
                  </div>

                  <div>
                    {/* NFT Account Profile Modal */}
                    {signature && avatarImage && accountAddress && (
                      <>
                        <Avatar size={'sm'} src={avatarImage} border="2px solid white" onClick={onOpen} />
                        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>NFT Profile</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <AccountDashboard />
                            </ModalBody>
                          </ModalContent>
                        </Modal>
                      </>
                    )}
                  </div>
                  {/* Primary Menu */}
                </HStack>
              </GridItem>
            </Grid>
          </Box>

          <Tabs isManual variant="enclosed" mt={10}>
            <TabList color='purple' zIndex={'999'} position={'fixed'} w="100%" bg="white" display="flex" justifyContent="center" p={1}>
              <Tab>Dashboard</Tab>
              <Tab>Vault</Tab>
              <Tab>Directory</Tab>
              <Tab>IBUNY</Tab>
              </TabList>

            <TabPanels>
              <TabPanel>
                <Center w={'100%'}>
                  <Box w="100%" maxWidth={550} mt={14} style={{ overflowX: 'hidden' }}>
                    
                      <>
                        <AccountLogin onAccountAddressChange={updateAccountAddress} onNftDetails={handleNftDetails} />
                      </>
                    

                    {!account && (
                      <>
                      <Center>
                        <div>
                          {!hasProvider && (
                            <a href="https://metamask.io" target="_blank" rel="noreferrer">
                              <Text fontSize={'xs'}>Install MetaMask</Text>
                            </a>
                          )}
                                                  </div>
                      </Center>
                      </>
                    )}
                  </Box>
                </Center>
                <Box m={8}>
                  <BunyDescription />
                </Box>
                
              </TabPanel>
              <TabPanel>
                <Box mt={8}>
                  <MultiSigWithdrawal />
                </Box>
              </TabPanel>
              <TabPanel>
                <Center mt={2} mb={2}>
                 
                  <Box w="100%" maxWidth={500} px={['1rem', '0']} p={2} mt={8} >
                    <Box border="0.5px solid silver" bg="ghostwhite">
                    <Text borderBottom="0.5px solid silver"   p={2}>Contract</Text>
                      <UserStorage publicKey={publicKey} account={account} contractAddress={UserKeyStorage.address} abi={UserKeyStorage.abi} />
                    </Box>

                    {!publicKey && (
                      <>
                    <Box mt={2}  border="0.5px solid silver">
                      <Grid templateColumns="repeat(5, 1fr)" gap={4} bg="ghostwhite">
                        
                        <GridItem colStart={5} colEnd={6} >
                          <Center>
                            <Popover isLazy>
                              <PopoverTrigger>
                                <IconButton variant="ghost" colorScheme="twitter" aria-label="Call Sage" fontSize="20px" icon={<QuestionOutlineIcon />} />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverHeader fontWeight="semibold">Public Encryption Key</PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody fontSize={'small'}>
                                  Requests that the user share their public encryption key. Returns a public encryption key, or rejects if the user denies the
                                  request. The public key is computed using the NaCl implementation of the X25519_XSalsa20_Poly1305 algorithm.
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Center>
                        </GridItem>
                      </Grid>
                            
                      <FetchPublicEncryptionKey onPublicKey={handleEncryptionKey} />


                    </Box>
</>
                    )}
                    <Box mt={2}  border="0.5px solid silver">
                      <Grid templateColumns="repeat(5, 1fr)" gap={4} bg="ghostwhite">
                        <GridItem colSpan={2} >
                          <Text p={2}>User Directory</Text>
                        </GridItem>
                        <GridItem colStart={5} colEnd={6} >
                          <Center>
                            <Popover isLazy>
                              <PopoverTrigger>
                                <IconButton variant="ghost" colorScheme="twitter" aria-label="Call Sage" fontSize="20px" icon={<QuestionOutlineIcon />} />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverHeader fontWeight="semibold">User Directory</PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody fontSize={'small'}>
                                  SmartContract directory of usernames and their corresponding wallet address and public encryption key. Click a username to
                                  send an encrypted message.
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Center>
                        </GridItem>
                      </Grid>
                      <UserKeyTable account={account} contractAddress={UserKeyStorage.address} abi={UserKeyStorage.abi} />
                    </Box>

                    <Box mt={2}  border="0.5px solid silver">
                      <Grid templateColumns="repeat(5, 1fr)" gap={4} bg="ghostwhite">
                        <GridItem colSpan={2} >
                          <Text p={2}>View Messages</Text>
                        </GridItem>
                        <GridItem colStart={5} colEnd={6} >
                          <Center>
                            <Popover isLazy>
                              <PopoverTrigger>
                                <IconButton variant="ghost" colorScheme="twitter" aria-label="Call Sage" fontSize="20px" icon={<QuestionOutlineIcon />} />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverHeader fontWeight="semibold">Messages</PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody fontSize={'small'}>
                                  <Text>All encrypted messages sent to connected account are displayed here.</Text>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Center>
                        </GridItem>
                      </Grid>
                      <ViewMessages account={account} />
                    </Box>
                  </Box>
                </Center>
              </TabPanel>
             <TabPanel>
              <MintFormLayout />
             </TabPanel>
            </TabPanels>
          </Tabs>
        </Layout>
      </>
    </AppContext.Provider>
  )
}

export default App
