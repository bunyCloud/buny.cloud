import { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, Heading, Badge, HStack, Center, Link, VStack } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
//Telos
import BunyMultiFactory from '../../contracts/BunyMultiFactory.json'
import MultiSigWallet from '../../contracts/MultiSigWallet.json'
//Fuji
import MultiFactory from '../../contracts/fuji/MultiFactory.json'
import SigWallet from '../../contracts/fuji/SigWallet.json'
import WhatNetworkSymbol from '../../utils/WhatNetworkSymbol'
import CreateWalletDrawer from '../Drawers/CreateWalletDrawer'
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import WhatNetworkName from '../../utils/WhatNetworkName'
import { formatChainAsNum } from '../../utils/formatMetamask'

const WalletFactory = ({ onDeployments }) => {
  const { account, chainId } = useContext(AppContext)
  const [deployments, setDeployments] = useState([])
  const deployer = account

  const fetchContractBalance = async (addr, index) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(addr, MultiSigWallet.abi, signer)
    try {
      const name = await contract.contractName()
      const contractBalance = await contract.walletBalance()
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

  const fetchAndSetDeployments = async () => {
    try {
      let contract
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      if (chainId === 41) {
        contract = new ethers.Contract(BunyMultiFactory.address, BunyMultiFactory.abi, signer)
      } else if (chainId === 43113) {
        contract = new ethers.Contract(MultiFactory.address, MultiFactory.abi, signer)
      }
      const results = await contract.getDeploymentsOf(deployer)
      setDeployments(results.map((dep) => ({ ...dep, balance: '0', name: '' }))) // set initial balance and name
      results.forEach((dep, index) => fetchContractBalance(dep.contractAddress, index))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Using useEffect to fetch deployments on component load
  useEffect(() => {
    fetchAndSetDeployments()
  }, [deployer])

  return (
    <Box>
      <Box w="100%">
        <HStack>
          <Text>Connected to: </Text>
          <WhatNetworkName chainId={formatChainAsNum(chainId)} />
        </HStack>
      </Box>
      <Center border="0.5px solid silver" mt={2} bg="InfoBackground">
        <VStack>
          <Box p={2}>
            <CreateWalletDrawer />
          </Box>
          <HStack>
            {chainId === 41 && (
              <>
                <HStack>
                  <Link href={`https://testnet.teloscan.io/address/${BunyMultiFactory.address}`} isExternal target="_blank">
                    Factory Contract <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>

                <HStack>
                  <Link href={`https://testnet.teloscan.io/address/${MultiSigWallet.address}`} isExternal target="_blank">
                    Template Contract <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>
              </>
            )}
            {chainId === 43113 && (
              <>
                <HStack>
                  <Link href={`https://testnet.snowtrace.io/address/${MultiFactory.address}`} isExternal target="_blank">
                    Factory Contract <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>

                <HStack>
                  <Link href={`https://testnet.snowtrace.io/address/${SigWallet.address}`} isExternal target="_blank">
                    Template Contract <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>
              </>
            )}
          </HStack>
        </VStack>
      </Center>

      <Box mt={4} p={4} bg="ThreeDFace" border="1px solid silver">
        <HStack justifyContent="space-between">
          <Heading size="sm">My Deployed Wallets</Heading>
          <IconButton
            icon={<RepeatIcon />}
            aria-label="Refresh deployments"
            onClick={fetchAndSetDeployments} // Here we're calling the fetchAndSetDeployments function when the button is clicked
          />
        </HStack>
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
