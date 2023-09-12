import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, Heading, Badge, HStack, Center } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyMultiFactory from '../../contracts/BunyMultiFactory.json'
import MultiSigWallet from '../../contracts/MultiSigWallet.json'
import WhatNetworkSymbol from '../../utils/WhatNetworkSymbol'

const WalletFactory = ({ onDeployments }) => {
  const { account, chainId } = useContext(AppContext)
  const [minSignatures, setMinSignatures] = useState('')
  const [contractName, setContractName] = useState('')
  // const [deployer, setDeployer] = useState(account);
  const [balance, setBalance] = useState('0')
  const [deployments, setDeployments] = useState([])
  const deployer = account
  const contractAddress = BunyMultiFactory.address
  const contractABI = BunyMultiFactory.abi
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractABI, signer)

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
      const tx = await contract.createMultiSigWallet(minSignatures, contractName)
      await tx.wait()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Using useEffect to fetch deployments on component load
  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const results = await contract.getDeploymentsOf(deployer)
        setDeployments(results.map((dep) => ({ ...dep, balance: '0', name: '' }))) // set initial balance and name
        results.forEach((dep, index) => fetchContractBalance(dep.contractAddress, index))
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchDeployments()
  }, [deployer])

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

      <Box mt={3} p={4}  bg="ThreeDFace" border="1px solid silver">
        <Heading size="md">Deployed Wallets</Heading>
        <Text fontSize="sm">Wallets assigned to you as owner. </Text>

        {deployments.map((dep, index) => (
         <Center>
          <Box key={index} mt={2} bg="InfoBackground"  border="1px" w='100%' borderColor="gray" borderRadius="md" p="4px">
            <HStack justify='center' p={1} gap="18px" bg='ghostwhite'  border='0.5px solid silver'>
              <Badge colorScheme="purple">
                <Text>Vault: {dep.deploymentNumber.toString()}</Text>
              </Badge>
              <Text>{dep.name}</Text>
              <HStack gap='2px' >
              <Text>Balance: {dep.balance} /</Text>
              <WhatNetworkSymbol chainId={chainId} />
              </HStack>
                          </HStack>
            {/*<Text>Owner: {dep.deployer}</Text>*/}
            <Center>
            <Text p={1}>{dep.contractAddress}</Text>
            </Center>

            <Button w="100%" size={'sm'} colorScheme="purple" mt={2} onClick={() => onDeployments(dep.contractAddress)}>
              Load Wallet
            </Button>
          </Box>
          </Center>
        ))}
      </Box>
    </Box>
  )
}

export default WalletFactory
