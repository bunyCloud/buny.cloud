import { create } from "ipfs-http-client";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { FileUpload, ImageUpload } from "react-ipfs-uploader";
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
import { Button, Input, Tag, Card, Result } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";

const projectId = "25aFLOpT6wwyHnAAvLlpH0oPodw";
const projectSecret = "4c269229af2949eb44e23418406f1319";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export default function ListItem() {
  const [deployInitiate, setDeployInitiate] = useState();
  const [deployStatus, setDeployStatus] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState();

  const [itemId, setItemId] = useState();
  const [formatTokenId, setFormatTokenId] = useState();
  const [listingItemId, setListingItemId] = useState();
  const [listingTokenId, setListingTokenId] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isListing, setIsListing] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [animationFile, setAnimationFile] = useState();
  const [fileLog, setFileLog] = useState();
  const [mintStatus, setMintStatus] = useState();
  const [listingPrice, setListingPrice] = useState();
  const [tokenUrl, setTokenUrl] = useState();
  const [ipfsMetaLog, setIpfsMetaLog] = useState();
  const { onCopy, value, setValue, hasCopied } = useClipboard(tokenUrl);
  const { TextArea } = Input;

  const [formData, setFormData] = useState({
    price: "",
    name: "",
    description: "",
  });

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc",
  );

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
      `Buny NFT Minted! Creating market.. https://snowtrace.io/tx/${transaction.hash}`,
    );
    console.log(`https://snowtrace.io/tx/${transaction.hash}`);
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
    setDeployStatus(`https://snowtrace.io/tx/${listingTx.hash}`);
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
    if (!name || !price || !description || !imageFile || !animationFile) {
      console.log("Some feild are missing");
      setIsListing(false);
      return;
    }
    const data = JSON.stringify({
      name,
      description,
      image: imageFile,
      animation: animationFile,
    });
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
  }, []);

  useEffect(() => {
    if (imageFile) {
      setImageUrl(imageFile);
      console.log(`Image uploaded to IPFS ${imageFile}`);
    } else {
      console.log("Image not loading....");
    }
  }, [imageFile, setImageUrl]);

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

  const [tabIndex, setTabIndex] = useState(0);

  const handleSliderChange = (event) => {
    setTabIndex(parseInt(event.target.value, 10));
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  return (
    <div>
      <Center>
        <Card
          title="Mint NFT & Create listing"
          bodyStyle={{ padding: "2px", fontSize: "12px", color: "white" }}
          headStyle={{ color: "white", padding: "2px" }}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "0px",
            fontSize: "12px",
            margin: "4px",
            //borderColor: "orange",
            borderWidth: "0px",
          }}
        >
          <HStack>
            <div
              style={{
                paddingBottom: "3px",
                paddingTop: "3px",
                marginLeft: "20px",
                width: "100%",
                fontSize: "11px",
              }}
            >
              <Tooltip title="View marketplace contract">
                <Button
                  type="link"
                  shape="circle"
                  onClick={() =>
                    window.open(
                      `https://snowtrace.io/address/${nftMarketplaceAddress}`,
                      "_blank",
                    )
                  }
                  icon={<FileSearchOutlined />}
                >
                  View Contract
                </Button>
              </Tooltip>
            </div>
            <div style={{ width: "100%", padding: "5px" }}>
              Listing fee: {listingPrice} | AVAX
            </div>
          </HStack>
          <div>
            <form action="">
              <div
                style={{
                  marginTop: "15px",
                  marginBottom: "4px",
                  backgroundColor: "white",
                  padding: "4px",
                }}
              >
                <Tag
                  color="#108ee9"
                  style={{ borderRadius: "2px", color: "white" }}
                >
                  NFT Name
                </Tag>

                <TextArea
                  showCount
                  id="name"
                  placeholder="e.g.  Rabbit NFT Club"
                  label="Name"
                  maxLength={100}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{
                    height: 60,
                    marginBottom: 24,
                  }}
                />
              </div>
            </form>
            <div
              style={{
                marginTop: "15px",
                marginBottom: "4px",
                backgroundColor: "white",
                padding: "4px",
              }}
            >
              <Tag
                color="#108ee9"
                style={{ borderRadius: "2px", color: "white" }}
              >
                NFT Description
              </Tag>
              <TextArea
                showCount
                id="description"
                placeholder="Your NFT or product description."
                label="Description"
                maxLength={400}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{
                  height: 120,
                  marginBottom: 24,
                }}
              />
            </div>
            <div
              style={{
                marginTop: "15px",
                marginBottom: "8px",
                backgroundColor: "white",
                padding: "4px",
              }}
            >
              <Tag
                color="#108ee9"
                style={{ borderRadius: "2px", color: "white" }}
              >
                NFT Price
              </Tag>
              <Center>
                <Input
                  id="price"
                  label="Price"
                  addonAfter="avax"
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) => {
                    console.log(formData.price);
                    setFormData({ ...formData, price: e.target.value });
                  }}
                />
              </Center>
            </div>
            <div
              style={{
                marginBottom: "1px",
                marginTop: "15px",
                backgroundColor: "white",
                color: "black",
                padding: "4px",
              }}
            >
              <Tag
                color="#108ee9"
                style={{ borderRadius: "2px", color: "white" }}
              >
                Media Type
              </Tag>
              <Box>
                <HStack>
                  <p>Image</p>
                  <input
                    style={{
                      height: "15px",
                      marginTop: "5px",
                      marginLeft: "15px",
                      marginRight: "15px",
                      width: "100px",
                    }}
                    type="range"
                    min="0"
                    max="1"
                    value={tabIndex}
                    onChange={handleSliderChange}
                  />
                  <p>3D Model</p>
                </HStack>

                <Tabs isLazy index={tabIndex} onChange={handleTabsChange}>
                  <TabList>
                    <Tab
                      style={{
                        color: "blue",
                        backgroundColor: "white",
                        margin: "4px",
                      }}
                    >
                      Image imageFile
                    </Tab>
                    <Tab
                      style={{
                        color: "blue",
                        backgroundColor: "white",
                        margin: "4px",
                      }}
                    >
                      GLB/GLTF Model
                    </Tab>
                  </TabList>
                  <TabPanels>
                    {/* initially mounted */}
                    <TabPanel>
                      <Box width="100%" padding="6px" bg="white" color="black">
                        <p style={{ padding: "5px" }}>
                          <strong>Standard:</strong> Single Image NFT:
                          Extensions:( *.png, *.gif, *jpg)
                        </p>
                        <ImageUpload setUrl={setImageFile} />
                        IPFS Hash :{" "}
                        <a
                          href={imageFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {imageFile}
                        </a>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box width="100%" padding="6px" bg="white" color="black">
                        <p style={{ padding: "5px" }}>
                          <strong>3D Model:</strong> Single 3D NFT: Extensions:(
                          *.glb, *.gltf)
                        </p>
                        <FileUpload setUrl={setAnimationFile} />
                        IPFS Hash :{" "}
                        <a
                          href={animationFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {animationFile}
                        </a>
                      </Box>
                    </TabPanel>
                    {/* initially not mounted */}
                  </TabPanels>
                </Tabs>
              </Box>
            </div>
            <Center>
              <Button
                block
                className="btn-primary"
                style={{
                  fontSize: 18,
                  width: "100%",
                  color: "white",
                  marginBottom: "8px",
                  marginTop: "8px",
                  backgroundColor: "#108ee9",
                  border: "0px solid white",
                }}
                onClick={listAnItem}
                disabled={isListing}
              >
                Mint & List NFT
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
          mt="-5px"
          p={5}
          fontWeight="semibold"
          color="white"
          bg={"black"}
          fontSize="11px"
          w={"100%"}
          maxWidth="500px"
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
                  <p style={{ color: "white" }}>Successfully Minted NFT!</p>
                  <p style={{ color: "white" }}>{formatTokenId}</p>
                  <p style={{ color: "white" }}> {itemId}</p>
                </>,
              ]}
              subTitle={[
                <>
                  <Center>
                    <div>
                      {imageUrl && (
                        <model-viewer
                          style={{
                            width: "350px",
                            height: "350px",
                            marginBottom: "5px",
                          }}
                          camera-controls
                          poster={imageUrl}
                          alt="GLB model"
                          src={imageUrl}
                          auto-rotate
                        ></model-viewer>
                      )}
                    </div>
                  </Center>
                  <HStack>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9c9c9c",
                        padding: "15px",
                        marginBottom: "-10px",
                        fontWeight: "normal",
                        maxWidth: "320px",
                        overflow: "hidden",
                      }}
                    >
                      <Box isTruncated>
                        <a href={tokenUrl}>{tokenUrl} </a>
                      </Box>
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
                </>,
              ]}
              extra={[
                <Button type="primary" key="tokenpage" href={tokenUrl}>
                  View NFT page
                </Button>,
                <Button key="market" href="/nft-marketplace">
                  Back to marketplace
                </Button>,
              ]}
            />
          )}
        </Box>
      </Center>
    </div>
  );
}
