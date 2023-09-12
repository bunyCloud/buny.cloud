
//Import libraries and components
import { useEffect, useState } from 'react';
import { ethers, utils } from "ethers";
import { Box, Text } from '@chakra-ui/react';

// Placeholder ABI to fetch balance (ERC20 standard)
const tokenABI = [
    "function balanceOf(address owner) view returns (uint256)"
  ];

function BalanceDashboard({inputAddress}) {
  //State variables
  const [tokens, setTokens] = useState([])
  const [address, setAddress] = useState(inputAddress)

  const [tokenBalances, setTokenBalances] = useState({});

  const tokenAddresses = {
    "BUNY": "0x0F68453C094D6073FdC9Aa82641CD7902f80aA44",
    "WETH": "0x75164Da7CEb923c4a9F3814Be99eF29aB23C6C5A"
    // Add other token addresses as needed
  };


  //Function to fetch tokens
  useEffect(() => {
    const fetchBalances = async () => {
    if (!utils.isAddress(address)){
      alert('Please enter a valid Ethereum wallet address')
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider("https://testnet.telos.net/evm");
    const balances = {};

    for (const [tokenName, tokenAddress] of Object.entries(tokenAddresses)) {
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const balance = await tokenContract.balanceOf(inputAddress);
      balances[tokenName] = balance.toString();
    }

    setTokenBalances(balances);
};

fetchBalances();
}, [address, inputAddress, tokenAddresses]);
  
  return(
    <Box color='white' p={4} borderWidth={0} borderRadius="lg" maxWidth={360}>
      <Text noOfLines={3} fontSize="sm" mb={2}>Account Token Balances {inputAddress}:</Text>
      {Object.entries(tokenBalances).map(([tokenName, balance]) => (
        <Text fontSize={'sm'} key={tokenName}>{tokenName}: {ethers.utils.formatEther(balance)}</Text>
      ))}
    </Box>
    
  );
}

export default BalanceDashboard;