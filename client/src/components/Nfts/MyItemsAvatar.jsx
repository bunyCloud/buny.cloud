import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { avatarAddress } from "../../contracts/config/networkAddress";
import NFTAbi from "../../contracts/erc721Dynamic.json";
import axios from "axios";
import Web3Modal from "web3modal";
import Card from "../../subcomponents/cards/AvatarCardMini";
import { Center, Link } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";

export default function MyItemsAvatar() {
  const [allNFTs, setAllNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { account, deactivate } = useEthers();

  // Only loads the NFTs which are purchased by the user.
  const loadMyNFTs = async () => {
    setLoading(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(avatarAddress, NFTAbi.abi, signer);
    const data = await nftContract.OwnerOfToken(account);
    const allItems = await Promise.all(
      data?.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.edition);
        const metaData = await axios.get(tokenUri);
        let item = {
          edition: i.edition.toNumber(),
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
    };
    load();
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "390px",
          height: "auto",
          backgroundColor: "transparent",
          overFlowY: "auto",
        }}
      >
        {allNFTs.length && !loading ? (
          allNFTs?.map((nft, index) => (
            <div key={index}>
              <Card nft={nft} url="/avatar" />
            </div>
          ))
        ) : (
          <Center>
            <div>
              No Avatars found.
              <Link
                style={{ marginLeft: "5px" }}
                href={`/collection/${avatarAddress}`}
              >
                Check mint page
              </Link>
            </div>
          </Center>
        )}
      </div>
    </>
  );
}
