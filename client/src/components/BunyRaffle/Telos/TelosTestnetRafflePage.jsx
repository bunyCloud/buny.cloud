import Web3Modal from "web3modal";
import React, { useState, useEffect } from "react";
import UseAnimations from "react-useanimations";
import alertTriangle from "react-useanimations/lib/alertTriangle";
import loading2 from "react-useanimations/lib/loading2";
import {
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import moment from "moment";
import {
  Box,
  Center,
  //Button,
  Text,
  VStack,
  Flex,
  Wrap,
  WrapItem,
  Heading,
} from "@chakra-ui/react";
import { Modal } from "antd-mobile";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ethers, utils } from "ethers";
import raffleNft from "contracts/BunyRaffleNft.json";
//import { IconButton } from '@chakra-ui/react'
//import { CopyIcon } from '@chakra-ui/icons'
import { Image } from "@chakra-ui/react";
import { Tag } from "antd-mobile";
import { Tooltip, notification, Popover } from "antd";
import { useEthers } from "@usedapp/core";
import { HStack, useClipboard } from "@chakra-ui/react";
import { Button, List } from "antd";
import { Icon } from "@chakra-ui/react";
import { NonceManager } from "@ethersproject/experimental";
import { Result } from "antd-mobile";

const CircleIcon = (props) => (
  <>
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  </>
);

