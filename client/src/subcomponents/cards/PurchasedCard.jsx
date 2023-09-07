import NFTMarketplaceAbi from "../../contracts/Marketplace.json";
import {
  FileSearchOutlined,
  TransactionOutlined,
  ProfileOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Grid, GridItem, Center, Box, Link, HStack } from "@chakra-ui/react";
import { Tooltip, Modal, Row, Col, InputNumber } from "antd";
import {
  nftMarketplaceAddress,
  nftAddress,
} from "contracts/config/networkAddress";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MarketSelection from "components/MarketSelection";

export default function PurchasedCard({ nft, url = "/" }) {
  //const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deployInitiate, setDeployInitiate] = useState();
  const [deployStatus, setDeployStatus] = useState(null);
  const [listingItemId, setListingItemId] = useState();
  const [isListing, setIsListing] = useState(false);
  const [file, setFile] = useState();
  const [listingPrice, setListingPrice] = useState();

  const [formData, setFormData] = useState({
    price: "",
    name: "",
    description: "",
  });

  const onChange = (value) => {
    console.log("changed", value);
  };

  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc",
  );
  const signer = provider.getSigner();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function fetchListingPrice() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(
        nftMarketplaceAddress,
        NFTMarketplaceAbi.abi,
        provider,
      );
      try {
        const data = await contract.getListingPrice();
        const price = ethers.utils.formatEther(data.toString());
        console.log(`Listing price: ${price}`);
        setListingPrice(price);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  useEffect(() => {
    fetchListingPrice();
  }, [fetchListingPrice]);

  async function resellNft(nft) {
    const convertedPrice = ethers.utils.parseUnits(formData.price, "ether");
    // Create NFT market listing
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      signer,
    );
    const listingPrice = await nftMarketPlaceContract.getListingPrice();
    const listingTx = await nftMarketPlaceContract.resellItem(
      nftAddress,
      nft.tokenId,
      convertedPrice,
      { value: listingPrice },
    );
    const tx = await listingTx.wait();
    setDeployInitiate("NFT Market listing created", tx);
    console.log(" NFT Market listing created.....", tx);
    setDeployStatus(`https://snowtrace.io/tx/${listingTx.hash}`);
    const levent = tx.events.find((x) => x.event === "ItemList");
    console.log(Number(levent.args.itemId));
    setListingItemId(Number(levent.args.itemId));
    const thisItemId = listingItemId;
    console.log("listing id:", thisItemId);
    setIsListing(false);
  }

  return (
    <Box
      p={0}
      m={20}
      width="auto"
      maxWidth={400}
      bg={"rgb(229 231 235)"}
      color="black"
      //boxShadow={"outline"}
      rounded={"md"}
    >
      <Box
        w={"auto"}
        m={0}
        p={4}
        isTruncated
        bg={"rgb(229 231 235)"}
        fontSize="13px"
      >
        <strong>{nft.name}</strong>
      </Box>
      <Grid
        templateColumns="repeat(5, 1fr)"
        gap={2}
        m={2}
        bg={"white"}
        w={"100%"}
      >
        <GridItem colSpan={2} p={5} bg="white" w="auto">
          {/*
          <Image
            height="120px"
            width="120px"
            fallback={fallbackImg}
            src={nft.image}
            alt={nft.name}
            preview={false}
          />
        */}
          <model-viewer
            shadow-intensity="1"
            style={{ width: "120px", height: "120px" }}
            camera-controls
            poster={nft.image}
            alt={`Nft Name: ${nft.name}`}
            src={nft.image}
          ></model-viewer>
        </GridItem>

        <GridItem
          colSpan={2}
          h="80px"
          color="black"
          width="auto"
          p={5}
          bg="transparent"
          fontSize="12px"
        >
          <Box
            fontWeight="semibold"
            color="black"
            w={"auto"}
            h={"80px"}
            p={0}
            overflow="auto"
            bg="transparent"
            fontSize="12px"
            lineHeight="tight"
            noOfLines={[3]}
          >
            {nft.description}
          </Box>
        </GridItem>
      </Grid>

      <Box bg="rgb(229 231 235)" w={190} mb={15} h={45}>
        <HStack>
          <div
            style={{
              fontSize: "14px",
              color: "blue",
              padding: "5px",
            }}
          >
            <Tooltip title="Sell or trade NFT">
              <Center>
                <TransactionOutlined onClick={showModal} />
              </Center>
              <Center>
                <p style={{ fontSize: "10px" }}>Sell</p>
              </Center>
            </Tooltip>

            <Modal
              title={`Create market listing`}
              open={isModalOpen}
              okText={`Sell: ${nft.name}`}
              onOk={resellNft}
              centered
              onCancel={handleCancel}
              width={300}
              bodyStyle={{ padding: "6px", overflowX: "hidden" }}
            >
              <Center>
                <Row>
                  <Col span={24} flex="0 1 300px">
                    <Box bg={"white"} minWidth="300px">
                      <p>
                        <strong style={{ paddingRight: "5px" }}>Name:</strong>
                        {nft.name}{" "}
                      </p>
                      <p>
                        <strong style={{ paddingRight: "5px" }}>
                          Token Id:
                        </strong>
                        {nft.tokenId}
                      </p>
                    </Box>
                  </Col>
                  <Col span={24} flex="0 1 300px">
                    <Center>
                      {/*
                      <Image
                        height="150px"
                        width="150px"
                        fallback={fallbackImg}
                        src={nft.image}
                        alt={nft.name}
                        preview={false}
                      />
                      */}
                      <model-viewer
                        shadow-intensity="0"
                        style={{ width: "120px", height: "120px" }}
                        camera-controls
                        poster={nft.image}
                        src={nft.image}
                      ></model-viewer>
                    </Center>
                  </Col>
                </Row>
              </Center>
              <p>
                <strong style={{ paddingRight: "5px" }}>Price: </strong>
                <InputNumber
                  addonAfter="AVAX"
                  style={{
                    width: 160,
                    margin: 10,
                  }}
                  defaultValue="0.5"
                  min="0.001"
                  max="1000000"
                  step="0.001"
                  onChange={onChange}
                  stringMode
                />
              </p>
              <p>
                <strong style={{ paddingRight: "5px" }}>Marketplace: </strong>
                <MarketSelection />
              </p>
              <p style={{ fontSize: "8px" }}>
                *Buny Marketplace only during testnet operations{" "}
              </p>
              <p>
                <strong style={{ paddingRight: "5px" }}>Listing Fee:</strong>
                {listingPrice}
              </p>
            </Modal>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "blue",
              padding: "5px",
            }}
          >
            <Tooltip title="Transfer NFT">
              <Center>
                <SendOutlined onClick={fetch} />
              </Center>
              <Center>
                <p style={{ fontSize: "10px" }}>Transfer</p>
              </Center>
            </Tooltip>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "blue",
              padding: "5px",
            }}
          >
            <Tooltip title="Block Explorer">
              <Link
                href={`https://snowtrace.io/token/${nftAddress}?a=${nft.tokenId}`}
                target="_blank"
              >
                <Center>
                  <FileSearchOutlined
                    style={{
                      color: "blue",
                    }}
                  />
                </Center>
              </Link>
              <Center>
                <p style={{ fontSize: "10px" }}>Explorer</p>
              </Center>
            </Tooltip>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "blue",
              padding: "5px",
              marginRight: "5px",
            }}
          >
            <Tooltip title="NFT Details Page">
              <Link href={`${url}${nftAddress}/${nft.tokenId}`}>
                <Center>
                  <ProfileOutlined
                    style={{
                      color: "blue",
                    }}
                  />
                </Center>
              </Link>
              <Center>
                <p style={{ fontSize: "10px" }}>Details</p>
              </Center>
            </Tooltip>
          </div>
        </HStack>
      </Box>
    </Box>
  );
}
