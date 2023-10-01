import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { Grid, GridItem, Box, Image, Center, Text, VStack, Heading, HStack, IconButton, useToast } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import {RepeatIcon} from '@chakra-ui/icons'
import ViewNftDrawer from '../Drawers/ViewNftDrawer'
import FetchAccountAddress from '../TokenBound/FetchAccountAddress'



export default function FetchMyIBUNYList({contractAddress, abi, refresh}){

    const [nfts, setNfts] = useState([])
    const {account, chainId} = useContext(AppContext)
    const [nftError, setNftError] = useState()
    const toast = useToast()

    useEffect(() => {
        if (!window.ethereum) {
          console.log('Provider not found.');
          return; 
        }
        async function fetchNfts() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
        
            // Notify the user that the search is in progress
           
        
            const ownedNFTs = await contract.tokensOfOwner(userAddress);
        
            if (ownedNFTs.length === 0) {
                console.log('No NFTs found.');
                setNftError('No NFTs found');
        
                // Notify the user that no NFTs were found
               
        
                return;
            }
        
            const tokenData = await Promise.all(
                ownedNFTs.map(async (tokenId) => {
                    const tokenURI = await contract.tokenURI(tokenId);
                    let metadata = {};
                    try {
                        const response = await axios.get(tokenURI);
                        metadata = response.data;
                        console.log(metadata)
                    } catch (error) {
                        console.error(`Error fetching metadata for token ${tokenId}: ${error}`);
        
                        // Notify the user about the error
                        toast({
                            title: "Error Fetching Metadata",
                            description: `Error fetching metadata for token ${tokenId}: ${error}`,
                            status: "error",
                            duration: 7000,
                            isClosable: true,
                        });
                    }
        
                    return {
                        tokenId,
                        tokenURI,
                        metadata,
                    };
                }),
            );
        
            setNfts(tokenData);
        
          
        }
      
        fetchNfts()
      }, [abi, account, contractAddress, toast, refresh])


return(
    <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
    <Heading size="md">
      <HStack gap="auto">
      <Text bg="#c1cfd8" as="b" fontSize={'12px'} noOfLines={2}>
  My IBUNY Collection
</Text>

      </HStack>
      </Heading>

      <Grid
  bg="white"
  h="auto"
  color="black"
  overflowY={'auto'}
  templateColumns={{
    base: '1fr', // Single column for mobile and smaller screens
    sm: 'repeat(6, 1fr)', // 2 columns for slightly larger screens
    md: 'repeat(8, 1fr)', // 3 columns for medium screens
    lg: 'repeat(10, 1fr)', // 4 columns for large screens
    xl: 'repeat(12, 1fr)' // 4 columns for extra-large screens
  }}
  gap={2}>
  {nfts.map((nft, i) => (
    <GridItem key={i}>
      <Center>
        <VStack>
          
          <Box border="1px solid #c1cfd8">
            <Image boxSize="auto" objectFit="cover" src={nft.metadata.image} alt={nft.metadata.name} />
            <Text fontSize={'sm'}> {nft.metadata.name}</Text>

            <FetchAccountAddress inputAddress={contractAddress} inputChainId={41} inputTokenId={nft.metadata.edition} />
            
            <ViewNftDrawer contractAddress={contractAddress} name={nft.metadata.name} edition={nft.metadata.edition} dna={nft.metadata.dna} date={nft.metadata.date} nftImage={nft.metadata.image} description={nft.metadata.description} attributes={nft.metadata.attributes} />
          </Box>
        </VStack>
      </Center>
    </GridItem>
  ))}
</Grid>

</Box>
)
  }