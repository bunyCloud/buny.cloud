import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";
import { Box, SimpleGrid, Center } from "@chakra-ui/react";
import { Button, Tag } from "antd";
import { Input } from "antd";
import React, { useState, useEffect } from "react";
import { HashCard } from "./HashCard";

function HashBox() {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [ipfsHash, setIpfsHash] = useState();
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [ipfsTitle, setIpfsTitle] = useState();
  const [ipfsCount, setIpfsCount] = useState();
  const [boxName, setBoxName] = useState();
  const [cidList, setCidList] = useState();

  // Save the contents of abi in a variable
  const contractABI = abi;
  let provider;
  let signer;

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
      <Center>
        <Box bg="white" color="black" w="auto" minWidth={350}>
          Pinned IPFS Files
          {cids}
        </Box>
      </Center>
    </>
  );
}

export default HashBox;
