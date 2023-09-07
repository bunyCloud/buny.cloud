import { useState, useEffect } from 'react'
import { useEthers } from '@usedapp/core'
import { Table } from 'antd'
import { Contract, ethers } from 'ethers'
import raffleNft from 'contracts/BunyRaffleNft.json'



const RaffleEvents = ({raffleAddress}) => {
  const { account, library } = useEthers()


  const [events, setEvents] = useState([])


  useEffect(() => {
    const fetchEvents = async () => {
      if (library) {
        const contract = new Contract(raffleAddress, raffleNft.abi, library)
        const filter = {
          address: raffleAddress,
          fromBlock: 0,
          toBlock: 'latest',
        }
        const logs = await library.getLogs(filter)
        const formattedLogs = logs.map((log) => ({
          blockNumber: log.blockNumber,
          event: log.topics[0],
          args: contract.interface.parseLog(log).args,
        }))
        setEvents(formattedLogs)
      }
    }
    fetchEvents()
  }, [library])


  const columns = [
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
    },
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
    },
    {
        title: 'Arguments',
        dataIndex: 'args',
        key: 'args',
        render: args => {
          const formattedArgs = [];
          for (const key in args) {
            if (typeof args[key] === 'object' && args[key]._isBigNumber) {
              formattedArgs.push(
                <div key={key}>
                  {key}: {ethers.utils.formatEther(args[key], "ether")}
                </div>
              );
            } else {
              formattedArgs.push(
                <div key={key}>
                  {key}: {args[key].toString()}
                </div>
              );
            }
          }
          return <div style={{ display: 'flex', flexDirection: 'column' }}>{formattedArgs[1]}</div>;
        },
      },
  ]

  return  <Table
  columns={columns}
  dataSource={events}
  pagination={{ pageSize: 10 }}
  style={{ maxWidth: '500px' }}
/>
}
export default RaffleEvents
