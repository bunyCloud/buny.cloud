import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "contracts/config/mainnet/networkAddress";
import NFTAbi from "../../contracts/NFT.json";
import NFTMarketplaceAbi from "../../contracts/Marketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
//import Card from "../../subcomponents/cards/SellerCard";
import Card from "./Market3DNftCard";

//import Link from "next/link";
import Loading from "../../subcomponents/loading/Loading";
import BtnMain from "../../subcomponents/btns/BtnMain";
//import { useRouter } from "next/router";
import {
  Tabs,
  TabList,
  TabPanels,
  Center,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Box, HStack } from "@chakra-ui/react";
import { AutoCenter } from "antd-mobile";
import { Flex, VStack } from "@chakra-ui/react";
import { Spin } from "antd";

const styles = {
  layout: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    //margin: "10px auto",
    width: "100%",
    backgroundColor: "black",
  },
  title: {
    color: "Black",
  },
};

export default function MyListings(trigger) {
  //const router = useRouter()
  const [listedNFTs, setListedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Loads all the nfts which are either listed or sold of user.
  const loadMyNFTs = async () => {
    setLoading(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftAddress, NFTAbi.abi, signer);
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      signer,
    );
    const data = await nftMarketPlaceContract.getSellerListedItems();
    //console.log("This is your data ", data);

    const allItems = await Promise.all(
      data?.map(async (i) => {
        const convertedPrice = ethers.utils.formatUnits(i.price, "ether");
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const metaData = await axios.get(tokenUri);
        let item = {
          price: convertedPrice,
          sold: i.sold,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: metaData.data.image,
          animation: metaData.data.animation_url,
          name: metaData.data.name,
          description: metaData.data.description,
        };
        //console.log(item);
        return item;
      }),
    );

    // Filter to get only listed NFTs
    let currentListedItems = allItems.filter((item) => !item.sold);
    setListedNFTs(currentListedItems);

    // Filter to get only sold NFTs
    let soldItems = allItems.filter((item) => item.sold);
    setSoldNFTs(soldItems);
    //console.log(soldItems);
    //console.log(currentListedItems);
    setLoading(false);
  };

  ///////////////////////////
  // NFT Marketplace
  //Purchase Tokens
  //////////////
  ///

  useEffect(() => {
    const load = async () => {
      await loadMyNFTs();
      ///console.log(listedNFTs);
    };
    load();
  }, [listedNFTs]);

  useEffect(() => {
    if (trigger) {
      loadMyNFTs();
    }
  }, [trigger]);

  return (
    <Flex>
      <VStack>
        {loading && (
          <>
            <Center mt={40}>
              <Spin tip="Loading" size="small"></Spin>
            </Center>
            <p style={{ color: "white" }}>loading marketplace NFTs.......</p>
          </>
        )}
        {loaded && listedNFTs.length === 0 && (
          <p>There are no Items in the marketplace </p>
        )}
        <AutoCenter>
          <Box display="flex" mt="2" alignItems="center">
            <div style={styles.layout}>
              {listedNFTs.map((nft) => (
                <Card key={nft.itemId} nft={nft} url="/my-listings" showInfo />
              ))}
            </div>
          </Box>
        </AutoCenter>
      </VStack>
    </Flex>
  );
}
