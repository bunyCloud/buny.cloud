import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Center, Box, Flex, VStack } from '@chakra-ui/react'
import NFT from 'contracts/TheBunyProjectNFT.json'
import Marketplace from 'contracts/TheBunyProjectMarketplace.json'
import NFTCard from './Market3DNftCard'
import { nftAddress, nftMarketplaceAddress } from 'contracts/config/networkAddress'
import { Spin } from 'antd'
import { AutoCenter } from 'antd-mobile'

const styles = {
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    WebkitBoxPack: 'center',
    justifyContent: 'center',
    //margin: "10px auto",
    width: '100%',
    backgroundColor: 'black',
  },
}

export default function All3DNfts(trigger) {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log({ nftAddress, nftMarketplaceAddress })
    loadNfts()
  }, [])

  useEffect(() => {
    if (trigger) {
      loadNfts()
    }
  }, [trigger])

  async function loadNfts() {
    setLoading(true)

    const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')

    const nft = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketplace = new ethers.Contract(nftMarketplaceAddress, Marketplace.abi, provider)

    let items = []
    try {
      items = await marketplace.getAllListedItems()
    } catch (err) {
      console.log(err)
    }
    items = await Promise.all(
      items.map(async (i) => {
        const tokenURI = await nft.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        return {
          ...i,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId.toNumber(),
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          price: ethers.utils.formatUnits(i.price.toString(), 'ether'),
        }
      })
    )

    setLoading(false)
    setLoaded(true)
    setNfts(items)
  }
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function buyNft(nft) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketplace = new ethers.Contract(
      nftMarketplaceAddress,
      Marketplace.abi,
      signer,
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await marketplace.buyItem(nftAddress, nft.itemId, {
      value: price,
    });
    await transaction.wait();
    loadNfts();
  }

  return (
    <Flex>
      <VStack>
        {loading && (
          <>
            <Center mt={40}>
              <Spin tip="Loading" size="small"></Spin>
            </Center>
            <p style={{ color: 'white' }}>loading marketplace NFTs.......</p>
          </>
        )}
        {loaded && nfts.length === 0 && <p>There are no Items in the marketplace </p>}
        <AutoCenter>
          <Box display="flex" mt="2" alignItems="center">
            <div style={styles.layout}>
              {nfts.map((nft) => (
                <NFTCard key={nft.itemId} nft={nft} showInfo showBuyBtn buyNft={() => buyNft(nft)} />
              ))}
            </div>
          </Box>
        </AutoCenter>
      </VStack>
    </Flex>
  )
}
