import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "../../contracts/config/networkAddress";
import NFTAbi from "../../contracts/NFT.json";
import NFTMarketplaceAbi from "../../contracts/Marketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
import Card from "../../subcomponents/cards/PurchasedCard";
import { Link, Flex } from "@chakra-ui/react";

const styles = {
  nfts: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: "100%",
    gap: "20px",
  },
  layout: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    //margin: "10px auto",
    width: "100%",
    backgroundColor: "white",
  },
};

export default function MyItems(trigger) {
  const [allNFTs, setAllNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only loads the NFTs which are purchased by the user.
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

    const data = await nftMarketPlaceContract.getOwnerListedItems();

    const allItems = await Promise.all(
      data?.map(async (i) => {
        let convertedPrice = ethers.utils.formatUnits(
          i.price.toString(),
          "ether",
        );
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const metaData = await axios.get(tokenUri);
        let item = {
          price: convertedPrice,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        };
        return item;
      }),
    );
    setAllNFTs(allItems);
    //console.log(allNFTs);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await loadMyNFTs();
      //console.log(allNFTs);
    };
    load();
  }, []);

  useEffect(() => {
    if (trigger) {
      loadMyNFTs();
    }
  }, [trigger]);

  return (
    <>
      <Flex>
        <div style={styles.layout}>
          {allNFTs?.map((nft, index) => (
            <Card nft={nft} url="/token/" />
          ))}
        </div>
      </Flex>
    </>
  );
}
