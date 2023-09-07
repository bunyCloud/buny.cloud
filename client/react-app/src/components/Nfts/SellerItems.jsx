import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "contracts/config/mainnet/networkAddress";
import NFTAbi from "../../contracts/NFT.json";
import NFTMarketplaceAbi from "../../contracts/Marketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
//import Card from "../../subcomponents/cards/SellerCard";
import Card from "./Market3DNftCard";

//import Link from "next/link";
import Loading from "../../subcomponents/loading/Loading";
import BtnMain from "../../subcomponents/btns/BtnMain";
//import { useRouter } from "next/router";
import {
  Tabs,
  TabList,
  Flex,
  TabPanels,
  Center,
  Tab,
  TabPanel,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import { Box, HStack } from "@chakra-ui/react";
//import { buyNft } from "pages/api/buyNFT";
import MyItems from "./MyItems";
import { Heading } from "@chakra-ui/react";

const styles = {
  nfts: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    gap: "5px",
    margin: "10px",
  },
  layout: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    //margin: "10px auto",
    width: "100%",
    backgroundColor: "black",
  },
  title: {
    color: "Black",
  },
};

export default function SellerItems() {
  //const router = useRouter()
  const [listedNFTs, setListedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value) => value,
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => address,
    },
  ];

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
    //console.log(soldItems);
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
      ///console.log(listedNFTs);
    };
    load();
  }, [listedNFTs]);

  return (
    <div>
      {!listedNFTs.length && loading ? (
        <Center>
          <Loading />
        </Center>
      ) : (
        <div>
          <div>
            <Tabs isLazy>
              <HStack spacing={8}>
                <div
                  style={{
                    backgroundColor: "white",
                    height: "60px",
                    width: "100%",
                  }}
                >
                  <Center>
                    <TabList style={{ textAlign: "center", padding: "5px" }}>
                      {/*<Tab className="sellerTabs">Auctions</Tab>*/}
                      <Tab className="sellerTabs">Dashboard</Tab>
                      <Tab className="sellerTabs">Selling</Tab>
                      <Tab className="sellerTabs">Sold</Tab>
                      <Tab className="sellerTabs">Purchased</Tab>
                    </TabList>
                  </Center>
                </div>
              </HStack>

              <TabPanels>
                {/* initially mounted */}
                <TabPanel>
                  <Center>
                    <Box
                      w="100%"
                      overflow="hidden"
                      maxWidth="500px"
                      h="100%"
                      bg="white"
                      color="blue"
                      p={20}
                      m={5}
                    >
                      Dashboard
                    </Box>
                  </Center>
                </TabPanel>

                <TabPanel>
                  <Flex>
                    <Wrap>
                      <WrapItem>
                        <Box display="flex" mt="2">
                          <div style={styles.layout}>
                            {listedNFTs?.map((nft, index) => (
                              <Card nft={nft} url="/my-listings/" />
                            ))}
                          </div>
                        </Box>
                      </WrapItem>
                    </Wrap>
                  </Flex>
                </TabPanel>
                {/* initially not mounted */}
                <TabPanel>
                  <div style={styles.layout}>
                    {soldNFTs?.map((nft, index) => (
                      <Center>
                        <Card
                          nft={nft}
                          url="/my-sales/"
                          /*  onClick={() => {
                                    buyNft(nft);
                                    console.log("Onclicked on buy button.");*
                                  }}*/
                        />
                      </Center>
                    ))}
                  </div>
                </TabPanel>
                <TabPanel>
                  <MyItems />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          {/* Sold list */}
        </div>
      )}
    </div>
  );
}
