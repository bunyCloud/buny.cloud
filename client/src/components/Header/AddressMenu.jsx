import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, HStack, Button, useToast } from '@chakra-ui/react';
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { formatAddress } from '../../utils/formatMetamask';
import { Text } from '@chakra-ui/react';
import { HeaderConnect } from './HeaderConnect';

const AddressMenu = ({account, balance, handleDisconnect}) => {
  const toast = useToast();

  const copyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(account);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Menu>
     {account && (
      <MenuButton
        px={1}
        py={1}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        borderColor="#6a14fc"
        _hover={{ bg: 'red' }}
        _expanded={{ bg: 'white' }}
        _focus={{ boxShadow: 'outline' }}
      >
      
      
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
      <MenuList border="1px solid #6a14fc">
      <Center>
      <HStack>
      <Text textAlign="right"  fontSize={'12px'} h="100%" pr={4}>Balance: {balance} TLOS</Text>
      </HStack>
      </Center>
      <MenuDivider/>
        <MenuItem icon={<CopyIcon/>} onClick={copyAddress}>Copy Address</MenuItem>
        <MenuItem icon={<ExternalLinkIcon/>}>
          <a
            className="text_link tooltip-bottom"
            href={`https://testnet.teloscan.io/address/${account}`}
            target="_blank"
            data-tooltip="Open in Block Explorer"
            rel="noreferrer"
          >
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
  );
};

export default AddressMenu;
