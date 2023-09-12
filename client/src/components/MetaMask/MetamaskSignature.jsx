import { Box, Button, Center, Grid, GridItem, HStack, Text, VStack, useToast } from '@chakra-ui/react'
import { ethers, utils } from 'ethers'
import React, { useState, useEffect, useContext } from 'react'
import { CopyIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyERC6551Registry from '../../contracts/BunyERC6551Registry.json'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'
import useSessionStorageState from 'use-session-storage-state'
import { formatAddress } from '../../utils/formatMetamask'

const MetamaskSignature = ({ isActive, inputName, accountAddress, inputAddress, networkName, tokenId }) => {
  const toast = useToast()
  const [balance, setBalance] = useState()
  const { account, chainId, setAccount, setAccountAddress, logged } = useContext(AppContext)
  const [provider, setProvider] = useState('')
  const [signature, setSignature] = useSessionStorageState(null)
  const [address, setAddress] = useState('')
  const [verifyAddress, setVerifyAddress] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')

  const mess = `Account: ${accountAddress}\nNFT: ${inputAddress}\nTokenId: ${tokenId.toString()}\nName: ${inputName}\nNetwork: ${networkName}`
  const dataRows = mess.split('\n')

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
    // Step 2: Show a toast notification when the copy action is successful
    toast({
      title: 'Copied to Clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  useEffect(() => {
    //*
    //  Load NFT Account address
    const checkAccount = async (inputChainId) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const implementation = BunyERC6551Account.address
      //const chain = formatChainAsNum(inputChainId)
      const salt = '1' // or some other unique number
      const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
      //await registryContract.createAccount(implementation, inputChainId, inputAddress, tokenId, salt, initData)
      const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, tokenId, salt)
      console.log(`This NFT Account Address is: ${accountAddress}`)
      setAccountAddress(accountAddress)
    }
    checkAccount()
  }, [inputAddress, setAccountAddress, tokenId])

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!')
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          console.log(result)
          //setLogged(true);
          const address = utils.getAddress(result[0])
          setAccount(address)
          const newProvider = new ethers.providers.Web3Provider(window.ethereum)
          setProvider(newProvider)
          handleBalance(address, newProvider)
        })
        .catch(() => {
          console.log('Could not detect Account')
        })
    } else {
      console.log('Need to install MetaMask')
    }
  }

  const handleBalance = () => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setBalance(ethers.utils.formatEther(balance))
      })
      .catch(() => {
        console.log('Could not detect the Balance')
      })
  }

 

  // Select NFT and create ERC6551 token bound account
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createAccount = async (tokenId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const implementation = BunyERC6551Account.address // Contract address of account contract
    const salt = '1' // can be any random number
    const initData = '0x' // not being used
    const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, signer)
    await registryContract.createAccount(implementation, chainId, inputAddress, tokenId, salt, initData)
    const accountAddress = await registryContract.account(implementation, chainId, inputAddress, tokenId, salt)
    setAccountAddress(accountAddress)
  }


  const handleSign = async () => {
    const message = mess
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(message)
    const address = await signer.getAddress()
    setSignature(signature.toString())
    setAddress(address)
    console.log('sig : ' + signature)
  }
  
  useEffect(() => {
    if (signature) {
      const verify = () => {
        const actualAddress = utils.verifyMessage(mess, signature)
        console.log(actualAddress)
        setVerifyAddress(actualAddress)
        if (signature) {
          console.log('valid signature')
          setVerificationStatus('Account login verification successful!')
          //onSignature(signature)
        } else {
          console.log('wrong')
          setVerificationStatus('Invalid')
        }
      }
      verify()
    }
  }, [mess, signature])

  return (
    <Box p={2}>
      {!logged ? (
        <VStack spacing={3}>
          <Text fontSize="12px">Log in with Metamask wallet</Text>
          <Button onClick={handleLogin} colorScheme="twitter">
            Connect
          </Button>
        </VStack>
      ) : (
        <VStack spacing={3}>
          {!signature && isActive && (
            <>
              <Button w="100%" onClick={() => handleSign()} size={'sm'} colorScheme="twitter">
                Sign & Login
              </Button>
            </>
          )}
          {signature && (
            <>
            <Box w={'auto'}  p={6} border="1px solid silver">
                <Text as="b" color="white">
                  Signature
                </Text>
                <Box bg='white' w='auto'  color='black' >
                <Text noOfLines={6}  p={3} fontSize="14px" color="black"   w={'100%'} maxWidth={365}>
                  {signature && <>{signature}</>}
                </Text>
                </Box>
                <Text noOfLines={2} p={2} fontSize={'sm'} color="white">
                  Signature is saved in browser session storage until browser or tab is closed.
                </Text>
              </Box>

              <Box>
                <Text as="b" color="white">
                  Signature receipt
                </Text>
                <Center>
                  <Grid templateColumns="repeat(2, 1fr)" gap={'2px'} p={2} maxWidth={400}>
                    {dataRows.map((rowData, index) => {
                      const [key, value] = rowData.split(':')
                      return (
                        <React.Fragment key={index}>
                          <GridItem w={100} p={1}>{key}</GridItem>
                          <GridItem p={1} overflow='auto' w={'auto'}>
                            <HStack gap="auto">
                              <Text noOfLines={2} overflow={'auto'}>
                                {value && <>{formatAddress(value)}</>}
                              </Text>
                              {index < 2 && (
                                <IconButton
                                  size="xs"
                                  variant={'unstyled'}
                                  aria-label="Copy to Clipboard"
                                  icon={<CopyIcon />}
                                  onClick={() => copyToClipboard(value)}
                                />
                              )}
                            </HStack>
                          </GridItem>
                        </React.Fragment>
                      )
                    })}
                  </Grid>
                </Center>
              </Box>

            
              <Box bg="ghostwhite" p={3} rounded="md" w={'100%'} border="1px solid silver">
                <Center>
                  <Text fontSize="14px" color="purple" bg="white" p={4} border="1px solid silver">
                    {verificationStatus.toString()}
                  </Text>
                </Center>

                <Center>
                  <Text>
                    {!isActive && (
                      <>
                        <Button variant={'solid'} colorScheme="twitter" w="100%" maxWidth={300} onClick={createAccount}>
                          Create Account
                        </Button>
                      </>
                    )}
                  </Text>
                </Center>
              </Box>
            </>
          )}
        </VStack>
      )}
    </Box>
  )
}

export default MetamaskSignature
