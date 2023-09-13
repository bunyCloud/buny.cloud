import React, {useState} from 'react';
import { Box, Button, Center, Input, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

function Encryptor({ encryptionKey, clearText, onEncryption }) {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const toast = useToast();

  const handleEncryption = async () => {
    try {
      const response = await axios.post('http://localhost:5000/encrypt', {
        encryptionKey,
        cleartext: clearText,
      });
      setEncryptedMessage(response.data.encryptedMessage);
      onEncryption(response.data.encryptedMessage); // Pass the encrypted message to the parent

    } catch (error) {
      console.error('Error encrypting message:', error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
   
      
      
      <Center mt={2} mb={2}>
      <Button  size="sm" w="100%" colorScheme="messenger" onClick={handleEncryption}>
        Encrypt
      </Button>
      </Center>
      {encryptedMessage && (
        <>
          
        <Text mt={2} as='b'>Encrypted: </Text>
        <Text noOfLines={2} overflow={'auto'}  bg="white" fontSize={'12px'} p={2} border='0.5px solid silver'>
          {encryptedMessage}
        </Text>
        </>
      )}
    </Box>
  );
}

export default Encryptor;
