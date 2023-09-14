import React, {useState} from 'react';
import { Box, Button, Center,  Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

function Encryptor({handleSubmit, encryptionKey, clearText, onEncryption }) {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const toast = useToast();

  const handleEncryption = async () => {
    try {
      const response = await axios.post('http://localhost:5000/encrypt', {
        encryptionKey,
        cleartext: clearText,
      });
      
      return response.data.encryptedMessage;

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

  const handleSubmission = async () => {
    // Encrypt the message first
    const encrypted = await handleEncryption();
    
    // Display the 'Message is encrypting' toast for 3 seconds
    toast({
      title: "Please wait",
      description: "Message is encrypting...",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    // Wait for 3 seconds before displaying the encrypted message and submitting
    setTimeout(async () => {
      setEncryptedMessage(encrypted);  // Display the encrypted message
      onEncryption(encrypted); // Pass the encrypted message to the parent
      await handleSubmit();
    }, 3000);
  };

  return (
    <Box>
     <Center mt={2} mb={2}>
      <Button  size="sm" w="100%" colorScheme="messenger" onClick={handleSubmission}>
        Encrypt
      </Button>
      </Center>
      
    <>          
    
        
        <Text noOfLines={1} overflow={'auto'}  bg="white" fontSize={'12px'} p={2} border='0.5px solid silver'>
          {encryptedMessage && (
            <>
            <Text mt={2} as='b'>Encrypted: </Text>
            <Text p={1}>
              {encryptedMessage}
            </Text>
            </>
          )}
        </Text>
 
        </>
    
    </Box>
  );
}

export default Encryptor;
