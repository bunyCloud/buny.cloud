import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, Heading, Badge, HStack, Center } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyMultiFactory from '../../contracts/BunyMultiFactory.json'
import MultiSigWallet from '../../contracts/MultiSigWallet.json'
import WhatNetworkSymbol from '../../utils/WhatNetworkSymbol'

const CreateWallet = ({ onDeployments }) => {
  const { account, chainId } = useContext(AppContext)
  const [minSignatures, setMinSignatures] = useState('')
  const [contractName, setContractName] = useState('')
  // const [deployer, setDeployer] = useState(account);
  const [balance, setBalance] = useState('0')
  const [deployments, setDeployments] = useState([])
  const deployer = account

  const fetchContractBalance = async (addr, index) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const template = new ethers.Contract(addr, MultiSigWallet.abi, signer)
    try {
      const name = await template.contractName()
      const contractBalance = await template.walletBalance()
      setDeployments((prevDeployments) => {
        const updatedDeployments = [...prevDeployments]
        updatedDeployments[index].name = name
        updatedDeployments[index].balance = ethers.utils.formatEther(contractBalance)
        return updatedDeployments
      })
    } catch (error) {
      console.error('Error fetching contract balance:', error)
    }
  }

  const createWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(BunyMultiFactory.address, BunyMultiFactory.abi, signer)   
      const tx = await contract.createMultiSigWallet(minSignatures, contractName)
      await tx.wait()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Using useEffect to fetch deployments on component load
 

  return (
    <Box mt={3} p={4} bg="InfoBackground" border="1px solid silver">
      <Heading size="md">Create Multi-Signature Wallet</Heading>

      <Text>Set the minimum number of signers to approve a transaction.</Text>
      <Text>Deploy contract with a unique identifier name for your vault.</Text>
      <Input size={'sm'} placeholder="Minimum Signatures" value={minSignatures} onChange={(e) => setMinSignatures(e.target.value)} />
      <Input size={'sm'} mt={2} placeholder="Contract Name" value={contractName} onChange={(e) => setContractName(e.target.value)} />
      <Button colorScheme="messenger" w="100%" mt={2} onClick={createWallet}>
        Create Wallet
      </Button>

 
    </Box>
  )
}

export default CreateWallet
