import { Tabs } from "antd";
import { Center, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";
import { useEffect } from "react";
import { HashCard } from "./HashCard";
import {
  UploadOutlined,
  FolderOutlined,
  FolderAddOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import HashBox from "./HashBox";
import IpfsUploadTabs from "./IpfsUploadTabs";
import AddHashBox from "./AddHashBox";
import MyBoxes from "./MyBoxes";
import HashBoxMain from "./HashBoxMain";

function IpfsTabBar(myName) {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [ipfsCount, setIpfsCount] = useState();
  const [boxName, setBoxName] = useState();
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [ipfsTitle, setIpfsTitle] = useState();
  const [cidList, setCidList] = useState();

  const [ipfsUrl, setIpfsUrl] = useState("");

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
    const uploads = await contract.ipfsCount();
    const hashBox = await contract.contractName();
    setBoxName(hashBox);
    setIpfsCount(Number(uploads));
    //setMyName(username);
    setMyPublicKey(address);
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

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <Tabs
      style={{
        display: "flex",
        flexWrap: "wrap",
        WebkitBoxPack: "center",
        color: "blue",
        marginTop: "-5px",
        marginLeft: "5px",
        padding: "5px",
        justifyContent: "center",
      }}
      defaultActiveKey="1"
      onChange={onChange}
      items={[
        {
          label: (
            <>
              <Center paddingLeft="20px">
                <VStack>
                  <CodeSandboxOutlined />,
                  <p style={{ fontSize: "10px" }}>IPFS</p>
                </VStack>
              </Center>
            </>
          ),
          key: "1",
          children: (
            <>
              <HashBoxMain />
            </>
          ),
        },
        {
          label: (
            <>
              <Center>
                <VStack>
                  <FolderOutlined />,{" "}
                  <p style={{ fontSize: "10px" }}>HashBox</p>
                </VStack>
              </Center>
            </>
          ),
          key: "2",
          children: (
            <>
              <Center ml={10} p={5}>
                <HashBox />
              </Center>
            </>
          ),
        },
        {
          label: (
            <>
              <Center>
                <VStack>
                  <UploadOutlined />,<p style={{ fontSize: "10px" }}>Upload</p>
                </VStack>
              </Center>
            </>
          ),
          key: "3",
          children: (
            <>
              <IpfsUploadTabs />
            </>
          ),
        },
        {
          label: (
            <>
              <Center>
                <VStack>
                  <FolderAddOutlined />,
                  <p style={{ fontSize: "10px" }}>Create</p>
                </VStack>
              </Center>
            </>
          ),
          key: "4",
          children: (
            <>
              <AddHashBox />
            </>
          ),
        },
        {
          label: (
            <>
              <Center>
                <VStack>
                  <FolderAddOutlined />,
                  <p style={{ fontSize: "10px" }}>Boxes</p>
                </VStack>
              </Center>
            </>
          ),
          key: "5",
          children: (
            <>
              <MyBoxes />
            </>
          ),
        },
      ]}
    />
  );
}
export default IpfsTabBar;
