import React, { useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text } from '@chakra-ui/react'
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
            <div>
              Control panel for managing actions such as creating wallets, proposing transactions, adding new owners, sending encrypted messages, loading
              wallets, creating contact list, transfering accounts, approving pending transactions along with other general account settings.{' '}
            </div>
            <Button
              size="small"
              p={2}
              variant={'outline'}
              colorScheme='purple'
              onClick={() => {
                setVisible2(true)
              }}>
              Settings
            </Button>

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
