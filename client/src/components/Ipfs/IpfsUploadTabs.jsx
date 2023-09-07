import {
  Box,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  useClipboard,
  Tab,
  TabPanel,
  VStack,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { Center, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import FolderUploader from "components/Ipfs/FolderUploader";
import PdfUploader from "components/Ipfs/PdfUploader";
import ImageUploader from "components/Ipfs/ImageUploader";
import MultipleFileUploader from "components/Ipfs/MultipleFileUploader";
import FileUploader from "components/Ipfs/FileUploader";
import TextUploader from "components/Ipfs/TextUploader";
import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";
import { Button, Tag } from "antd";
import { Input, Modal } from "antd";
import { useEffect } from "react";
import { HashCard } from "./HashCard";
import ModelUploader from "./ModelUploader";
import { create } from "ipfs-http-client";

const projectId = "25aFLOpT6wwyHnAAvLlpH0oPodw";
const projectSecret = "4c269229af2949eb44e23418406f1319";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

function IpfsUploadTabs() {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [ipfsTitle, setIpfsTitle] = useState();
  const [ipfsCount, setIpfsCount] = useState();
  const [boxName, setBoxName] = useState();
  const [cidList, setCidList] = useState();
  const [initiateDeploy, setInitiateDeploy] = useState();
  const [deployData, setDeployData] = useState();
  const [thisId, setId] = useState();
  const [thisHash, setHash] = useState();
  const [thisAuthor, setAuthor] = useState();
  const [thisTitle, setTitle] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const { onCopy, hasCopied } = useClipboard(ipfsUrl);
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

  const formatCid = ipfsUrl.replace("https://ipfs.io/ipfs/", "");

  // Save the contents of abi in a variable
  const contractABI = abi;
  let provider;
  let signer;

  async function login() {
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
        "Lucky",
      );
      if (username === "") username = "Lucky";
      await contract.createAccount(username);
    }
    setMyName(username);
    setMyPublicKey(address);
  }
  const [pinResult, setPinResult] = useState();
  const newPinPrice = "0.005";

  const [thisTx, setTx] = useState();

  async function saveIpfsHash() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const upload = await contract.pinHash(formatCid, ipfsTitle, {
      value: ethers.utils.parseEther(newPinPrice),
    });
    const client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });
    client.pin.add(formatCid).then((res) => {
      console.log(res);
      setPinResult(res);
    });
    const tx = await provider.getTransaction(upload.hash);
    if (tx) {
      if (tx.blockNumber) {
        console.log("tx: ");
        console.log(tx);
        return tx;
      }
    }
    setInitiateDeploy("Writing hash to blockchain....", tx);
    console.log("Writing hash to blockchain...", tx);
    setDeployData(`http://snowtrace.io/tx/tx/${upload.hash}`);
    setTx(upload.hash);
    contract.on("IpfsPinned", (id, hash, title, author, event) => {
      const info = {
        id: Number(id),
        hash: hash,
        title: title,
        author: author,
        data: event,
      };
      console.log(JSON.stringify(info, null, 5));
      setId(JSON.stringify(Number(id)));
      setHash(hash);
      setTitle(title);
      setAuthor(author);
    });
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
    const uploads = await contract.ipfsCount();
    const hashBox = await contract.contractName();
    setBoxName(hashBox);
    setIpfsCount(Number(uploads));
  }

  //fetch users upload list
  useEffect(() => {
    async function loadCidList() {
      let cidList = [];
      // Get Friends
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer,
        );
        const data = await contract.getMyCidList();
        data.forEach((item) => {
          cidList.push({ publicKey: item[0], name: item[1] });
        });
      } catch (err) {
        cidList = null;
      }
      setCidList(cidList);
    }
    loadCidList();
  }, [myPublicKey, myContract]);

  /*
  const cids = cidList
  ? cidList.map((cid) => {
      return (
        <ChatCard
          publicKey={cid.publicKey}
          name={cid.name}
        />
      );
    })
  : null;

*/

  function refreshPage() {
    window.location.reload(false);
  }

  //fetch user info on load
  useEffect(() => {
    fetchUser();
  }, []);

  const cids = cidList
    ? cidList.map((cid) => {
        return <HashCard publicKey={cid.publicKey} name={cid.name} />;
      })
    : null;

  return (
    <>
      <Box w={380} height="100%" pb={20} bg="rgb(229 231 235)">
        <Box
          m={5}
          bg={"white"}
          fontSize="12px"
          color={"black"}
          border="1px solid white"
          p={5}
        >
          IPFS (the InterPlanetary File System) is a peer-to-peer network and
          protocol designed to make the web faster, safer, and more open.{" "}
          <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
            {" "}
            Learn more about IPFS
          </a>
        </Box>

        {ipfsUrl && (
          <>
            <Box
              m={5}
              bg={"black"}
              fontSize="12px"
              color={"white"}
              border="1px solid white"
              p={5}
            >
              <Box>
                <strong>Pin Cid, {myName}?:</strong>
                <Center p={5} m={5} bg="blue" color="white">
                  {formatCid}
                </Center>
              </Box>
              <Center>
                <HStack gap={15}>
                  <Button type="outline" onClick={showModal}>
                    Pin Cid
                  </Button>
                  <Button type="outline" onClick={refreshPage}>
                    Reload
                  </Button>
                </HStack>
              </Center>
            </Box>
          </>
        )}

        <Modal
          //title="Basic Modal"
          open={isModalOpen}
          footer={null}
        >
          <>
            <HStack>
              <div>
                <strong>HashBox:</strong>
              </div>
              <div>{boxName}</div>
            </HStack>
            <div>
              <Center m={10} bg="blue" color="white">
                {formatCid}
              </Center>
            </div>
            <Box p={5} m={5}>
              <p>Object title:</p>
              <Input
                className="formInput"
                placeholder="Upload title"
                onChange={(e) => {
                  setIpfsTitle(e.target.value);
                }}
                value={ipfsTitle}
                style={{
                  padding: 5,
                  marginBottom: "10px",
                  width: "333px",

                  color: "black",
                  fontSize: 12,
                }}
              />
              <button
                onClick={saveIpfsHash}
                style={{
                  backgroundColor: "transparent",
                  width: "100px",
                  height: "33px",
                  color: "black",
                  border: "1px solid black",
                }}
              >
                Hash It
              </button>
            </Box>
            <Box>
              {initiateDeploy && (
                <>
                  <div>Log: {initiateDeploy}</div>
                  <div style={{ fontSize: "10px" }}>
                    <a href={`https://snowtrace.io/tx/${thisTx}`}>
                      Click here to view transaction
                    </a>
                  </div>
                  <p>Please wait for confirmation to complete......</p>
                  {thisId && (
                    <>
                      <div>
                        <strong style={{ padding: "5px" }}>Pin#:</strong>
                        {thisId}
                      </div>
                      <div>
                        <strong style={{ padding: "5px" }}>Hash#:</strong>
                        {thisHash}
                      </div>
                      <div>
                        {" "}
                        <strong style={{ padding: "5px" }}>Owner#:</strong>
                        {thisAuthor}
                      </div>
                    </>
                  )}
                </>
              )}
              {thisId && (
                <>
                  <Center bg="blue" color="white">
                    <p>Cid pinned to HashBox. Transaction confirmed!</p>
                  </Center>
                  <Center>
                    <button
                      onClick={handleCancel}
                      style={{
                        width: "200px",
                        padding: "5px",
                        margin: "5px",
                        backgroundColor: "transparent",
                        border: "1px solid black",
                        color: "blue",
                      }}
                    >
                      Close
                    </button>
                  </Center>
                </>
              )}
            </Box>
          </>
        </Modal>
        <Tabs isLazy>
          <Grid
            h="100%"
            maxHeight={800}
            m={10}
            templateRows="repeat(4, 1fr)"
            templateColumns="repeat(5, 1fr)"
            bg="white"
            gap={5}
          >
            <GridItem rowSpan={4} colSpan={1} bg="white">
              <Center>
                <TabList
                  style={{
                    marginTop: "4px",
                    backgroundColor: "transparent",
                  }}
                >
                  <VStack>
                    <Tab className="verticalTabs"> Image</Tab>
                    <Tab className="verticalTabs"> 3D</Tab>
                    <Tab className="verticalTabs">File</Tab>
                    <Tab className="verticalTabs">Multi-file</Tab>
                    <Tab className="verticalTabs">Folder</Tab>
                    <Tab className="verticalTabs"> Text</Tab>
                    <Tab className="verticalTabs"> Pdf </Tab>
                  </VStack>
                </TabList>
              </Center>
            </GridItem>

            <GridItem colSpan={4} bg="white" padding={"5px"}>
              <TabPanels>
                {/* initially mounted */}
                <TabPanel>
                  <h6 style={{ color: "black" }}>Single Image</h6>
                  <Box maxW="sm" borderRadius="0g" maxWidth={390} isTruncated>
                    <ImageUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                    <IconButton
                      m={2}
                      onClick={onCopy}
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Copy to clipboard"
                      icon={<CopyIcon />}
                    >
                      {hasCopied ? "Copied!" : "Copy"}
                    </IconButton>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <h6 style={{ color: "black" }}>GLB/GLTF 3D Model</h6>
                  <Box maxW="sm" borderWidth="1px" height="100%">
                    <ModelUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                    <IconButton
                      m={2}
                      onClick={onCopy}
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Copy to clipboard"
                      icon={<CopyIcon />}
                    >
                      {hasCopied ? "Copied!" : "Copy"}
                    </IconButton>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <h6 style={{ color: "black" }}>Single File</h6>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    height="100%"
                  >
                    <FileUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <h6 style={{ color: "black" }}>Multiple Files</h6>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    height="100%"
                  >
                    <MultipleFileUploader
                      ipfsUrl={ipfsUrl}
                      setIpfsUrl={setIpfsUrl}
                    />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <h6 style={{ color: "black" }}>Folder Upload</h6>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    height="100%"
                  >
                    <FolderUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <h6 style={{ color: "black" }}>Raw Text Upload</h6>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    height="100%"
                  >
                    <TextUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <h6 style={{ color: "black" }}>PDF File</h6>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    borderRadius="lg"
                    height="100%"
                  >
                    <PdfUploader />
                  </Box>
                </TabPanel>
              </TabPanels>
            </GridItem>
          </Grid>
        </Tabs>
      </Box>
    </>
  );
}

export default IpfsUploadTabs;
