import React, { useState, useEffect } from 'react'
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
} from '@chakra-ui/react'
import { EmailIcon } from '@chakra-ui/icons'
import WriteMessage from './WriteMessage'
import UserKeyStorage from '../../contracts/UserKeyStorage.json'
import { formatAddress } from '../../utils/formatMetamask'

function UserKeyTable() {
  const [users, setUsers] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const toast = useToast()

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')

    async function fetchUsers() {
    

      try {
        const contract = new ethers.Contract(UserKeyStorage.address, UserKeyStorage.abi, provider)

        const [addresses, usernames, encryptedKeys] = await contract.getAllUsers()
        const userList = addresses.map((address, index) => ({
          address,
          username: usernames[index],
          encryptedKey: encryptedKeys[index],
        }))
        setUsers(userList)
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

    fetchUsers()
  }, [toast])

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setIsDrawerOpen(true)
  }

  const handleSuccess = (tx) => {
    setIsDrawerOpen(tx)
  }

  return (
    <Box h={200} overflowX="auto" bg="InfoBackground" fontSize={'xs'} border="0.5px solid silver">
      <Table size={'sm'} variant="simple">
        <Thead>
          <Tr>
            <Th fontSize={'xs'}>User</Th>
            <Th fontSize={'xs'}>Address</Th>
            <Th fontSize={'xs'}>Public Key</Th>
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
              <Td fontSize={'xs'}>{formatAddress(user.address)}</Td>
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
