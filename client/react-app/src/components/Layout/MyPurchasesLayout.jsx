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
import { Wrap, WrapItem } from "@chakra-ui/react";
import { Layout, Button } from "antd";
import React, { useState, useEffect } from "react";
import { Box, Center } from "@chakra-ui/react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import MyItems from "components/Nfts/MyItems";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import { HStack } from "@chakra-ui/react";
//import ListNftTabs from "components/Nfts/ListNftTabs";
import ListNftForm from "./../Nfts/ListNftForm";
import { Link } from "react-router-dom";
import {
  ReloadOutlined,
  ControlOutlined,
  RollbackOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
const { Content } = Layout;
const { Header } = Layout;

function MyPurchasesLayout() {
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

  const [trigger, setTrigger] = useState(0);
  const navigate = useHistory();
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
      <Layout>
        <Layout>
          <Center>
            <Content
              style={{
                marginTop: "0px",
                minHeight: "800px",
                backgroundColor: "black",
              }}
            >
              <Layout>
                <Header
                  style={{
                    backgroundColor: "black",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "white" }}>
                    <strong> My Purchases</strong>
                  </p>
                </Header>

                <Content
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                  }}
                >
                  <Center w="100%" p={0} bg="black">
                    <Wrap>
                      <WrapItem>
                        <MyItems trigger={trigger} />
                      </WrapItem>
                    </Wrap>
                  </Center>
                </Content>
              </Layout>
            </Content>
          </Center>
        </Layout>
      </Layout>
    </>
  );
}

export default MyPurchasesLayout;
