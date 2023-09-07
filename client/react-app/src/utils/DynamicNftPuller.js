import { ethers } from "ethers";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
//import raffleNft from "./raffleNft.json";
import raffleNft from "contracts/RaffleNft.json";
import { Card, Container, Text, Grid } from "@nextui-org/react";
import { key, displayAmount, network } from "./settings";
import { Box, Center } from "@chakra-ui/react";
import { Button } from "antd";
import "subcomponents/hoverButton.scss";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function DynamicNftPuller(raffleAddress) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    generateNft();
  }, [setNfts]);

  async function refreshPage() {
    window.location.reload();
  }

  const [initImage, setOne] = useState();
  const [thisName, setTwo] = useState();
  const [thisDesc, setThree] = useState();
  const [thisEdition, setFour] = useState();
  const [thisDate, setFive] = useState();
  const [thisDna, setSix] = useState();

  async function generateNft(raffleAddress) {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.avax-test.network/ext/bc/C/rpc",
    );
    const contract = new ethers.Contract(
      raffleAddress,
      raffleNft.abi,
      provider,
    );

    const itemArray = [];
    contract.totalSupply().then((result) => {
      let totalSup = parseInt(result, 16);
      for (let i = 0; i < totalSup; i++) {
        var token = i + 1;
        const owner = contract.ownerOf(token);
        const rawUri = contract.tokenURI(token);
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
          setOne(image);
          setTwo(name);
          setThree(desc);
          setFour(edition);
          setFive(date);
          setSix(dna.toString());
          console.log(image);
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

  useEffect(() => {
    generateNft();
  }, []);

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        {nfts.map((nft, i) => {
          <div>
            <Card.Image src={nft.img} key={i} />
            <h2>No Collections Retrieved</h2>
          </div>;
        })}
      </div>
    );
  return (
    <Container md>
      <Text h1 css={{ marginLeft: "$10" }} size={"40px"} color="rgba(31,41,80)">
        Avatar Collection
      </Text>
      <Button css={{ marginLeft: "$10" }} onClick={refreshPage}>
        Refresh NFTs
      </Button>
      <Grid.Container gap={3}>
        {nfts.map((nft, i) => {
          return (
            <Grid key={i}>
              <a>
                <Card
                  isHoverable
                  key={i}
                  css={{
                    mw: "270px",
                    marginRight: "$1",
                    boxShadow: "0px 2px 12px #000000",
                  }}
                  variant="bordered"
                >
                  <Card.Image src={nft.img} />
                  <Card.Body md css={{ background: "$gradient" }}>
                    <Text css={{ color: "$white" }} h2>
                      {nft.name}
                    </Text>
                    <Text h3 css={{ color: "$white" }}>
                      NFT ID: {nft.edition}
                    </Text>
                    {/*<Box fontSize="12px" color='white'>DNA: {nft.dna}</Box>*/}
                    <Box
                      noOfLines={5}
                      style={{ fontSize: "12px", color: "white" }}
                    >
                      {nft.desc}
                    </Box>
                  </Card.Body>
                  <Center>
                    <Link
                      ml={5}
                      href={`https://buny.cloud/avatar/${raffleAddress}/${nft.edition}`}
                      isExternal
                    >
                      View token page <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Center>
                </Card>
              </a>
            </Grid>
          );
        })}
      </Grid.Container>
    </Container>
  );
}
