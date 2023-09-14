import { Box, Button, Center, HStack, IconButton, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { AddIcon, CopyIcon } from '@chakra-ui/icons'
import { UserOutlined } from '@ant-design/icons';

function FetchPublicEncryptionKey({ onPublicKey }) {
  const [encryptionKey, setEncryptionKey] = useState('')
  const [fetchedAccounts, setFetchedAccounts] = useState([])
  const [error, setError] = useState('')


  useEffect(() => {
    async function fetchAccounts() {
      try {
        const ethereum = window.ethereum

        if (!ethereum) {
          throw new Error('MetaMask not detected')
        }

        const enabledAccounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        setFetchedAccounts(enabledAccounts)
        setError('')
        //  onAccountsFetched(enabledAccounts); // Pass the accounts to the parent component
      } catch (err) {
        setError('An error occurred while fetching accounts')
        console.error(err)
      }
    }

    fetchAccounts()
  }, [])

  // Request public encryption key for connected wallet
  const handleRequestKey = async () => {
    const ethereum = window.ethereum
    const response = await ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [fetchedAccounts[0]],
    })
    setEncryptionKey(response)
    onPublicKey(response)
  }

  return (
    <>
      <Box  p={2} bg="InfoBackground" border="1px solid silver">
        <Text >Request your MetaMask Public Encryption Key</Text>
        <Center>
          
        <Button
        variant={'outline'}
        color="purple"
        w="100%"
        border='1px solid purple'
        leftIcon={<UserOutlined />}
        onClick={handleRequestKey}
        >
        <HStack pr={2} gap="auto">
          <IconButton
            size={'xs'}
            variant={'unstyled'}
            colorScheme="purple"
            aria-label="Action"
            icon={<AddIcon/>}
          />

          <Text>Request Public Key</Text>
        </HStack>
      </Button>
        


        </Center>
        
        {encryptionKey && (
          <div>
            
              
              <HStack justify={'center'} mb={-1}  w='100%' fontSize={'small'} p={2} mt={2}>
              <Text>Public Key</Text>
              <Text bg='white' p={1} noOfLines={2} overflow={'auto'} border='0.5px solid silver'>
                <code>{encryptionKey.toString()}</code>
                <IconButton
                  size={'xs'}
                  variant={'unstyled'}
                  icon={<CopyIcon />}
                  aria-label="Copy Account Address"
                  onClick={() => {
                    navigator.clipboard.writeText(encryptionKey)
                  }}
                />
                </Text>
              </HStack>
            
          </div>
        )}
      </Box>
    </>
  )
}

export default FetchPublicEncryptionKey
