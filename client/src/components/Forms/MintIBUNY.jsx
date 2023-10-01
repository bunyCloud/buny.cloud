import React, { useState, useEffect, useCallback, useContext } from 'react'
import { ethers } from 'ethers'
import { Button as AntButton } from 'antd'
import { Box, HStack, Center, useToast, Spinner } from '@chakra-ui/react'
import TheBUNY from '../../contracts/TheBUNY.json'
import axios from 'axios'
import { VStack, Image, Button, Text } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import MyIBUNYGalleryTabs from '../IBUNY/MyIBUNYGalleryTabs'
//import { formatAddress } from '../../utils/formatMetamask'

function MintIBUNY() {
  const { account, rpcUrl } = useContext(AppContext)
  const [nftName, setNftName] = useState()
  const [nftSymbol, setNftSymbol] = useState()
  const [maxSupply, setMaxSupply] = useState()
  const [nftCost, setCost] = useState(null)
  const [totalNftSupply, setTotalNftSupply] = useState()
  const nftAddress = TheBUNY.address
  const [mintResult, setMintResult] = useState()
  const toast = useToast()
  const [IBUNYImage, setIBUNYImage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const handleRefreshNfts = () => {
    setRefresh(true)
  }

  const fetchIBUNYData = useCallback(async () => {
    setIsLoading(true)
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const nftContract = new ethers.Contract(TheBUNY.address, TheBUNY.abi, provider)
    const name = await nftContract.name()
    setNftName(name)
    const price = await nftContract.cost()
    setCost(ethers.utils.formatUnits(price, 'ether'))
    const symbol = await nftContract.symbol()
    setNftSymbol(symbol)
    const totalNftSupply = await nftContract.totalSupply()
    setTotalNftSupply(totalNftSupply.toString())
    const max = await nftContract.maxSupply()
    setMaxSupply(max.toString())
    const baseURI = await nftContract.baseURI()
    //setBaseURI(baseURI.toString())
    console.log(baseURI.toString())
    const tokenURI = await nftContract.tokenURI(totalNftSupply.toString())
    console.log(tokenURI)
    const call = await axios.get(tokenURI)
    console.log(JSON.stringify(call.data.image))
    const url = call.data.image
    // Split the URL into parts based on '/'
    const urlParts = url.split('/')

    // Get the last part of the URL (e.g., "42.png")
    const lastPart = urlParts[urlParts.length - 1]

    // Split the last part into filename and extension (e.g., "42.png" -> ["42", "png"])
    const fileParts = lastPart.split('.')

    // Check if there are exactly two parts (filename and extension)
    if (fileParts.length === 2) {
      // Extract the filename and increment it
      let filename = parseInt(fileParts[0])
      filename++

      // Reconstruct the URL with the incremented filename
      const newURL = url.replace(fileParts[0], filename.toString())

      console.log(newURL) // Output the new URL with the incremented number
      setIBUNYImage(newURL)
      
    } else {
      console.log('Invalid URL format') // Handle invalid URL format
    }
    setRefresh(true)
    setIsLoading(false)
  }, []) // Update the dependencies as needed

  useEffect(() => {
    if (window.ethereum) {
      fetchIBUNYData()
    } else {
      console.log('Please install MetaMask')
    }
  }, [fetchIBUNYData])

  const [toastId, setToastId] = useState(null)

  const mintIBUNY = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(TheBUNY.address, TheBUNY.abi, signer)
      const contractWithSigner = contract.connect(signer)
      const price = await contract.cost()

      // Mint the token and listen for the confirmation
      const mintTx = await contractWithSigner.mint('1', {
        value: price,
      })

      // Show "Pending Confirmations" toast
      const pendingId = toast({
        title: 'Pending Confirmations',
        description: 'Waiting for tx confirmation...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })

      // Wait for one confirmation
      await mintTx.wait(1) // Change the argument to adjust the number of confirmations required

      // Close the "Pending Confirmations" toast
      toast.close(pendingId)

      console.log(mintTx)
      setMintResult(mintTx.hash.toString())

      // Close the previous toast if it exists
      if (toastId) {
        toast.close(toastId)
      }

      const successId = toast({
        title: 'Transaction successful',
        description: `IBUNY Successfully minted!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setToastId(successId)

      fetchIBUNYData()
    } catch (error) {
      // Close the previous toast if it exists
      if (toastId) {
        toast.close(toastId)
      }

      const id = toast({
        title: 'Transaction failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      setToastId(id)
    }
  }

  return (
    <VStack bg="white" color="black" spacing={1} w={'100%'} p={1} mt={1}>
      <style jsx>{`
        p {
          font-size: 12px;
        }
      `}</style>
      {isLoading ? (
        <Center p={12} w="100%" h="100%">
          <VStack>
          <Spinner size={'lg'} color="#b77672" />
          <Text>Refreshing IPFS Metadata</Text>
          </VStack>
        </Center>
      ) : (
        <>
          <HStack m={1}>
            <Text as="b">Name:</Text>
            <Text bg="ghostwhite" p={1} noOfLines={1} overflow={'hidden'}>
              {' '}
              {nftName}
            </Text>
          </HStack>
          <HStack gap="4px" fontSize={'12px'} p={2} m={2}>
            <Text as="b">Minted:</Text>
            <Text>{totalNftSupply}</Text>
            <Text as="b">/</Text>
            <Text>{maxSupply}</Text>
          </HStack>
          <Text bg="ghostwhite" p={1} noOfLines={1} overflow={'hidden'}>
            {nftAddress}
          </Text>
          <div>
            <>
              <div>
                <Center mt={2}>
                  <VStack w="100%">
                    <Image src={IBUNYImage} width="200px" border="1px solid silver" />
                    <Text fontSize="10px">* Next NFT to be minted</Text>

                    <div>
                      {mintResult && (
                        <>
                          <Box mb={2}>
                            <AntButton href={`https://testnet.teloscan.io/tx/${mintResult}`} target="_blank">
                              View Transaction
                            </AntButton>
                          </Box>
                        </>
                      )}
                    </div>
                  </VStack>
                </Center>
              </div>
            </>
          </div>
        </>
      )}

      <Button size={'sm'} colorScheme="twitter" onClick={() => mintIBUNY('1')}>
        <HStack fontSize="12px">
          {' '}
          <Text>Mint </Text>
          <Text> {nftSymbol}</Text>
          <Text>{nftCost}/TLOS</Text>
        </HStack>
      </Button>
      <MyIBUNYGalleryTabs contractAddress={TheBUNY.address} abi={TheBUNY.abi} refresh={refresh} />
    </VStack>
  )
}

export default MintIBUNY
