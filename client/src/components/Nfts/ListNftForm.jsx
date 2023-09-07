import { Box, HStack, VStack } from "@chakra-ui/react";
import { Button, message, Steps } from "antd";
import { create } from "ipfs-http-client";
import { CopyIcon } from "@chakra-ui/icons";
import { FileUpload, ImageUpload } from "react-ipfs-uploader";
import { Center, IconButton, Tooltip } from "@chakra-ui/react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useClipboard } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "contracts/config/networkAddress";
import NFTAbi from "../../contracts/TheBunyProjectNFT.json";
import NFTMarketplaceAbi from "../../contracts/TheBunyProjectMarketplace.json";
import { Input, Tag, Result } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";

const projectId = "25aFLOpT6wwyHnAAvLlpH0oPodw";
const projectSecret = "4c269229af2949eb44e23418406f1319";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ListNftForm = () => {
  //const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
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
  const [usdzFile, setUsdzFile] = useState();
  const [fileLog, setFileLog] = useState();
  const [mintStatus, setMintStatus] = useState();
  const [listingPrice, setListingPrice] = useState();
  const [tokenUrl, setTokenUrl] = useState();
  const [ipfsMetaLog, setIpfsMetaLog] = useState();
  const { onCopy, value, setValue, hasCopied } = useClipboard(tokenUrl);
  const { TextArea } = Input;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    external_url: "",
    youtube_url: "",
    price: "",
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
      `Buny NFT Minted!.. https://snowtrace.io/tx/${transaction.hash}. Initiating transaction 2 of 2.`,
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
    const { name, price, description, external_url, youtube_url } = formData;
    if (!name || !price || !description || !imageFile) {
      console.log("Some feild are missing");
      setIsListing(false);
      return;
    }
    const data = JSON.stringify({
      name,
      description,
      external_url,
      youtube_url,
      image: imageFile,
      animation_url: animationFile,
      usdzFile: usdzFile,
    });
    try {
      const add = await client.add(data);
      const url = `https://ipfs.io/ipfs/${add.path}`;
      createItem(url);
      console.log(url);
      setIpfsUrl(url);
      setIpfsMetaLog(
        `Metadata successfully uploaded to IPFS. Initiating transaction 1 of 2.. ${url}`,
      );
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

  const steps = [
    {
      title: [
        <>
          <p
            style={{
              color: "blue",
              fontSize: "10px",
            }}
          >
            Details
          </p>
        </>,
      ],
      content: [
        <>
          <Box color="black">
            <h6>Create NFT Listing</h6>
            <Center>
              <HStack>
                <div
                  style={{
                    marginLeft: "20px",
                    width: "auto",
                    fontSize: "12px",
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
                <div
                  style={{ width: "auto", padding: "5px", fontSize: "12px" }}
                >
                  Listing fee: {listingPrice} | AVAX
                </div>
              </HStack>
            </Center>
            <Center>
              <Box w={300}>
                <form action="">
                  <p style={{ padding: "2px", fontSize: "13px" }}>
                    {" "}
                    <strong>Name*</strong>
                  </p>

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
                      marginBottom: 14,
                    }}
                  />

                  <p style={{ padding: "2px", fontSize: "13px" }}>
                    {" "}
                    <strong>Description*</strong>
                  </p>

                  <TextArea
                    showCount
                    id="description"
                    placeholder="Your NFT or product description."
                    label="Description"
                    width="auto"
                    maxLength={400}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={{
                      height: 120,
                      width: "auto",
                      marginBottom: 24,
                    }}
                  />
                  <Box w={300} bg="transparent" mt={30} mb={15}>
                    <p style={{ padding: "2px", fontSize: "13px" }}>
                      {" "}
                      <strong>External Url (Optional)</strong>
                    </p>

                    <Center>
                      <VStack>
                        <Input
                          id="external_url"
                          placeholder="External Url"
                          style={{
                            width: 250,
                            marginBottom: 4,
                            marginTop: 4,
                          }}
                          onChange={(e) => {
                            console.log(formData.external_url);
                            setFormData({
                              ...formData,
                              external_url: e.target.value,
                            });
                          }}
                        />
                      </VStack>
                    </Center>
                    <p
                      style={{
                        padding: "2px",
                        marginTop: "6px",
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      <strong>Youtube Url (Optional)</strong>
                    </p>
                    <Center>
                      <VStack>
                        {" "}
                        <Input
                          id="youtube_url"
                          placeholder="Youtube Url"
                          style={{
                            width: 250,
                            marginBottom: 4,
                            marginTop: 4,
                          }}
                          onChange={(e) => {
                            console.log(formData.youtube_url);
                            setFormData({
                              ...formData,
                              youtube_url: e.target.value,
                            });
                          }}
                        />
                      </VStack>
                    </Center>
                  </Box>
                </form>
              </Box>
            </Center>
          </Box>
        </>,
      ],
    },
    {
      title: [
        <>
          <p
            style={{
              color: "blue",
              fontSize: "10px",
            }}
          >
            Price
          </p>
        </>,
      ],
      content: [
        <>
          <Box color="black">
            <Tag
              color="#108ee9"
              style={{ borderRadius: "2px", color: "white" }}
            >
              NFT Price
            </Tag>
            <Center>
              <VStack>
                <Box w={300} fontSize="12px">
                  Enter your item price in Avax tokens.
                </Box>
                <Input
                  id="price"
                  label="Price"
                  addonAfter="avax"
                  style={{
                    width: "auto",
                  }}
                  onChange={(e) => {
                    console.log(formData.price);
                    setFormData({ ...formData, price: e.target.value });
                  }}
                />
              </VStack>
            </Center>
            <Box w="100%" fontSize="12px">
              Current Avax USD rate @
            </Box>
          </Box>
        </>,
      ],
    },
    {
      title: [
        <>
          <p
            style={{
              color: "blue",
              fontSize: "10px",
            }}
          >
            Media
          </p>
        </>,
      ],
      content: [
        <>
          <Box color="black" w={"auto"} p={5}>
            {/* initially mounted */}
            <Box
              bg="#b3e880"
              color="black"
              w={"auto"}
              fontSize="12px"
              p={25}
              mt={"-0px"}
            >
              <strong> Image </strong>: Extensions:( *.png, *.gif, *jpg)
              <ImageUpload setUrl={setImageFile} />
              <Center>
                <div>
                  {imageFile && (
                    <>
                      <Box bg="white" p={15}>
                        <img src={imageFile} width="100px" height="100px" />
                      </Box>
                    </>
                  )}
                </div>
              </Center>
              <a href={imageFile} target="_blank" rel="noopener noreferrer">
                {imageFile}
              </a>
            </Box>
            <Box width="auto" bg="#f9836e" color="black" fontSize="12px" p={25}>
              <p style={{ padding: "5px" }}>
                {" "}
                <strong>3D Model (Optional):</strong>
                Extensions:( *.glb, *.gltf)
              </p>

              <FileUpload setUrl={setAnimationFile} />
              <Center>
                <div>
                  {animationFile && (
                    <>
                      <model-viewer
                        style={{ width: "180px", height: "180px" }}
                        camera-controls
                        poster={animationFile}
                        src={animationFile}
                        usdzFile={usdzFile}
                      ></model-viewer>
                    </>
                  )}
                </div>
              </Center>
              <a href={animationFile} target="_blank" rel="noopener noreferrer">
                {animationFile}
              </a>
            </Box>

            <Box width="auto" bg="#f9836e" color="black" fontSize="12px" p={25}>
              <p style={{ padding: "5px" }}>
                {" "}
                <strong>USDZ (Optional) *required for IOS AR support:</strong>
                Extensions:( *.usdz)
              </p>

              <FileUpload setUrl={setUsdzFile} />
              <Center>
                <div>
                  {usdzFile && (
                    <>
                      <model-viewer
                        style={{ width: "180px", height: "180px" }}
                        camera-controls
                        poster={imageFile}
                        src={usdzFile}
                        usdzFile={usdzFile}
                      ></model-viewer>
                    </>
                  )}
                </div>
              </Center>
              <a href={usdzFile} target="_blank" rel="noopener noreferrer">
                {usdzFile}
              </a>
            </Box>
            {/* initially not mounted */}
          </Box>
        </>,
      ],
    },
    {
      title: [
        <>
          <p
            style={{
              color: "blue",
              fontSize: "10px",
            }}
          >
            Deploy
          </p>
        </>,
      ],
      content: [
        <>
          <Box color="black" bg="white" p={10} w={"auto"}>
            <p style={{ textAlign: "left", fontSize: "12px", padding: "5px" }}>
              {" "}
              Please review details for accuracy. To make changes use the back
              button below.
            </p>
            <Box
              fontSize="12px"
              textAlign="left"
              p={5}
              bg="#bbdccb"
              color="black"
            >
              <div>Name: {formData.name}</div>
              <div>Description: {formData.description}</div>
              <div>Price: {formData.price} /Avax</div>
              <div>Image: {imageFile}</div>
              <div>Animation: {animationFile}</div>
              <div>USDZ: {usdzFile}</div>
              <div>External Url: {formData.external_url}</div>
              <div>Youtube Url: {formData.youtube_url}</div>
            </Box>
            <Center>
              <VStack>
                <Box w={"auto"} fontSize="12px" p={5} m={5}>
                  <p style={{ padding: "6px" }}>
                    Once satisifed you may proceed by clicking the Mint button
                    below.
                  </p>
                  <div style={{ textAlign: "left", padding: "5px" }}>
                    <p>
                      <strong style={{ marginRight: "5px" }}>
                        Transaction 1
                      </strong>
                      Mint NFT token using the information provided.
                    </p>
                    <p>
                      <strong style={{ marginRight: "5px" }}>
                        Transaction 2
                      </strong>{" "}
                      List NFT for sale on marketplace.
                    </p>
                  </div>
                  <Center>
                    <HStack>
                      <div>
                        {imageFile && (
                          <>
                            <img
                              src={imageFile}
                              width="100px"
                              height="100px"
                              padding="5px"
                            />
                          </>
                        )}
                      </div>
                      <div>
                        {animationFile && (
                          <>
                            <model-viewer
                              style={{ width: "100px", height: "100px" }}
                              camera-controls
                              poster={animationFile}
                              src={animationFile}
                            ></model-viewer>
                          </>
                        )}
                      </div>
                    </HStack>
                  </Center>
                </Box>

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
                    border: "1px solid #bbdccb",
                  }}
                  onClick={listAnItem}
                  disabled={isListing}
                >
                  Mint & List NFT
                </Button>
                <Center>
                  <Box>
                    <div
                      style={{
                        padding: "5px",
                        backgroundColor: "#f3fdff",
                        width: "100%",
                        overflow: "hidden",
                        fontSize: "12px",
                        color: "black",
                        minHeight: "30px",
                        //margin: "5px",
                        border: "1px solid white",
                      }}
                    >
                      <p>{fileLog}</p>
                      <p>{ipfsMetaLog}</p>
                      <p id="mintStatus">{mintStatus}</p>{" "}
                    </div>
                  </Box>
                </Center>
              </VStack>
            </Center>
          </Box>
        </>,
      ],
    },
    {
      title: [
        <>
          <p
            style={{
              color: "blue",
              fontSize: "10px",
            }}
          >
            Results
          </p>
        </>,
      ],
      content: [
        <>
          <Center>
            <Box
              p={15}
              m={5}
              fontWeight="semibold"
              color="white"
              fontSize="12px"
              minHeight="200px"
              bg="#1F2937"
              w={"auto"}
              minWidth="300px"
              maxWidth="500px"
              lineHeight="tight"
            >
              {!tokenUrl && <>No transaction found....</>}
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
        </>,
      ],
    },
  ];

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

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    lineHeight: "15px",
    textAlign: "center",
    color: "white",
    backgroundColor: "white",
    padding: "15px",
    minWidth: "300px",
    borderRadius: "5px",
    border: `1px solid #bbdccb`,
    marginTop: 12,
  };
  return (
    <>
      <VStack bg="white">
        <Box w={"100%"}>
          <Steps
            size="small"
            type="inline"
            current={current}
            items={items}
            style={{
              paddingLeft: "0px",
              padding: "15px",
              marginBottom: "-25px",
              backgroundColor: "transparent",
            }}
          />
        </Box>
        <Box maxWidth="600px" minWidth="300px" w="100%">
          <div style={contentStyle}>{steps[current].content}</div>
        </Box>
        <HStack>
          <div
            style={{
              marginTop: 4,
              marginBottom: 8,
            }}
          >
            {current > 0 && (
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}
          </div>
        </HStack>
      </VStack>
    </>
  );
};
export default ListNftForm;
