import React, { useState, useEffect } from "react";
import { avatarAddress } from "contracts/config/networkAddress";
import erc721Dynamic from "contracts/erc721Dynamic.json";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { ethers } from "ethers";
import { IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { Tooltip, notification, Tag } from "antd";
import { HStack, useClipboard } from "@chakra-ui/react";
import moment from "moment";
import { AutoCenter } from "antd-mobile";

function AvatarPage() {
  const { tokenId } = useParams();
  const [contractName, setContractName] = useState();
  const [nftOwner, setNftOwner] = useState();
  const [contractSymbol, setContractSymbol] = useState();
  const [nftImage, setNftImage] = useState();
  const [nftDna, setDna] = useState();
  const [nftName, setNftName] = useState();
  const [nftDesc, setNftDesc] = useState();
  const [date, setDate] = useState();
  const { onCopy, hasCopied } = useClipboard(avatarAddress);
  const [background, setBackground] = useState();
  const [chest, setChest] = useState();
  const [mouth, setMouth] = useState();
  const [head, setHead] = useState();
  const [animation, setAnimation] = useState();

  const openNotification = () => {
    notification.open({
      message: "Copied to clipboard",
      description: [
        <>
          <p style={{ fontSize: "10px" }}>
            Buny Avatar NFT Contract: {avatarAddress}
          </p>
        </>,
      ],
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  async function fetchNFT() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.avax.network/ext/bc/C/rpc",
    );
    const contract = new ethers.Contract(
      avatarAddress,
      erc721Dynamic.abi,
      provider,
    );

    const name = await contract.name(); //contract name
    setContractName(name);
    const symbol = await contract.symbol();
    setContractSymbol(symbol);
    const tokenUri = await contract.tokenURI(tokenId); // nft tokenuri
    const response = await fetch(tokenUri);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    console.log(json);
    console.log(`Name: ${json.name}`);
    setNftName(json.name);
    console.log(json.description);
    setNftDesc(json.description);
    setAnimation(json.animation);
    console.log(`Buny DNA sequence: ${json.dna}`);
    setDna(json.dna);
    console.log(`Background: ${json.attributes[0].value}`);
    setBackground(json.attributes[0].value);
    console.log(`Mouth: ${json.attributes[1].value}`);
    setMouth(json.attributes[1].value);
    console.log(`Chest: ${json.attributes[3].value}`);
    setChest(json.attributes[3].value);
    console.log(`Head: ${json.attributes[2].value}`);
    setHead(json.attributes[2].value);
    console.log(`Image URL: ${json.image}`);
    setDate(json.date);
    console.log(json.date);
    setNftImage(json.image);
    checkOwner();
  }

  async function checkOwner() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.avax.network/ext/bc/C/rpc",
    );
    const contract = new ethers.Contract(
      avatarAddress,
      erc721Dynamic.abi,
      provider,
    );
    const n = new ethers.BigNumber.from(tokenId);
    const owner = await contract.ownerOf(n);
    setNftOwner(owner);
    console.log(`NFT owned by: ${owner}`);
  }

  const [deployInitiate, setDeployInitiate] = useState();
  const dateString = moment(date).format("MM/DD/YYYY");
  console.log(dateString);

  useEffect(() => {
    fetchNFT();
  }, []);

  useEffect(() => {
    //fetchMetadata();
  }, []);

  return (
    <>
      <Box
        bg="#0000ed"
        border={"1px solid blue"}
        mt={10}
        w={"100%"}
        maxWidth="800px"
        h={"100%"}
        style={{
          fontSize: "12px",
          padding: "5px",
          color: "white",
        }}
      >
        <AutoCenter>
          <Box bg="white" minWidth="-moz-max-content" color="black" p={5}>
            <Center>
              <Flex minWidth={"-moz-max-content"}>
                <Wrap justify="center">
                  <WrapItem>
                    <Box minWidth={350}>
                      <p
                        style={{
                          fontSize: "14px",
                          borderBottom: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <strong> {nftName}</strong>{" "}
                      </p>
                      <p>
                        <strong>Collection:</strong> {contractName}
                      </p>
                      <p>
                        <strong>Symbol:</strong> {contractSymbol}
                      </p>
                      <div>
                        <p>
                          <strong>Token ID:</strong> {tokenId}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Created:</strong> {dateString}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>DNA:</strong> {nftDna}
                        </p>
                      </div>
                      <Box
                        fontWeight="bold"
                        color="black"
                        h={45}
                        fontSize="11px"
                        w={"100%"}
                        lineHeight="tight"
                        noOfLines={[1]}
                        isTruncated
                      >
                        <HStack>
                          <div
                            onClick={openNotification}
                            style={{
                              fontSize: "11px",
                              padding: "0px",
                              textAlign: "right",
                              color: "black",
                            }}
                          >
                            <strong style={{ paddingRight: "4px" }}>
                              Address:
                            </strong>
                            <a
                              href={`https://snowtrace.io/address/${avatarAddress}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {avatarAddress}
                            </a>

                            <Tooltip title="Copy to clipboard">
                              <IconButton
                                m={2}
                                onClick={onCopy}
                                variant="outline"
                                colorScheme="teal"
                                aria-label="Copy to clipboard"
                                icon={<CopyIcon />}
                              >
                                {hasCopied ? "Copied!" : "Copy"}
                              </IconButton>
                            </Tooltip>
                          </div>
                        </HStack>
                        <HStack>
                          <strong style={{ paddingRight: "4px" }}>
                            Owner:
                          </strong>
                          <a
                            href={`https://snowtrace.io/address/${nftOwner}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div>{nftOwner}</div>
                          </a>
                        </HStack>
                      </Box>
                    </Box>
                  </WrapItem>
                  <WrapItem>
                    <Center
                      w="100%"
                      minWidth="350px"
                      bg="rgba(31,41,80)"
                      color="white"
                    >
                      <Box>
                        <p
                          style={{
                            fontSize: "14px",
                            borderBottom: "1px solid white",
                            textAlign: "center",
                          }}
                        >
                          <strong> Attributes </strong>
                        </p>

                        <Box
                          bg="rgb(229 231 235)"
                          w="100%"
                          h="120px"
                          minWidth="300px"
                          maxWidth="350px"
                          p={10}
                          textAlign="center"
                          mt={5}
                          color="black"
                        >
                          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                            <GridItem
                              colSpan={2}
                              ml={20}
                              h="15"
                              bg="transparent"
                            >
                              <strong>Background:</strong>{" "}
                            </GridItem>
                            <GridItem
                              colStart={4}
                              colEnd={6}
                              h="15"
                              bg="transparent"
                              fontSize="12px"
                              ml={-35}
                            >
                              <div>{background} </div>
                            </GridItem>
                            <GridItem
                              colSpan={2}
                              h="15"
                              bg="transparent"
                              ml={20}
                            >
                              <strong>Mouth:</strong>{" "}
                            </GridItem>
                            <GridItem
                              colStart={4}
                              colEnd={6}
                              h="15"
                              fontSize="12px"
                              ml={-35}
                              bg="transparent"
                            >
                              <div>{mouth} </div>
                            </GridItem>
                            <GridItem
                              ml={20}
                              colSpan={2}
                              h="15"
                              bg="transparent"
                            >
                              <strong>Chest:</strong>{" "}
                            </GridItem>
                            <GridItem
                              colStart={4}
                              colEnd={6}
                              h="15"
                              bg="transparent"
                              fontSize="12px"
                              ml={-35}
                            >
                              <div>{chest}</div>
                            </GridItem>
                            <GridItem
                              ml={20}
                              colSpan={2}
                              h="15"
                              bg="transparent"
                            >
                              <strong>Head:</strong>{" "}
                            </GridItem>
                            <GridItem
                              colStart={4}
                              colEnd={6}
                              h="15"
                              bg="transparent"
                              fontSize="12px"
                              ml={-35}
                            >
                              <div>{head} </div>
                            </GridItem>
                          </Grid>
                        </Box>
                      </Box>
                    </Center>
                  </WrapItem>
                </Wrap>
              </Flex>
            </Center>
            <Box p={15} fontSize="12px">
              <Tag
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(31,41,80)",
                  color: "rgba(31,41,80)",
                }}
              >
                Description
              </Tag>
              <p>{nftDesc}</p>
            </Box>
          </Box>
        </AutoCenter>

        <div>
          <Center>
            <Flex>
              <Wrap>
                <WrapItem>
                  <Box
                    style={{
                      backgroundColor: "transparent",
                      margin: "10px",
                      height: "100%",
                      color: "white",
                      maxWidth: "900px",
                    }}
                  >
                    <Tag
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid white",
                        color: "white",
                      }}
                    >
                      Image
                    </Tag>
                    <model-viewer
                      shadow-intensity="1"
                      style={{ width: "350px", height: "350px" }}
                      camera-controls
                      poster={nftImage}
                      //alt={`Nft Name: ${nft.name}`}
                      src={nftImage}
                    ></model-viewer>
                  </Box>
                </WrapItem>
                <WrapItem>
                  <Box
                    style={{
                      backgroundColor: "transparent",
                      margin: "10px",
                      height: "100%",
                      color: "white",
                      maxWidth: "900px",
                    }}
                  >
                    <Tag
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid white",
                        color: "white",
                      }}
                    >
                      Animation
                    </Tag>
                    <model-viewer
                      shadow-intensity="1"
                      style={{ width: "350px", height: "350px" }}
                      camera-controls
                      poster={animation}
                      src={animation}
                    ></model-viewer>
                  </Box>
                </WrapItem>
              </Wrap>
            </Flex>
          </Center>
        </div>
      </Box>
    </>
  );
}

export default AvatarPage;
