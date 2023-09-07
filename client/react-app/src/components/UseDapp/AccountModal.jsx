import {
  Box,
  Button,
  Flex,
  Link,
  Center,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react'
import { useClipboard } from '@chakra-ui/react'
import { ExternalLinkIcon, CopyIcon } from '@chakra-ui/icons'
import { useEthers } from '@usedapp/core'
import Identicon from './Identicon'
import { Tag } from 'antd-mobile'
import { useToast } from '@chakra-ui/react'

export default function AccountModal({ isOpen, onClose }) {
  const { account, deactivate, chainId } = useEthers()
  const toast = useToast()
  const { onCopy, value, setValue, hasCopied } = useClipboard(account)
  function getNetworkName(chainId) {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet'
      case 3:
        return 'Ropsten '
      case 4:
        return 'Rinkeby '
      case 5:
        return 'Goerli '
      case 40:
        return 'Telos'
      case 41:
        return 'Telos '

      case 42:
        return 'Kovan '
      case 56:
        return 'Binance Smart Chain Mainnet'
          case 97:
        return 'Binance Smart Chain '
      case 137:
        return 'Polygon'
      case 250:
        return 'Fantom'
        case 4002:
          return 'Fantom Testnet'
      case 42220:
        return 'Celo Mainnet'
      case 42161:
        return 'Arbitrum One'
      case 43113:
        return 'Fuji'
      case 80001:
        return 'Mumbai'
          case 43114:
        return 'Avalanche'
      case 43113:
        return 'Fuji'
      default:
        return 'Unknown network'
    }
  }
    const networkName = getNetworkName(chainId)

    

  function handleCopy() {
    onCopy()
    toast({
      render: () => (
        <Box color="white" p={3} bg="blue.500">
          Address copied to clipboard!
        </Box>
      ),
      duration: 1800,
      isClosable: true,
    })
  }

  function handleDeactivateAccount() {
    deactivate()
    onClose()
  }
  return (
    <>
      <Box borderRadius="3xl" border="2px" borderStyle="solid" borderColor="white" px={2} pt={4} pb={2} mb={3}>
        <Center>
        <HStack>
          <Tag 
                      style={{ '--text-color': 'black' }}

          color="#bbdccb" >
            
            <HStack>
            <div>Network:</div>
              <NetworkName chainId={chainId} />
              </HStack>
            
          </Tag>
          <Tag color="#bbdccb"
          style={{ '--text-color': 'black' }}
          >
          <HStack>
          <div>
            Chain Id:</div><div>{chainId}</div>
            </HStack>
          </Tag>
        </HStack>
</Center>
        <Center>
          <Flex bg="#fdeeb3" alignItems="center" mt={4} mb={4} lineHeight={1}>
            <Text color="black" fontSize="12px" fontWeight="semibold" ml="2" lineHeight="1.1">
              {account}
            </Text>
            <Button onClick={handleCopy}>
              <CopyIcon mr={1} />
            </Button>
          </Flex>
        </Center>
  
      </Box>
    </>
  )
}
