import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Box,  FormControl, FormLabel, Heading, HStack, Input, Stack, Text } from '@chakra-ui/react'
import {Button} from 'antd'
import BunyBankTelos from 'contracts/telosTestnet/BunyBankTelos.json'
import { BunyBankTelosAddress } from 'contracts/config/networkAddress'

import { Tag } from 'antd'

function BunyBankInterface() {
  const [owner1Balance, setOwner1Balance] = useState(null)
  const [owner2Balance, setOwner2Balance] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [contractName, setName] = useState()
  const [owner1, setOwner1] = useState()
  const [owner2, setOwner2] = useState()

  function refreshPage() {
    window.location.reload(false)
  }

  async function deposit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(BunyBankTelosAddress, BunyBankTelos.abi, signer)
    const transaction = await contract.deposit({ value: ethers.utils.parseEther(depositAmount) })
    await transaction.wait()
    refreshPage()
  }

  async function withdraw() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(BunyBankTelosAddress, BunyBankTelos.abi, signer)
    const halfAmount = ethers.utils.parseEther(withdrawAmount).div(2)
    const transaction = await contract.withdraw(halfAmount)
    await transaction.wait()
  }

  async function getOwner1Balance() {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
    const contract = new ethers.Contract(BunyBankTelosAddress, BunyBankTelos.abi, provider)
    const balance = await contract.getOwner1Balance()
    const contractName = await contract.ContractName()
    const owner1 = await contract.owner1()
    setOwner1(owner1.toString())
    const owner2 = await contract.owner2()
    setOwner2(owner2.toString())
    setName(contractName)
    setOwner1Balance(ethers.utils.formatEther(balance))
  }

  async function getOwner2Balance() {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
    const contract = new ethers.Contract(BunyBankTelosAddress, BunyBankTelos.abi, provider)
    const balance = await contract.getOwner2Balance()
    setOwner2Balance(ethers.utils.formatEther(balance))
  }

  useEffect(() => {
    getOwner1Balance()
    getOwner2Balance()
  }, [])

  return (
    <Box p={25} bg="#bbdccb" mt={15} w={250} mb={5}>
      <Heading as="h6" mb={8}>
        <div>{contractName}</div>
      </Heading>
      <Stack spacing={4}>
        <FormControl style={{ fontSize: '12px' }}>
          <FormLabel>Deposit Amount</FormLabel>
          <Input w={'100%'} type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
        </FormControl>
        <Button type="primary" onClick={deposit}>Deposit</Button>
        <FormControl style={{ fontSize: '12px' }}>
          <FormLabel>Withdraw Amount</FormLabel>
          <Input w={'100%'} type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
        </FormControl>
        <Button type="primary" onClick={withdraw}>Withdraw</Button>
        <HStack mt={5}>
        <Tag>Owner 1: {owner1Balance || 'Empty'}/TLOS</Tag>
          <Button href={`https://testnet.teloscan.io/address/${owner1}/`} type="link" size="small">
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            {owner1 && `${owner1.slice(0, 4)}...${owner1.slice(owner1.length - 4, owner1.length)}`}
          </div>
          </Button>
        </HStack>
        <HStack>
          <Tag>Owner 2: {owner2Balance || 'Empty'}/TLOS</Tag>
          <Button href={`https://testnet.teloscan.io/address/${owner2}/`} type="link" size="small">
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            {owner2 && `${owner2.slice(0, 4)}...${owner2.slice(owner2.length - 4, owner2.length)}`}
          </div>
          </Button>
        </HStack>
      </Stack>
    </Box>
  )
}

export default BunyBankInterface
