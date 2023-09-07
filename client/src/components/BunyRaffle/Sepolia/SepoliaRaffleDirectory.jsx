import React, { useState, useEffect } from 'react'
import { SepoliaRaffleFactoryAddress } from 'contracts/config/networkAddress'
import { Box, Flex, HStack, Image, VStack, Link, Wrap, WrapItem } from '@chakra-ui/react'
import raffleFactory from 'contracts/sepolia/BunyRaffleFactory.json'
import { useClipboard, Center } from '@chakra-ui/react'
import { ethers, Contract, utils } from 'ethers'
import { Tag } from 'antd-mobile'
import { Button, Avatar, List, Descriptions, Badge } from 'antd'
import { TeamOutlined, TagsOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons'
import ConnectButton from 'components/UseDapp/ConnectButton'

export default function SepoliaRaffleDirectory(props) {
  const [implementation, setImplementation] = useState()
  const [collectionCount, setCount] = useState()
  const [_name, setName] = useState()
  const [data, setData] = useState([])
  const [raffles, setRaffles] = useState()
  const { onCopy, value, setValue, hasCopied } = useClipboard(data)
  const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')

  async function fetchRaffles() {
    const contract = new ethers.Contract(SepoliaRaffleFactoryAddress, raffleFactory.abi, provider)
    const implementation = await contract.implementation() //contract name
    setImplementation(implementation)
    const count = await contract.collectionCount()
    setCount(count.toString())
    console.log(count.toString())
    const items = []
    console.log(items)
    try {
      for (let i = 0; i < count; i++) {
        const items = await contract.readAllCollections()
        setRaffles(items)
        console.log(items)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchRaffles()
  }, [])

  return (
    <>
      <Flex mt="15px" p={5}>
        <VStack>
          <Center>
            <Box
              bg="white"
              //border={'4px solid #fe9d97'}
              mt={-4}
              isTruncated
              w={'100%'}
              maxWidth="375px"
              style={{
                fontSize: '12px',
                padding: '15px',
                color: '#bbdccb',
              }}>
              <Descriptions title="All Sepolia Raffles">
                <Descriptions.Item label="Network">
                  <img
                    width="20px"
                    src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"></img>
                </Descriptions.Item>

                <Descriptions.Item label="# of Raffles">
                  <div>{collectionCount}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge status="warning" text="Testnet" />
                </Descriptions.Item>
              </Descriptions>

              <div
                style={{
                  backgroundColor: '#d9cbc2',
                  marginTop: '4px',
                  padding: '10px',
                }}>
                <ConnectButton />
              </div>
            </Box>
          </Center>

          <Box
            // bg="white"
            //    border={'4px solid rgb(229 231 235)'}
            mt={-4}
            m={1}
            w={'auto'}
            minWidth="375px"
            maxHeight="1100px"
            overflow="hidden"
            maxWidth={800}
            overflowWrap="anywhere"
            style={{
              fontSize: '12px',
              padding: '20px',
              color: 'white',
            }}>
            <List
              itemLayout="vertical"
              grid={{
                gutter: 6,
                xs: 1,
                sm: 1,
                column: 2,
              }}
              dataSource={raffles}
              renderItem={(item) => (
                <Link href={`/raffle/${item[1]}`}>
                  <List.Item
                    style={{
                      border: '4px solid #5a5a5c',
                      minWidth: '375px',
                      backgroundColor: 'white',
                      width: '100%',
                      //maxWidth: '385px',
                      padding: '8px',
                      display: 'flex',
                    }}>
                    <List.Item.Meta
                      avatar={
                        <Image
                          style={{
                            marginLeft: '3px',
                            width: '100px',
                            height: '100px',
                            marginTop: '4px',
                            marginBottom: '-8px',
                            backgroundColor: '#bbdccb',
                          }}
                          size={{
                            //xs: 24,
                            //sm: 32,
                            md: 40,
                            lg: 64,
                            xl: 80,
                          }}
                          src={item[7]}
                        />
                      }
                      title={
                        <Button
                          block
                          //type="ghost"
                          style={{
                            //textDecoration: 'none',
                            marginTop: '6px',

                            marginBottom: '-10px',
                            //border:"2px solid #ebd86d",
                            padding: '4px',
                            fontSize: '16px',
                          }}
                          //type="outlined"
                          href={`/raffle/${item[1]}`}>
                          <HStack justify="center" spacing={8}>
                            <div>{item[0]}</div>
                            <div style={{ marginRight: '-1px' }}>#{item[3].toString()}</div>

                            {/*
                            <Image
                              src="https://buny.us-southeast-1.linodeobjects.com/carrot3.png"
                              width="20px"
                              alt="Carrot"
                            /> 
                            */}
                          </HStack>

                          <Center>
                            <div style={{ fontSize: '14px' }}>
                              <Tag color="#fdeeb3">
                                {' '}
                                <div style={{ color: 'black', fontSize: '14px' }}>
                                  Enter:
                                  {ethers.utils.formatEther(item[6].toString(), 'ether')} /TLOS
                                </div>
                              </Tag>
                              <Tag color="#fdeeb3">
                                <div style={{ color: 'black', fontSize: '14px' }}>
                                  Win:
                                  {(
                                    ((ethers.utils.formatEther(item[6].toString(), 'ether') * item[2]) / 100) *
                                    90
                                  ).toFixed(2)}{' '}
                                  /TLOS
                                </div>
                              </Tag>
                            </div>
                          </Center>
                          <Center color="black" w="auto">
                            <HStack gap="10px">
                              <div style={{ fontSize: '14px' }}>
                                <TagsOutlined fontSize="8px" />
                                Tickets:{item[2].toString()}
                              </div>

                              <div style={{ fontSize: '14px' }}>
                                <TeamOutlined fontSize="8px" />
                                Min Players:{item[4].toString()}
                              </div>
                            </HStack>
                          </Center>
                        </Button>
                      }
                      description={<></>}
                    />
                  </List.Item>
                </Link>
              )}
            />
          </Box>
        </VStack>
      </Flex>
    </>
  )
}
