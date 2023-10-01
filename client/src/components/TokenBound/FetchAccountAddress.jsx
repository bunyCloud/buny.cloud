import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import BunyERC6551Registry from '../../contracts/BunyERC6551Registry.json';
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json';
import { HStack, Text } from '@chakra-ui/react';
import { AppContext } from '../../AppContext';

function FetchAccountAddress({ inputTokenId, inputAddress, onAccountAddress, inputChainId }) {
  const [accountAddress, setAccountAddress] = useState('');
  const {rpcUrl} = useContext(AppContext)

  useEffect(() => {
    const fetchAccountAddress = async () => {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const implementation = BunyERC6551Account.address;
      const salt = 1; // or some other unique number
      const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider);
      const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, inputTokenId, salt);
      console.log(`Account address: ${accountAddress}`);
      setAccountAddress(accountAddress);
      onAccountAddress(accountAddress)
    };

    fetchAccountAddress();
  }, [inputAddress, inputChainId, inputTokenId]);

 
  return (
    <>
  <Text>{accountAddress}</Text>
  
            
            
    </>
  );
}

export default FetchAccountAddress;
