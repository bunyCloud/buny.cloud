import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { Box, Button, Input, FormControl, Center, VStack, useToast, Text, HStack, Link } from '@chakra-ui/react'
import WhatNetworkName from '../../utils/WhatNetworkName'
import { AppContext } from '../../AppContext'
import FujiUserStorage from '../../contracts/fuji/FujiUserStorage.json'
import UserKeyStorage from '../../contracts/UserKeyStorage.json'

function UserStorage({ publicKey,  contractAddress, abi }) {
  const {account, chainId} = useContext(AppContext)
  const userAddress = account
  const [username, setUsername] = useState('')
  const [userCount, setUserCount] = useState('')
  const [msgCount, setMsgCount] = useState('')
  const toast = useToast()
  const [contractName, setContractName] = useState([])

  let contract
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  if (chainId === 41) {
    contract = new ethers.Contract(UserKeyStorage.address, UserKeyStorage.abi, signer)
  } else if (chainId === 43113) {
    contract = new ethers.Contract(FujiUserStorage.address, FujiUserStorage.abi, signer)
  }

  useEffect(() => {
    async function fetchContractName() {
    try {
        const name = await contract.contractName()
        const users = await contract.getTotalUsers()
        setUserCount(users.toString())
        const msgs = await contract.messageCounter()
        setMsgCount(msgs.toString())
        setContractName(name)
      } catch (error) {
        console.log('errors not tears')
      }
    }

    fetchContractName()
  }, [abi, contract, contractAddress])

  const addUser = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contractWithSigner = contract.connect(signer)
      const result = await contractWithSigner.addWallet(userAddress, username, publicKey)
      console.log(result)
      toast({
        title: 'Transaction successful',
        description: `User added successfully! Reload page to continue. Transaction hash: ${result.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <VStack spacing={4}>
      <Box bg="InfoBackground" w="100%" mt={0} p={4}>
        <Box p={4} border="0.5px solid silver" bg="white">
          <HStack>
          <Text fontSize={'small'}>Network: </Text>
          <WhatNetworkName chainId={chainId}/>
          </HStack>
          
          <HStack>
            <Text >Contract: {contractName && <>{contractName}</>}</Text>
            <Link href={`https://testnet.teloscan.io/address/${contractAddress}`} target="_blank">
              View on Explorer
            </Link>
          </HStack>
          <HStack>
            <HStack gap="auto" >
              <Text>Total Users: </Text>
              <Text> ({userCount})</Text>
            </HStack>
            <HStack gap="auto">
              <Text>Total Messages: </Text>
              <Text> ({msgCount})</Text>
            </HStack>
          </HStack>
        </Box>
        {publicKey && (
          <>
            {/*
        <FormControl>
          <FormLabel>User Address</FormLabel>
          <Text border='0.5px solid silver' p={2} fontSize={'small'} w='100%' bg='ghostwhite'>
            {account}
          </Text>
    
        </FormControl>
        <FormControl>
          <FormLabel>Encrypted Key</FormLabel>
          <Text border='0.5px solid silver' p={2} fontSize={'small'} w='100%' bg='ghostwhite'>
            {publicKey}
          </Text>
          </FormControl>
        */}

            <FormControl mt={2} p={2}>
              <Text>Create a username to add your account to directory listing.</Text>
              <Input bg="white" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>

            <Center>
              <Button maxWidth={360} mt={1} w="100%" colorScheme="twitter" onClick={addUser}>
                Add Wallet
              </Button>
            </Center>
          </>
        )}
      </Box>
    </VStack>
  )
}

export default UserStorage
