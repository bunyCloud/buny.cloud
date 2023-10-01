import React, { useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text, Heading } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import CreateWallet from '../MultiSig/CreateWallet'

const RightCreateWallet = () => {
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)



  return (
    <Box mt={2}>
     <Button
          variant={'outline'}
          color="purple"
          border='1px solid purple'
          //leftIcon={<UserOutlined />}
          onClick={() => {
            setVisible1(true)
          }}>
      <HStack pr={2}  gap="auto">
      
        <IconButton
          size={'xs'}
          variant={'unstyled'}
          colorScheme="purple"
          onClick={() => {
            setVisible1(true)
          }}
          aria-label="Action"
          icon={<AddIcon />}
        />

          <Text>Create Vault</Text>
        
      </HStack>
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
          <Box p={4}>  {/* Padding for better spacing */}
          <Heading size={'md'}>
            Multi-Signature Wallet
          </Heading>

  <Text mt={2}>Enhanced Security: Set number of private keys to authorize a transaction.</Text>
  <Text mt={2}>Collaborative Control: Multi-signature wallets ensure that no single individual has complete control over funds or assets.</Text>
  
</Box>
            

            <CreateWallet />
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
        <div style={{ padding: '24px', marginTop: '40px' }}>
          <div>This is the second popup layer</div>
        </div>
      </Popup>
    </Box>
  )
}

export default RightCreateWallet
