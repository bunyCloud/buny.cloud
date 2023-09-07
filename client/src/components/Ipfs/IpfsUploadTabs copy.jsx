import {
  Box,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from "@chakra-ui/react";
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
import { Input } from "antd";
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
  async function saveIpfsHash() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const upload = await contract.pinHash(formatCid, ipfsTitle, {
      value: ethers.utils.parseEther(newPinPrice),
    });
    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    ipfs.pin.add(formatCid).then((res) => {
      console.log(res);
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
    setIpfsCount(uploads);
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
      <Box w={380}>
        <Box
          m={5}
          bg={"black"}
          fontSize="12px"
          color={"white"}
          border="1px solid white"
          p={5}
        >
          IPFS (the InterPlanetary File System) is a peer-to-peer network and
          protocol designed to make the web faster, safer, and more open.{" "}
          <a href="https://ipfs.io/" target="_blank">
            {" "}
            Learn more about IPFS
          </a>
        </Box>
        <Tabs isLazy>
          <Grid
            h="300px"
            m={10}
            templateRows="repeat(4, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={5}
          >
            <GridItem rowSpan={4} colSpan={1} bg="transparent">
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
                  <p>Single Image</p>
                  <Box maxW="sm" borderRadius="0g">
                    <ImageUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <p>GLB/GLTF 3D Model</p>
                  <Box maxW="sm" borderWidth="1px" height="100%">
                    <ModelUploader ipfsUrl={ipfsUrl} setIpfsUrl={setIpfsUrl} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <p>Single File</p>
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
                  <p>Multiple Files</p>
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
                  <p>Folder Upload</p>
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
                  <p>Raw Text Upload</p>
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
                  <p>PDF File</p>
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
        <Center>
          <Box bg="black" color="white" fontSize="12px" p={5} w={390} mt={1}>
            <Box bg="black" color="white" fontSize="12px" p={5} w={390} mt={1}>
              <Box
                m={4}
                bg={"black"}
                fontSize="12px"
                color={"white"}
                border="1px solid white"
                p={10}
              >
                <Tag
                  color="#ffc72c"
                  style={{ color: "black", borderRadius: "1px" }}
                >
                  HashBox
                </Tag>
                <HStack>
                  <div>Box:</div>
                  <div>
                    <p style={{ color: "yellow" }}>
                      <a
                        style={{ color: "yellow" }}
                        target="_blank"
                        href={`https://testnet.snowtrace.io/address/${HashBoxFactoryAddress}`}
                      >
                        {boxName}
                      </a>
                    </p>
                  </div>
                  <div style={{ fontSize: "9px", padding: "2px" }}>
                    Pin Count:
                  </div>
                  <p style={{ color: "yellow" }}>{ipfsCount}</p>
                </HStack>
                <HStack>
                  <div>CPP: </div>
                  <div>
                    <p style={{ color: "yellow" }}>{newPinPrice} /avax</p>
                  </div>
                </HStack>
                <p style={{ padding: "5px", color: "white", fontSize: "9px" }}>
                  *Cost per pin is the one time storage fee collected for every
                  upload pinned to storage.{" "}
                </p>
                <HStack>
                  <div>Welcome:</div>
                  <div>
                    <p style={{ color: "yellow" }}>{myName}</p>
                  </div>
                </HStack>

                <p
                  style={{
                    padding: "5px",
                  }}
                >
                  Save your IPFS hash to the Avalanche blockchain for a
                  permanent decentralized pinning solution.{" "}
                </p>

                <Input
                  className="formInput"
                  placeholder="IPFS Hash"
                  onChange={(e) => {
                    setIpfsUrl(e.target.value);
                  }}
                  value={formatCid}
                  style={{
                    padding: 5,
                    marginBottom: "10px",
                    width: "333px",

                    color: "black",
                    fontSize: 12,
                  }}
                />
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
                <Box
                  fontWeight="bold"
                  textAlign={"center"}
                  color="blue"
                  fontSize="12px"
                  m={0}
                  p={0}
                  lineHeight="tight"
                  isTruncated
                  w={333}
                >
                  <Box
                    bg="white"
                    p={5}
                    textAlign={"left"}
                    fontSize="11px"
                    w={390}
                    isTruncated
                    border="1px solid blue"
                  >
                    <p>Hash Queue</p>
                    <Box>CID: {formatCid}</Box>
                  </Box>
                  <Button
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      margin: "5px",
                      width: "200px",
                      border: "2px solid blue",
                    }}
                    onClick={saveIpfsHash}
                  >
                    Pin Hash
                  </Button>
                  <div>
                    <p>Status:</p>
                    {initiateDeploy}
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        </Center>
      </Box>
    </>
  );
}

export default IpfsUploadTabs;
