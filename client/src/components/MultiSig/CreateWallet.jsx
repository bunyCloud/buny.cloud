import { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, Heading } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyMultiFactory from '../../contracts/BunyMultiFactory.json'
import MultiFactory from '../../contracts/fuji/MultiFactory.json'
import { useToast } from "@chakra-ui/react";


const CreateWallet = () => {
  const { account, chainId } = useContext(AppContext)
  const [minSignatures, setMinSignatures] = useState('')
  const [contractName, setContractName] = useState('')
  // Inside your component...
  const toast = useToast();

  

  const createWallet = async () => {
    try {
      let contract;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      if (chainId === 41) {
        contract = new ethers.Contract(BunyMultiFactory.address, BunyMultiFactory.abi, signer);
      } else if (chainId === 43113) {
        contract = new ethers.Contract(MultiFactory.address, MultiFactory.abi, signer);
      }
  
      // Notifying user that the transaction has been initiated
      toast({
        title: "Transaction Initiated",
        description: "Creating multi-signature wallet...",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
  
      const tx = await contract.createMultiSigWallet(minSignatures, contractName);
      await tx.wait();
  
      // Notifying user that the transaction has been successful
      toast({
        title: "Transaction Successful",
        description: "Multi-signature wallet created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error:', error);
  
      // Notifying user that there was an error
      toast({
        title: "Transaction Failed",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mt={3} p={4} bg="InfoBackground" border="1px solid silver">
      <Heading size="sm">Create Wallet</Heading>

      <Text>Set the minimum number of signers to approve a transaction.</Text>
      <Text>Deploy contract with a unique identifier name for your vault.</Text>
      <Input size={'sm'} placeholder="Minimum Signatures" value={minSignatures} onChange={(e) => setMinSignatures(e.target.value)} />
      <Input size={'sm'} mt={2} placeholder="Contract Name" value={contractName} onChange={(e) => setContractName(e.target.value)} />
      <Button colorScheme="messenger" w="100%" mt={2} onClick={createWallet}>
        Create Wallet
      </Button>
    </Box>
  )
}

export default CreateWallet
