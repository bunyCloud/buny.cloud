import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
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
  Text,
  IconButton,
} from '@chakra-ui/react'
import { EmailIcon, RepeatIcon } from '@chakra-ui/icons'
import WriteMessage from './WriteMessage'
import UserKeyStorage from '../../contracts/UserKeyStorage.json'
import FujiUserStorage from '../../contracts/fuji/FujiUserStorage.json'
import { formatAddress } from '../../utils/formatMetamask'
import { AppContext } from '../../AppContext'

function UserKeyTable() {
const {chainId} = useContext(AppContext)
  const [users, setUsers] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const toast = useToast()

  

  const contracts = {
    41: { // telos testnet
      address: UserKeyStorage.address,
      abi: UserKeyStorage.abi
    },
    43113: { // fuji testnet
      address: FujiUserStorage.address,
      abi: FujiUserStorage.abi
    }
  };

  const currentContractConfig = contracts[chainId];

  const fetchUsers = async () => {
    if (!window.ethereum) {
      console.log('Provider not found.');
      return; // Exit the function early if no provider is found
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(currentContractConfig.address, currentContractConfig.abi, signer);

      const [addresses, usernames, encryptedKeys] = await contract.getAllUsers();
      const userList = addresses.map((address, index) => ({
        address,
        username: usernames[index],
        encryptedKey: encryptedKeys[index]
      }));
      setUsers(userList);
    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  if (!currentContractConfig) {
    // handle the scenario where the chainId isn't one of the expected values
    console.error(`No contract configuration found for chainId: ${chainId}`);
    // Potentially handle this scenario with a toast or other UI element
    return null;
  }




  const handleUserClick = (user) => {
    setSelectedUser(user)
    setIsDrawerOpen(true)
  }

  const handleSuccess = (tx) => {
    setIsDrawerOpen(tx)
  }

  return (
    <Box h={200}  overflowX="auto" bg="InfoBackground" fontSize={'xs'} border="0.5px solid silver">
      <Table size={'sm'} variant="simple">
        <Thead>
          <Tr>
            <Th fontSize={'xs'}>User</Th>
            <Th fontSize={'xs'}>Address</Th>
            <Th fontSize={'xs'}>Public Key</Th>
            <Th>    <IconButton
          icon={<RepeatIcon />}
          aria-label="Reload"
          onClick={fetchUsers}
          variant="outline"
          colorScheme="blue"
        /></Th>
        
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, index) => (
            <Tr key={index}>
              <Td>
                <Button leftIcon={<EmailIcon />}  w={150} variant={'solid'} colorScheme="twitter" onClick={() => handleUserClick(user)}>
                  <Text overflow={'hidden'} p={6}>
                  {user.username}
                  </Text>
                </Button>
              </Td>
              <Td fontSize={'xs'}>{user.address}</Td>
              <Td fontSize={'xs'}>{formatAddress(user.encryptedKey)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedUser && (
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} size="xs">
          <DrawerOverlay>
            <DrawerContent fontSize={'small'}>
              <DrawerCloseButton />
              <DrawerHeader>Compose</DrawerHeader>

              <DrawerBody mt={1}>
                <WriteMessage
                  onSuccess={handleSuccess}
                  userAddress={selectedUser.address}
                  publicKey={selectedUser.encryptedKey}
                  username={selectedUser.username}
                />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </Box>
  )
}

export default UserKeyTable
