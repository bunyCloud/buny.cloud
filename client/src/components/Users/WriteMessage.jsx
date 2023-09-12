import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Text, Box, Button, Input, FormControl, FormLabel, useToast, Center, Textarea } from '@chakra-ui/react'
import UserKeyStorage from '../../contracts/UserKeyStorage.json'
import Encryptor from './Encryptor'

function WriteMessage({ userAddress, publicKey, onSuccess }) {
  const [message, setMessage] = useState('')
  const [encryptedMessage, setEncryptedMessage] = useState('')

  const toast = useToast()
  const contractAddress = UserKeyStorage.address
  const contractABI = UserKeyStorage.abi

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractABI, signer)

  const handleEncryptedMessage = (encryptedMsg) => {
    setEncryptedMessage(encryptedMsg)
  }

  const handleSubmit = async () => {
    try {
      const tx = await contract.addMessage(userAddress, encryptedMessage)
      await tx.wait()
      onSuccess(false)
      toast({
        title: 'Success',
        description: 'Message added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box overflowX="auto" bg="ghostwhite" p={2} fontSize={'small'} border="0.5px solid silver">
      <FormControl>
        <Text p={1} w="100%" as="b">
          User Address
        </Text>
        <Text bg="white" p={1} noOfLines={2} overflow={'auto'} border="0.5px solid silver">
          {userAddress}
        </Text>
        <Text p={1} w="100%" as="b">
          Public Key
        </Text>
        <Text bg="white" p={1} noOfLines={2} overflow={'auto'} border="0.5px solid silver">
          {publicKey}
        </Text>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Message to Encrypt</FormLabel>

        <Textarea bg="white" placeholder="Enter your message" value={message} size={'sm'} onChange={(e) => setMessage(e.target.value)} />
      </FormControl>
      <Encryptor clearText={message} encryptionKey={publicKey} onEncryption={handleEncryptedMessage} />
      <Center>
        <Button w="100%" maxWidth={360} colorScheme="twitter" mt={4} onClick={handleSubmit}>
          Submit Message
        </Button>
      </Center>
    </Box>
  )
}

export default WriteMessage
