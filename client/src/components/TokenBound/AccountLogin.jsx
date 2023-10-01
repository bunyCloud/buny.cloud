import { Card, theme } from 'antd'
import { Button, Box, Alert, AlertIcon, AlertDescription, Text, AlertTitle, HStack, Tooltip, Center, Image, VStack, Avatar } from '@chakra-ui/react'
import React, { useState, useEffect, useContext } from 'react'
import BunyERC6551Registry from '../../contracts/BunyERC6551Registry.json'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'
import FujiERC6551Registry from '../../contracts/fuji/FujiERC6551Registry.json'
import FujiERC6551Account from '../../contracts/fuji/FujiERC6551Account.json'
import TheBUNY from '../../contracts/TheBUNY.json'
import axios from 'axios'
import { ethers } from 'ethers'
import { networks } from '../../config/networks'
import LoginForm from '../Forms/LoginForm'
import LoginForm2 from '../Forms/LoginForm2'
import MetamaskSignature from '../MetaMask/MetamaskSignature'
import { AppContext } from '../../AppContext'
import WhatNFTImage from '../../utils/WhatNFTImage'
import WhatNFTName from '../../utils/WhatNFTName'
import { RepeatIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import WhatCollectionName from '../../utils/WhatCollectionName'
import WhatNFTOwner from '../../utils/WhatNFTOwner'
import FetchAccountAddressTelos from './FetchAccountAddressTelos'
import WhatNetworkName from '../../utils/WhatNetworkName'

const options = [
  {
    value: '41',
    label: 'Telos Testnet',
  },
  {
    value: '40',
    label: 'Telos',
  },

  {
    value: '1',
    label: 'Ethereum',
  },
  {
    value: '43114',
    label: 'Avalanche',
  },
  {
    value: '43113',
    label: 'Fuji Testnet',
  },
  {
    value: '137',
    label: 'Polygon',
  },
]

const AccountLogin = ({ onAccountAddressChange, onNftDetails }) => {
  const {
    account,
    logged,
    avatarImage,
    setAvatarImage,
    tokenContract,
    setTokenId,
    setTokenContract,
    signature,
    chainId,
    rpcUrl,
    setSignature,
    setAccountAddress,
    accountAddress,
  } = useContext(AppContext)
  const [loading, setLoading] = React.useState(true)
  const [inputAddress, setInputAddress] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isFujiActive, setIsFujiActive] = useState(false)
  const [isTelosActive, setIsTelosActive] = useState(false)
  const [inputTokenId, setInputTokenId] = useState(null) // State variable for the inputTokenId input field
  const [inputAccount, setInputAccount] = useState('') // State variable for the account input field
  const [inputImage, setInputImage] = useState(null)
  const [inputName, setInputName] = useState(null)
  const [nftSymbol, setNftSymbol] = useState(null)
  const [selectedChainId, setSelectedChainId] = useState('43113')
  const [inputDescription, setInputDescription] = useState(null)
  const [nftOwner, setNftOwner] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [avatarName, setAvatarName] = useState()
  const [signedIn, setSignedIn] = useState(null)
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)
  const networkConfig = networks[selectedChainId]
  const selectedChainName = networkConfig?.chainName

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const reset = () => {
    setCurrent(current - 2)
  }

  const handleChange = (event) => {
    setSelectedChainId(event.target.value)
  }

  // Event handler for the token input field
  const handleAddressChange = (event) => {
    setInputAddress(event.target.value)
  }

  const handleIsOwner = (event) => {
    setIsOwner(event)
  }

  const handleNftOwner = (nftOwner) => {
    setNftOwner(nftOwner)
  }
  // Event handler for the inputTokenId input field
  const handleTokenIdChange = (event) => {
    setInputTokenId(event.target.value)
  }

  // Event handler for the account input field
  const handleAccountChange = (event) => {
    setInputAccount(event.target.value)
  }

  const handleIsActive = (value) => {
    setIsActive(value)
  }
  const handleIsTelosActive = (value) => {
    setIsTelosActive(value)
  }

  const handleIsFujiActive = (value) => {
    setIsFujiActive(value)
  }
  const handleCollectionChange = (value) => {
    setInputAddress(value)
  }

  const handleAccountAddress = (address) => {
    setAccountAddress(address)
  }

  const handleSignedIn = (account) => {
    setAccountAddress(account)
  }

  const createAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const implementation = FujiERC6551Account.address
    const salt = '1' // or some other unique number
    const initData = '0x' // no init data
    const contract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
    const create = await contract.createAccount(implementation, selectedChainId, inputAddress, inputTokenId, salt, initData)
    console.log(create.hash)
    console.log(create.confirmations)
  }

  useEffect(() => {
    if (!window.ethereum) {
      console.log('Provider not found.')
      return
    }
    if (nftOwner) {
      const checkOwner = async (nftOwner) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        console.log(`user address ${address}`)
        if (nftOwner === address) {
          setIsOwner(true)
          console.log('connected user is owner')
          //          setTokenContract(inputAddress)
          setAvatarImage(inputImage)
          setTokenId(inputTokenId)
        }
      }
      checkOwner(nftOwner)
    }
    if (isOwner) {
      const checkAccount = async () => {
        try {
          let provider
          if (chainId === 41) {
            provider = new ethers.providers.JsonRpcProvider(rpcUrl)
          } else if (chainId === 43113) {
            provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
          }
          let contract
          const signer = provider.getSigner()
          if (chainId === 41) {
            contract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
            console.log('telos testnet registry')
          } else if (chainId === 43113) {
            contract = new ethers.Contract(FujiERC6551Registry.address, FujiERC6551Registry.abi, signer)
            console.log('checking fuji registry')
          }
          let implementation
          if (chainId === 41) {
            implementation = BunyERC6551Account.address
          } else if (chainId === 43113) {
            implementation = FujiERC6551Account.address
          }
          const salt = '1'
          const accountAddress = await contract.account(implementation, selectedChainId, inputAddress, inputTokenId, salt)
          console.log('preset account address received')
          const accountDetails = await contract.getAccountDetails(accountAddress)
          if (accountDetails[0] !== ethers.constants.AddressZero) {
            setAccountAddress(accountAddress)
            onAccountAddressChange(accountAddress)
            //fetchNFTData()
            setTokenContract(inputAddress)
          } else {
            console.log('No account found')
          }
        } catch (error) {
          console.error('Error checking account:', error)
        }
      }
      checkAccount()
    }
  }, [
    chainId,
    inputAddress,
    inputImage,
    inputTokenId,
    isOwner,
    nftOwner,
    onAccountAddressChange,
    selectedChainId,
    setAccountAddress,
    setAvatarImage,
    setTokenContract,
    setTokenId,
  ])

  const fetchNFTData = async () => {
    setLoading(true)
    try {
      let metadata = {}
      //const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
       const contract = new ethers.Contract(inputAddress, TheBUNY.abi, provider)
      let tokenURI = await contract.tokenURI(inputTokenId)
      if (tokenURI.startsWith('ipfs://')) {
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
        const cid = tokenURI.replace('ipfs://', '')
        tokenURI = ipfsGatewayUrl + cid
      }
      const nftOwner = await contract.ownerOf(inputTokenId)
      setNftOwner(nftOwner)
      if (nftOwner && account) {
        const lowerNftOwner = ethers.utils.getAddress(nftOwner.toLowerCase())
        const lowerAddress = ethers.utils.getAddress(account.toLowerCase())

        if (lowerNftOwner === lowerAddress) {
          setIsOwner(true)
        } else {
          setIsOwner(false)
        }
      } else {
        setIsOwner(false)
      }
      const symbol = await contract.symbol()
      setNftSymbol(symbol)

      const response = await axios.get(tokenURI)
      const { data } = response

      if (!data) {
        throw new Error('No metadata found at provided tokenURI.')
      }
      metadata = data
      let avatarImage = metadata.image
      let avatarName = metadata.name

      // Convert IPFS URL to HTTPS if necessary
      if (avatarImage.startsWith('ipfs://')) {
        const ipfsGatewayUrl = 'https://ipfs.io/ipfs/'
        const cid = avatarImage.replace('ipfs://', '')
        avatarImage = ipfsGatewayUrl + cid
      }
      console.log('Image URL:', avatarImage)

      setInputImage(avatarImage)
      setInputName(avatarName)
      setInputDescription(data.description)
      onNftDetails(nftOwner, symbol, avatarImage, avatarName)
    } catch (error) {
      console.error('Unable to fetch NFT data:', error)
    }
    setLoading(false)
  }

  const handleNftDetails = (nftOwner, nftSymbol, avatarImage, avatarName) => {
    setNftOwner(nftOwner)
    setNftSymbol(nftSymbol)
    setAvatarImage(avatarImage)
    setAvatarName(avatarName)
  }

  const steps = [
    {
      title: 'Load',
      content: (
        <LoginForm
          account={account}
          accountAddress={accountAddress}
          loading={loading}
          inputImage={inputImage}
          inputDescription={inputDescription}
          nftOwner={nftOwner}
          selectedChainId={selectedChainId}
          selectedChainName={selectedChainName}
          signedIn={signedIn}
          signature={signature}
          setSignedIn={setSignedIn}
          setSignature={setSignature}
          options={options}
          inputAddress={inputAddress}
          inputTokenId={inputTokenId}
          logged={logged}
          inputAccount={inputAccount}
          handleChange={handleChange}
          handleCollectionChange={handleCollectionChange}
          onInputAddressChange={handleAddressChange}
          onInputTokenIdChange={handleTokenIdChange}
          handleAccountChange={handleAccountChange}
        />
      ),
      cardTitle: 'Token Bound NFT Portal',
    },
    {
      title: 'Verify',
      content: (
        <LoginForm2
          selectedNetwork={selectedChainName}
          inputChainId={selectedChainId}
          inputAddress={inputAddress}
          nftSymbol={nftSymbol}
          inputName={inputName}
          inputTokenId={inputTokenId}
          onNftDetails={handleNftDetails}
          handleAccountAddress={handleAccountAddress}
          fetchNFTData={fetchNFTData}
        />
      ),
      cardTitle: 'Verify NFT',
    },
    {
      title: 'Sign',
      content: [
        <>
          <Box w={'100%'}>
            {!isOwner && !loading && (
              <>
                <Alert
                  color="black"
                  status="warning"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  height="150px">
                  <AlertIcon boxSize="33px" mr={0} />
                  <AlertTitle mt={2} mb={1} fontSize="lg">
                    NFT found but you are not the owner!
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    <Text noOfLines={3} fontSize={'small'}>
                      Double check your inputs and try again.
                    </Text>
                    <Text>Make sure you are connected and on the correct network</Text>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </Box>
          <Box p={2} mt={2}>
            {isOwner && !loading && (
              <>
                {!signature ? (
                  <>
                    <Alert
                      status="info"
                      variant="subtle"
                      p={3}
                      flexDirection="column"
                      alignItems="left"
                      bg="ghostwhite"
                      //border="1px solid silver"
                      w={'100%'}
                      justifyContent="left"
                      textAlign="left"
                      height="auto"
                      fontSize="small"
                      color="#6a14fc">
                      <HStack>
                        <Avatar src={avatarImage} size={'sm'} />
                        <AlertTitle mt={2} mb={1} fontSize="lg">
                          <WhatNFTName inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />
                        </AlertTitle>
                      </HStack>

                      <AlertDescription w="auto" overflow={'auto'}>
                        <div>
                          {!isActive && (
                            <>
                              <Text noOfLines={2} fontSize={'small'}>
                                NFT Token Account Bindings
                              </Text>
                              <HStack>
                                <Text noOfLines={2}>No token bound account found on</Text>
                                <WhatNetworkName chainId={chainId} /> <Text>{chainId.toString()}</Text>
                              </HStack>

                              <Text>Sign transaction and create account to continue</Text>
                            </>
                          )}
                        </div>

                        <Box border="0.5px solid purple.200" mt={1} mb={1}>
                          <FetchAccountAddressTelos
                            onIsActive={handleIsActive}
                            inputAddress={inputAddress}
                            inputTokenId={inputTokenId}
                            inputChainId={selectedChainId}
                          />
                        </Box>

                        {/*

                       <Box  border="0.5px solid purple.200" mt={1} mb={1}>
                        <FetchAccountAddressFuji
                          onIsActive={handleIsActive}
                          inputAddress={inputAddress}
                          inputTokenId={inputTokenId}
                          inputChainId={selectedChainId}
                        />
                       </Box>
                       */}
                      </AlertDescription>
                    </Alert>
                    {!isActive && (
                      <>
                        <Center bg="ghostwhite" p={2} color="black">
                          <VStack>
                            <WhatCollectionName inputAddress={inputAddress} inputChainId={selectedChainId} />
                            <WhatNFTName inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />
                            <WhatNFTOwner
                              onIsOwner={handleIsOwner}
                              onNftOwner={handleNftOwner}
                              inputAddress={inputAddress}
                              inputChainId={selectedChainId}
                              inputTokenId={inputTokenId}
                            />
                            <WhatNFTImage size={'lg'} inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />
                            <Text></Text>
                            <Button onClick={createAccount} variant={'outline'} size={'md'} colorScheme="telegram">
                              Create Account
                            </Button>
                          </VStack>
                        </Center>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Alert
                      bg="white"
                      status="success"
                      variant="subtle"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                      height="auto">
                      <Center>
                        <VStack>
                          <model-viewer
                            style={{
                              width: '250px',
                              height: '250px',
                              //marginTop: '-3px',
                              //backgroundColor: 'transparent',
                            }}
                            src="/successful-login2.glb"
                            poster="/telos.png"
                            shadow-intensity="0.99"
                            auto-rotate
                            shadow-softness="0.57"></model-viewer>
                          <Image src={'/signature-matched.png'} width="200px" />
                          <Box p={2}>
                            <Avatar src={avatarImage} size={'lg'} name={avatarName} />
                          </Box>
                        </VStack>
                      </Center>
                    </Alert>
                  </>
                )}
                <Box p={2} mt={2}>
                  <MetamaskSignature
                    onSignedIn={handleSignedIn}
                    accountAddress={accountAddress}
                    inputAddress={inputAddress}
                    tokenId={inputTokenId}
                    inputChainId={selectedChainId}
                    inputName={inputName}
                    networkName={selectedChainName}
                    isActive={isActive}
                  />
                </Box>
              </>
            )}
          </Box>
        </>,
      ],
      cardTitle: 'Confirmation',
    },
  ]

  return (
    <>
      <div>
        <Center>
          <Card
            className="customCard"
            actions={
              current < steps.length - 1
                ? [
                    <Box color="white" w="100%">
                      <WhatNFTName inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />
                      <Text>
                        {inputTokenId && (
                          <>
                            TokenId:
                            {inputTokenId.toString()}
                          </>
                        )}
                      </Text>
                      <Text>{selectedChainName && <>{selectedChainName}</>}</Text>
                    </Box>,
                    <WhatNFTImage size={'lg'} inputAddress={inputAddress} inputChainId={selectedChainId} inputTokenId={inputTokenId} />,
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      {inputTokenId && !signature && (
                        <>
                          <Button mt={2} size="md" variant={'solid'} onClick={() => next()}>
                            <Text fontSize={'md'}>Continue</Text>
                          </Button>
                        </>
                      )}
                    </div>,
                  ]
                : []
            }
            footerStyle={{ backgroundColor: '#6a14fc', color: 'white', padding: '4px' }}
            bodyStyle={{ backgroundColor: '#6a14fc', color: 'white', padding: '4px' }}
            style={{ backgroundColor: '#6a14fc', color: 'white', paddingBottom: '10px', marginBottom: '16px', width: '350px' }}
            headStyle={{ backgroundColor: '#6a14fc', color: 'white', marginBottom: '-10px', fontSize: '18px' }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {steps[current].cardTitle}
                <Tooltip label="Reset NFT Data" aria-label="reset">
                  <IconButton
                    isRound={true}
                    variant="unstyled"
                    onClick={reset}
                    colorScheme="whiteAlpha"
                    aria-label="Done"
                    fontSize="18px"
                    icon={<RepeatIcon />}
                  />
                </Tooltip>
              </div>
            }>
            {steps[current].content}
          </Card>
        </Center>
      </div>
    </>
  )
}

export default AccountLogin
