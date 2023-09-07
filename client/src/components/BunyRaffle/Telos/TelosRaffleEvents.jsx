import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useEthers } from '@usedapp/core'

function TelosRaffleEvents({ contractAddress }) {
  const [events, setEvents] = useState([])
  const { account, chainId } = useEthers()
  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')
  const contractAbi = [
    'event CreatedEdition(uint256 indexed editionId, address indexed creator, uint256 editionSize, address indexed editionContractAddress, uint256 minPlayers, uint256 maxTokens, uint256 salePrice)',
    '  event Rafflestarted(address minter, uint256 startTime)',
  ]
  const contract = new ethers.Contract(contractAddress, contractAbi, provider)

  useEffect(() => {
    async function fetchEvents() {
      const filter = {
        address: contractAddress,
        topics: [
          ethers.utils.id('CreatedEdition(uint256,address,uint256,address,uint256,uint256,uint256)'),
          ethers.utils.id('Rafflestarted(address,uint256)'),
        ],
      }
      const query = await contract.queryFilter(filter)
      setEvents(query)
    }

    fetchEvents()
  }, [account, contract, contractAddress])

  return (
    <div>
      {events.map((event) => (
        <div key={event.transactionHash}>{JSON.stringify(event)}</div>
      ))}
    </div>
  )
}

export default TelosRaffleEvents
