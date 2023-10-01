import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import FujiERC6551Registry from '../contracts/fuji/FujiERC6551Registry.json'
import { Text, Table, Thead, Tbody, Tr, Td, HStack, Link } from '@chakra-ui/react'
import { AppContext } from '../AppContext'
import WhatNetworkName from './WhatNetworkName'
import { getExplorer } from '../config/networks'
import { ExternalLinkIcon } from '@chakra-ui/icons'

function WhatIsBoundAvalanche({ onIsActive, accountAddress }) {
  const [isActive, setIsActive] = useState(false)
  
  const chainId = 43113;
  

  //explorer data
const  explorerUrl = getExplorer(chainId.toString())
  

  //fetch account details
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setIsActive(false)
        const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const contract = new ethers.Contract(FujiERC6551Registry.address, FujiERC6551Registry.abi, provider)
         const accountDetails = await contract.getAccountDetails(accountAddress)
        console.log('Checking for existing token binging on Avalanche testnet')
        console.log(`Fuji Account implementation ${accountDetails[0]}`)
        console.log(`Avalanche testnet account implementation ${accountDetails[0]}`)
        console.log(`NFT Token Id ${accountDetails[1].toString()}`)
        console.log(`NFT Contract: ${accountDetails[2]}`)
        const tokenIDBigNumber = ethers.BigNumber.from(accountDetails[3])
        console.log(tokenIDBigNumber.toString())
        if (tokenIDBigNumber.gte(1)) {
          setIsActive(true)
          console.log('Active NFT token binding on Fuji Testnet')
          onIsActive(true)
          console.log('Token Bound Account Found')
        }
        console.log(`salt: ${accountDetails[4].toString()}`)
      } catch (error) {
        console.error('Error checking account:', error)
      }
    }

    fetchAccountDetails(accountAddress)
  }, [accountAddress, chainId, onIsActive])


  

  return (
    <>
      {isActive && (
        <>
          <HStack>
            <Text>Token Bound Account Found! - </Text> <WhatNetworkName chainId={chainId} />
            <Text> ({chainId.toString()})</Text>
          </HStack>
        </>
      )}
      {!isActive && (
        <>
        <HStack>
          <Text>Token Bound Account Not Found</Text>
          <WhatNetworkName chainId={chainId} />
            <Text> ({chainId.toString()})</Text>
          </HStack>
        </>
      )}
      {isActive && (
        <>
          <Link href={`${explorerUrl}/address/${accountAddress}`} isExternal>
            <HStack spacing="3px">
              <Text>{accountAddress.toString()}</Text>
              <ExternalLinkIcon mx="2px" />
            </HStack>
          </Link>
        </>
      )}
    </>
  )
}

export default WhatIsBoundAvalanche
