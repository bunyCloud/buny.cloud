import React, { useState } from 'react'

// Importing contract addresses
import {
  BunyBankFujiAddress,
  TelosTestnetRaffleFactoryAddress,
  TelosTestnetRaffleNftAddress,
  avalancheRaffleNftAddress,
  avalancheRaffleFactoryAddress,
  telosTestnetOracleAddress,
  BunyBankTelosAddress,
  TelosBunyBankAddress,
  TelosRaffleNftAddress,
  TelosRaffleFactoryAddress,
  MumbaiBankAddress,
  MumbaiRaffleFactoryAddress,
  MumbaiRaffleNftAddress,
  FantomTestnetBankAddress,
  FantomTestnetRaffleNftAddress,
  FantomTestnetRaffleFactoryAddress,
} from '../contracts/config/networkAddress'
import { VStack } from '@chakra-ui/react'
import FactoryEventListener from './FactoryEventListener'

function ContractDropdown() {
  const [contractAddress, setContractAddress] = useState(null)
  

  const handleChange = (event) => {
    setContractAddress(event.target.value)
  }

  const handlechange = (event) => {
    setContractAddress(event.target.value)
  }

  return (
    <>
      <VStack>
        <div>
          <label htmlFor="contract-select">Mainnet Contracts:</label>
          <select id="contract-select" value={contractAddress} onChange={handleChange}>
            <option value="">--Select an address--</option>

            <option value={avalancheRaffleNftAddress}>Avalanche Raffle NFT</option>
            <option value={avalancheRaffleFactoryAddress}>Avalanche Raffle Factory</option>

            <option value={TelosBunyBankAddress}>Telos Buny Bank</option>
            <option value={TelosRaffleNftAddress}>Telos Raffle NFT</option>
            <option value={TelosRaffleFactoryAddress}>Telos Raffle Factory</option>
          </select>
          <div style={{ fontSize: '12px' }}>
            {contractAddress &&
              `${contractAddress.slice(0, 16)}...${contractAddress.slice(
                contractAddress.length - 16,
                contractAddress.length
              )}`}
          </div>
        </div>
        <div>
          <label htmlFor="contract-select">Select a Testnet contract:</label>
          <select id="contract-select" value={contractAddress} onChange={handlechange}>
            <option value="">--Select an address--</option>
            <option value={TelosTestnetRaffleFactoryAddress}>Telos Testnet Raffle Factory</option>
            <option value={TelosTestnetRaffleNftAddress}>Telos Testnet Raffle NFT</option>
            <option value={MumbaiRaffleFactoryAddress}>Mumbai Raffle Factory</option>
            <option value={MumbaiRaffleNftAddress}>Mumbai Raffle NFT</option>
            <option value={FantomTestnetRaffleNftAddress}>Fantom Testnet Raffle NFT</option>
            <option value={FantomTestnetRaffleFactoryAddress}>Fantom Testnet Raffle Factory</option>
          </select>
          <div style={{ fontSize: '12px' }}>
            {contractAddress &&
              `${contractAddress.slice(0, 16)}...${contractAddress.slice(
                contractAddress.length - 16,
                contractAddress.length
              )}`}
          </div>
        </div>
      </VStack>
  
    </>
  )
}

export default ContractDropdown
