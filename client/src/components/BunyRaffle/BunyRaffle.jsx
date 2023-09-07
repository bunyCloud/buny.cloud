import { useHistory } from "react-router-dom";
import { Button, Tag } from "antd";
import { Center, Box, HStack, GridItem, Grid } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
//import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import RaffleNFT from "contracts/RaffleNFT.json";
import { IconButton, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CopyIcon, CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
//import { nftMarketplaceAddress } from "contracts/config/networkAddress";
import { useClipboard } from "@chakra-ui/react";
import { Card, Tooltip, notification, Statistic } from "antd";

//import 'react-wheel-of-prizes/dist/index.css'

import { AutoCenter } from "antd-mobile";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    width: "100%",

    padding: "50px",
    gap: "15px",
  },
  NFTB: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px",
    gap: "15px",
  },
  banner: {
    display: "flex",
    WebkitBoxPack: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    maxWidth: "600px",
    paddingBottom: "10px",
    borderBottom: "solid 1px blue",
  },
  logo: {
    height: "120px",
    width: "120px",
    borderRadius: "50%",
    //border: "solid 1px white",
  },
  text: {
    color: "white",
    fontSize: "27px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

const { Meta } = Card;

function BunyRaffle() {
  //const { editionContractAddress } = useParams("0xa33BCac5C926186e388F27296ecc54F0D8FF681e");
  //const { editionContractAddress } = useState("0xa33BCac5C926186e388F27296ecc54F0D8FF681e");
  const editionContractAddress = "0x5120D9dC7cF656127184bFB695DBB2B0b09EEE6b";
  const raffleOneAddress = "0x5120D9dC7cF656127184bFB695DBB2B0b09EEE6b";
  const raffleTwoAddress = "";
  const [numberCanMint, setNumberCanMint] = useState();
  const [salesPrice, setSalesPrice] = useState();
  const [contractName, setContractName] = useState();
  const [editionSize, setEditionSize] = useState();
  const [description, setDescription] = useState();
  const [raffleOwner, setRaffleOwner] = useState();
  const [contractSymbol, setContractSymbol] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [thisImage, setImage] = useState();
  const [thisAnimation, setAnimation] = useState();
  const [thisPrize, setPrize] = useState();
  const [thisFee, setFee] = useState();
  const [trigger, setTrigger] = useState(0);
  const navigate = useHistory();
  const [thisP1, setP1] = useState([]);
  const [thisP2, setP2] = useState();
  const [thisP3, setP3] = useState();
  const [thisP4, setP4] = useState();
  const [thisP5, setP5] = useState();
  const [thisP6, setP6] = useState();
  const [thisP7, setP7] = useState();
  const [thisP8, setP8] = useState();
  const [thisP9, setP9] = useState();
  const [thisP10, setP10] = useState();
  const [thisP11, setP11] = useState();
  const [thisP12, setP12] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const openNotification = () => {
    notification.open({
      message: "Copied to clipboard",
      description: `${editionContractAddress}`,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };
  const { onCopy, value, setValue, hasCopied } = useClipboard(
    editionContractAddress,
  );

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function mintToken(collectionAddress) {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        editionContractAddress,
        RaffleNFT.abi,
        signer,
      );
      const data = await contract.salePrice();
      console.log(data);
      const transaction = await contract.purchase({
        value: data,
      });
      await transaction.wait();
    }
  }

  async function fetchRaffle() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.avax-test.network/ext/bc/C/rpc",
    );
    const contract = new ethers.Contract(
      editionContractAddress,
      RaffleNFT.abi,
      provider,
    );
    const name = await contract.name(); //contract name
    setContractName(name);
    const symbol = await contract.symbol();
    setContractSymbol(symbol);
    const size = await contract.editionSize();
    setEditionSize(Number(size));
    const avail = await contract.numberCanMint();
    setNumberCanMint(Number(avail));

    const raffle = await contract.houseFee();
    const fee = ethers.utils.formatEther(raffle.toString());
    setFee(Number(fee));
    const prize = await contract.getPrize();
    const avaxPrize = ethers.utils.formatEther(prize.toString());
    setPrize(Number(avaxPrize));
    const image = await contract.imageUrl();
    setImage(image);
    const animation = await contract.animationUrl();
    setAnimation(animation);
    const desc = await contract.description();
    setDescription(desc);
    const supply = await contract.totalSupply();
    setTotalSupply(Number(supply));
    const weiprice = await contract.salePrice();
    const price = ethers.utils.formatEther(weiprice.toString());
    setSalesPrice(price);
    const owner = await contract.owner(); // fetch owner
    setRaffleOwner(owner);
  }

  ///////////////////////////////////////////////////////////////////
  ///  Fetch max collection size
  ////

  useEffect(() => {
    fetchRaffle();
    fetchPlayers();
  }, []);

  async function myFunction() {
    var text = " ";
    var i;
    for (i = 0; i < 5; i++) {
      text += " The number is " + i;
    }
    console.log(text);
  }

  async function fetchPlayers() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.avax-test.network/ext/bc/C/rpc",
    );
    const contract = new ethers.Contract(
      editionContractAddress,
      RaffleNFT.abi,
      provider,
    );
    const p1 = await contract.ownerOf(1); //player 1
    setP1(p1);
    console.log(p1);
    const p2 = await contract.ownerOf(2);
    setP2(p2);
    console.log(p2);
    const p3 = await contract.ownerOf(3);
    setP3(p3);
    console.log(p3);
    const p4 = await contract.ownerOf(4);
    setP4(p4);
    console.log(p4);
    const p5 = await contract.ownerOf(5);
    setP5(p5);
    console.log(p5);
    const p6 = await contract.ownerOf(6);
    setP6(p6);
    console.log(p6);
  }

  return (
    <>
      <Flex mt="15px">
        <Box
          bg="transparent"
          border={"4px solid orange"}
          mt={-4}
          p={5}
          isTruncated
          w={"100%"}
          maxHeight="1100px"
          maxWidth={400}
          style={{
            fontSize: "12px",
            padding: "10px",
            color: "white",
          }}
        >
          <Center>
            <HStack fontWeight="bold" color="orange" fontSize="26px">
              <div>Buny Raffle: Win: 1 /AVAX. </div>
            </HStack>
          </Center>
          <AutoCenter>
            <HStack>
              <div>
                <p
                  style={{
                    textAlign: "center",
                    color: "orange",
                    fontSize: "14px",
                    marginRight: "4px",
                  }}
                >
                  {" "}
                  Price :
                </p>
              </div>
              <div>
                <p
                  style={{
                    textAlign: "center",
                    color: "orange",
                    fontSize: "14px",
                    marginRight: "4px",
                  }}
                >
                  {salesPrice} /AVAX
                </p>
              </div>
            </HStack>
          </AutoCenter>

          <div style={styles.text}>
            <>
              <Center>
                <div style={{ color: "black" }}>
                  Total Minted: {totalSupply}/{editionSize}
                </div>
              </Center>
            </>
          </div>

          <Center>
            <Box>
              <model-viewer
                shadow-intensity="1"
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "transparent",
                }}
                //camera-controls
                auto-rotate
                poster={thisImage}
                //alt={`Nft Name: ${nft.name}`}
                src={thisImage}
              ></model-viewer>

              <Center>
                <Button type="primary" block onClick={mintToken}>
                  <Center>
                    Mint <div style={{ marginLeft: "10px" }}>{salesPrice}</div>{" "}
                    /avax
                  </Center>
                </Button>
              </Center>
            </Box>
          </Center>
          <Box display="flex">
            <Tag
              color="#108ee9"
              style={{ borderRadius: "2px", color: "white" }}
            >
              Players
            </Tag>
          </Box>
          <Center>
            <Grid templateColumns="repeat(5, 1fr)" gap={2} color="black">
              <GridItem colSpan={2} h="100%" bg="#feefd0" w={120}>
                <Center>
                  <List spacing={3}>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP1 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P1:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP1 &&
                            `${thisP1.slice(0, 6)}...${thisP1.slice(
                              thisP1.length - 4,
                              thisP1.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP2 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P2:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP2 &&
                            `${thisP2.slice(0, 6)}...${thisP2.slice(
                              thisP2.length - 4,
                              thisP2.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP3 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P3:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP3 &&
                            `${thisP3.slice(0, 6)}...${thisP3.slice(
                              thisP3.length - 4,
                              thisP3.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    {/* You can also use custom icons from react-icons */}
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP4 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P4:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP4 &&
                            `${thisP4.slice(0, 6)}...${thisP4.slice(
                              thisP4.length - 4,
                              thisP4.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP5 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P5:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP5 &&
                            `${thisP5.slice(0, 6)}...${thisP5.slice(
                              thisP5.length - 4,
                              thisP5.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP6 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P6:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP6 &&
                            `${thisP6.slice(0, 6)}...${thisP6.slice(
                              thisP6.length - 4,
                              thisP6.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                  </List>
                </Center>
              </GridItem>
              <GridItem
                colStart={4}
                colEnd={6}
                h="100%"
                bg="#feefd0"
                color="black"
                w={120}
              >
                <Center>
                  <List spacing={3}>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP7 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>

                        <div>P7:</div>

                        <div style={{ fontSize: "12px" }}>
                          {thisP7 &&
                            `${thisP7.slice(0, 6)}...${thisP7.slice(
                              thisP7.length - 4,
                              thisP7.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP8 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P8:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP8 &&
                            `${thisP8.slice(0, 6)}...${thisP8.slice(
                              thisP8.length - 4,
                              thisP8.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP9 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P9:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP9 &&
                            `${thisP9.slice(0, 6)}...${thisP9.slice(
                              thisP9.length - 4,
                              thisP9.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    {/* You can also use custom icons from react-icons */}
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP10 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P10:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP10 &&
                            `${thisP10.slice(0, 6)}...${thisP10.slice(
                              thisP10.length - 4,
                              thisP10.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP11 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P11:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP11 &&
                            `${thisP11.slice(0, 6)}...${thisP11.slice(
                              thisP11.length - 4,
                              thisP11.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <div>
                          {thisP12 ? (
                            <ListIcon as={CheckIcon} color="green" />
                          ) : (
                            <ListIcon as={WarningTwoIcon} color="red" />
                          )}
                        </div>
                        <div>P12:</div>
                        <div style={{ fontSize: "12px" }}>
                          {thisP12 &&
                            `${thisP12.slice(0, 6)}...${thisP12.slice(
                              thisP12.length - 4,
                              thisP12.length,
                            )}`}
                        </div>
                      </HStack>
                    </ListItem>
                  </List>
                </Center>
              </GridItem>
            </Grid>
          </Center>

          <Box mt={15}>
            <Tag
              color="#108ee9"
              style={{ borderRadius: "2px", color: "white" }}
            >
              Description
            </Tag>
            <div
              style={{
                color: "black",
                fontSize: "13px",
              }}
            >
              <p>
                <strong>Raffle: </strong> {contractName}
              </p>
            </div>
            <div
              style={{
                color: "black",
                fontSize: "13px",
              }}
            >
              {description}
            </div>

            <HStack>
              <div
                style={{
                  color: "black",
                  fontSize: "13px",
                }}
              >
                <p>
                  <strong>Address:</strong>
                  <a
                    style={{ fontSize: "10px" }}
                    href={`https://testnet.snowtrace.io/address/${editionContractAddress}`}
                    target="_blank"
                  >
                    {editionContractAddress}
                  </a>
                </p>
              </div>
              <div
                onClick={openNotification}
                style={{
                  fontSize: "10px",
                  color: "#9c9c9c",
                  //padding: "5px",
                  fontWeight: "normal",
                  overflow: "hidden",
                }}
              >
                <Tooltip title="Copy to clipboard">
                  <IconButton
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
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default BunyRaffle;
