import React, { useState, useEffect } from "react";
import { FantomTestnetRaffleFactoryAddress } from "contracts/config/networkAddress";
import { Box, Flex, HStack, Image, VStack, Link } from "@chakra-ui/react";
import raffleFactory from "contracts/BunyRaffleFactory.json";
import { Center } from "@chakra-ui/react";
import { ethers } from "ethers";
import { Tag } from "antd-mobile";
import { Button, List, Descriptions, Badge } from "antd";
import { TeamOutlined, TagsOutlined } from "@ant-design/icons";
import ConnectButton from "components/UseDapp/ConnectButton";
import { useEthers, FantomTestnet } from "@usedapp/core";

function getNetworkName(chainId) {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 3:
      return "Ropsten Testnet";
    case 4:
      return "Rinkeby Testnet";
    case 5:
      return "Goerli Testnet";
    case 40:
      return "Telos";
    case 41:
      return "Telos Testnet";

    case 42:
      return "Kovan Testnet";
    case 56:
      return "Binance Smart Chain Mainnet";
    case 77:
      return "POA Network Sokol";
    case 97:
      return "Binance Smart Chain Testnet";
    case 99:
      return "POA Network Core";
    case 128:
      return "Huobi ECO Chain Mainnet";
    case 137:
      return "Matic Network";
    case 246:
      return "Energy Web Chain";
    case 250:
      return "Fantom Opera";
      case 4002:
        return "Fantom Testnet";
    case 42220:
      return "Celo Mainnet";
    case 42161:
      return "Arbitrum One";
    case 44787:
      return "Edgeware Mainnet";
    case 4689:
      return "xDai Chain";
    case 1666600000:
      return "Harmony Mainnet";
    case 1666600001:
      return "Harmony Testnet";
    case 43113:
      return "Fuji Testnet";
    case 43112:
      return "Near Mainnet";
    case 80001:
      return "FantomTestnet Testnet";
    case 1666700000:
      return "Moonbeam Mainnet";
    case 1666700001:
      return "Moonbase Alpha Testnet";
    case 43114:
      return "Avalanche";
    case 43113:
      return "Fuji";
    default:
      return "Unknown network";
  }
}

export default function FantomTestnetRaffleDirectory() {
  const [implementation, setImplementation] = useState();
  const [collectionCount, setCount] = useState();
  const [_name, setName] = useState();
  const [data, setData] = useState([]);
  const [raffles, setRaffles] = useState();
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.testnet.fantom.network",
  );
  const { activateBrowserWallet, chainId, switchNetwork, account } =
    useEthers();
  const networkName = getNetworkName(chainId);

  async function fetchRaffles() {
    const contract = new ethers.Contract(
      FantomTestnetRaffleFactoryAddress,
      raffleFactory.abi,
      provider,
    );
    const implementation = await contract.implementation(); //contract name
    setImplementation(implementation);
    const count = await contract.collectionCount();
    setCount(count.toString());
    console.log(count.toString());
    const items = [];
    console.log(items);
    try {
      for (let i = 0; i < count; i++) {
        const items = await contract.readAllCollections();
        setRaffles(items);
        console.log(items);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchRaffles();
  }, []);

  return (
    <>
      <Flex mt="15px" p={5}>
        <VStack>
          <Center>
            <Box
              bg="white"
              //border={'4px solid #fe9d97'}
              mt={-4}
              isTruncated
              w={"100%"}
              maxWidth="375px"
              style={{
                fontSize: "12px",
                padding: "15px",
                color: "#bbdccb",
              }}
            >
              <Descriptions title="All Fantom Testnet Raffles">
                <Descriptions.Item label="Network">
                  <HStack gap={10}>
                    <img
                      width="20px"
                      src="https://seeklogo.com/images/F/fantom-ftm-logo-3566C53917-seeklogo.com.png"
                    ></img>{" "}
                    <Badge status="warning" text="Testnet" />
                    <Tag>
                      <div>Raffle Count:{collectionCount}</div>
                    </Tag>
                  </HStack>
                </Descriptions.Item>
              </Descriptions>
            </Box>
          </Center>

          <Box
            // bg="white"
            //    border={'4px solid rgb(229 231 235)'}
            mt={-4}
            m={1}
            w={"auto"}
            minWidth="375px"
            maxHeight="1100px"
            overflow="hidden"
            maxWidth={800}
            overflowWrap="anywhere"
            style={{
              fontSize: "12px",
              padding: "20px",
              color: "white",
            }}
          >
            <List
              itemLayout="vertical"
              grid={{
                gutter: 6,
                xs: 1,
                sm: 1,
                column: 2,
              }}
              dataSource={raffles}
              renderItem={(item) => (
                <Link href={`/raffle/${item[1]}`}>
                  <List.Item
                    style={{
                      border: "4px solid #bbdccb",
                      minWidth: "375px",
                      backgroundColor: "white",
                      width: "100%",
                      //maxWidth: '385px',
                      padding: "8px",
                      display: "flex",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Image
                          style={{
                            marginLeft: "3px",
                            width: "100px",
                            height: "100px",
                            marginTop: "4px",
                            marginBottom: "-8px",
                            backgroundColor: "#bbdccb",
                          }}
                          size={{
                            //xs: 24,
                            //sm: 32,
                            md: 40,
                            lg: 64,
                            xl: 80,
                          }}
                          src={item[7]}
                        />
                      }
                      title={
                        <Button
                          block
                          //type="ghost"
                          style={{
                            //textDecoration: 'none',
                            marginTop: "6px",

                            marginBottom: "-10px",
                            //border:"2px solid #ebd86d",
                            padding: "4px",
                            fontSize: "16px",
                          }}
                          //type="outlined"
                          href={`/raffle/${item[1]}`}
                        >
                          <HStack justify="center" spacing={8}>
                            <div>{item[0]}</div>
                            <div style={{ marginRight: "-1px" }}>
                              #{item[3].toString()}
                            </div>

                            {/*
                            <Image
                              src="https://buny.us-southeast-1.linodeobjects.com/carrot3.png"
                              width="20px"
                              alt="Carrot"
                            /> 
                            */}
                          </HStack>

                          <Center>
                            <div style={{ fontSize: "14px" }}>
                              <Tag color="#fdeeb3">
                                {" "}
                                <div style={{ color: "black", fontSize: "14px" }}>
                                  Enter:
                                  {ethers.utils.formatEther(
                                    item[6].toString(),
                                    "ether",
                                  )}{" "}
                                  /ftm
                                </div>
                              </Tag>
                              <Tag color="#fdeeb3">
                                <div style={{ color: "black", fontSize: "14px" }}>
                                  Win:
                                  {(
                                    ((ethers.utils.formatEther(
                                      item[6].toString(),
                                      "ether",
                                    ) *
                                      item[2]) /
                                      100) *
                                    90
                                  ).toFixed(2)}{" "}
                                  /ftm
                                </div>
                              </Tag>
                            </div>
                          </Center>
                          <Center color="black" bg="#bbdccb" p={1}>
                            <HStack gap="2px">
                              <div style={{ fontSize: "12px" }}>
                                <TagsOutlined fontSize="8px" />
                                Tickets:{item[2].toString()}
                              </div>

                              <div style={{ fontSize: "12px" }}>
                                <TeamOutlined fontSize="8px" />
                                Min Players:{item[4].toString()}
                              </div>
                            </HStack>
                          </Center>
                        </Button>
                      }
                      description={<></>}
                    />
                  </List.Item>
                </Link>
              )}
            />
          </Box>
        </VStack>
      </Flex>
    </>
  );
}
