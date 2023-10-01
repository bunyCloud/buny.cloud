import { Button, Center, HStack, Text } from '@chakra-ui/react'

import { useSDK } from '@metamask/sdk-react'

export const HeaderConnect = () => {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useSDK()

  return (
    <div>

          <Center>
          
            <HStack>
              <div>
                {!hasProvider && (
                  <a href="https://metamask.io" target="_blank" rel="noreferrer">
                    <Text fontSize={'sm'}>Install MetaMask</Text>
                  </a>
                )}

                {!wallet.accounts.length > 0 && (
                  <>
                  <Button w={'120px'} size={'xs'} colorScheme='twitter'  border="1px solid white" disabled={isConnecting} onClick={connectMetaMask}>
                    Connect 
                  </Button>
                  </>
                )}
                
          
              </div>
            </HStack>
          </Center>
   
    </div>
  )
}
