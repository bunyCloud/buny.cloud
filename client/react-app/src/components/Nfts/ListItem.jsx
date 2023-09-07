import { CopyIcon } from "@chakra-ui/icons";
import { ImageUpload } from "react-ipfs-uploader";

import { Box, Center, IconButton, HStack, Tooltip } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useClipboard } from "@chakra-ui/react";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "contracts/config/networkAddress";
import NFTAbi from "../../contracts/TheBunyProjectNFT.json";
import NFTMarketplaceAbi from "../../contracts/TheBunyProjectMarketplace.json";
import { Button, Input, Tag, Card, Result, notification } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";

const projectId = "25aFLOpT6wwyHnAAvLlpH0oPodw";
const projectSecret = "4c269229af2949eb44e23418406f1319";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const ipfsClient = require("ipfs-http-client");

export default function ListItem() {
  const [deployInitiate, setDeployInitiate] = useState();
  const [deployStatus, setDeployStatus] = useState(null);
  const [itemId, setItemId] = useState();
  const [formatTokenId, setFormatTokenId] = useState();
  const [listingItemId, setListingItemId] = useState();
  const [listingTokenId, setListingTokenId] = useState();
  const [ipfsUrl, setIpfsUrl] = useState();
  const [imageUrl, setImageUrl] = useState();

  const [isListing, setIsListing] = useState(false);
  const [file, setFile] = useState();
  const [fileLog, setFileLog] = useState();
  const [mintStatus, setMintStatus] = useState();
  const [listingPrice, setListingPrice] = useState();
  const [tokenUrl, setTokenUrl] = useState();
  const [ipfsMetaLog, setIpfsMetaLog] = useState();
  const { onCopy, value, setValue, hasCopied } = useClipboard(tokenUrl);

  const [formData, setFormData] = useState({
    price: "",
    name: "",
    description: "",
  });

  const client = ipfsClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc",
  );

  // Onchange of image file
  const onChange = async (e) => {
    const fileData = e.target.files[0];
    try {
      const add = await client.add(fileData, {
        progress: (prog) => console.log("Image uploaded : ", prog),
      });
      const url = `https://ipfs.io/ipfs/${add.path}`;
      setFile(url);
      console.log("Image uploaded to IPFS:", url);
      setFileLog(`Image uploaded to IPFS: ${url}`);
    } catch (error) {
      console.log(
        "Error in onChange function , You are in catch of ListItem component ",
        error,
      );
    }
  };

  const openNotification = () => {
    notification.open({
      message: "Copied to clipboard",
      description: `${tokenUrl}`,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };
  // Main function to list an item. First it mint an NFT and then List an nft.
  const createItem = async (url) => {
    setIsListing(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // Mint NFT token
    const nftContract = new ethers.Contract(nftAddress, NFTAbi.abi, signer);
    const transaction = await nftContract.mintToken(url);
    const tx = await transaction.wait();
    // Set transaction explorer url
    setMintStatus(
      `Buny NFT Minted! Creating market.. https://testnet.snowtrace.io/tx/${transaction.hash}`,
    );
    console.log(`https://testnet.snowtrace.io/tx/${transaction.hash}`);
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();
    setListingTokenId(tokenId);
    setTokenUrl(`https://buny.cloud/token/${nftAddress}/${tokenId}`);
    // Convert ethers value
    const convertedPrice = ethers.utils.parseUnits(formData.price, "ether");
    // Create NFT market listing
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      signer,
    );
    const listingPrice = await nftMarketPlaceContract.getListingPrice();
    const listingTx = await nftMarketPlaceContract.listItem(
      nftAddress,
      tokenId,
      convertedPrice,
      { value: listingPrice },
    );
    const ltx = await listingTx.wait();
    setDeployInitiate("NFT Market listing created", ltx);
    console.log(" NFT Market listing created.....", ltx);
    setDeployStatus(`https://testnet.snowtrace.io/tx/${listingTx.hash}`);
    const levent = ltx.events.find((x) => x.event === "ItemList");
    console.log(Number(levent.args.itemId));
    setListingItemId(Number(levent.args.itemId));
    const thisItemId = listingItemId;
    console.log("listing id:", thisItemId);
    setIsListing(false);
  };

  const listAnItem = async () => {
    setIsListing(true);
    const { name, price, description } = formData;
    if (!name || !price || !description || !file) {
      console.log("Some feild are missing");
      setIsListing(false);
      return;
    }

    const data = JSON.stringify({ name, description, image: file });
    try {
      const add = await client.add(data);
      const url = `https://ipfs.io/ipfs/${add.path}`;
      createItem(url);
      console.log(url);
      setIpfsUrl(url);
      setIpfsMetaLog(`NFT Metadata uploaded to IPFS: ${url}`);
    } catch (error) {
      console.log("upload error, cannot resolve ", error);
    }
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

  useEffect(() => {
    if (file) {
      setImageUrl(file);
      console.log(`Image uploaded to IPFS ${file}`);
    } else {
      console.log("Image not loading....");
    }
  }, [file, setImageUrl]);

  useEffect(() => {
    if (listingItemId > 0) {
      console.log("Listing Item ID:", listingItemId);
      setItemId(`Your listing item id is: ${listingItemId}`);
    } else {
      console.log("No listing ID found, please complete deployment..");
    }
  }, [listingItemId]);

  useEffect(() => {
    if (listingTokenId > 0) {
      console.log("Your token Id:", listingTokenId);
      setFormatTokenId(`Your Token Id is: ${listingTokenId}`);
    } else {
      console.log("No Token ID found, please mint token first ..");
    }
  }, [listingTokenId]);

  return (
    <div>
      <Center>
        <Card
          title="Mint & List: Standard NFT"
          bodyStyle={{ padding: "10px", fontSize: "12px", color: "white" }}
          headStyle={{ color: "white" }}
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "10px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            fontSize: "12px",
            margin: "10px",
            //borderColor: "orange",
            borderWidth: "0px",
          }}
        >
          <HStack>
            <div
              style={{
                paddingBottom: "10px",
                paddingTop: "10px",
                width: "100%",
              }}
            >
              <Tooltip title="View marketplace contract">
                <Button
                  type="link"
                  shape="circle"
                  onClick={() =>
                    window.open(
                      `https://testnet.snowtrace.io/address/${nftMarketplaceAddress}`,
                      "_blank",
                    )
                  }
                  icon={<FileSearchOutlined />}
                >
                  View Marketplace Contract
                </Button>
              </Tooltip>
            </div>
            <div style={{ width: "100%", padding: "5px" }}>
              Listing fee: {listingPrice} | AVAX
            </div>
          </HStack>
          <div>
            <form action="">
              <div style={{ marginBottom: "10px" }}>
                <Tag
                  color="#ffc72c"
                  style={{ borderRadius: "2px", color: "black" }}
                >
                  NFT Name
                </Tag>
                <Input
                  id="name"
                  placeholder="e.g. Bored Owls NFT"
                  label="Name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </form>
            <div style={{ marginBottom: "10px" }}>
              <Tag
                color="#ffc72c"
                style={{ borderRadius: "2px", color: "black" }}
              >
                NFT Description
              </Tag>
              <Input
                id="description"
                placeholder="Your NFT or product description."
                label="Description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <Tag
                color="#ffc72c"
                style={{ borderRadius: "2px", color: "black" }}
              >
                NFT Price
              </Tag>
              <Input
                id="price"
                placeholder="e.g.10 (In Avax)"
                label="Price"
                onChange={(e) => {
                  console.log(formData.price);
                  setFormData({ ...formData, price: e.target.value });
                  console.log(formData);
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <Tag
                color="#ffc72c"
                style={{ borderRadius: "2px", color: "black" }}
              >
                NFT Image
              </Tag>
              <Box
                mt="1"
                fontWeight="semibold"
                color="black"
                width={"100%"}
                bg={"white"}
                minHeight={135}
                fontSize="12px"
                lineHeight="tight"
                isTruncated
              >
                <ImageUpload setUrl={setFile} />
                IPFS Hash :{" "}
                <a href={file} target="_blank" rel="noopener noreferrer">
                  {file}
                </a>
              </Box>
            </div>
            <Center>
              <Button
                block
                className="btn-primary"
                style={{
                  fontSize: 12,
                  width: "300px",
                  color: "black",
                  marginBottom: "10px",
                  backgroundColor: "#ffc72c",
                  border: "0px solid white",
                }}
                onClick={listAnItem}
                disabled={isListing}
              >
                List NFT
              </Button>
            </Center>
          </div>
          <Center>
            <div
              style={{
                padding: "5px",
                backgroundColor: "#f3fdff",
                width: "100%",
                overflow: "hidden",
                fontSize: "10px",
                color: "black",
                minHeight: "80px",
                //margin: "5px",
                border: "0px solid white",
              }}
            >
              <p>{fileLog}</p>
              <p>{ipfsMetaLog}</p>
              <p id="mintStatus">{mintStatus}</p>{" "}
            </div>
          </Center>{" "}
        </Card>
      </Center>
      <Center>
        <Box
          mt="1"
          p={5}
          paddingRight={"15px"}
          border="1px solid blue"
          fontWeight="semibold"
          color="white"
          bg={"#0000ed"}
          fontSize="11px"
          w={"350px"}
          lineHeight="tight"
          noOfLines={[1]}
          isTruncated
          overflow={"hidden"}
        >
          {tokenUrl && (
            <Result
              status="success"
              title={[
                <>
                  <img
                    src={file}
                    width="200px"
                    height="200px"
                    textAlign="center"
                  ></img>
                  <p style={{ color: "white" }}>Successfully Minted NFT!</p>
                  <p style={{ color: "white" }}>{formatTokenId}</p>
                  <p style={{ color: "white" }}> {itemId}</p>
                </>,
              ]}
              subTitle={[
                <>
                  <Box bg="white" isTruncated overflow={"hidden"}>
                    <HStack>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#9c9c9c",
                          padding: "5px",
                          fontWeight: "normal",
                          overflow: "hidden",
                        }}
                      >
                        <a href={tokenUrl}>{tokenUrl} </a>
                      </div>
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          m={5}
                          p={5}
                          onClick={onCopy}
                          variant="outline"
                          aria-label="Copy to clipboard"
                          icon={<CopyIcon />}
                        >
                          {hasCopied ? "Copied!" : "Copy"}
                        </IconButton>
                      </Tooltip>
                    </HStack>
                  </Box>
                </>,
              ]}
              extra={[
                <Button type="primary" key="tokenpage">
                  Go to token page
                </Button>,
                <Button key="market">Go to marketplace</Button>,
              ]}
            />
          )}
        </Box>
      </Center>
    </div>
  );
}
