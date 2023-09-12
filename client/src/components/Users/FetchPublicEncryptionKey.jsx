import { Box, Button, Center, HStack, IconButton, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { CopyIcon } from '@chakra-ui/icons'

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
      <Box p={2} w="100%" bg='ghostwhite' border='0.5px solid silver'>
        <Text p={2}>Request your MetaMask Public Encryption Key</Text>
        <Center>
          
        <Button mt={1} w="100%" maxWidth={360} colorScheme="twitter" onClick={handleRequestKey}>
          Request
        </Button>

        </Center>
        {error && <div style={{ color: 'red' }}>{error}</div>}
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
