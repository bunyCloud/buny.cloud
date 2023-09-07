import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "../../helpers/networkAddress";
import NFTAbi from "../../contracts/NFT.json";
import NFTMarketplaceAbi from "../../contracts/Marketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
import Card from "../../subcomponents/cards/Card";
//import Link from "next/link";
import Heading3 from "../../subcomponents/headings/Heading3";
import Loading from "../../subcomponents/loading/Loading";
import BtnMain from "../../subcomponents/btns/BtnMain";
//import { useRouter } from "next/router";
import { Center } from "@chakra-ui/react";
import { buyNft } from "pages/api/buyNFT";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    marginLeft: "10px",
    marginRight: "10px",
    width: "100%",
    textAlign: "center",
    maxWidth: "1000px",
    gap: "10px",
  },
  ipfsTabs: {
    padding: "5px",
    borderRadius: "2px",
    borderWidth: "3px",
    borderColor: "white",
    color: "white",
    backgroundColor: "rgb(47, 6, 255)",
    width: "88px",
    cursor: "pointer",
    textAlign: "center",
  },
};

export default function OwnerItems() {
  //const router = useRouter()
  const [listedNFTs, setListedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allNfts, setAllNfts] = useState();

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
    console.log("This is your data ", data);

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
          sold: i.sold,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        };
        console.log(item);
        setAllNfts(item);
        return item;
      }),
    );

    // Filter to get only listed NFTs
    let currentListedItems = allItems.filter((item) => !item.sold);
    setListedNFTs(currentListedItems);

    // Filter to get only sold NFTs
    let soldItems = allItems.filter((item) => item.sold);
    setSoldNFTs(soldItems);
    console.log(soldItems);
    console.log(currentListedItems);
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
      console.log(listedNFTs);
    };
    load();
  }, []);
  return (
    <div>
      {!listedNFTs.length && loading ? (
        <Center>
          <Loading />
        </Center>
      ) : (
        <div>
          <div>
            <Center>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "40px",
                  marginLeft: "40px",
                  marginRight: "40px",
                }}
              >
                <Heading3 title="Listed NFTs" />
                <div style={styles.NFTs}>
                  {listedNFTs.length && !loading ? (
                    listedNFTs?.map((nft, index) => (
                      <div key={index}>
                        <Center>
                          <Card
                            nft={nft}
                            url="/my-listed-items/"
                            onClick={() => {
                              buyNft(nft);
                              console.log("Onclicked on buy button.");
                            }}
                          />
                        </Center>
                      </div>
                    ))
                  ) : (
                    <div className="font-semibold text-base flex items-center gap-x-2">
                      No Listed NFTs found{" "}
                      <span>
                        <BtnMain text="List Now" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Center>
          </div>
          {/* Sold list */}
        </div>
      )}
    </div>
  );
}
