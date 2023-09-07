import React, { useState, useEffect } from 'react'
import { nftAddress, nftMarketplaceAddress } from 'contracts/config/networkAddress'
import { Box, Center, WrapItem, Heading, VStack } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import Marketplace from 'contracts/TheBunyProjectMarketplace.json'
import NFT from 'contracts/TheBunyProjectNFT.json'
import { IconButton, Text } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { Tooltip, List, notification } from 'antd'

import { HStack, Flex, Wrap, useClipboard } from '@chakra-ui/react'
import { Tag } from 'antd-mobile'
import {
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

function ProductPageA(nft, price) {
  const { tokenId } = useParams()
  const [contractName, setContractName] = useState()
  const [nftOwner, setNftOwner] = useState()
  const [contractSymbol, setContractSymbol] = useState()
  const [nftImage, setNftImage] = useState()
  const [nftName, setNftName] = useState()
  const [nftDesc, setNftDesc] = useState()
  const [transferEvents, setTransferEvents] = useState([]);

  const openNotification = () => {
    notification.open({
      message: 'Copied to clipboard',
      description: [
        <>
          <p style={{ fontSize: '12px' }}>Buny Marketplace NFT address {nftAddress}</p>
        </>,
      ],
      onClick: () => {
        console.log('Notification Clicked!')
      },
    })
  }
  const { onCopy, hasCopied } = useClipboard(nftAddress)
  const [nftAnimation, setNftAnim] = useState()
  const [usdzFile, setUsdzFile] = useState()
  const provider = new ethers.providers.JsonRpcProvider('https://avalanche-mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
  


  async function fetchNFT() {
    const contract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const name = await contract.name() //contract name
    setContractName(name)
    const symbol = await contract.symbol()
    setContractSymbol(symbol)
    const owner = await contract.ownerOf(tokenId) // fetch owner
    setNftOwner(owner)
    const tokenUri = await contract.tokenURI(tokenId) // nft tokenuri
    const response = await fetch(tokenUri)
    if (!response.ok) throw new Error(response.statusText)
    const json = await response.json()
    console.log(json)
    console.log(json.name)
    setNftName(json.name)
    console.log(json.description)
    setNftDesc(json.description)
    console.log(json.image)
    setNftImage(json.image)
    setNftAnim(json.animation_url)
    setUsdzFile(json.usdzFile)
    const market = new ethers.Contract(nftMarketplaceAddress, Marketplace.abi, provider)
    const data = await market.getSpecificItem(tokenId)
    const price = ethers.utils.formatEther(data[5].toString())
    if (price > 0) {
      console.log(price)
    }
    console.log(data.toString())

    console.log(data[6].toString())
  }

  const getTransferEvents = async () => {
    const contract = new ethers.Contract(nftAddress, NFT.abi, provider);
      // Fetch past events
      const hexlify = ethers.utils.formatBytes32String(tokenId)
      const transferEvents = await contract.queryFilter(contract.filters.Transfer(null, null, hexlify));

        console.log(transferEvents)
        setTransferEvents(transferEvents)

      }
  
    
  
  

  useEffect(() => {
    fetchNFT()
  }, [])

  
  useEffect(() => {
    getTransferEvents()
  }, [tokenId])


  return (
    <>
      <VStack>
        <Box
          // bg="rgba(31,41,80)"
          bg="white"
          //border={'4px solid #ebd86d'}
          mt={5}
          w={'100%'}
          maxWidth={'900px'}
          h={'100%'}
          style={{
            fontSize: '12px',
            padding: '4px',
            //color: 'white',
          }}>
          <Heading>
            <HStack mt={2}>
              <div
                style={{
                  marginLeft: '25px',
                }}>
                {nftName}
              </div>
              <TwitterShareButton
                title={nftName}
                via={'Buny Nft Maker'}
                media={nftImage}
                url={`https://buny.cloud/token/${nftAddress}/${tokenId}`}
                hashtags={['avax', 'Buny', 'NftCommunity']}>
                <TwitterIcon size={20} round />
              </TwitterShareButton>
              <TelegramShareButton title={nftName} url={`https://buny.cloud/token/${nftAddress}/${tokenId}`}>
                <TelegramIcon size={20} round />
              </TelegramShareButton>
              <RedditShareButton title={nftName} url={`https://buny.cloud/token/${nftAddress}/${tokenId}`}>
                <RedditIcon size={20} round />
              </RedditShareButton>
              <PinterestShareButton
                title={nftName}
                description={nftDesc}
                media={nftImage}
                url={`https://buny.cloud/token/${nftAddress}/${tokenId}`}>
                <PinterestIcon size={20} round />
              </PinterestShareButton>
            </HStack>
          </Heading>

          <Wrap justify="center">
            <WrapItem>
              <Center>
                <div
                  style={{
                    width: '100%',
                    margin: '10px',
                  }}>
                  <Flex>
                    <Wrap justify={'center'}>
                      <WrapItem bg="white" w="auto">
                        <Box
                          style={{
                            backgroundColor: 'white',
                            margin: '10px',
                            width: '100%',
                            height: 'auto',
                            color: 'white',
                            //maxWidth: '600px',
                          }}>
                          <Tag
                            style={{
                              border: '1px solid rgba(31,41,80)',
                              color: 'white',
                            }}>
                            Image
                          </Tag>
                          <Center>
                            <model-viewer
                              shadow-intensity="1"
                              style={{ width: '375px', height: '375px' }}
                              camera-controls
                              poster={nftImage}
                              //alt={`Nft Name: ${nft.name}`}
                              src={nftImage}></model-viewer>
                          </Center>
                        </Box>
                      </WrapItem>
                      <WrapItem>
                        <div>
                          {nftAnimation && (
                            <Box
                              style={{
                                margin: '10px',
                                height: '100%',
                                color: 'white',
                                maxWidth: '900px',
                              }}>
                              <Tag
                                style={{
                                  border: '1px solid rgba(31,41,80)',
                                  color: 'white',
                                }}>
                                GLB/GLTF Model
                              </Tag>
                              <Center>
                                <model-viewer
                                  shadow-intensity="1"
                                  style={{ width: '375px', height: '375px' }}
                                  camera-controls
                                  poster={nftImage}
                                  src={nftAnimation}
                                  usdzFile={usdzFile}></model-viewer>
                              </Center>
                            </Box>
                          )}
                        </div>
                      </WrapItem>
                      <WrapItem>
                        <div>
                          {usdzFile && (
                            <Box
                              style={{
                                margin: '10px',
                                height: '100%',
                                color: 'white',
                                maxWidth: '900px',
                              }}>
                              <Tag
                                style={{
                                  border: '1px solid rgba(31,41,80)',
                                  color: 'white',
                                }}>
                                AR(Augmented Reality)
                              </Tag>
                              <Center>
                                <model-viewer
                                  shadow-intensity="1"
                                  style={{ width: '375px', height: '375px' }}
                                  camera-controls
                                  ar
                                  poster={nftImage}
                                  src={nftAnimation}
                                  usdzFile={usdzFile}></model-viewer>
                              </Center>
                            </Box>
                          )}
                        </div>
                      </WrapItem>
                    </Wrap>
                  </Flex>
                </div>
              </Center>
            </WrapItem>

            <WrapItem>
              <VStack>
                <Box
                  mr={4}
                  ml={4}
                  p={15}
                  h="100%"
                  fontSize="12px"
                  w={'375px'}
                  //minWidth="375px"
                  //maxWidth="375px"
                  bg="#bbdccb"
                  color="rgba(31,41,80)">
                  <Tag
                    style={{
                      border: '1px solid rgba(31,41,80)',
                      color: 'white',
                    }}>
                    Details
                  </Tag>

                  <p>
                    <strong>Collection:</strong> {contractName}
                  </p>
                  <HStack>
                    <div>
                      <p>
                        <strong>Symbol:</strong> {contractSymbol}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Token ID:</strong> {tokenId}
                      </p>
                    </div>
                  </HStack>

                  <div onClick={openNotification}>
                    <Box>
                      <HStack>
                        <div>Address:</div>
                        <div style={{ fontSize: '10px' }}>
                          <a href={`https://snowtrace.io/address/${nftAddress}`} target="_blank" rel="noreferrer">
                            {nftAddress}
                          </a>
                        </div>
                        <Tooltip title="Copy to clipboard">
                          <IconButton
                            m={2}
                            onClick={onCopy}
                            variant="outline"
                            colorScheme="teal"
                            aria-label="Copy to clipboard"
                            icon={<CopyIcon />}>
                            {hasCopied ? 'Copied!' : 'Copy'}
                          </IconButton>
                        </Tooltip>
                      </HStack>
                    </Box>
                  </div>
                  <Box>
                    <HStack>
                      <div>Owner:</div>
                      <div style={{ fontSize: '10px' }}>
                        <a href={`https://snowtrace.io/address/${nftOwner}`} target="_blank" rel="noreferrer">
                          {nftOwner}
                        </a>
                      </div>
                    </HStack>
                  </Box>
                </Box>
                <Box bg="white" w={360}>
                  {' '}
                  <Tag
                    style={{
                      border: '1px solid rgba(31,41,80)',
                      color: 'white',
                    }}>
                    Description
                  </Tag>
                  <p style={{ padding: '15px' }}>{nftDesc}</p>
                </Box>
              </VStack>
            </WrapItem>
          </Wrap>
        </Box>
        <Box bg="#fefce2" w={'100%'}>
          <Box>
            <Text fontSize="12px">Recent transfer events.</Text>
            <List
              itemLayout="vertical"
              grid={{
                gutter: 6,
                xs: 1,
                sm: 1,
                column: 1,
              }}
              itemLayout="vertical"
              dataSource={transferEvents}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    border: '4px solid #bbdccb',
                    width: '370px',
                    backgroundColor: 'white',
                    //width: '100%',
                    //maxWidth: '385px',
                    padding: '2px',
                    display: 'flex',
                  }}>
                  <List.Item.Meta
                    //     avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                    title={
                      <div style={{ marginBottom: '-10px', fontSize: '12px' }}>
                        Transfer: 
                      </div>
                    }
                    description={
                      <>
                        <div style={{ fontSize: '12px', marginBottom: '-10px' }}>
                          <HStack>
                            <Tag style={{ marginRight: '2px' }}>From:</Tag>
                            <div>
                            <a href={`https://testnet.teloscan.io/address/${item.data[0]}/`}>
                              <div style={{ marginBottom: '8px', fontSize: '10px' }}>
                                {item.data[0] &&
                                  `${item.data[0].slice(0, 16)}...${item.data[0].slice(
                                    item.data[0].length - 16,
                                    item.data[0].length
                                  )}`}
                              </div>
                            </a>
                            </div>
                          </HStack>
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '-10px' }}>
                          <HStack>
                            <Tag style={{ marginRight: '2px' }}>To:</Tag>
                            <div>
                            <a href={`https://testnet.teloscan.io/address/${item.data[1]}/`}>
                              <div style={{ marginBottom: '8px', fontSize: '10px' }}>
                                {item.data[1] &&
                                  `${item.data[1].slice(0, 16)}...${item.data[1].slice(
                                    item.data[1].length - 16,
                                    item.data[1].length
                                  )}`}
                              </div>
                            </a>
                            </div>
                          </HStack>
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Box>
        </Box>
      </VStack>
    </>
  )
}

export default ProductPageA
