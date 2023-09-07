import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";
import { abi as HashBoxAbi } from "contracts/HashBox.json";
import { Box, SimpleGrid, Center, HStack } from "@chakra-ui/react";
import { Button, Tag, List, Typography } from "antd";
import { Input } from "antd";
import React, { useState, useEffect } from "react";
import BoxCard from "./BoxCard";

function MyBoxes() {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [ipfsHash, setIpfsHash] = useState();
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [ipfsTitle, setIpfsTitle] = useState();
  const [ipfsCount, setIpfsCount] = useState();
  const [boxName, setBoxName] = useState();
  const [boxList, setBoxList] = useState();
  const [boxAddress, setBoxAddress] = useState();
  // Save the contents of abi in a variable
  const contractABI = abi;
  let provider;
  let signer;

  const [initiateDeploy, setInitiateDeploy] = useState();
  const [deploymentText, setDeploymentText] = useState();
  const [deployData, setDeployData] = useState();
  const [boxCount, setBoxCount] = useState();
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
    const boxCount = await contract.boxCount();
    const hashBox = await contract.contractName();
    setBoxName(hashBox);
    setBoxCount(Number(boxCount));
    //setIpfsCount(Number(uploads));
  }

  const [thisId, setId] = useState();
  const [thisHash, setHash] = useState();
  const [thisTitle, setTitle] = useState();
  const [thisAuthor, setAuthor] = useState();

  async function saveIpfsHash() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(boxAddress, HashBoxAbi, signer);
    const upload = await contract.pinHash(thisHash, ipfsTitle);
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
    contract.on("IpfsPinned", (id, hash, title, author, event) => {
      const info = {
        id: id,
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

  //fetch users upload list
  //fetch users upload list
  useEffect(() => {
    async function loadBox() {
      let boxList = [];
      // Get Friends
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer,
      );
      const data = await contract.fetchHashBox();

      setBoxAddress(data);
    }
    loadBox();
  }, []);

  const boxes = boxList
    ? boxList.map((box) => {
        return (
          <BoxCard
            contractAddress={box.ContractAddress}
            boxName={box.boxName}
          />
        );
      })
    : null;

  //fetch user info on load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Box bg="rgb(229 231 235)" p={5} color="black">
        <SimpleGrid columns={1} spacing={10} width="auto" bg="rgb(229 231 235)">
          <Box bg="white" height="20px">
            <p style={{ float: "left", fontSize: "14px" }}>Signed in as:</p>{" "}
            <p style={{ color: "blue" }}>{myName}</p>
          </Box>

          <Box height="20px" w="auto">
            <p style={{ float: "left", color: "black", fontSize: "14px" }}>
              Contract/Box Name:
            </p>
            <p style={{ color: "blue" }}>{boxName} </p>
          </Box>

          <Box height="20px">
            <p style={{ float: "left", fontSize: "14px" }}>Box Count:</p>
            <p style={{ color: "blue" }}>{boxCount} </p>
          </Box>
        </SimpleGrid>
        <Box bg="white" color="black" p={10} m={5}>
          <h6 style={{ color: "black" }}>HashBoxes</h6>
          <HStack style={{ fontSize: "12px" }}>
            <div>
              <p>Your HashBox:</p>
            </div>
            <div>{boxAddress}</div>
          </HStack>
        </Box>

        <Center>
          <Box w={390} p={10} bg="rgb(229 231 235)" color="black">
            <p
              style={{
                padding: "5px",
              }}
            >
              Save your IPFS hash to the Avalanche blockchain for a permanent
              decentralized pinning solution.{" "}
            </p>

            <Input
              className="formInput"
              placeholder="IPFS Hash"
              onChange={(e) => {
                setIpfsHash(e.target.value);
              }}
              value={ipfsHash}
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
          </Box>
        </Center>
        <Box
          fontWeight="bold"
          textAlign={"center"}
          color="blue"
          fontSize="12px"
          m={0}
          p={0}
          lineHeight="tight"
          isTruncated
        >
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
          <div>{initiateDeploy}</div>
          <div>
            <a href={deployData} target="_blank">
              {deployData}
            </a>
            <div>
              <p>{thisId}</p>
            </div>
            <div>
              <p>
                <a href={`https://ipfs.io/ipfs/${thisHash}`} target="_blank">
                  {thisHash}
                </a>
              </p>
            </div>
            <div>{thisAuthor}</div>
            <div>{thisTitle}</div>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default MyBoxes;
