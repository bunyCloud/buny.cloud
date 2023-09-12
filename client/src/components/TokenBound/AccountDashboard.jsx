import React, { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import BunyERC6551Registry from '../../contracts/BunyERC6551Registry.json'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'
import { Box, Avatar, Text, useToast, HStack, VStack, IconButton } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import DepositModal from '../modals/DepositModal'
import WithdrawModal from '../modals/WithdrawModal'
import { AppContext } from '../../AppContext'
import { useContext } from 'react'
import { formatAddress } from '../../utils/formatMetamask'
import TheBUNY from '../../contracts/TheBUNY.json'
import WhatNetworkName from '../../utils/WhatNetworkName'
import WhatNetworkSymbol from '../../utils/WhatNetworkSymbol'
import BalanceDashboard from './BalanceDashboard'

const AccountDashboard = () => {
  const { accountAddress, account, avatarImage, avatarName, tokenContract, tokenId, accountName, chainId } = useContext(AppContext)
  const [accountBalance, setAccountBalance] = useState(null)
  const [nftSymbol, setNftSymbol] = useState()
  const [implementation, setImplementation] = useState('')
  const toast = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(accountAddress)
    toast({
      title: 'Address copied to clipboard!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const loadAccount = async (accountAddress) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)
      const info = await registryContract.getAccountDetails(accountAddress)
      console.log(`Attempting to load account address: ${accountAddress}`)
      console.log(`Implementation: ${info[0]}`)
      setImplementation(info[0])
      console.log(`Token ChainId: ${info[1].toString()}`)
      console.log(`NFT: ${info[2]}`)
      console.log(`TokenId: ${info[3].toString()}`)
      console.log(`Salt: ${info[4]}`)
    } catch (error) {
      console.error('Error loading account:', error)
    }
  }

  useEffect(() => {
    if (accountAddress) {
      loadAccount(accountAddress) // Pass the accountAddress to the function
    }
  }, [accountAddress])

  const fetchAccountToken = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(accountAddress, BunyERC6551Account.abi, signer)
    const bal = await contract.getBalance()
    console.log(ethers.utils.formatEther(bal, 'ether'))
    setAccountBalance(ethers.utils.formatEther(bal, 'ether'))
    const nft = new ethers.Contract(tokenContract, TheBUNY.abi, provider)
    let tokenURI = await nft.tokenURI(tokenId)
    if (tokenURI.startsWith('ipfs://')) {
      const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
      const cid = tokenURI.replace('ipfs://', '')
      tokenURI = ipfsGatewayUrl + cid
    }
    const symbol = await nft.symbol()
    console.log(symbol)
    setNftSymbol(symbol)
  }, [accountAddress, tokenContract, tokenId]) // Update the dependencies as needed

  useEffect(() => {
    if (accountAddress) {
      fetchAccountToken()
    }
  }, [accountAddress, fetchAccountToken])

  return (
    <>
      <VStack bg="#5b5f99" border="1px solid white" h="100%" minHeight={400} w='100%'>
        <div>
          <HStack gap={3} p={1}>
            <Avatar border="2px solid white" size="lg" name={avatarName} src={avatarImage} />

            <HStack bg="silver" border="1px solid white" h={10} w={300} gap="12px">
              <Text ml={2} color="white" as="b" fontSize="12px">
                {accountName}
              </Text>

              <HStack color='white' gap={2} ml={12}>
                <Text color="white" as="b">
                  {accountBalance && <>{accountBalance}</>}
                </Text> 
                <Text>/</Text>
                <WhatNetworkSymbol chainId={chainId} />
                
              </HStack>
            </HStack>
          </HStack>

          <Box bg="ghostwhite"  p={1}>
            <HStack>
              <Text as="b">Account:</Text>
              <Text fontSize="12px">{accountAddress && <>({accountAddress})</>}</Text>

              <IconButton mt={-1} ml={-2} size={'xs'} variant={'unstyled'} onClick={handleCopy} icon={<CopyIcon />} />
            </HStack>

            <HStack>
              <Text as="b">Token:</Text>
              <Text fontSize="12px">{tokenContract && <> {formatAddress(tokenContract)} </>}</Text>
              <Text as="b" fontSize="12px">
                Network:
              </Text>

              <WhatNetworkName chainId={chainId} />
              <Text fontSize="12px" as="b">
                TokenID:
              </Text>
              <Text fontSize="12px">{tokenId && <> {tokenId.toString()}</>}</Text>
              <Text fontSize="12px" as="b">
                Symbol:
              </Text>
              <Text fontSize="12px">{nftSymbol && <> {nftSymbol}</>}</Text>
            </HStack>
          </Box>
          <HStack bg="white" p={2} spacing={6} mb={-1} mt={1} justify="center">
            <DepositModal account={account} accountAddress={accountAddress} />
            <WithdrawModal />
          </HStack>
        </div>
        <BalanceDashboard inputAddress={accountAddress}/>
      </VStack>
    </>
  )
}

export default AccountDashboard
