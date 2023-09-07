import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";
import { Box, SimpleGrid, Center } from "@chakra-ui/react";
import { Button, Tag } from "antd";
import { Input } from "antd";
import React, { useState, useEffect } from "react";
import { HashCard } from "./HashCard";

function UploadBox() {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [ipfsHash, setIpfsHash] = useState();
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

  async function saveIpfsHash() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const upload = await contract.uploadIpfs(ipfsHash, ipfsTitle);
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
    contract.on("IpfsUploaded", (id, hash, title, author, event) => {
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
    const hashBox = await contract.name();
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
      <p>Decentralized IPFS pinning</p>

      <Box p={10} mt={5} bg="black" color="white">
        <div
          style={{
            padding: "5px",
          }}
        >
          <p>
            Signed in as:
            <p style={{ color: "yellow" }}>{myName}</p>
          </p>
          <div style={{ color: "yellow" }}>{myPublicKey}</div>
        </div>

        <div
          style={{
            padding: "5px",
          }}
        >
          Locker Name:
          <p style={{ color: "yellow" }}>{boxName}</p>
        </div>
        <div
          style={{
            padding: "5px",
          }}
        >
          Total items pinned:
          <p style={{ color: "yellow" }}>{ipfsCount}</p>
        </div>
        <Tag color="#ffc72c" style={{ color: "black", borderRadius: "1px" }}>
          Hash the Hash
        </Tag>
        <p
          style={{
            padding: "5px",
          }}
        >
          Save your IPFS hash to the blockchain for a permanent decentralized
          pinning solution.{" "}
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
          w={"100%"}
          lineHeight="tight"
          isTruncated
        >
          <Button
            style={{
              backgroundColor: "white",
              color: "black",
              margin: "5px",
              border: "2px solid blue",
            }}
            onClick={saveIpfsHash}
          >
            Save Hash
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

export default UploadBox;
