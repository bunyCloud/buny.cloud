import { Flex, Heading, StackDivider } from '@chakra-ui/react'

import MintIBUNY from '../components/Forms/MintIBUNY'
import React, {  } from 'react'
import { Box, Text, VStack } from '@chakra-ui/react'


export default function MintFormLayout() {


   return (
    <>
      <Flex color="black" bg="white" justify="center" p={6} mt={10}>
        <VStack divider={<StackDivider borderColor="gray" />} spacing={4} align="stretch" p={2}>
          <Heading as="h4" size="md">
            Mint IBUNY NFT
          </Heading>
          <Box p={6} bg="ghostwhite" w={'auto'} border="1px solid silver">
            <Text as='b'> Currently only Telos Testnet</Text>
            <Text>Mint a NFT for free!</Text>
            <Text noOfLines={2}>Create a ERC6551 Token Bound Account </Text>
          </Box>
          
            <>
              <MintIBUNY  />
            </>
          
        
          
        </VStack>
      </Flex>
    </>
  )
}
