import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useEthers } from '@usedapp/core'
import { TelosRaffleFactoryAddress } from 'contracts/config/networkAddress'

function FactoryEventListener() {
  const [events, setEvents] = useState([])
  const [account] = useEthers()
  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')

  const contractAbi = [
    'event CreatedEdition(uint256 indexed editionId, address indexed creator, uint256 editionSize, address indexed editionContractAddress, uint256 minPlayers, uint256 maxTokens, uint256 salePrice)',
  ]
  const contract = new ethers.Contract(TelosRaffleFactoryAddress, contractAbi, provider)

    const filter = {
      address: TelosRaffleFactoryAddress,
      topics: [ethers.utils.id('CreatedEdition(uint256,address,uint256,address, uint256, uint256, uint256)')],
    }
    async function fetchEvents() {
      const query = await contract.queryFilter(filter)
      setEvents(query)
    }

    fetchEvents()

  return (
    <div>
      {events.map((event) => (
        <div key={event.transactionHash}>{JSON.stringify(event)}</div>
      ))}
    </div>
  )
}

export default FactoryEventListener
