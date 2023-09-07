import Web3Modal from "web3modal";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Center, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import erc721Dynamic from "contracts/erc721Dynamic.json";
import { useEthers } from "@usedapp/core";
import { Avatar, List } from "antd";

import { IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react";
import { Card, Tooltip, notification, Modal, Input, Button } from "antd";
import { HStack } from "@chakra-ui/react";
import { useEtherBalance } from "@usedapp/core";
import { Text, Grid, Image } from "@chakra-ui/react";
import { Spin } from "antd";
import { AutoCenter } from "antd-mobile";
import { abi } from "contracts/HashBoxFactory.json";
import { useParams } from "react-router-dom";
import moment from "moment";

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

function CollectionPage() {
  const { contractAddress } = useParams();
  const [numberCanMint, setNumberCanMint] = useState();
  const [salesPrice, setSalesPrice] = useState();
  const [contractName, setContractName] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [presale, setPresale] = useState();
  const [publicMint, setPublicMint] = useState();
  const [max, setMax] = useState();
  const [editionSize, setEditionSize] = useState();
  const [wAddress, setWaddress] = useState();
  const [nfts, setNft] = useState([]);
  const [miningStatus, setMiningStatus] = useState(null);
  const [mintStatus, setMintStatus] = useState();
  const [description, setDescription] = useState();
  const [contractSymbol, setContractSymbol] = useState();
  const [loadingState, setLoadingState] = useState(0);
  const [mintedId, setMintedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const userBalance = useEtherBalance(account);
  const [myName, setMyName] = useState(null);
  const [dna, setDna] = useState();
  const { onCopy, value, setValue, hasCopied } = useClipboard(contractAddress);
  const [isWhitelisted, setIsWhitelisted] = useState();
  const [tokenId, setTokenId] = useState([]);
  const [userWhitelisted, setUserWhitelisted] = useState();
  const [thisTx, setTx] = useState();
  const [thisTime, setTx0] = useState(); // timestamp
  const [thisBlock, setTx1] = useState(); // blocknumber
  const [thisNonce, setTx2] = useState(); // nonce
  const [thisReceipt, setTx3] = useState(); // receipt
  const [tx4, setTx4] = useState(); //hash
  const [based, setBased] = useState();
  const [status, setStatus] = useState();

  const contractABI = abi;
  let signer;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc",
  );
  const contract = new ethers.Contract(
    contractAddress,
    erc721Dynamic.abi,
    provider,
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const openNotification = () => {
    notification.open({
      message: "Copied to clipboard",
      description: `${contractAddress}`,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /////mint token
  async function mintToken() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      erc721Dynamic.abi,
      signer,
    );
    const data = await contract.salePrice();
    console.log(ethers.utils.formatUnits(data.toString(), "ether"));
    const transaction = await contract.purchase({
      value: data,
    });

    console.log("Mining....", transaction.hash);
    setMiningStatus(0);
    let tx = await transaction.wait();
    setLoadingState(1);
    console.log("Mined!", tx);
    const event = tx.events.find((x) => x.event === "BunyMint");
    console.log(event.args.tokenId.toString());
    setMintedId(event.args.tokenId.toString());
    setTokenId(event.args.tokenId.toString());
    fetchMetadata();
    console.log(
      `Mined, see transaction: https://snowtrace.io/tx/${transaction.hash}`,
    );
    setMintStatus(
      `Mined, see transaction: https://snowtrace.io/tx/${transaction.hash}`,
    );
  }

  async function mintPresale() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      erc721Dynamic.abi,
      signer,
    );
    const data = await contract.preSalePrice();
    console.log(ethers.utils.formatUnits(data.toString(), "ether"));
    const transaction = await contract.presale({
      value: data,
    });

    console.log("Mining....", transaction.hash);
    setMiningStatus(0);
    let tx = await transaction.wait();
    setLoadingState(1);
    console.log("Mined!", tx);
    const event = tx.events.find((x) => x.event === "BunyMint");
    console.log(event.args.tokenId.toString());
    setMintedId(event.args.tokenId.toString());
    setTokenId(event.args.tokenId.toString());
    fetchMetadata();
    console.log(
      `Mined, see transaction: https://snowtrace.io/tx/${transaction.hash}`,
    );
    setMintStatus(
      `Mined, see transaction: https://snowtrace.io/tx/${transaction.hash}`,
    );
  }
  // fetch collection info
  async function fetchCollection() {
    const name = await contract.name(); //contract name
    setContractName(name);
    const symbol = await contract.symbol();
    setContractSymbol(symbol);
    const desc = await contract.description();
    setDescription(desc);
    const max = await contract.maxMint();
    setMax(max.toString());
    const based = await contract.baseURI();
    setBased(based);

    const publicMint = await contract.publicMint();
    console.log(publicMint.toString());
    setPublicMint(publicMint.toString());
    const weiprice = await contract.salePrice();
    const price = ethers.utils.formatEther(weiprice.toString(), "ether");
    setSalesPrice(price);
    const wei = await contract.preSalePrice();
    const presale = ethers.utils.formatEther(wei.toString(), "ether");
    setPresale(presale);
    const size = await contract.editionSize();
    setEditionSize(size.toString());
    const avail = await contract.numberCanMint();
    setNumberCanMint(avail);
  }

  // fetch token supply
  async function fetchSupply() {
    const supply = await contract.totalSupply();
    setTotalSupply(supply.toString());
  }

  async function checkWhitelist() {
    const check = await contract.whitelist(wAddress);
    setIsWhitelisted(check.toString());
  }

  useEffect(() => {
    fetchCollection();
    fetchInitial();
  }, []);

  useEffect(() => {
    fetchSupply();
  }, []);

  const data = [
    {
      tx: [
        <>
          <div>tx: {tx4}</div>
        </>,
      ],
    },
    {
      tx: "Ant Design Title 2",
    },
    {
      tx: "Ant Design Title 3",
    },
    {
      tx: "Ant Design Title 4",
    },
  ];

  async function fetchTransaction(props) {
    const itemArray = [];
    //let snowtrace =
    const Uri = Promise.resolve(
      `https://api.snowtrace.io/api?module=account&action=txlist&address=${contractAddress}&sort=asc`,
    );
    const getUri = Uri.then((value) => {
      let str = value;
      console.log(contractAddress);
      let data = axios.get(str).catch(function (error) {
        console.log(data.toJSON());
        console.log(error.toJSON());
      });
      return data;
    });
    getUri.then((value) => {
      console.log(value);
      var thisTime = value.data.result[0].timeStamp;
      var thisBlock = value.data.result[0].blockNumber;
      var thisNonce = value.data.result[0].nonce;
      var thisReceipt = value.data.result[0].txreceipt_status;
      var tx4 = value.data.result[0].hash;
      let receipt;
      if (thisReceipt > 0) {
        receipt = "success";
      } else {
        receipt = "fail";
      }
      console.log(receipt.toString());
      setStatus(receipt);
      setTx0(thisTime);
      setTx1(thisBlock);
      setTx2(thisNonce);
      setTx3(thisReceipt);
      setTx4(tx4);
      // var desc = value.data.description;
      //setTwo(name);
      //setThree();
    });

    await new Promise((r) => setTimeout(r, 9000));
    setTx(itemArray);
  }
  const [mintedImage, setImage] = useState();
  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMetadata(tokenId) {
    setLoading(true);
    const itemArray = [];
    const owner = contract.ownerOf(tokenId);
    const rawUri = contract.tokenURI(tokenId);
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
      setImage(image);
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
  const [initImage, setOne] = useState();
  const [thisName, setTwo] = useState();
  const [thisDesc, setThree] = useState();
  const [thisEdition, setFour] = useState();
  const [thisDate, setFive] = useState();
  const [thisDna, setSix] = useState();

  async function fetchInitial() {
    const itemArray = [];
    const owner = contract.ownerOf(1);
    const rawUri = contract.tokenURI(1);
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
      setThree(desc.toString());
      setFour(edition.toString());
      setFive(date);
      setSix(dna.toString());
      console.log(image);
    });

    await new Promise((r) => setTimeout(r, 9000));
    setNft(itemArray);
  }

  const dateString = moment(thisDate).format("MM/DD/YYYY");
  console.log(dateString);

  if (isWhitelisted == "true") {
    return (
      <>
        <Box bg="white" w={300} p={10}>
          Verified! Mint your Avatar NFT.
          <Button block m={5} onClick={mintPresale}>
            Mint
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box
        bg="#1F2937"
        border={"1px solid white"}
        mt={10}
        p={5}
        mb={50}
        w={"100%"}
        overflow={"hidden"}
        maxWidth={500}
        style={{
          fontSize: "14px",
          padding: "20px",
          color: "white",
        }}
      >
        <Box bg="white" color="black" p={5} isTruncated>
          <Box>
            <img src={initImage} />
            <HStack>
              <div>
                <strong
                  style={{
                    marginRight: "5px",
                  }}
                >
                  Address:
                </strong>
                <a
                  style={{ fontSize: "11px" }}
                  href={`https://snowtrace.io/address/${contractAddress}`}
                  target="_blank"
                >
                  {contractAddress}
                </a>
              </div>
              <div
                onClick={openNotification}
                style={{
                  fontSize: "11px",
                  color: "#9c9c9c",
                  fontWeight: "normal",
                  overflow: "hidden",
                }}
              >
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    m={5}
                    p={2}
                    onClick={onCopy}
                    variant="outline"
                    float="right"
                    colorScheme="teal"
                    aria-label="Copy to clipboard"
                    icon={<CopyIcon />}
                  >
                    {hasCopied ? "Copied!" : "Copy"}
                  </IconButton>
                </Tooltip>
              </div>
            </HStack>
            <Box>
              <div>
                <strong style={{ paddingRight: "5px" }}>Created:</strong>{" "}
                {dateString}
              </div>
              <div>
                <strong style={{ paddingRight: "5px" }}>Collection: </strong>{" "}
                {contractName}
              </div>
              <div>
                <strong style={{ paddingRight: "5px" }}>Symbol:</strong>{" "}
                {contractSymbol}
              </div>
            </Box>
          </Box>

          <div>
            <p>
              <strong
                style={{
                  marginRight: "5px",
                }}
              >
                Public Mint Enabled?
              </strong>
              {publicMint}
            </p>
          </div>
          <div>
            <p>
              <strong
                style={{
                  marginRight: "5px",
                }}
              >
                Max tokens per wallet:
              </strong>
              {max}
            </p>
            <p style={{ fontSize: "11px" }}>
              *Max tokens per wallet subject to change.
            </p>
          </div>
          <div>
            <Box bg={"black"} color={"white"} p={0} fontSize="12px"></Box>
          </div>
          <div>
            <Button
              type="ghost"
              style={{ backgroundColor: "rgb(229 231 235)" }}
              onClick={showModal}
            >
              Check Whitelist
            </Button>
            <Modal open={isModalOpen} footer={null} onCancel={handleCancel}>
              <>
                <Box>
                  <div
                    style={{
                      backgroundColor: "silver",
                      color: "black",
                      minHeight: "40px",
                      marginTop: "20px",
                      padding: "5px",
                    }}
                  >
                    <div>
                      {!isWhitelisted && (
                        <>
                          <p>Check address whitelist status</p>
                        </>
                      )}
                    </div>
                    <div>
                      {isWhitelisted && (
                        <>
                          <div>
                            <strong style={{ marginRight: "5px" }}>
                              Address is whitelisted?:
                            </strong>
                            {isWhitelisted}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Input
                    placeholder="input wallet address "
                    onChange={(e) => {
                      setWaddress(e.target.value);
                    }}
                    value={wAddress}
                    style={{
                      border: "1px solid #dfe1e5",
                      width: "100%",
                      //borderRadius: "24px",
                      display: "flex",
                      height: "44px",
                      marginTop: "5px",
                      marginBottom: "5px",
                      fontSize: 12,
                      color: "black",
                    }}
                  />
                  <Box>
                    <Button
                      type="ghost"
                      style={{ backgroundColor: " rgb(229 231 235)" }}
                      block
                      onClick={checkWhitelist}
                    >
                      Verify Address
                    </Button>
                  </Box>
                </Box>
              </>
            </Modal>
          </div>
        </Box>
        <div style={styles.text}>
          <>
            <Center>
              <div style={{ color: "white" }}>
                Total NFTs Minted: {totalSupply}/{editionSize}
              </div>
            </Center>
            <Flex>
              <Text></Text>
            </Flex>
            <Center>
              <Card
                title={
                  <div>
                    <p style={{ textAlign: "center", color: "blue" }}>
                      {" "}
                      Sale Price: {salesPrice} /avax
                    </p>
                    <div>
                      <p style={{ textAlign: "center", color: "blue" }}>
                        Presale Price: {presale} /avax
                      </p>
                    </div>
                  </div>
                }
                style={{
                  width: "100%",
                  color: "blue",
                  padding: "0px",
                  marginBottom: "12px",
                  backgroundColor: "white",
                }}
                bodyStyle={{ padding: "0px" }}
              >
                <div
                  style={{
                    padding: "5px",
                    textAlign: "center",
                    backgroundColor: "white",
                    color: "black",
                  }}
                >
                  <Center>
                    <HStack
                      spacing="24px"
                      align={"stretch"}
                      marginBottom={"1px"}
                    >
                      <Button
                        style={{
                          width: "350px",
                          color: "black",
                          height: "50px",
                          fontSize: "18px",
                          backgroundColor: "rgb(229 231 235)",
                        }}
                        type="primary"
                        block
                        onClick={mintToken}
                      >
                        Mint
                      </Button>
                    </HStack>
                  </Center>
                </div>
              </Card>
            </Center>
          </>
        </div>
        <div>
          {loadingState === 0 ? (
            miningStatus === 0 ? (
              <div>Processing your transaction............</div>
            ) : (
              <>
                <p style={{ fontSize: "10px" }}>Standby</p>
              </>
            )
          ) : (
            <>
              <div>{mintStatus}</div>
              <div>Minted NFT....Ok.</div>
              <div>Token Id: {mintedId}</div>
              <div>{tokenId}</div>

              <AutoCenter>
                <div>
                  <img src={mintedImage} alt={`{mintedId}`} />
                </div>
                <Box>
                  {loading && (
                    <>
                      <Center mt={40}>
                        <Spin tip="Loading" size="small"></Spin>
                      </Center>
                      <p style={{ color: "white" }}>
                        loading collection images.......
                      </p>
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
              </AutoCenter>
            </>
          )}
        </div>
        {/*
        <Box>
          <Flex>
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={
                      <a href={`https://snowtrace.io/tx/${tx4}`}>{item.tx}</a>
                    }
                    description={
                      <>
                        <div>timestamp: {thisTime}</div>
                        <div>blockNumber: {thisBlock}</div>
                        <div>nonce: {thisNonce}</div>
                        <div>Status: {status}</div>
                        <Box isTruncated w={300}>
                          <div>Hash: {tx4}</div>
                        </Box>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Flex>
        </Box>
        */}
      </Box>
    </>
  );
}

export default CollectionPage;
