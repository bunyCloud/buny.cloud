import { Box } from "@chakra-ui/react";
//import OpenSea from "./OpenSea";
import React, { useState } from "react";
import { Card, Button } from "antd";
import { Center, HStack } from "@chakra-ui/react";
import { Statistic } from "antd";
import erc721Dynamic from "../contracts/erc721Dynamic.json";
import erc721Static from "../contracts/erc721Static.json";
import { ethers } from "ethers";
import { Input } from "antd";
import { useClipboard } from "@chakra-ui/react";
import { Tooltip } from "antd";
import { IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

function OwnerLoadContract(props) {
  const [minterAddress, setMinterAddress] = useState("");
  const [_allowed, setAllowed] = useState("");
  const [_NewBaseURI, setNewBaseURI] = useState();
  const [addressTo, setAddressTo] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [salesPrice, setSalesPrice] = useState();
  const [preSalePrice, setPreSalePrice] = useState();
  const [numberCanMint, setNumberCanMint] = useState("");
  const [baseURI, setBaseURI] = useState("");
  const [_editionSize, setEditionSize] = useState("");
  const [_symbol, setSymbol] = useState("");
  const [_description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [_name, setNFTName] = useState("");
  const [contractAddress, setContractAddress] = useState([]);
  const [owner, setOwner] = useState("");
  const [tokenUri, setTokenUri] = useState();
  const [tokenId, setTokenId] = useState(1);
  const [uploadUrl, setUploadUrl] = useState();
  const [_uploadUrl, _setUploadUrl] = useState();
  const { onCopy, value, setValue, hasCopied } = useClipboard(baseURI);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress,
    erc721Dynamic.abi,
    provider,
  );

  async function fetchName() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.name();
        console.log("data: ", data);
        setNFTName(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchTokenUri() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.tokenURI(tokenId);
        console.log("data: ", data);
        setTokenUri(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchOwner() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.owner();
        console.log("data: ", data);
        setOwner(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchSymbol() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.symbol();
        console.log("data: ", data);
        setSymbol(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchDescription() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.description();
        console.log("data: ", data);
        setDescription(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchBase() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.baseURI();
        setBaseURI(data);
        console.log("data: ", data);
        //setBaseURI(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
  const [paused, setPaused] = useState();
  const [publicMint, setPublicMint] = useState();

  async function fetchPaused() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.paused();
        setPublicMint(data.toString());
        console.log("data: ", data);
        //setBaseURI(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchPublicMint() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.publicMint();
        setPaused(data.toString());
        console.log("data: ", data);
        //setBaseURI(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchURIs() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.getURIs();

        setUploadUrl(data);

        console.log("data: ", data);
        //setBaseURI(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchTotalSupply() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.totalSupply();
        console.log("data: ", data);
        setTotalSupply(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchSalePrice() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.salePrice();
        const price = ethers.utils.formatEther(data.toString());
        console.log(`Listing price: ${price}`);
        setSalesPrice(price);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchEditionSize() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.editionSize();
        console.log("data: ", data);
        setEditionSize(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
  const [maxMint, setMax] = useState();

  async function fetchNumberCanMint() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      try {
        const data = await contract.numberCanMint();
        const d = await contract.maxMint();
        setMax(d.toString());
        console.log("data: ", data);
        setNumberCanMint(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function settingBaseUri() {
    if (!_NewBaseURI) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const transaction = await contract.setBaseURI(_NewBaseURI);
      console.log("Minting NFT to {_NewBaseURI}.....");

      setNewBaseURI("");
      await transaction.wait();
      fetchBase();
    }
  }

  async function definePrice() {
    if (!price) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const convertedPrice = ethers.utils.parseUnits(price, "ether");

      const transaction = await contract.setSalePrice(convertedPrice);
      await transaction.wait();
      setSalesPrice(Number(convertedPrice));
    }
  }

  async function definePresalePrice() {
    if (!price) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const convertedPrice = ethers.utils.parseUnits(price, "ether");

      const transaction = await contract.setPreSalePrice(convertedPrice);
      await transaction.wait();
      setPreSalePrice(Number(convertedPrice));
    }
  }

  /////////////////////
  /////mint edition/////
  //////////////////////
  const [mintEditionLog, setMintEditionLog] = useState();
  const [mintEditionHash, setMintEditionHash] = useState();

  async function setMintEdition() {
    if (!addressTo) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const transaction = await contract.mintEdition(addressTo);
      const tx = await provider.getTransaction(transaction.hash);
      if (tx) {
        if (tx.blockNumber) {
          console.log("tx: ");
          console.log(tx);
          return tx;
        }
      }

      setMintEditionLog(`Minting NFT to ${addressTo}`);
      console.log(`Minting NFT to ${addressTo}.....`);
      setMintEditionHash(`https://snowtrace.io/tx/tx/${transaction.hash}`);
      console.log(`https://snowtrace.io/tx/tx/${transaction.hash}`);
    }
  }

  const [maxMintStatus, setMaxMintStatus] = useState();
  const [inputMaxMint, setInputMaxMint] = useState();
  async function putMaxMint() {
    if (!addressTo) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const transaction = await contract.setMaxMint(inputMaxMint);
      const tx = await provider.getTransaction(transaction.hash);
      if (tx) {
        if (tx.blockNumber) {
          console.log("tx: ");
          console.log(tx);
          return tx;
        }
      }
      setMaxMintStatus(`https://snowtrace.io/tx/tx/${transaction.hash}`);
      console.log(`https://snowtrace.io/tx/tx/${transaction.hash}`);
    }
  }

  async function purchaseToken() {
    if (!salesPrice) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const transaction = await contract.purchase(salesPrice);
      console.log("Minting NFT...");

      await transaction.wait();
    }
  }

  const [address, setAddress] = useState();

  //Owner withdraw from contract
  //formatEther
  async function Withdraw() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        signer,
      );
      const transaction = await contract.withdraw();
      console.log("Minting NFT to {addressTo}.....");

      await transaction.wait();
    }
  }

  async function updateTokenUri() {
    const tokenUriUpdate = [];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      erc721Static.abi,
      signer,
    );
    const tokenURI = await contract.tokenURI(tokenId);

    const jsonManifestString = atob(tokenURI.substring(29));
    console.log("jsonManifestString", jsonManifestString);

    try {
      const jsonManifest = JSON.parse(jsonManifestString);
      console.log("jsonManifest", jsonManifest);
      tokenUriUpdate.push({
        id: tokenId,
        uri: tokenURI,
        owner: address,
        ...jsonManifest,
      });
    } catch (e) {
      console.log(e);
    }
  }

  ///////////////////////////
  //set Approved Minter
  ///////////////////////////
  const setApprovedMinter = (
    <Center>
      <Button
        type="primary"
        style={{
          backgroundColor: "white",
          color: "black",
          width: "120px",
          fontSize: 12,
        }}
        onClick={async () => {
          if (typeof window.ethereum !== "undefined") {
            await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
              contractAddress,
              erc721Dynamic.abi,
              signer,
            );
            const transaction = await contract.setApprovedMinter(
              minterAddress,
              _allowed,
            );
            console.log("Setting approved minter address....");
            await transaction.wait();
          }
        }}
      >
        Set Minter
      </Button>
    </Center>
  );

  return (
    <Center>
      <Card
        title={<p style={{ color: "white" }}> SmartContract Loader </p>}
        style={{
          width: "100%",
          borderWidth: "3px",
          padding: "5px",
          minWidth: "350px",
          color: "white",
          backgroundColor: "#001fff",
        }}
        bodyStyle={{ padding: "0px" }}
      >
        <p style={{ color: "white", textAlign: "center" }}>
          Already deployed your contract? Load it here.
        </p>
        <Card
          bodyStyle={{ padding: "0px" }}
          style={{
            width: "100%",
            borderWidth: "3px",
            padding: "5px",
            color: "white",
            backgroundColor: "#001fff",
          }}
        >
          <Center>
            <Input
              onChange={(e) => setContractAddress(e.target.value)}
              value={contractAddress}
              placeholder="Enter NFT Contract Address"
              style={{
                border: "1px solid #dfe1e5",
                width: "300px",
                marginTop: "5px",
                //width: "auto",
                borderRadius: "24px",
                display: "flex",
                height: "44px",
                fontSize: 12,
                color: "black",
              }}
            />
          </Center>
          <Center>
            <Button
              onClick={() => {
                //fetchNFTs(owner, contractAddress, setNFTs);
                fetchOwner();
                fetchSymbol();
                fetchPaused();
                fetchName();
                fetchURIs();
                fetchPublicMint();
                fetchDescription();
                fetchBase();
                fetchTotalSupply();
                fetchEditionSize();
                fetchNumberCanMint();
                fetchSalePrice();
              }}
              style={{
                //backgroundColor: "",
                padding: "0px 16px",
                cursor: "pointer",
                height: "36px",
                minWidth: "64px",
                fontFamily: "Roboto, arial, sans-serif",
                lineHeight: "27px",
                backgroundColor: "white",
                border: "1px solid silver",
                borderRadius: "14px",
                margin: "5px 2px",
                textAlign: "center",
                color: "black",
              }}
            >
              Load Contract
            </Button>
          </Center>
        </Card>
        <Card
          title={<p style={{ color: "white" }}>Contract Details</p>}
          style={{
            width: "100%",
            borderWidth: "3px",
            color: "white",
            backgroundColor: "#001fff",
          }}
          bodyStyle={{ padding: "0px" }}
        >
          <Box
            w={"100%"}
            p={5}
            fontSize="11px"
            bg={"black"}
            boxShadow={"outline"}
            rounded={"md"}
            noOfLines={[1]}
            overflow="hidden"
            isTruncated
          >
            <div
              style={{
                backgroundColor: "white",
                color: "black",
                //padding:'2px',
              }}
            >
              <HStack>
                <div style={{ color: "black" }}>Contract:</div>
                <div>{contractAddress}</div>
              </HStack>
            </div>
            <Box
              w={"100%"}
              p={5}
              fontSize="11px"
              bg={"black"}
              boxShadow={"outline"}
              rounded={"md"}
              noOfLines={[1]}
              overflow="hidden"
              isTruncated
            >
              <HStack>
                <div style={{ color: "white" }}>
                  <strong>Owner:</strong>
                </div>
                <div>{owner}</div>
              </HStack>
            </Box>
            <Box
              w={"100%"}
              p={5}
              fontSize="12px"
              bg={"black"}
              boxShadow={"outline"}
              rounded={"md"}
              noOfLines={[1]}
              overflow="hidden"
              isTruncated
            >
              <p>
                <strong> Name:</strong> {_name}
              </p>
            </Box>
            <Box
              w={"100%"}
              p={5}
              fontSize="12px"
              bg={"black"}
              boxShadow={"outline"}
              rounded={"md"}
              noOfLines={[1]}
              overflow="hidden"
              isTruncated
            >
              <p>
                <strong>Symbol:</strong> {_symbol}
              </p>
            </Box>
            <Box
              w={"100%"}
              p={5}
              fontSize="12px"
              bg={"black"}
              boxShadow={"outline"}
              rounded={"md"}
              noOfLines={[1]}
              overflow="hidden"
              isTruncated
            >
              <p>
                <strong>Paused?:</strong> {paused}
              </p>
            </Box>
            <Box
              w={"100%"}
              p={5}
              fontSize="12px"
              bg={"black"}
              boxShadow={"outline"}
              rounded={"md"}
              noOfLines={[1]}
              overflow="hidden"
              isTruncated
            >
              <p>
                <strong>Public min enabledt?</strong> {publicMint}
              </p>
            </Box>
            <Box
              bg={"black"}
              w={"100%"}
              fontSize="11px"
              minWidth={"200px"}
              p={5}
            >
              <HStack>
                <strong>URI</strong>
                <div>
                  {baseURI &&
                    `${baseURI.slice(0, 24)}...${baseURI.slice(
                      baseURI.length - 18,
                      baseURI.length,
                    )}`}
                </div>
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    p={2}
                    onClick={onCopy}
                    variant="ghost"
                    float={"right"}
                    color="black"
                    aria-label="Copy to clipboard"
                    icon={<CopyIcon />}
                  >
                    {hasCopied ? "Copied!" : "Copy"}
                  </IconButton>
                </Tooltip>
              </HStack>
            </Box>
            <Box
              w={"100%"}
              p={5}
              fontSize="12px"
              bg={"black"}
              boxShadow={"outline"}
              rounded={"md"}
              noOfLines={[1, 2]}
              overflow="hidden"
              isTruncated
            >
              <p>
                <strong> Description: </strong> {_description}
              </p>

              <Box>
                <div>{_uploadUrl}</div>
              </Box>
            </Box>
          </Box>
        </Card>
        <Center>
          <HStack spacing="12px" marginTop={"10px"} marginBottom={"10px"}>
            <Statistic
              title={<p style={{ color: "white" }}> Edition Size: </p>}
              value={_editionSize}
              valueStyle={{ fontSize: 12, color: "white", textAlign: "center" }}
            />

            <Statistic
              title={<p style={{ color: "white" }}> Available: </p>}
              value={numberCanMint}
              valueStyle={{ fontSize: 12, color: "white", textAlign: "center" }}
            />

            <Statistic
              title={<p style={{ color: "white" }}> Total Supply:</p>}
              value={totalSupply}
              valueStyle={{
                fontSize: 12,
                color: "white",
                textAlign: "center",
              }}
            />
            <Statistic
              title={<p style={{ color: "white" }}> Max Mint:</p>}
              value={maxMint}
              valueStyle={{
                fontSize: 12,
                color: "white",
                textAlign: "center",
              }}
            />
          </HStack>
        </Center>
        <Card
          title={<p style={{ color: "white" }}> Sale Price: </p>}
          extra={<div style={{ color: "white" }}>{salesPrice} </div>}
          style={{
            width: "100%",
            borderWidth: "3px",
            color: "white",
            backgroundColor: "#001fff",
          }}
          bodyStyle={{ padding: "0px" }}
        ></Card>
        <Card
          title={<p style={{ color: "white" }}> Presale Price: </p>}
          extra={<div style={{ color: "white" }}>{preSalePrice} </div>}
          style={{
            width: "100%",
            borderWidth: "3px",
            color: "white",
            backgroundColor: "#001fff",
          }}
          bodyStyle={{ padding: "0px" }}
        ></Card>
        <Center>
          <Card
            style={{ border: "0px", width: "100%" }}
            bodyStyle={{ padding: "0px" }}
          >
            <Card
              title={<p style={{ color: "white" }}>Purchase</p>}
              extra={
                <Button
                  type="primary"
                  onClick={purchaseToken}
                  style={{
                    backgroundColor: "white",
                    padding: "5px",
                    color: "black",
                    marginBottom: "10px",
                    fontSize: 12,
                    width: "120px",
                  }}
                >
                  Purchase
                </Button>
              }
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "black",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "0px" }}
            >
              <p style={{ color: "white" }}>
                Mint a token for {salesPrice} /avax
              </p>
            </Card>

            <Card
              title={<p style={{ color: "white" }}> Withdraw </p>}
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    Withdraw();
                  }}
                  style={{
                    backgroundColor: "white",
                    padding: "5px",
                    color: "black",
                    marginBottom: "10px",
                    fontSize: 12,
                    width: "120px",
                  }}
                >
                  Withdraw
                </Button>
              }
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "black",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "0px" }}
            >
              <p style={{ color: "white" }}>Contract balance: /avax</p>
            </Card>
            <Card
              title={<p style={{ color: "white" }}>Owner Mint</p>}
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "white",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "5px" }}
            >
              <Center>
                <Input
                  onChange={(e) => setAddressTo(e.target.value)}
                  value={addressTo}
                  placeholder="Mint to Address"
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    borderRadius: "24px",
                    display: "flex",
                    height: "44px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              <Center>
                <Button
                  type="primary"
                  onClick={setMintEdition}
                  style={{
                    fontSize: 12,
                    backgroundColor: "white",
                    color: "black",
                    width: "120px",
                  }}
                >
                  Mint Edition
                </Button>
              </Center>

              <Center>
                <div
                  style={{
                    fontSize: "10px",
                    overflow: "hidden",
                    maxWidth: "300px",
                  }}
                >
                  <p id="mintEditionLog">{mintEditionLog} </p>
                  <p id="mintEditionHash">{mintEditionHash}</p>
                </div>
              </Center>
            </Card>
            <Card
              title={<p style={{ color: "white" }}>Set Max Mint</p>}
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "white",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "5px" }}
            >
              <Center>
                <Input
                  onChange={(e) => setInputMaxMint(e.target.value)}
                  value={inputMaxMint}
                  placeholder="Max tokens per wallet"
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    borderRadius: "24px",
                    display: "flex",
                    height: "44px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              <Center>
                <Button
                  type="primary"
                  onClick={putMaxMint}
                  style={{
                    fontSize: 12,
                    backgroundColor: "white",
                    color: "black",
                    width: "120px",
                  }}
                >
                  Set Max Mint
                </Button>
              </Center>

              <Center>
                <div
                  style={{
                    fontSize: "10px",
                    overflow: "hidden",
                    maxWidth: "300px",
                  }}
                >
                  <p id="mintEditionHash">{maxMintStatus}</p>
                </div>
              </Center>
            </Card>
            <Card
              title={<p style={{ color: "white" }}>Set Minter</p>}
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "black",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "5px" }}
            >
              <Center>
                <Input
                  placeholder="Address"
                  onChange={(e) => {
                    setMinterAddress(e.target.value);
                  }}
                  value={minterAddress}
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    borderRadius: "24px",
                    display: "flex",
                    height: "44px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              <Center>
                <Input
                  placeholder="Approved? (True/False)"
                  onChange={(e) => {
                    setAllowed(e.target.value);
                  }}
                  value={_allowed}
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    borderRadius: "24px",
                    display: "flex",
                    height: "44px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              {setApprovedMinter}
            </Card>
            <Card
              title={<p style={{ color: "white" }}>Set Sales Price</p>}
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "black",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "5px" }}
            >
              <Center>
                <Input
                  placeholder="price in avax"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  value={price}
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    borderRadius: "24px",
                    display: "flex",
                    height: "44px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              <Center>
                <Button
                  type="primary"
                  onClick={definePrice}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    width: "120px",
                    fontSize: 12,
                  }}
                >
                  Set Token Price
                </Button>
              </Center>
            </Card>
            <Card
              title={<p style={{ color: "white" }}>Set Presale Price</p>}
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "black",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "5px" }}
            >
              <Center>
                <Input
                  placeholder="input price in avax ie.(0.5)"
                  onChange={(e) => {
                    setPreSalePrice(e.target.value);
                  }}
                  value={preSalePrice}
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    borderRadius: "24px",
                    display: "flex",
                    height: "44px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              <Center>
                <Button
                  type="primary"
                  onClick={definePresalePrice}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    width: "120px",
                    fontSize: 12,
                  }}
                >
                  Set Presale Price
                </Button>
              </Center>
            </Card>
            <Card
              title={<p style={{ color: "white" }}>Set Base Uri</p>}
              style={{
                width: "100%",
                borderWidth: "3px",
                color: "black",
                backgroundColor: "#001fff",
              }}
              bodyStyle={{ padding: "5px" }}
            >
              <Center>
                <Input
                  placeholder="set baseURI *add forward / to end of URL"
                  onChange={(e) => {
                    setNewBaseURI(e.target.value);
                  }}
                  value={_NewBaseURI}
                  style={{
                    border: "1px solid #dfe1e5",
                    width: "300px",
                    borderRadius: "24px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    display: "flex",
                    height: "44px",
                    fontSize: 12,
                    color: "black",
                  }}
                />
              </Center>
              <Center>
                <Button
                  type="primary"
                  onClick={settingBaseUri}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    width: "120px",
                    fontSize: 12,
                  }}
                >
                  Set Base URI
                </Button>
              </Center>
            </Card>

            {/*
                  <section className="flex flex-wrap justify-center">
                    {NFTs ? (
                      NFTs.map((NFT) => {
                        return (
                          <NftCard
                            image={NFT.media[0].gateway}
                            id={NFT.id.tokenId}
                            title={NFT.title}
                            address={NFT.contract.address}
                            description={NFT.description}
                            attributes={NFT.metadata.attributes}
                          ></NftCard>
                        );
                      })
                    ) : (
                      <div>No NFTs found</div>
                    )}
                  </section>
                    */}
          </Card>
        </Center>
      </Card>
    </Center>
  );
}

export default OwnerLoadContract;
