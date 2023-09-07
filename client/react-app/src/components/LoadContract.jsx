//import { useMoralis } from "react-moralis";
import { getNativeByChain } from "../helpers/networks";
import { useMoralis } from "react-moralis";
import { useState } from "react";
import { Card, Button } from "antd";
import NftCard from "./nftcard";
import { fetchNFTs } from "../utils/fetchNFTs";
import {
  Table,
  Center,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { Statistic, Input, Row, Col } from "antd";
import erc721Dynamic from "../contracts/erc721Dynamic.json";
import { ethers } from "ethers";

function LoadContract() {
  const [totalSupply, setTotalSupply] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [numberCanMint, setNumberCanMint] = useState("");
  const [baseURI, setBaseURI] = useState("");
  const [_editionSize, setEditionSize] = useState("");
  const [NFTs, setNFTs] = useState("");
  const [_symbol, setSymbol] = useState("");
  const [_description, setDescription] = useState("");
  const [_name, setNFTName] = useState("");
  const { chainId } = useMoralis();
  const [contractAddress, setContractAddress] = useState(
    "0x9c68d75066084c7516d653f118fea2cf6b89da88",
  );
  const [owner, setOwner] = useState("");
  const nativeName = getNativeByChain(chainId);
  /*
  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /*
  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc",
  );
*/
  async function fetchName() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
      try {
        const data = await contract.name();
        console.log("data: ", data);
        setNFTName(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchSalePrice() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
      try {
        const data = await contract.salePrice();
        const price = ethers.utils.formatEther(data.toString());
        console.log(`Listing price: ${price}`);
        setSalePrice(price);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchOwner() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
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
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
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
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
      try {
        const data = await contract.description();
        console.log("data: ", data);
        console.log(`Connected to ${chainId}`);
        setDescription(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchBase() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
      try {
        const data = await contract.baseURI();
        console.log("data: ", data);
        setBaseURI(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function fetchEditionSize() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
      try {
        const data = await contract.editionSize();
        console.log("data: ", data);
        setEditionSize(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  ////////////////////////////////
  // Fetch max mint # per wallet //
  //////////////////////////////////
  async function fetchNumberCanMint() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc",
      );
      const contract = new ethers.Contract(
        contractAddress,
        erc721Dynamic.abi,
        provider,
      );
      try {
        const data = await contract.numberCanMint();
        console.log("data: ", data);
        setNumberCanMint(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  return (
    <Center>
      <Card
        title="Load Existing Contract"
        bodyStyle={{ padding: "5px" }}
        style={{
          width: "390px",
          padding: "1px",
          borderRadius: "15px",
          fontSize: 8,
          //borderColor: "orange",
          borderWidth: "3px",
        }}
      >
        <Card
          bodyStyle={{ padding: "5px" }}
          style={{
            width: "100%",
            fontSize: 12,
            padding: "0px",
            margin: "auto",
            color: "black",
            //backgroundColor: "blue",
            borderWidth: "0px",
            //                    borderColor: "orange",
          }}
        >
          <Input
            onChange={(e) => setContractAddress(e.target.value)}
            value={contractAddress}
            placeholder="Enter NFT Contract Address"
            style={{
              border: "1px solid #dfe1e5",
              width: "100%",
              //width: "auto",
              borderRadius: "24px",
              display: "flex",
              height: "44px",

              fontSize: 12,
              color: "black",
            }}
          />
          <Center>
            <Button
              onClick={() => {
                fetchNFTs(owner, contractAddress, setNFTs);
                fetchOwner();
                fetchSymbol();
                fetchName();
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
                margin: "11px 8px",
                textAlign: "center",
                color: "black",
              }}
            >
              Load Contract
            </Button>
          </Center>
        </Card>
        <TableContainer>
          <Card
            bodyStyle={{ padding: "5px" }}
            style={{
              width: "100%",
              padding: "2px",

              borderWidth: "3px",
              backgroundColor: "#81cdf2",
              overflow: "auto",
            }}
          >
            <Table>
              <Tbody>
                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Owner:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Text fontSize="10px" color="black">
                      {owner}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Address
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Text fontSize="10px" color="black">
                      {contractAddress}
                    </Text>
                  </Td>
                </Tr>

                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Collection:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Text fontSize="10px" color="black">
                      {_name}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontSize="10px" color="tomato">
                      Symbol:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Text fontSize="10px" color="black">
                      {_symbol}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Description:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Text fontSize="10px" color="black">
                      {_description}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Base URI:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Text fontSize="10px" color="black">
                      {baseURI}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Edition Size:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Statistic
                      //title="Edition Size"
                      value={_editionSize}
                      valueStyle={{ fontSize: 12, color: "black" }}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontSize="11px" color="tomato">
                      Available:
                    </Text>
                  </Td>
                  <Td></Td>
                  <Td>
                    <Statistic
                      //title="Available "
                      value={numberCanMint}
                      valueStyle={{ fontSize: 12, color: "black" }}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Card>
        </TableContainer>
        <Card
          style={{
            width: "100%",
            borderWidth: "3px",
            //                    borderColor: "#ffb657",
            backgroundColor: "white",
          }}
          bodyStyle={{ padding: "5px" }}
        >
          <Center>
            <Row gutter={4}>
              <Col span={12}>
                <Statistic
                  title="Sale Price"
                  value={`${salePrice}`}
                  valueStyle={{ fontSize: 12, color: "black" }}
                />
                {nativeName}
              </Col>
            </Row>
          </Center>{" "}
        </Card>
        <Card style={{ borderWidth: "3px" }}>
          <Center>
            <Statistic
              title="Total Supply"
              value={totalSupply}
              valueStyle={{
                fontSize: 12,
                color: "black",
                textAlign: "center",
              }}
            />
          </Center>
          <Center>
            <div>
              <Button
                type="primary"
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  fontSize: 12,
                }}
                onClick={() => {
                  fetchNFTs(owner, contractAddress, setNFTs);
                }}
              >
                Refresh
              </Button>
            </div>
          </Center>
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
        </Card>
      </Card>
    </Center>
  );
}

export default LoadContract;
