import { ethers } from "ethers";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import NFTCollection from "contracts/erc721Dynamic.json";
import { avatarAddress } from "contracts/config/networkAddress";
import { Box, Text, Grid, Button, Image, Center } from "@chakra-ui/react";
import { Spin } from "antd";
import { network, key } from "./settings";
// fuji avatar contract address
//Generic Wallet Key to make the call, not usable, DO NOT CHANGE.

export default function FetchNftMetadata() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    generateNft();
  }, [setNfts]);

  async function refreshPage() {
    window.location.reload();
  }
  async function generateNft() {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(network);
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(
      avatarAddress,
      NFTCollection.abi,
      wallet,
    );
    const itemArray = [];
    contract.totalSupply().then((result) => {
      let totalSup = parseInt(result, 8);

      /*
        Replace "displayAmount" with "totalSup"
        below if you want to display all NFTs 
        in the collection BUT BE CAREFUL, it will render
        every nft image and possibly freeze your server/browser!!
        */
      for (let i = 0; i < totalSup; i++) {
        var edition = i + 1;
        const owner = contract.ownerOf(edition);
        const rawUri = contract.tokenURI(edition);
        const Uri = Promise.resolve(rawUri);
        const getUri = Uri.then((value) => {
          let str = value;
          let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
          let metadata = axios.get(cleanUri).catch(function (error) {
            console.log(error.toJSON());
          });
          return metadata;
        });
        getUri.then((value) => {
          let rawImg = value.data.image;
          var name = value.data.name;
          var desc = value.data.description;
          var edition = value.data.edition;
          var date = value.data.date;
          var dna = value.data.dna;
          let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
          Promise.resolve(owner).then((value) => {
            let ownerW = value;
            let meta = {
              name: name,
              img: image,
              edition: edition,
              date: date,
              dna: dna,
              wallet: ownerW,
              desc: desc,
            };
            itemArray.push(meta);
          });
        });
      }
    });
    await new Promise((r) => setTimeout(r, 9000));
    setNfts(itemArray);
    setLoadingState("loaded");
    setLoading(false);
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        {nfts.map((nft, i) => {
          <div>
            <Image src={nft.img} key={i} />
            <h2>No Collections Retrieved</h2>
          </div>;
        })}
      </div>
    );
  return (
    <Box bg="white" minHeight="100px">
      <Text style={{ marginLeft: "10px" }} size={"40px"}>
        NFT Collection
      </Text>
      <Button
        style={{ marginLeft: "10px", color: "black" }}
        onPress={refreshPage}
      >
        Refresh NFTs
      </Button>
      <Box>
        {loading && (
          <>
            <Center mt={40}>
              <Spin tip="Loading" size="small"></Spin>
            </Center>
            <p style={{ color: "white" }}>loading collection images.......</p>
          </>
        )}
      </Box>
      <Box gap={3}>
        {nfts.map((nft, i) => {
          return (
            <Grid>
              <a>
                <Box
                  key={i}
                  minWidth="250px"
                  maxWidth="300px"
                  border="1px solid orange"
                >
                  <Image src={nft.img} />
                  <Box>
                    <Text style={{ color: "blue" }}>{nft.name}</Text>
                    <Text style={{ color: "blue", fontSize: "12px" }}>
                      ID: {nft.edition}
                    </Text>
                    <Text style={{ color: "blue", fontSize: "12px" }}>
                      {nft.desc}
                    </Text>
                    <Text style={{ color: "blue", fontSize: "12px" }}>
                      Dna:{nft.dna}
                    </Text>
                    <Text style={{ color: "blue", fontSize: "12px" }}>
                      Created:{nft.date}
                    </Text>
                  </Box>
                </Box>
              </a>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}
