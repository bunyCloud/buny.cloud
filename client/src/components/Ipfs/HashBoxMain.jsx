import { Box, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";
import { Button, Tag } from "antd";
import { Input } from "antd";
import { useEffect } from "react";

function HashBoxMain() {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [myName, setMyName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ipfsCount, setIpfsCount] = useState();
  const [boxName, setBoxName] = useState();
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [ipfsTitle, setIpfsTitle] = useState();
  const [cidList, setCidList] = useState();
  const [initiateDeploy, setInitiateDeploy] = useState();
  const [deployData, setDeployData] = useState();
  const [thisId, setId] = useState();
  const [thisHash, setHash] = useState();
  const [thisAuthor, setAuthor] = useState();
  const [thisTitle, setTitle] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const newPinPrice = "0.005";

  const formatCid = ipfsUrl.replace("https://ipfs.io/ipfs/", "");

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

  async function saveIpfsHash() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const upload = await contract.pinHash(formatCid, ipfsTitle);
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

  // Login to Metamask and check the if the user exists else creates one
  async function fetchUser() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const address = await signer.getAddress();
    let present = await contract.checkUserExists(address);
    let username;
    if (present) username = await contract.getUsername(address);
    const uploads = await contract.ipfsCount();
    const hashBox = await contract.contractName();
    setBoxName(hashBox);
    setIpfsCount(Number(uploads));
    setMyName(username);
    setMyPublicKey(address);
  }

  //fetch user info on load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Box bg="white" color="black" fontSize="12px" p={5} w={390} mt={1}>
        <HStack>
          <div
            style={{
              padding: "5px",
            }}
          >
            {myName && (
              <>
                <HStack>
                  <div>
                    <p style={{ padding: "5px" }}>
                      <strong>Welcome:</strong>
                    </p>
                  </div>
                  <div style={{ color: "blue" }}>{myName}</div>
                </HStack>
              </>
            )}
          </div>
          <div>
            {!myName && (
              <>
                <button
                  style={{
                    color: "black",
                    width: "100px",
                    backgroundColor: "transparent",
                    border: "1px solid #d9cbc2",
                    padding: "5px",
                    margin: "5px",
                  }}
                  onClick={login}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </HStack>
        <Box
          m={4}
          fontSize="12px"
          color={"black"}
          border="1px solid #d9cbc2"
          p={10}
        >
          <Tag color="#ffc72c" style={{ color: "black", borderRadius: "1px" }}>
            HashBox
          </Tag>
          <HStack>
            <div>Box:</div>
            <div>
              <p style={{ color: "blue" }}>
                <a
                  style={{ color: "blue" }}
                  target="_blank"
                  href={`https://snowtrace.io/address/${HashBoxFactoryAddress}`}
                  rel="noreferrer"
                >
                  {boxName}
                </a>
              </p>
            </div>
            <div style={{ fontSize: "9px", padding: "2px" }}>Pin Count:</div>
            <p style={{ color: "white" }}>{ipfsCount}</p>
          </HStack>
          <HStack>
            <div>CPP: </div>
            <div>
              <p>{newPinPrice} /avax</p>
            </div>
          </HStack>
          <p style={{ padding: "5px", color: "black", fontSize: "9px" }}>
            *Cost per pin is the one time storage fee collected for every upload
            pinned to storage.{" "}
          </p>

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
              setIpfsUrl(e.target.value);
            }}
            value={formatCid}
            style={{
              padding: 5,
              marginBottom: "10px",
              width: "100%",

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
              width: "100%",

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
            w={"auto"}
          >
            <Box
              mb={5}
              color="black"
              p={5}
              textAlign={"left"}
              fontSize="11px"
              w={"auto"}
              isTruncated
              border="1px solid blue"
            >
              <p>Hash Queue</p>
              <Box>CID: {formatCid}</Box>
            </Box>
            <Button
              block
              /*
              style={{
                backgroundColor: 'white',
                color: 'black',
                margin: '5px',
                width: '200px',
                border: '2px solid blue',
              }}
              */
              onClick={saveIpfsHash}
            >
              Pin Hash
            </Button>
            <div>
              {initiateDeploy && (
                <div>
                  <p>Status:</p>
                  {initiateDeploy}
                </div>
              )}
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default HashBoxMain;
