import React, { useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text, Heading, Input, Center } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { FileProtectOutlined, UserOutlined } from '@ant-design/icons'
import { ethers } from 'ethers'

const AddProposalDrawer = ({contractAddress, contractABI}) => {
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')



  const proposeTransaction = async () => {
    try {
      
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractABI, signer)
  const tx = await contract.transferTo(recipient, ethers.utils.parseEther(amount))
  await tx.wait()
      alert('Proposal submitted successfully!')
    } catch (error) {
      console.error('Error adding proposal:', error)
    }
  }
  
  return (
    
        <Box mt={2}>
       <Button
          variant={'outline'}
          color="purple"
          border='1px solid purple'
          leftIcon={<FileProtectOutlined />}
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

          <Text>Submit Proposal</Text>
        
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
              Submit transfer proposal for owner approval.
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
            
            <Box mt={2} p={2} bg="InfoBackground" border="1px solid silver">
          <Heading size="md">Propose Transaction</Heading>
          
          <Input size="sm" mt={3} placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          <Text fontSize="sm">Enter the recipient's address.</Text>
          <Input size="sm" mt={2} placeholder="Amount (TLOS)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Text fontSize="sm">Specify the amount to send in TLOS.</Text>
          <Center>
            <Button colorScheme="messenger" w="100%" mt={2} onClick={proposeTransaction}>
              Propose
            </Button>
          </Center>
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
        <div style={{ padding: '24px', marginTop: '40px' }}>
          <div>This is the second popup layer</div>
        </div>
      </Popup>
    </Box>
  )
}

export default AddProposalDrawer
