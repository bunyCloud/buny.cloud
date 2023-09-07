import { useState, useEffect } from 'react'
import { useEthers } from '@usedapp/core'
import { List, Table } from 'antd'
import { Contract, ethers } from 'ethers'
import { Box, VStack, Tag, HStack,  } from '@chakra-ui/react'
import raffleFactory from 'contracts/telos/BunyRaffleFactory.json'
import { TelosRaffleFactoryAddress, TelosRaffleNftAddress } from 'contracts/config/networkAddress'

const TelosRaffleEvents = () => {
  const { account, library } = useEthers()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')

      const contract = new ethers.Contract(TelosRaffleFactoryAddress, raffleFactory.abi, provider);
        // Fetch past events
        const events = await contract.queryFilter('CreatedEdition', 0, -5).then((results) => {
          const pastEvents = results.map((result) => {
            return {
              event: result.event,
              data: result.args,
              key: result.blockNumber + result.logIndex,
            }
  
          }
          )
          console.log(pastEvents);
          setEvents(pastEvents)
  
        })
    
      
    };
    fetchEvents();
  }, [library]);

 return(
  <>
  <Box w={'360px'} p={25}>
      <List
      overflowX="hidden"
                              itemLayout="vertical"
              grid={{
                gutter: 2,
                xs: 1,
                sm: 1,
                column: 1,
              }}
    itemLayout="vertical"
    dataSource={events}
    renderItem={(item, index) => (
      <List.Item
      style={{
                      border: "4px solid #bbdccb",
                      width: "100%",
                      backgroundColor: "white",
                      //width: '100%',
                      //maxWidth: '385px',
                      padding: "2px",
                      display: "flex",
                      overflowX:"hidden",
                    }}
      >
        <List.Item.Meta
     //     avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
          title={<div style={{marginBottom:'-5px',fontSize:'12px'}}>Raffle #{(item.data[0].toString())}. Event: Raffle Created!</div>}
          description={
            <>
              <div style={{fontSize:'12px', marginBottom:'-5px', overflowX:"hidden"}}>
              <VStack>
              
              
                                  
                                  <div style={{ marginBottom: '0px', fontSize: '12px' }}>
                   {item.data[1].toString()}
                                  </div>
                                  <HStack>
                                  <div>Tickets:</div>
                                  <div style={{ marginBottom: '0px', fontSize: '12px' }}>
                   {item.data[2].toString()}
                                  </div>
                                  </HStack>
                                  <div style={{ marginBottom: '0px', fontSize: '12px' }}>
{item.data[3].toString()}
                                  </div>
                                  <HStack>
                                  <div>Min. Players</div>
                                  <div style={{ marginBottom: '0px', fontSize: '12px' }}>
{item.data[4].toString()}
                                  </div>
                                  </HStack>
                                  <HStack>
                                  <div>Max. Tokens per wallet</div>
                                  <div style={{ marginBottom: '0px', fontSize: '12px' }}>
{item.data[5].toString()}
                                  </div></HStack>
                                  
              
              </VStack>
              </div>
             
            </>
          }
        />
      </List.Item>
    )}
  />
  </Box>
  </>
 )
        }
        export default TelosRaffleEvents;