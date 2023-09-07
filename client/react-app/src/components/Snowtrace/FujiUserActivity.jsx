import { DollarCircleOutlined, StarOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { List, Space, Tag } from 'antd'
import { Link, Box, HStack } from '@chakra-ui/react'
import moment from 'moment'
import { Badge } from 'antd-mobile'
import { ExternalLinkIcon } from '@chakra-ui/icons'

function FujiUserActivity() {
  const [transactions, setTransactions] = useState([])
  const { account } = useEthers()

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      <div style={{ fontSize: '12px' }}> {text}</div>
    </Space>
  )

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `https://api-testnet.snowtrace.io/api?module=account&action=txlist&address=${account}&sort=desc`
        )
        if (response.data.status === '1') {
          setTransactions(response.data.result)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchTransactions()
  }, [account])

  return (
    <div>
      <Box w={'100%'} maxWidth="375px" p={2} mt={0} h="100%">
        <p style={{ marginBottom: '2px', fontSize: '12px' }}>
          <Tag>Transactions</Tag>
          <Box bg="#fdeeb3">{account}</Box>
        </p>
        <List
          itemLayout="vertical"
          size="small"
          pagination={{
            onChange: (page) => {
              console.log(page)
            },
            pageSize: 4,
          }}
          dataSource={transactions}
          renderItem={(item, index) => (
            <List.Item
              style={{ border: '2px solid #f6ccd0' }}
              key={index}
              actions={[
                <HStack gap={5}>
                  <IconText
                    icon={StarOutlined}
                    text={
                      <div style={{ color: 'black' }}>
                        {moment.unix(item.timeStamp).format('dddd, Do MMM YYYY, h:mm:ss A')}
                      </div>
                    }
                    key="list-vertical-star-o"
                  />
                  ,
                  <IconText
                    icon={DollarCircleOutlined}
                    text={
                      <div>
                        <div
                          style={{
                            width: '30px',
                            color: 'black',
                          }}>{`${ethers.utils.formatEther(item.value, 'ether')}`}</div>
                      </div>
                    }
                    key="list-vertical-message"
                  />
                  ,
                </HStack>,
              ]}>
              <List.Item.Meta
                //avatar={<Avatar src={'https://ipfs.io/ipfs/QmTmagere3xQyhPzmLk3F9L6sGtX18xjAC3iBpe1Wozb8u'} />}

                title={
                  <>
                    <div style={{ fontSize: '12px', float: 'left' }}>
                      <Link href={`https://snowtrace.io/tx/${item.hash}`} isExternal>
                        {item.hash &&
                          `${item.hash.slice(0, 22)}...${item.hash.slice(item.hash.length - 22, item.hash.length)}`}
                        <ExternalLinkIcon mx="2px" />
                      </Link>
                    </div>
                  </>
                }
              />

              <div>
                {item.to && (
                  <>
                    <HStack mt={-10}>
                      <Tag>To:</Tag>
                      <div style={{ fontSize: '12px' }}>
                        {' '}
                        {item.to && `${item.to.slice(0, 18)}...${item.to.slice(item.to.length - 20, item.to.length)}`}
                      </div>
                    </HStack>
                  </>
                )}
              </div>
              <div>
                {item.functionName && (
                  <>
                    <HStack mb={-10}>
                      <Tag>Function:</Tag>
                      <div
                        style={{
                          fontSize: '12px',
                        }}>
                        {item.functionName &&
                          `${item.functionName.slice(0, 40)}...${item.functionName.slice(
                            item.functionName.length - 0,
                            item.functionName.length
                          )}`}
                      </div>
                    </HStack>
                  </>
                )}
              </div>
            </List.Item>
          )}
        />
      </Box>
    </div>
  )
}

export default FujiUserActivity
