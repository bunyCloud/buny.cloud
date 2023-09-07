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
//import { buyNft } from "pages/api/buyNFT";
import { Heading } from "@chakra-ui/react";

const styles = {
  nfts: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    gap: "5px",
    margin: "10px",
  },
  layout: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    //margin: "10px auto",
    width: "100%",
    backgroundColor: "white",
    gap: "10px",
  },
  title: {
    color: "Black",
  },
};

export default function MySales() {
  //const router = useRouter()
  const [listedNFTs, setListedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value) => value,
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => address,
    },
  ];

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
        const convertedPrice = ethers.utils.formatUnits(
          i.price.toString(),
          "ether",
        );
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const metaData = await axios.get(tokenUri);
        let item = {
          price: convertedPrice,
          sold: i.sold,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: metaData.data.image,
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

  return (
    <div>
      {!listedNFTs.length && loading ? (
        <Center>
          <Loading />
        </Center>
      ) : (
        <div>
          <Center>
            <div
              style={{
                backgroundColor: "white",
                display: "flex",
                flexWrap: "wrap",
                WebkitBoxPack: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <div style={styles.nfts}>
                {soldNFTs.length && !loading ? (
                  soldNFTs?.map((nft, index) => (
                    <div style={{ textAlign: "center" }} key={index}>
                      <Center>
                        <Card nft={nft} url="/my-sales/" />
                      </Center>
                    </div>
                  ))
                ) : (
                  <div>No NFTs sold yet</div>
                )}
              </div>
            </div>
          </Center>
        </div>
      )}
    </div>
  );
}
