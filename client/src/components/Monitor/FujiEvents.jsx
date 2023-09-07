import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { List, Button } from 'antd'
import raffleFactory from 'contracts/avalanche/BunyRaffleFactory.json'
import raffleNft from 'contracts/avalanche/BunyRaffleNft.json'
import { BunyRaffleFactoryAddress } from 'contracts/config/networkAddress'

import { Table } from 'antd'


const columns = [
    {
      title: "Event Name",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "Event Data",
      dataIndex: "data",
      key: "data",
    },
  ];
  
const FujiEvents = () => {
  const [events, setEvents] = useState([])


  useEffect(() => {
      const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')

    const contract = new ethers.Contract(BunyRaffleFactoryAddress, raffleFactory.abi, provider)

    // Fetch past events
    contract.queryFilter('createEdition', 0, 'latest').then((results) => {
      const pastEvents = results.map((result) => {
        return {
          event: result.event,
          data: result.args,
          key: result.blockNumber + result.logIndex,
        }
      })
      setEvents(pastEvents)
    })

    // Listen for new events
    contract.on('createEdition', (result) => {
      const newEvent = {
        event: result.event,
        data: result.args,
        key: result.blockNumber + result.logIndex,
      }
      setEvents((prevEvents) => [...prevEvents, newEvent])
    })

    // Unsubscribe from event listener on component unmount
    return () => {
      contract.removeAllListeners()
    }
  }, [])

  return <Table columns={columns} dataSource={events} />
}

export default FujiEvents
