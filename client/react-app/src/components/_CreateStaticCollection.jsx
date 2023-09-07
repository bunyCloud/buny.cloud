import ReactJsonViewer from "react-json-viewer-cool";
import { Tooltip, Modal, Row, Col } from "antd";
import { FileSearchOutlined, QuestionCircleTwoTone } from "@ant-design/icons";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
//import Chains from "./Chains";
import { useMoralis } from "react-moralis";
import { Card, Tag, Button } from "antd";
import { Text } from "@chakra-ui/react";
import { Input } from "antd";
import { ImageUpload, FolderUpload } from "react-ipfs-uploader";
//import JsonExample from "./JsonExample";
import React, { useState, useEffect } from "react";
import { Center } from "@chakra-ui/react";
import {
  dFactoryAddress,
  erc721DynamicAddress,
  erc721StaticAddress,
  sFactoryAddress,
} from "contracts/config/networkAddress";
import { getExplorer, getExplorerName, getChainByName } from "helpers/networks";
import {
  Tabs,
  Box,
  TabList,
  TabPanels,
  Tab,
  HStack,
  TabPanel,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import dFactory from "../contracts/dFactory.json";
import sFactory from "../contracts/sFactory.json";

function CreateStaticCollection() {
  //const [userMetadata, setUserMetadata] = useState();
  //const { user } = useMoralis(0);
  const { authenticate, isAuthenticated, logout } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();
  //const { Moralis } = useMoralis();
  //const { chainId } = useMoralis(0x4);
  const [_symbol, setSymbol] = useState("");
  const [_description, setDescription] = useState("");
  const [_name, setNFTName] = useState("");
  const [_editionSize, setEditionSize] = useState("");
  const [deployStaticText, setDeployStaticText] = useState();
  const [deployStaticTx, setDeployStaticTx] = useState();

  const { isWeb3Enabled, enableWeb3, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  const [_baseURI, setBaseURI] = useState("");
  const [_royaltyBPS, setRoyaltyBPS] = useState("");
  const [_animationUrl, setAnimationUrl] = useState("");
  const [deployStatus, setDeployStatus] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { TextArea } = Input;
  const [contractAddress, setContractAddress] = useState(
    " Address will display once confirmed. ",
  );

  const [initiateStatic, setInitiateStatic] = useState();
  const [deployInitiate, setDeployInitiate] = useState();
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

  const sampleData = {
    name: "BUNY #1",
    description: "The BUNY Project",
    image:
      "https://gateway.pinata.cloud/ipfs/QmP6VWE3sL8vY4CV1q1Lh2nRhS4ALdGWoeg8DkufU7VKkf//1.png",
    dna: "b8c45328086852f116b91e2e29f757860010c470",
    edition: 1,
    date: 1666450631378,
    attributes: [
      {
        trait_type: "Background",
        value: "pank",
      },
      {
        trait_type: "mouth",
        value: "orange",
      },
      {
        trait_type: "chest",
        value: "pinkSuit",
      },
      {
        trait_type: "head",
        value: "orangePink",
      },
    ],
    compiler: "HashLips Art Engine",
  };

  /////////////////////////////////
  //Deploy erc721Dynamic contract
  //////////////////////////////////
  async function setDeployDynamic() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        dFactoryAddress,
        dFactory.abi,
        signer,
      );
      const transaction = await contract.createEdition(
        _baseURI,
        _name,
        _symbol,
        _description,
        _editionSize,
        _royaltyBPS,
      );
      const tx = await provider.getTransaction(transaction.hash);
      if (tx) {
        if (tx.blockNumber) {
          console.log("tx: ");
          console.log(tx);
          return tx;
        }
      }
      setDeployInitiate("Deploying NFT Collection", tx);
      console.log("Deploying NFT Collection.....", tx);
      setDeployStatus(`${getExplorer(chainId)}tx/${transaction.hash}`);
      console.log(`${getExplorer(chainId)}tx/${transaction.hash}`);
      contract.on(
        "CreatedEdition",
        (editionId, creator, editionSize, editionContractAddress, event) => {
          const info = {
            editionId: ethers.utils.formatUnits(editionId, 0),
            creator: creator,
            editionSize: ethers.utils.formatUnits(editionSize, 0),
            editionContractAddress: editionContractAddress,
            data: event,
          };
          console.log(JSON.stringify(info, null, 5));
          setContractAddress(JSON.stringify(editionContractAddress));
          setEditionSize(JSON.stringify(editionSize));
        },
      );
    } else {
      console.log("Contract not found");
    }
  }

  //////////////////////////
  //  Deploy erc721Static  /////
  /////////////////////////////
  async function setDeployStatic() {
    if (!_name) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        sFactoryAddress,
        sFactory.abi,
        signer,
      );
      const transaction = await contract.createEdition(
        _name,
        _symbol,
        _description,
        _animationUrl,
        imageUrl,
        _editionSize,
        _royaltyBPS,
      );
      const tx = await provider.getTransaction(transaction.hash);
      if (tx) {
        if (tx.blockNumber) {
          console.log("tx: ");
          console.log(tx);
          return tx;
        }
      }
      setInitiateStatic("Deploying NFT Collection", tx);
      console.log("Deploying NFT Collection.....", tx);
      setDeployStaticText("Deploying Static Image NFT Collection!");
      console.log(
        `Block explorer transaction hash http://testnet.snowtrace.io/tx/${transaction.hash}`,
      );
      setDeployStaticTx(
        `http://testnet.snowtrace.io/tx/tx/${transaction.hash}`,
      );
      contract.on(
        "CreatedEdition",
        (editionId, creator, editionSize, editionContractAddress, event) => {
          const info = {
            editionId: ethers.utils.formatUnits(editionId, 0),
            creator: creator,
            editionSize: ethers.utils.formatUnits(editionSize, 0),
            editionContractAddress: editionContractAddress,
            data: event,
          };
          console.log(JSON.stringify(info, null, 5));
          setContractAddress(JSON.stringify(editionContractAddress));
          setEditionSize(JSON.stringify(editionSize));
        },
      );
    } else {
      console.log("Contract not found");
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <>
      <Center>
        <Card
          title="Single Image Collection"
          headStyle={{ color: "white" }}
          bodyStyle={{ padding: "30px", fontSize: "12px" }}
          style={{
            width: "100%",
            backgroundColor: "black",
            backgroundSize: "cover",
            backgroundPosition: "absolute",
            minHeight: "666px",
            padding: "5px",
            borderRadius: "15px",
            fontSize: "12px",
            borderWidth: "0px",
          }}
        >
          <div>
            <Tag
              color="#ffc72c"
              style={{ color: "black", borderRadius: "1px" }}
            >
              Collection Name
            </Tag>
            <Input
              className="formInput"
              placeholder="Product or Collection Name"
              onChange={(e) => {
                setNFTName(e.target.value);
              }}
              value={_name}
              style={{
                padding: 5,
                marginBottom: "10px",
                width: "100%",

                color: "black",
                fontSize: 12,
              }}
            />
          </div>
          <Tag color="#ffc72c" style={{ color: "black", borderRadius: "1px" }}>
            NFT Symbol
          </Tag>
          <Input
            placeholder="Symbol. 3-5 characters. ie. ETH, BTC, LINK"
            onChange={(e) => {
              setSymbol(e.target.value);
            }}
            value={_symbol}
            className="formInput"
            style={{
              padding: 5,
              marginBottom: "10px",
              width: "100%",

              color: "black",
              fontSize: 12,
            }}
          />{" "}
          <div>
            <Tag
              color="#ffc72c"
              style={{ color: "black", borderRadius: "1px" }}
            >
              Edition Size
            </Tag>
            <Input
              className="formInput"
              placeholder="Edition size: number of tokens"
              onChange={(e) => {
                setEditionSize(e.target.value);
              }}
              value={_editionSize}
              style={{
                padding: 5,
                marginBottom: "10px",
                width: "100%",

                color: "black",
                fontSize: 12,
              }}
            />
          </div>
          <Tag color="#ffc72c" style={{ color: "black", borderRadius: "1px" }}>
            Royalties
          </Tag>
          <Input
            className="formInput"
            placeholder="Royalties: set % to earn (DEV: 500=5%) *FIX*"
            onChange={(e) => {
              setRoyaltyBPS(e.target.value);
            }}
            value={_royaltyBPS}
            style={{
              padding: 5,
              marginBottom: "10px",
              width: "100%",

              color: "black",
              fontSize: 12,
            }}
          />{" "}
          <div>
            <Tag
              color="#ffc72c"
              style={{ color: "black", borderRadius: "1px" }}
            >
              Description
            </Tag>
            <TextArea
              placeholder="Description of token project"
              rows={4}
              style={{
                padding: 5,
                marginBottom: "10px",
                width: "100%",

                color: "black",
                fontSize: 12,
              }}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={_description}
            />{" "}
          </div>
          <Box bg={"black"} color={"white"}>
            <Tag
              color="#ffc72c"
              style={{ color: "black", borderRadius: "1px" }}
            >
              Static Image
            </Tag>
            Upload primary token image to IPFS{" "}
            <p style={{ fontSize: "10px" }}>
              Accepted file types: *.jpg, png, svg, gif
            </p>
            <ImageUpload
              className="formInput"
              setUrl={setImageUrl}
              style={{ width: "100%", fontSize: "12px" }}
            />
          </Box>
          <Box bg={"black"} color={"white"}>
            <Tag
              color="#ffc72c"
              style={{ color: "black", borderRadius: "1px" }}
            >
              Animation Image
            </Tag>
            Upload secondary image, animation or 3d model to IPFS
            <p style={{ fontSize: "10px" }}>
              Accepted file types: gif, svg, mp4, mp3, glb, gltf{" "}
            </p>
            <ImageUpload
              setUrl={setAnimationUrl}
              bodyStyle={{ fontSize: "12px" }}
              style={{ width: "100%", fontSize: "12px" }}
            />
          </Box>
          <Center>
            <Button
              type="primary"
              block
              onClick={setDeployStatic}
              className="btn-primary"
              style={{
                fontSize: 12,
                width: "300px",
                color: "black",
                marginBottom: "10px",
                backgroundColor: "#ffc72c",
                border: "0px solid white",
              }}
            >
              Deploy NFT Collection
            </Button>
          </Center>
          <Center>
            <Box
              bg="black"
              color="whhite"
              border="1px solid blue"
              padding="10px"
            >
              {/* <p id="deployStatus">{deployStatus} </p> */}
              <Box
                style={{
                  fontSize: "10px",
                  color: "white",
                  padding: "5px",
                }}
              >
                {" "}
                Upload 1: {imageUrl}
              </Box>
              <Box
                style={{
                  fontSize: "10px",
                  color: "white",
                  padding: "5px",
                }}
              >
                {" "}
                Upload 2: {_animationUrl}
              </Box>
              <Box
                style={{
                  fontSize: "10px",
                  color: "white",
                  padding: "5px",
                }}
              >
                {deployStaticText}
              </Box>
              <Box
                style={{
                  fontSize: "10px",
                  color: "white",
                  padding: "5px",
                }}
              >
                {initiateStatic}
              </Box>
              <Box
                style={{
                  fontSize: "10px",
                  color: "white",
                  padding: "5px",
                }}
              >
                Contract address:{contractAddress}
              </Box>
              <Box
                style={{
                  fontSize: "10px",
                  color: "white",
                  padding: "5px",
                }}
              >
                {deployStaticTx}
              </Box>
            </Box>
          </Center>{" "}
        </Card>
      </Center>
    </>
  );
}

export default CreateStaticCollection;
