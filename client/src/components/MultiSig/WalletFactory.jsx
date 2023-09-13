import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, Heading, Badge, HStack, Center, Link, VStack } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyMultiFactory from '../../contracts/BunyMultiFactory.json'
import MultiSigWallet from '../../contracts/MultiSigWallet.json'
import WhatNetworkSymbol from '../../utils/WhatNetworkSymbol'
import CreateWalletDrawer from '../Drawers/CreateWalletDrawer'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const WalletFactory = ({ onDeployments }) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Using useEffect to fetch deployments on component load
  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(BunyMultiFactory.address, BunyMultiFactory.abi, signer)
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
    <Box>
     <Box w="100%">
        <Text>Network: Telos Testnet</Text>
        
      </Box>
      <Center border="0.5px solid silver" mt={2} bg="InfoBackground">
        <VStack>
        <Box  p={2}  >
          <CreateWalletDrawer />
        </Box>
        <HStack>
        
        <HStack>
          
          <Link href={`https://testnet.teloscan.io/address/${BunyMultiFactory.address}`} isExternal target="_blank">
            View Factory Contract <ExternalLinkIcon mx="2px" />
          </Link>
        </HStack>

        <HStack>
          
          <Link href={`https://testnet.teloscan.io/address/${MultiSigWallet.address}`} isExternal target="_blank">
            View Template Contract <ExternalLinkIcon mx="2px" />
          </Link>
        </HStack>
        </HStack>
        </VStack>

      </Center>
     
      <Box mt={4} p={4} bg="ThreeDFace" border="1px solid silver">
        <Heading size="sm">My Deployed Wallets</Heading>
        <Text fontSize="sm">Wallets assigned to you as owner. </Text>

        {deployments.map((dep, index) => (
          <Center>
            <Box key={index} mt={2} bg="InfoBackground" border="1px" w="100%" borderColor="gray" borderRadius="md" p="4px">
              <HStack justify="center" p={1} gap="18px" bg="ghostwhite" border="0.5px solid silver">
                <Badge colorScheme="purple">
                  <Text>Vault: {dep.deploymentNumber.toString()}</Text>
                </Badge>
                <Text>{dep.name}</Text>
                <HStack gap="2px">
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