function TelosTestnetRafflePage() {
  const { raffleAddress } = useParams();
  const { account, chainId } = useEthers();
  const [numberCanMint, setNumberCanMint] = useState();
  const [salesPrice, setSalesPrice] = useState();
  const [contractName, setContractName] = useState();
  const [description, setDescription] = useState();
  const [raffleOwner, setRaffleOwner] = useState();
  const [contractSymbol, setContractSymbol] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [thisImage, setImage] = useState();
  const [thisAnimation, setAnimation] = useState();
  const [thisPrize, setPrize] = useState();
  const [thisFee, setFee] = useState();
  const [loaded, setLoading] = useState();
  const navigate = useHistory();
  const [editionSize, setEditionSize] = useState();
  const { onCopy, hasCopied } = useClipboard(raffleAddress);
  const [minPlayers, setMinPlayers] = useState();
  const [maxTokens, setMaxTokens] = useState();
  const [potential, setPotential] = useState();
  const startRaffle = "true";
  const [randomNumber, setRandomNumber] = useState();
  const [isActive, setIsActive] = useState();
  const [isProof, setIsProof] = useState();
  const [isComplete, setIsComplete] = useState();
  const [startTime, setStartTime] = useState();
  const [winnerSelected, setWinnerSelected] = useState();
  const [endTime, setEndTime] = useState();
  const [winningNumber, setWinningNumber] = useState();
  const [raffleWinner, setRaffleWinner] = useState();
  const [raffleComplete, setRaffleComplete] = useState("false");
  const [entries, setEntries] = useState([]);
  const [entryCount, setEntryCount] = useState();
  const [thisSeed, setSeed] = useState();
  const [prime, setPrime] = useState();
  const [computeTime, setComputeTime] = useState();
  const [iterations, setIterations] = useState();
  const [newProof, setProof] = useState();
  const [newStart, setStart] = useState();
  const [computeTxLog, setComputeLog] = useState();
  const [supplyLog, setSupplyLog] = useState();
  const [connectedAddress, setConnectedAddress] = useState("");
  const [ownerSeed, setOwnerSeed] = useState();
  const [isOwner, setIsOwner] = useState(false);

  const bexmod = (base, exponent, modulus) => {
    let result = 1n;
    for (; exponent > 0n; exponent >>= 1n) {
      if (exponent & 1n) {
        result = (result * base) % modulus;
      }
      base = (base * base) % modulus;
    }
    return result;
  };
  const sloth = {
    compute(seed, prime, iterations) {
      const exponent = (prime + 1n) >> 2n;
      let beacon = seed % prime;
      for (let i = 0n; i < iterations; ++i) {
        beacon = bexmod(beacon, exponent, prime);
      }
      return beacon;
    },
    verify(beacon, seed, prime, iterations) {
      for (let i = 0n; i < iterations; ++i) {
        beacon = (beacon * beacon) % prime;
      }
      seed %= prime;
      if (seed == beacon) return true;
      if (prime - seed === beacon) return true;
      return false;
    },
  };

  const content = (
    <>
      <Box maxWidth={250}>
        <div style={{ fontSize: "10px" }}>
          <Text> Raffle: {description} </Text>
          <p>{raffleAddress}</p>
        </div>
        <div style={{ fontSize: "12px", color: "purple", textAlign: "center" }}>
          <p>Price per ticket: {salesPrice} /TSLO</p>
        </div>
      </Box>
    </>
  );

  const approveMinter = (
    <>
      <Box maxWidth={250}>
        <div style={{ fontSize: "10px" }}>{raffleAddress}</div>

        <p
          style={{
            fontSize: "12px",
            color: "purple",
            backgroundColor: "rgb(229 231 235)",
            textAlign: "center",
          }}
        >
          Click to start raffle!
        </p>
      </Box>
    </>
  );
  const provider = new ethers.providers.JsonRpcProvider(
    "https://testnet.telos.net/evm",
  );

  const openNotification = () => {
    notification.open({
      message: "Copied to clipboard",
      description: [
        <>
          <p style={{ fontSize: "10px" }}>
            Buny Raffle address {raffleAddress}
          </p>
        </>,
      ],
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };
  const [tx1, setTx1] = useState();

  async function fetchRaffle() {
    setLoading(true);
    const contract = new ethers.Contract(
      raffleAddress,
      raffleNft.abi,
      provider,
    );
    const name = await contract.name(); //contract name
    setContractName(name);
    const symbol = await contract.symbol();
    setContractSymbol(symbol);
    const size = await contract.editionSize();
    setEditionSize(size.toString());
    setWinningNumber(size.toString());
    const avail = await contract.numberCanMint();
    setNumberCanMint(avail.toString());
    setSupplyLog(`${avail} Ticket(s) still available`);
    const raffle = await contract.houseFee();
    const fee = ethers.utils.formatEther(raffle.toString());
    setFee(Number(fee).toString());
    const prize = await contract.getPrize();
    const avaxPrize = ethers.utils.formatEther(prize.toString());
    setPrize(Number(avaxPrize));
    const image = await contract.imageUrl();
    setImage(image);
    const animation = await contract.animationUrl();
    setAnimation(animation);
    const desc = await contract.description();
    setDescription(desc);
    const startTime = await contract.startTime();
    const date = new Date(startTime * 1000);
    setStartTime(date.toUTCString());
    const isActive = await contract.active();
    setIsActive(Boolean(isActive));
    const isComplete = await contract.isComplete();
    setIsComplete(Boolean(isComplete));
    const mplayers = await contract.minPlayers();
    setMinPlayers(mplayers.toString());
    const mtokens = await contract.maxTokens();
    setMaxTokens(mtokens.toString());
    const supply = await contract.totalSupply();
    setTotalSupply(supply.toString());
    const owner = await contract.owner(); // fetch owner
    setRaffleOwner(owner);
    const weiprice = await contract.salePrice();
    const price = ethers.utils.formatEther(weiprice, "ether");
    setSalesPrice(price);
    const findPotential = ((size * weiprice) / 100) * 90;
    console.log(findPotential.toString());
    const formatIt = ethers.utils.formatEther(findPotential.toString());
    setPotential(formatIt);
    console.log(formatIt);
    const rn = await contract.randomNumber();
    setRandomNumber(rn.toString());
    console.log(`Provable random number confirmed..? ${rn.toString()}`);
    const ip = await contract.isProof();
    setIsProof(Boolean(ip.toString()));
    console.log(`Provable random number = ${ip.toString()}`);
    const winSelected = await contract.winnerSelected();
    setWinnerSelected(Boolean(winSelected));
    console.log(`Winner selected?: ${winSelected}`);
    if (winSelected === true) {
      const winNumber = await contract.winningNumber();
      setWinningNumber(winNumber.toString());
      const winnerAddress = await contract.Winner();
      setRaffleWinner(winnerAddress.toString());
      console.log(
        `Raffle complete! Winner Selected! ${winnerAddress}, token Id:${winNumber}`,
      );
      const rend = await contract.endTime();
      const edate = new Date(rend * 1000);
      setEndTime(edate.toUTCString());
    }
    setLoading(false);
  }
  const [purchaseEvents, setPurchaseEvents] = useState();

  async function mintToken() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        raffleAddress,
        raffleNft.abi,
        signer,
      );
      const data = await contract.salePrice();
      console.log(data);
      const transaction = await contract.purchase({
        value: data,
      });
      const tx = await provider.getTransaction(transaction.hash);
      if (tx) {
        if (tx.blockNumber) {
          console.log("tx: ");
          console.log(tx);
          return tx;
        }
      }
      setTx1("Minting NFT Ticket please wait....", tx);
      contract.on(
        "EditionSold",
        (price, owner, EntryCount, entryTime, event) => {
          const info = {
            price: ethers.utils.formatUnits(price, 0),
            owner: owner,
            EntryCount: ethers.utils.formatUnits(EntryCount, 0),
            entryTime: entryTime,
            data: event,
          };
          console.log(JSON.stringify(info, null, 5));
          setPurchaseEvents(JSON.stringify(info, null, 5));
        },
      );
    } else {
      console.log("Contract not found");
    }
    refreshPage();
  }

  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 5000 milliseconds = 5 seconds
  }

  async function approveRaffle() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(raffleAddress, raffleNft.abi, signer);
    const transaction = await contract.setApprovedMinter(
      raffleAddress,
      startRaffle,
    );
    await transaction.wait();
    const startTime = await contract.startTime();
    setStartTime(startTime.toString());
    refreshPage();
  }

  const [winnerTx, setWinnerTx] = useState();

  async function randomRaffleWinner() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(raffleAddress, raffleNft.abi, signer);
    const transaction = await contract.pickWinner();
    await transaction.wait();
    const tx = await provider.getTransaction(transaction.hash);
    if (tx) {
      if (tx.blockNumber) {
        console.log("tx: ");
        console.log(tx);
        return tx;
      }
      console.log(
        `Block explorer transaction hash http://testnet.teloscan.io/tx/${transaction.hash}`,
      );
      setWinnerTx(`http://testnet.teloscan.io/tx/tx/${transaction.hash}`);
      contract.on("WinnerPicked", (winner, winningNumber, endTime, event) => {
        const info = {
          winner: winner,
          winningNumber: winningNumber,
          endTime: endTime,
          data: event,
        };
        console.log(JSON.stringify(info, null, 4));
      });
      setTx1("Starting transaction.....", tx);
      refreshPage();
    }
  }

  useEffect(() => {
    fetchRaffle();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function main() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        raffleAddress,
        raffleNft.abi,
        signer,
      );
      const prime = BigInt((await contract.prime()).toString());
      const iterations = BigInt((await contract.iterations()).toNumber());
      console.log("prime", prime.toString());
      setPrime(prime.toString());
      console.log("iterations", iterations.toString());
      setIterations(iterations.toString());
      const seed = BigInt((await contract.seed(account)).toString());
      console.log("seed", seed.toString());
      console.log("Connected player seed discovered...");
      setSeed(seed.toString());
      const start = Date.now();
      const date = new Date(start * 1000);
      console.log("Begin compute proof verification process....");
      console.log("Start time:", date.toUTCString());
      setStart(date.toUTCString());
      const proof = sloth.compute(seed, prime, iterations);
      console.log(
        `Player seed successfully computed. Provable random number generating. ${proof}`,
      );
      setProof(proof.toString());
      setComputeTime(Date.now() - start, proof);
      console.log("compute time", Date.now() - start, "ms", "vdf proof", proof);
      const proofTx = await contract.prove(proof);
      console.log("Proof Tx", proofTx.toString());
      await proofTx.wait();
      setComputeLog(proofTx.hash);
      console.log(proofTx.hash);
      if (proofTx) {
        randomRaffleWinner();
        console.log(
          "Generating randoom winner.....getting transaction results",
        );
      } else {
        console.log(
          "ERROR: no proof found or unable to compute. Please try again or contact the rabbit help desk",
        );
      }
    }
  }

  async function fetchEntries() {
    const contract = new ethers.Contract(
      raffleAddress,
      raffleNft.abi,
      provider,
    );

    const count = await contract.EntryCount();
    setEntryCount(count.toString());
    console.log(count.toString());
    const items = [];
    console.log(items);
    try {
      for (let i = 0; i < count; i++) {
        const items = await contract.readAllEntries();
        setEntries(items);
        console.log(items);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    async function getConnectedAddress() {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        // Connect to the Ethereum network
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Get the connected address
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setConnectedAddress(accounts[0]);
      }
    }
    getConnectedAddress();
  }, []);

  useEffect(() => {
    async function checkOwnerWinner() {
      // Create an ethers.js provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create an instance of the token contract
      const contract = new ethers.Contract(
        raffleAddress,
        raffleNft.abi,
        provider,
      );
      // Get the owner of the token
      const tokenOwner = await contract.ownerOf(winningNumber);
      // Check if the connected address is the owner of the token
      setIsOwner(tokenOwner === raffleWinner);
    }
    if (connectedAddress) {
      checkOwnerWinner();
    }
  }, [connectedAddress, raffleAddress, winningNumber, raffleWinner]);

  useEffect(() => {
    async function checkOwnerSeed() {
      // Create an ethers.js provider

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Create an instance of the token contract
      const contract = new ethers.Contract(
        raffleAddress,
        raffleNft.abi,
        provider,
      );
      // Get the owner of the token
      const ownerSeed = await contract.seed(connectedAddress);
      // Check if the connected address is the owner of the token
      setOwnerSeed(ownerSeed);
      console.log(`Connected player seed: ${ownerSeed.toString()}`);
      console.log("All player addresses have unique seed generated.");
    }
    if (connectedAddress) {
      checkOwnerSeed();
    }
  }, [connectedAddress, raffleAddress]);

  return (
    <>
      <Flex>
        <Wrap bg="white" justify="center" border={"4px solid #d5e5e2"}>
          <WrapItem justify="center">
            <Center w="100%">
              <VStack>
                <Box bg="white">
                  <Center>
                    <HStack mb={5} mt={-2}>
                      <h3 style={{ color: "#54b9b5", marginRight: "5px" }}>
                        {contractName}
                      </h3>

                      <TwitterShareButton
                        title={contractName}
                        via={"buny_raffle"}
                        url={`https://buny.cloud/raffle/${raffleAddress}`}
                        hashtags={[
                          "TLSO",
                          "BunyRaffle",
                          "NftCommunity",
                          "Telos",
                        ]}
                      >
                        <TwitterIcon size={20} round />
                      </TwitterShareButton>
                      <RedditShareButton
                        url={`${contractName} https://buny.cloud/raffle/${raffleAddress}`}
                      >
                        <RedditIcon size={20} round />
                      </RedditShareButton>
                      <TelegramShareButton
                        url={`${contractName} Win ${potential} | TSLO
 https://buny.cloud/raffle/${raffleAddress}`}
                      >
                        <TelegramIcon size={20} round />
                      </TelegramShareButton>
                    </HStack>
                  </Center>
                  <Box
                    fontWeight="bold"
                    //color="#fe9d97"
                    h={"auto"}
                    p={8}
                    fontSize="10px"
                    w={"375px"}
                    bg="#bbdccb"
                    lineHeight="tight"
                    noOfLines={[1]}
                    isTruncated
                  >
                    <HStack>
                      <div
                        onClick={openNotification}
                        style={{
                          fontSize: "12px",
                          padding: "0px",
                          textAlign: "left",
                          color: "black",
                        }}
                      >
                        <strong
                          style={{ paddingRight: "4px", paddingLeft: "4px" }}
                        >
                          Address:
                        </strong>
                        <a
                          href={`https://testnet.teloscan.io/address/${raffleAddress}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {raffleAddress}
                        </a>
                        {/*
                        <Tooltip title="Copy to clipboard">
                          <IconButton
                            m={2}
                            onClick={onCopy}
                            variant="outline"
                            colorScheme="teal"
                            aria-label="Copy to clipboard"
                            icon={<CopyIcon />}>
                            {hasCopied ? 'Copied!' : 'Copy'}
                          </IconButton>
                        </Tooltip>
                        */}
                      </div>
                    </HStack>
                    <div
                      style={{
                        fontSize: "12px",
                        padding: "0px",
                        textAlign: "left",
                        color: "black",
                      }}
                    >
                      <strong
                        style={{ paddingRight: "4px", paddingLeft: "4px" }}
                      >
                        Owner:
                      </strong>
                      <a
                        href={`https://testnet.teloscan.io/address/${raffleOwner}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {raffleOwner}
                      </a>
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        padding: "0px",
                        textAlign: "left",
                        color: "black",
                      }}
                    >
                      <HStack gap={6} mb={5}>
                        {" "}
                        <div
                          style={{ paddingRight: "4px", paddingLeft: "4px" }}
                        >
                          Symbol: {contractSymbol}
                        </div>
                        <div
                          style={{ paddingRight: "4px", paddingLeft: "4px" }}
                        >
                          Min. Players: {minPlayers}
                        </div>
                        <div
                          style={{ paddingRight: "4px", paddingLeft: "4px" }}
                        >
                          Ticket: {salesPrice} /TSLO
                        </div>
                      </HStack>
                      <div style={{ paddingRight: "4px", paddingLeft: "4px" }}>
                        {isActive && <>Start Time: {startTime}</>}
                      </div>
                    </div>
                  </Box>
                </Box>
                <Box
                  //border={"3px solid #d5e5e2"}
                  h="100%"
                  style={{
                    //margin: "10px",
                    color: "white",
                  }}
                >
                  <Tag float="left">NFT Image</Tag>

                  <model-viewer
                    shadow-intensity="1"
                    style={{
                      width: "375px",
                      height: "375px",

                      padding: "10px",
                      backgroundColor: "white",
                    }}
                    camera-controls
                    poster={thisImage}
                    //alt={`Nft Name: ${nft.name}`}
                    src={thisAnimation}
                  ></model-viewer>

                  <Box
                    fontSize="12px"
                    w="100%"
                    maxWidth="375px"
                    h="100%"
                    bg="white"
                    color="black"
                  >
                    <Tag float="left">Description</Tag>
                    <Text>{description}</Text>
                    <Center>
                      {loaded && (
                        <>
                          <UseAnimations animation={loading2} size={56} />
                        </>
                      )}
                    </Center>
                  </Box>
                </Box>
              </VStack>
            </Center>
          </WrapItem>
          <WrapItem>
            <Box
              border={"2px solid #d5e5e2"}
              //mt={10}
              bg="white"
              w={"375px"}
              h={"100%"}
              style={{
                fontSize: "12px",
                color: "white",
              }}
            >
              <VStack bg="white">
                <div>
                  {!raffleWinner && (
                    <>
                      <Box w="auto" h="100%" p={10} mb="-5px">
                        <Center>
                          <VStack>
                            <div>
                              {thisImage && (
                                <>
                                  <Center>
                                    <Image
                                      src={thisImage}
                                      width="75px"
                                      alt="Buny 2023 Carrot Award"
                                    />
                                  </Center>
                                </>
                              )}
                            </div>
                            <Tag
                              color="black"
                              fill="outline"
                              style={{ "-background-color": "#bbdccb" }}
                            >
                              <div
                                style={{
                                  fontSize: "18px",
                                  //color: '#bbdccb',
                                  textAlign: "center",
                                  width: "auto",
                                }}
                              >
                                Win {potential} | TSLO
                              </div>
                            </Tag>

                            <div>
                              {!raffleWinner && (
                                <>
                                  <Center>
                                    <VStack>
                                      <Tag
                                        color="black"
                                        fill="outline"
                                        style={{
                                          "--background-color": "#bbdccb",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            //color: '#bbdccb',
                                            textAlign: "center",
                                            width: "auto",
                                          }}
                                        >
                                          Tickets Sold: {totalSupply} of{" "}
                                          {editionSize}
                                        </div>
                                      </Tag>
                                      <Tag
                                        color="black"
                                        fill="outline"
                                        style={{
                                          "--background-color": "#bbdccb",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            //color: '#bbdccb',
                                            textAlign: "center",
                                            width: "auto",
                                          }}
                                        >
                                          {supplyLog}
                                        </div>
                                      </Tag>
                                    </VStack>
                                  </Center>
                                </>
                              )}
                            </div>
                          </VStack>
                        </Center>
                      </Box>
                    </>
                  )}
                  <Center>
                    {loaded && (
                      <>
                        <UseAnimations animation={loading2} size={56} />
                      </>
                    )}
                  </Center>
                  <div>
                    {isActive && startTime && !isComplete && (
                      <>
                        <VStack>
                          <Popover content={content} title={contractName}>
                            <Button
                              type="primary"
                              block
                              style={{
                                marginTop: "10px",
                                width: "375px",
                              }}
                              onClick={mintToken}
                            >
                              <Center>
                                <HStack>
                                  <div>Buy NFT Ticket</div>
                                  <div> {salesPrice} /TSLO</div>
                                </HStack>
                              </Center>
                            </Button>
                          </Popover>
                          <Center>
                            <div
                              style={{
                                color: "#54b9b5",
                                fontSize: "14px",
                              }}
                            >
                              {maxTokens && !isComplete && (
                                <>
                                  {" "}
                                  <Text
                                    color="black"
                                    fill="outline"
                                    style={{ "-background-color": "#bbdccb" }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        //color: '#bbdccb',
                                        textAlign: "center",
                                        width: "auto",
                                      }}
                                    >
                                      Max Tickets per Wallet: {maxTokens}
                                    </div>
                                  </Text>{" "}
                                </>
                              )}
                            </div>
                          </Center>
                          <Box color="black">{tx1}</Box>
                        </VStack>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  {winnerSelected && (
                    <>
                      <Box
                        fontSize="16px"
                        bg="#fdeeb3"
                        color="black"
                        p={8}
                        mt={5}
                        mb={5}
                      >
                        <Heading as="h3">
                          {" "}
                          Congratulations Raffle Winner!
                        </Heading>
                        <div>
                          <Box w="auto">
                            <Center>
                              <VStack>
                                <div>{raffleWinner && <>{raffleWinner}</>}</div>
                                <div>
                                  {winningNumber && (
                                    <>Ticket #:{winningNumber}</>
                                  )}
                                </div>
                                <div>Completed: {endTime}</div>
                                <div>{winnerTx}</div>
                              </VStack>
                            </Center>
                          </Box>
                        </div>
                      </Box>
                    </>
                  )}
                </div>
              </VStack>
              <div>
                {!isActive && !isComplete && (
                  <>
                    <Box w="100%" bg="#eda9fc" color="black" p={10}>
                      <Text style={{ padding: "5px" }}>
                        You have arrived!! Welcome to the experimental Avalanche
                        blockchain NFT raffle rabbit hole - "Buny Raffle". We
                        are happy you could make it!{" "}
                      </Text>
                    </Box>
                  </>
                )}
              </div>
              <div>
                {!isComplete && !isActive && (
                  <>
                    <Box w="100%" bg="white" color="black" p={10}>
                      <Result title={"Raffle has not started"} />
                      <Center>
                        <HStack>
                          <UseAnimations animation={alertTriangle} size={56} />
                          <Text>
                            <Text>Owner approval required</Text>
                          </Text>
                          <Popover
                            content={approveMinter}
                            title="Set Approved Minter"
                          >
                            <Button
                              type="primary"
                              onClick={approveRaffle}
                              margin={5}
                              size={"xs"}
                              p={4}
                              float="right"
                            >
                              Approve
                            </Button>
                          </Popover>
                        </HStack>
                      </Center>
                    </Box>
                  </>
                )}
              </div>
              <Box color="black">
                <div>
                  {iterations && (
                    <>
                      <Box w={375} h="40px" wordBreak={"break-all"}>
                        Seed:{thisSeed}
                      </Box>
                      <div>Start: {newStart}</div>
                      <div>Proof: {newProof}</div>
                      <div>Compute time: {computeTime} /ms</div>
                      <div>
                        {computeTxLog && (
                          <>
                            <a
                              target="_blank"
                              href={`https://testnet.teloscan.io/tx/${computeTxLog}`}
                              rel="noreferrer"
                            >
                              View Transaction on Block Explorer
                            </a>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  {isComplete && !winnerSelected && (
                    <>
                      <Box w="auto" bg="#f6ccd0" p={4} mb={10}>
                        <Box>
                          <Text fontSize="14px" p={5}>
                            {" "}
                            Any player may start the raffle drawing process once
                            raffle is complete by clicking the "Pick Winner"
                            button below.{" "}
                          </Text>
                          <Button type="primary" block onClick={main}>
                            Pick Winner?
                          </Button>
                        </Box>
                      </Box>
                    </>
                  )}
                </div>
              </Box>

              <div>
                {!winnerSelected && (
                  <>
                    <Box
                      w={"auto"}
                      overflowX="hidden"
                      overflowWrap="anywhere"
                      style={{
                        fontSize: "10px",
                        //padding: '10px',
                        color: "white",
                      }}
                    >
                      <Flex bg="#bbdccb" h="auto">
                        <VStack>
                          <Tag float="left">Players</Tag>
                          <Center>
                            <div>
                              <List
                                style={{
                                  width: "375px",
                                  fontSize: "10px",
                                }}
                                grid={{
                                  gutter: 4,
                                  column: 1,
                                }}
                                dataSource={entries}
                                renderItem={(item) => (
                                  <List.Item key={item.EntryNumber}>
                                    <List.Item.Meta
                                      title={
                                        <>
                                          <HStack gap={0}>
                                            <div style={{ fontSize: "12px" }}>
                                              Ticket #:
                                              {item.EntryNumber.toString()}
                                            </div>
                                            <div style={{ fontSize: "12px" }}>
                                              {item.player &&
                                                `${item.player.slice(
                                                  0,
                                                  6,
                                                )}...${item.player.slice(
                                                  item.player.length - 4,
                                                  item.player.length,
                                                )}`}
                                            </div>
                                            <div style={{ fontSize: "12px" }}>
                                              {item.entry}
                                            </div>
                                            <div style={{ fontSize: "12px" }}>
                                              {moment(item.entryTim).format(
                                                "LLLL",
                                              )}
                                            </div>
                                          </HStack>
                                        </>
                                      }
                                    />
                                  </List.Item>
                                )}
                              />
                            </div>
                          </Center>
                        </VStack>
                      </Flex>
                    </Box>
                  </>
                )}
              </div>
              <Button
                width="100%"
                block
                style={{ marginTop: "10px" }}
                type="link"
                onClick={() => {
                  Modal.alert({
                    //image: 'https://buny.us-southeast-1.linodeobjects.com/CARROT2.png',
                    title: "Disclaimer",
                    confirmText: "Confirm",
                    content:
                      'THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.',
                  });
                }}
              >
                Disclaimer
              </Button>
            </Box>
          </WrapItem>
        </Wrap>
      </Flex>
    </>
  );
}

export default TelosTestnetRafflePage;
