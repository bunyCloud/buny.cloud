import React, { useState, useEffect } from "react";
import { dFactoryAddress } from "contracts/config/networkAddress";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import dFactory from "contracts/dFactory.json";
import { useClipboard } from "@chakra-ui/react";

import { ethers } from "ethers";
import { Button, Avatar, List } from "antd";

export default function CollectionDirectory() {
  const [implementation, setImplementation] = useState();
  const [collectionCount, setCount] = useState();
  const [_name, setName] = useState();
  const [data, setData] = useState([]);
  const [collections, setCollections] = useState();
  const { onCopy, value, setValue, hasCopied } = useClipboard(data);

  async function fetchCollections() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.avax.network/ext/bc/C/rpc",
    );
    const contract = new ethers.Contract(
      dFactoryAddress,
      dFactory.abi,
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
        setCollections(items);
        console.log(items.toString());
        setData(items[1].toString());
        setName(items[0].toString());
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <>
      <Flex mt="15px" p={5}>
        <VStack>
          <Box
            bg="transparent"
            border={"4px solid rgb(229 231 235)"}
            mt={-4}
            p={5}
            isTruncated
            w={"100%"}
            maxHeight="1100px"
            maxWidth={600}
            style={{
              fontSize: "12px",
              padding: "10px",
              color: "black",
            }}
          >
            <HStack>
              <div>
                <strong>NFT Factory:</strong>
              </div>
              <div>
                <a
                  target="_blank"
                  href={`https://snowtrace.io/address/${dFactoryAddress}`}
                >
                  <p style={{ padding: "5px" }}>View Contract</p>
                </a>
              </div>
            </HStack>
            <div>Total # of collections: {collectionCount}</div>
          </Box>
          <Box
            bg="transparent"
            border={"4px solid rgb(229 231 235)"}
            mt={-4}
            p={5}
            w={"100%"}
            minWidth="350px"
            maxHeight="1100px"
            maxWidth={500}
            overflowWrap="anywhere"
            style={{
              fontSize: "12px",
              padding: "10px",
              color: "white",
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={collections}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://ipfs.io/ipfs/QmZgNMNqQHpoiXnc4TzsonV1JYJhNtLpR7Bwgy12TveLDQ" />
                    }
                    title={
                      <Button
                        //type="outlined"
                        href={`/collection/${item[1]}`}
                        style={{
                          width: "260px",
                          color: "black",
                          backgroundColor: "rgb(229 231 235)",
                          fontSize: "14px",
                        }}
                      >
                        {item[0]}
                      </Button>
                    }
                    description={
                      <>
                        <div style={{ fontSize: "11px" }}>{item[1]}</div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Box>
        </VStack>
      </Flex>
    </>
  );
}
