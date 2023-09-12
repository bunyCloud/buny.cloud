import React, { useState } from 'react';
import {
  Box,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { UnlockIcon } from '@chakra-ui/icons';

function Decryptor({ encryptedMessage, onDecryptedText }) {
  const [error, setError] = useState('');
  const toast = useToast();
  if (error) {
    console.log(error)
  }
  

  const handleDecrypt = async () => {
    try {
      const ethereum = window.ethereum;
      const decryptedText = await ethereum.request({
        method: 'eth_decrypt',
        params: [encryptedMessage, ethereum.selectedAddress],
      });
      onDecryptedText(decryptedText)
      setError('');

      // Toast notification for successful decryption
      toast({
        title: "Decryption Successful",
        description: "The message has been decrypted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <>

        <IconButton
  isRound={true}
  variant='solid'
  size={'sm'}
  onClick={handleDecrypt}
  colorScheme='twitter'
  aria-label='Done'
  fontSize='20px'
  icon={<UnlockIcon/>}
/>
    </>
  );
}

export default Decryptor;
