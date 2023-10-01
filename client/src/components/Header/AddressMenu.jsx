import React, { useContext } from 'react'
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, HStack, Button, useToast } from '@chakra-ui/react'
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { formatAddress } from '../../utils/formatMetamask'
import { Text } from '@chakra-ui/react'
import { HeaderConnect } from './HeaderConnect'
import { AppContext } from '../../AppContext'

const AddressMenu = ({ balance }) => {
  const toast = useToast()
  const { account, setAccount } = useContext(AppContext)

  const handleDisconnect = () => {
    // If using the injected window.ethereum object
    if (window.ethereum && typeof window.ethereum.disconnect === 'function') {
      window.ethereum.disconnect();
    }

    // Reset the account state to null
    setAccount(null);

    toast({
      title: 'Disconnected',
      description: 'Successfully disconnected from MetaMask.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const copyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(account)
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Menu>
      {account && (
        <MenuButton
          px={1}
          py={1}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          bg="white"
          borderColor="#6a14fc"
          _hover={{ bg: 'ghostwhite' }}
          _expanded={{ bg: 'white' }}
          _focus={{ boxShadow: 'outline' }}>
          <HStack>
            <Text color="#6a14fc" fontSize={'16px'}>
              {formatAddress(account)}
            </Text>

            <ChevronDownIcon color="#6a14fc" />
          </HStack>
        </MenuButton>
      )}
      {!account && (
        <>
          <HeaderConnect />
        </>
      )}
      <MenuList border="1px solid #6a14fc"  color='purple'>
        <Center>
          <HStack>
            <Text textAlign="right" fontSize={'12px'} h="100%" pr={4}>
              Balance: {balance} TLOS
            </Text>
          </HStack>
        </Center>
        <MenuDivider />
        <MenuItem icon={<CopyIcon />} onClick={copyAddress}>
          Copy Address
        </MenuItem>
        <MenuItem icon={<ExternalLinkIcon />}>
          <a
            className="text_link tooltip-bottom"
            href={`https://testnet.teloscan.io/address/${account}`}
            target="_blank"
            data-tooltip="Open in Block Explorer"
            rel="noreferrer">
            View in Explorer
          </a>
        </MenuItem>
        <MenuDivider />
        <MenuItem>
          <Button size={'sm'} w="100%" colorScheme="twitter" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default AddressMenu
