import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "../../contracts/config/networkAddress";
import NFTAbi from "../../contracts/NFT.json";
import NFTMarketplaceAbi from "../../contracts/NFTMarketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
import Card from "../../subcomponents/cards/PurchasedCardMini";
import { Link } from "@chakra-ui/react";
import { IndexBar, List } from "antd-mobile";

const styles = {
  nfts: {
    WebkitBoxPack: "center",
    justifyContent: "center",
    position: "relative",
    overFlow: "auto",
  },
};

export default function MyItemsIndex() {
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
    console.log(allNFTs);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await loadMyNFTs();
      console.log(allNFTs);
    };
    load();
  }, []);

  return (
    <>
      <div style={{ position: "relative", height: "450px", overFlowY: "auto" }}>
        {allNFTs.length && !loading ? (
          allNFTs?.map((nft, index) => (
            <div key={index}>
              {/*
              <Card nft={nft} url="/token/" />
                */}
              <IndexBar>
                {allNFTs?.map(nft, (index) => {
                  return (
                    <IndexBar.Panel index={nft} nft={nft} key="/token/">
                      <List>
                        {items.map((nft, index) => (
                          <List.Item key={index}>{item}</List.Item>
                        ))}
                      </List>
                    </IndexBar.Panel>
                  );
                })}
              </IndexBar>
            </div>
          ))
        ) : (
          <div className="text-center font-semibold text-base">
            No purchase History found.
            <Link href="/nft-marketplace">Go to marketplace</Link>
          </div>
        )}
      </div>
    </>
  );
}
