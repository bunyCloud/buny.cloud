import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FujiERC6551Registry from '../../contracts/fuji/FujiERC6551Registry.json'
import FujiERC6551Account from '../../contracts/fuji/FujiERC6551Account.json'
import { HStack, Text } from '@chakra-ui/react';
import WhatIsBoundAvalanche from '../../utils/WhatIsBoundAvalanche';

function FetchAccountAddressFuji({ inputTokenId, inputAddress, onAccountAddress, inputChainId }) {
  const [accountAddress, setAccountAddress] = useState('');
  const [isActive, setIsActive] = useState(false)

  const handleIsActive = (value) => {
    setIsActive(value)
  }

  useEffect(() => {
    const fetchAccountAddress = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
      const implementation = FujiERC6551Account.address;
      const salt = '1'; // or some other unique number
      const registryContract = new ethers.Contract(FujiERC6551Registry.address, FujiERC6551Registry.abi, provider);
      const accountAddress = await registryContract.account(implementation, inputChainId, inputAddress, inputTokenId, salt);
      console.log(`Account address: ${accountAddress}`);
      setAccountAddress(accountAddress);
      //onAccountAddress(accountAddress)
    };

    fetchAccountAddress();
  }, [inputAddress, inputChainId, inputTokenId, onAccountAddress]);

 
  return (
    <>
    
  <WhatIsBoundAvalanche accountAddress={accountAddress} onIsActive={handleIsActive} />
  
            
            
    </>
  );
}

export default FetchAccountAddressFuji;
