import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import WriteMessage from './WriteMessage';

function UserKeyTable({contractAddress, abi }) {
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')

    async function fetchUsers() {
      if (!provider) {
        toast({
          title: "Error",
          description: "Network provider not found",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const contract = new ethers.Contract(contractAddress, abi, provider);

      try {
        const [addresses, usernames, encryptedKeys] = await contract.getAllUsers();
        const userList = addresses.map((address, index) => ({
          address,
          username: usernames[index],
          encryptedKey: encryptedKeys[index]
        }));
        setUsers(userList);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }

    fetchUsers();
  }, [ contractAddress, abi, toast]);


  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleSuccess = (tx) => {
    setIsDrawerOpen(tx)
  }

  return (
    <Box overflowX="auto" bg='ghostwhite' fontSize={'small'} border='0.5px solid silver'>
    <Table size={'sm'} variant="simple" >
      <Thead>
        <Tr>
          <Th>Username</Th>
          <Th>User Address</Th>
          <Th>Public Key</Th>
        </Tr>
      </Thead>
      <Tbody fontSize={'small'}>
        {users.map((user, index) => (
          <Tr key={index}>
            <Td>
              <Button 
                leftIcon={<EmailIcon />} 
                size={'xs'} 
                variant={'solid'} 
                colorScheme='twitter'
                onClick={() => handleUserClick(user)}
              >
                {user.username}
              </Button>
            </Td>
            <Td>{user.address}</Td>
            <Td>{user.encryptedKey}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>

    {selectedUser && (
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} size="sm">
        <DrawerOverlay>
          <DrawerContent fontSize={'small'}>
            <DrawerCloseButton />
            <DrawerHeader>User Details</DrawerHeader>

            <DrawerBody mt={8}>
              <Text as='b' mb={2}><strong>Username:</strong> {selectedUser.username}</Text>

              <WriteMessage onSuccess={handleSuccess} userAddress={selectedUser.address} publicKey={selectedUser.encryptedKey} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    )}
  </Box>
  );
}

export default UserKeyTable;
