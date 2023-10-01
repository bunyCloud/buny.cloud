import React, { useContext, useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text, Heading, Input, Center, VStack, Image, Avatar } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
import { useToast } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import WhatCollectionName from '../../utils/WhatCollectionName'
import { AppContext } from '../../AppContext'
import WhatNFTOwner from '../../utils/WhatNFTOwner'
import { formatAddress } from '../../utils/formatMetamask'

const ViewNftDrawer = ({contractAddress, attributes, dna, name, description, date, edition, nftImage }) => {
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [nftOwner, setNftOwner] = useState()
  const toast = useToast()

  const handleNftOwner = (address) => {
    setNftOwner(address)
  }


const {chainId} = useContext(AppContext)
  const handleCopyToClipboard = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast({
          title: 'Copied',
          description: 'Value copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
        toast({
          title: 'Error',
          description: 'Failed to copy value to clipboard',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      })
  }

  return (
    <Box mt={2} overflow={'auto'}>
      <Button
        variant={'outline'}
        size={'xs'}
        m={1}
        color="purple"
        border="1px solid purple"
        leftIcon={<ViewIcon />}
        onClick={() => {
          setVisible1(true)
        }}>
        
          <Text>Details</Text>
        
      </Button>
      <Popup
        position="right"
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false)
        }}
        bodyStyle={{ height: '100%', width: '300px' }}>
        <div style={{ padding: '14px', marginTop: '40px' }}>
          <Space direction="vertical">
            <div>IBUNY</div>
            <Button
              size="xs"
              p={1}
              variant={'outline'}
              colorScheme="purple"
              onClick={() => {
                setVisible2(true)
              }}>
              Attributes
            </Button>

            <Box mt={0} w="275px">
            <HStack>
            <Avatar size={'lg'} src={nftImage}/>
              <Text noOfLines={2} fontSize={'lg'} overflow={'auto'}>
                {name && <>{name}</>}
              </Text>
              </HStack>

             <HStack>
             <Text>Collection</Text> <WhatCollectionName inputAddress={contractAddress} inputChainId={chainId.toString()} />
             </HStack>
              <Text>Edition: {edition && <>{edition.toString()}</>}</Text>
              <Text>Created: {date && new Date(date).toLocaleString()}</Text>
              <Text>Owner: {nftOwner && <>{formatAddress(nftOwner)}</>}</Text>
              
              
              <WhatNFTOwner onNftOwner={handleNftOwner} inputAddress={contractAddress} inputChainId={chainId.toString()} inputTokenId={edition.toString()}/>
              <HStack spacing={2}>
               
                <Text noOfLines={3} overflow={'hidden'} w={250}>
                  {nftImage && <>Image:{nftImage}</>}
                </Text>

                <IconButton variant={'unstyled'} size='xs' icon={<CopyIcon />} aria-label="Copy to clipboard"  onClick={() => handleCopyToClipboard(nftImage)} />
              </HStack>

              <Text mt={2} noOfLines={4} overflow={'auto'}>
                {description && <>{description}</>}
              </Text>

              
                
                
                  
                
              
            </Box>
          </Space>
        </div>
      </Popup>

      <Popup
        position="right"
        visible={visible2}
        onMaskClick={() => {
          setVisible2(false)
        }}
        bodyStyle={{ height: '100%' }}>
        <div style={{ padding: '12px', marginTop: '40px' }}>
          {attributes &&
            attributes.map((attr, index) => (
              <HStack bg="aliceblue" key={index} p={2}>
                <Text fontWeight="bold">{attr.trait_type}:</Text>
                <Text>{attr.value}</Text>
              </HStack>
            ))}
        </div>
      </Popup>
    </Box>
  )
}

export default ViewNftDrawer
