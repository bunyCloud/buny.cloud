import NFTAbi from "../../contracts/NFT.json";
import NFTMarketplaceAbi from "../../contracts/Marketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
//import Link from "next/link";
import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import {
  nftAddress,
  nftMarketplaceAddress,
  HashBoxFactoryAddress,
} from "contracts/config/networkAddress.jsx";
import { Flex, Stack, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { Layout, Tag, Button } from "antd";
import React, { useState, useEffect } from "react";
import { Box, Center } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { useEtherBalance, useEthers } from "@usedapp/core";
import IpfsTabBar from "components/Ipfs/IpfsTabBar";

const { Content, Footer } = Layout;
const { Header } = Layout;

function MyHashBoxLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [myName, setMyName] = useState(null);
  const [listedNFTs, setListedNFTs] = useState([]);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const userBalance = useEtherBalance(account);
  const [loading, setLoading] = useState(false);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const MarketBalance = useEtherBalance(nftMarketplaceAddress);

  // Save the contents of abi in a variable
  const contractABI = abi;
  let provider;
  let signer;

  async function loginUser() {
    setIsLoggedIn(false);
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    setMyContract(contract);
    const address = await signer.getAddress();
    let present = await contract.checkUserExists(address);
    let username;
    if (present) username = await contract.getUsername(address);
    else {
      username = prompt(
        "Select a username carefully to be associated with your wallet address",
        null,
      );
      if (username === "") username = null;
      await contract.createAccount(username);
    }
    setMyName(username);
    setMyPublicKey(address);
    setIsLoggedIn(true);
  }

  // Login to Metamask and check the if the user exists else creates one
  async function fetchUser() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const address = await signer.getAddress();
    let present = await contract.checkUserExists(address);
    let username;
    if (present) username = await contract.getUsername(address);
    setMyName(username);
    setMyPublicKey(address);
    setIsLoggedIn(true);
  }

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
    //console.log("This is your data ", data);

    const allItems = await Promise.all(
      data?.map(async (i) => {
        const convertedPrice = ethers.utils.formatUnits(
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
        //console.log(item);
        return item;
      }),
    );

    // Filter to get only listed NFTs
    let currentListedItems = allItems.filter((item) => !item.sold);
    setListedNFTs(currentListedItems);

    // Filter to get only sold NFTs
    let soldItems = allItems.filter((item) => item.sold);
    setSoldNFTs(soldItems);
    //console.log(soldItems[0].sold);
    //console.log(currentListedItems);
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
      //console.log(listedNFTs);
    };
    load();
  }, [listedNFTs]);

  //fetch user info on load
  useEffect(() => {
    fetchUser();
  }, []);

  //const formatBalance =
  return (
    <>
      <Layout style={{}}>
        <Center>
          <Content
            style={{
              marginTop: "0px",
              backgroundColor: "black",
              height: "auto",
            }}
          >
            <Layout>
              <Header style={{ backgroundColor: "black" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <strong>The Buny Project:</strong> Sold listings
                </p>
              </Header>

              <Center>
                <Content
                  style={{
                    backgroundColor: "rgb(229 231 235)",
                    color: "blue",
                    fontSize: "13px",
                    //margin: "4px",
                    padding: "5px",
                    position: "relative",
                    width: "auto",
                  }}
                >
                  <Center>
                    <Flex>
                      <Wrap justifyContent="center">
                        <WrapItem justifyContent={"center"}>
                          <Center>
                            <Box
                              w={"auto"}
                              mt={5}
                              //minWidth="390px"
                              bg={"#1F2937"}
                              color={"white"}
                              border="1px solid white"
                              p={10}
                            >
                              <Center>
                                {userBalance && (
                                  <p>
                                    Balance:{" "}
                                    {formatEther(userBalance).slice(0, 5)} AVAX{" "}
                                  </p>
                                )}
                              </Center>
                              <Center>
                                <div
                                  style={{
                                    backgroundColor: "white",
                                    width: "100%",
                                    color: "black",
                                    textAlign: "center",
                                    padding: "2px",
                                    marginRight: "4px",
                                  }}
                                >
                                  {account &&
                                    `Account: ${account.slice(
                                      0,
                                      4,
                                    )}...${account.slice(
                                      account.length - 4,
                                      account.length,
                                    )}`}
                                </div>
                              </Center>

                              <Center>
                                <Stack
                                  direction="column"
                                  bg="#1F2937"
                                  m={5}
                                  alignItems="center"
                                >
                                  <div>
                                    {}
                                    Logged in as:{" "}
                                    <Tag h="30px" color="#108ee9">
                                      {myName}
                                    </Tag>
                                  </div>

                                  <div>
                                    {!myName && (
                                      <Button onClick={loginUser}>
                                        Register
                                      </Button>
                                    )}
                                    {!account && (
                                      <Button onClick={activateBrowserWallet}>
                                        {" "}
                                        Connect{" "}
                                      </Button>
                                    )}
                                    {account && (
                                      <Button onClick={deactivate}>
                                        {" "}
                                        Disconnect{" "}
                                      </Button>
                                    )}
                                  </div>
                                  <Box
                                    bg="rgb(229 231 235)"
                                    w={300}
                                    m={2}
                                    p={2}
                                    borderTop="1px solid white"
                                  >
                                    <VStack gap="2px">
                                      <Button
                                        type="ghost"
                                        href="/dashboard"
                                        w="100"
                                        block
                                        color="blue"
                                      >
                                        Dashboard
                                      </Button>
                                      <Button
                                        type="ghost"
                                        href="/my-items"
                                        w="100"
                                        block
                                        color="blue"
                                      >
                                        Purchases
                                      </Button>
                                      <Button
                                        href="/my-listings"
                                        type="ghost"
                                        w="100"
                                        block
                                        color="blue"
                                      >
                                        Selling
                                      </Button>
                                      <Button
                                        href="/my-sales"
                                        type="ghost"
                                        w="100"
                                        block
                                        color="blue"
                                      >
                                        Sold
                                      </Button>
                                      <Button
                                        type="ghost"
                                        href="/my-collections"
                                        w="100"
                                        block
                                        color="blue"
                                      >
                                        Collections
                                      </Button>
                                      <Button
                                        type="ghost"
                                        href="/hashbox"
                                        w="100"
                                        block
                                        color="blue"
                                      >
                                        HashBox
                                      </Button>
                                    </VStack>
                                  </Box>
                                </Stack>
                              </Center>
                            </Box>
                          </Center>
                        </WrapItem>
                        <WrapItem>
                          <IpfsTabBar />
                        </WrapItem>
                      </Wrap>
                    </Flex>
                  </Center>
                </Content>
              </Center>
            </Layout>
          </Content>
        </Center>
      </Layout>
    </>
  );
}

export default MyHashBoxLayout;
