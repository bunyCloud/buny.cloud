import { abi } from 'contracts/TheBunyProjectMarketplace.json'
import { Flex, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import { Layout, Image } from 'antd'
import React, { useState } from 'react'
import { Box, Center } from '@chakra-ui/react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import HomepageTabBar from 'components/Layout/HomepageTabBar'
import AvaxUsd from 'components/CoinGecko/AvaxUsd'
import IridiumPriceTable from 'components/Metals/Iridium'
import TopMetals from 'components/Metals/TopMetals'

const { Sider } = Layout
const { Content, Footer } = Layout
const { Header } = Layout

const styles = {
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    WebkitBoxPack: 'center',
    justifyContent: 'center',
    //margin: "10px auto",
    width: '100%',
    backgroundColor: 'black',
  },
}

function DashboardLayout() {
  const { activateBrowserWallet, chainId, switchNetwork, account } = useEthers()

  //const formatBalance =
  return (
    <>
      <Layout>
        <Layout>
          <Center>
            <Content
              style={{
                minHeight: '800px',
                backgroundColor: 'black',
              }}>
              <Layout>
                <Header
                  style={{
                    backgroundColor: 'black',
                    textAlign: 'center',
                    width: '100%',
                    marginTop: '50px',
                    //                  height: "50px",
                  }}>
                  <Center>
                    <Image width={300} src="https://buny.us-southeast-1.linodeobjects.com/TheBunyProject-white.png" />
                  </Center>
                </Header>

                <Content
                  style={{
                    backgroundColor: '#f6ccd0',
                    width: '100%',
                  }}>
                  <Center>
                    <Flex>
                      <Wrap justify="center">
                        <WrapItem w={375}>
                          <Center>
                            <VStack>
                              <Box bg="white" border="2px solid white">
                                <HomepageTabBar />
                                <Center>
                                  <AvaxUsd />
                                </Center>

                                <div
                                  style={{ textAlign: 'right', marginRight: '10px', fontSize: '8px', color: 'black' }}>
                                  *CoinGecko
                                </div>
                              </Box>
                              <Box>
                                <TopMetals />
                              </Box>
                            </VStack>
                          </Center>
                        </WrapItem>
                      </Wrap>
                    </Flex>
                  </Center>
                </Content>
              </Layout>
            </Content>
          </Center>
        </Layout>
      </Layout>
    </>
  )
}

export default DashboardLayout
