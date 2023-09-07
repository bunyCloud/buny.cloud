import { Box } from "@chakra-ui/react";
import { Center, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import {
  HashBoxAddress,
  HashBoxFactoryAddress,
} from "contracts/config/networkAddress.jsx";
import { Button, Tag } from "antd";
import { Input } from "antd";
import { useEffect } from "react";

function AddHashBox() {
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myContract, setMyContract] = useState(null);
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [boxCount, setBoxCount] = useState();
  const [boxAddress, setBoxAddress] = useState();
  const [boxOwner, setBoxOwner] = useState();
  //const [boxAddress, setBoxAddress] = useState();
  const [boxName, setBoxName] = useState();
  const [newBoxName, setNewBoxName] = useState();
  const newBoxPrice = "0.025";
  // Save the contents of abi in a variable
  const contractABI = abi;
  let provider;
  let signer;

  const [createStatus, setCreateStatus] = useState();

  // create new box
  const [statusText, setStatusText] = useState();

  async function createHashBox() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const transaction = await contract.createHashBox(newBoxName, {
      value: ethers.utils.parseEther(newBoxPrice),
    });
    const tx = await transaction.wait();

    // Set transaction explorer url
    setStatusText("Creating new HashBox....");
    setCreateStatus(transaction.hash);
    console.log(`https://snowtrace.io/tx/${transaction.hash}`);
    console.log(tx);
    contract.on(
      "HashBoxCreated",
      (boxCount, _boxName, owner, contractAddress, event) => {
        const info = {
          boxCount: boxCount,
          _boxName: _boxName,
          owner: owner,
          contractAddress: contractAddress,
          data: event,
        };

        console.log(JSON.stringify(info, null, 5));
        setBoxCount(Number(boxCount));
        setBoxName(_boxName);
        setBoxOwner(owner);
        setBoxAddress(contractAddress);
      },
    );
  }

  // Login to Metamask and check the if the user exists else creates one
  async function fetchUser() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const address = await signer.getAddress();
    //    const userHashBox = await contract.fetchHashBox();
    //    setBoxAddress(userHashBox);
    let present = await contract.checkUserExists(address);
    let username;
    if (present) username = await contract.getUsername(address);

    setMyName(username);
    setMyPublicKey(address);
  }

  //fetch user info on load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Box w={390} bg="rgb(229 231 235)" p={5}>
        <Box style={{ textAlign: "left", color: "black" }}>
          <HStack
            style={{
              padding: "5px",
              backgroundColor: "white",
            }}
          >
            <p>Logged in as:</p>

            <div style={{ color: "blue" }}>{myName}</div>
          </HStack>
        </Box>
        <Box
          mt={5}
          bg={"white"}
          fontSize="12px"
          color={"black"}
          border="1px solid blue"
          p={10}
        >
          <h6 style={{ color: "black" }}> Deploy Private HashBox</h6>
          <p> Deploy a IPFS 'HashBox' that only you can pin objects to. </p>

          <Center>
            <HStack alignItems={"stretch"} gap={40} p={5} m={5}>
              <a href="https://ipfs.io/" target="_blank">
                {" "}
                More on IPFS
              </a>

              <a href="https://buny.cloud/hashbox" target="_blank">
                {" "}
                What is a HashBox?
              </a>
            </HStack>
          </Center>
        </Box>
        <Box border="1px solid white" p={20} mt={15}>
          <HStack>
            <div>
              <p style={{ color: "black" }}>Current fee per box:</p>
            </div>
            <div style={{ color: "blue" }}>{newBoxPrice} /avax</div>
          </HStack>
        </Box>

        <Box color="black" fontSize="12px" p={10} m={10}>
          <Center>
            <Box>
              <Center>
                <Tag
                  color="#ffc72c"
                  style={{
                    color: "black",
                    height: "30px",
                    borderRadius: "1px",
                    padding: 5,
                    marginBottom: "10px",
                  }}
                >
                  <strong>HashBox:</strong>
                </Tag>
                <Input
                  className="formInput"
                  placeholder="name of HashBox"
                  onChange={(e) => {
                    setNewBoxName(e.target.value);
                  }}
                  value={newBoxName}
                  style={{
                    padding: 5,
                    marginBottom: "10px",
                    width: "250px",
                    border: "1px solid blue",
                    color: "black",
                    fontSize: 12,
                  }}
                />
              </Center>

              <Box
                m={10}
                bg={"white"}
                w={390}
                color={"blue"}
                p={10}
                isTruncated
              >
                <Center>
                  <Button
                    block
                    onClick={createHashBox}
                    /*
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      border: "1px solid white",
                      padding: "10px",
                      width: "200px",
                    }}
                    */
                  >
                    Create HashBox
                  </Button>
                </Center>
              </Box>

              {createStatus && (
                <>
                  <Box
                    m={10}
                    bg={"black"}
                    fontSize="12px"
                    color={"white"}
                    border="1px solid white"
                    p={10}
                  >
                    <HStack>
                      <div>Log:</div>
                      <Box style={{ fontSize: "10px", width: "350px" }}>
                        {createStatus}
                      </Box>
                    </HStack>
                    <HStack>
                      <div>
                        <p>Box Address:</p>
                      </div>
                      <div>{boxAddress}</div>
                    </HStack>
                    <HStack>
                      <div>
                        <p>Box Name:</p>
                        <div>{boxName}</div>
                      </div>
                    </HStack>
                    <HStack>
                      <div>Box Count:</div>

                      <div> {boxCount}</div>
                    </HStack>
                  </Box>
                </>
              )}

              {/*
              <HStack>
                <div
                  style={{
                    padding: "5px",
                  }}
                >
                  Contract:
                </div>
                <div>
                  <p style={{ color: "yellow" }}>{boxAddress}</p>
                </div>
              </HStack>
              */}
            </Box>
          </Center>
        </Box>
      </Box>
    </>
  );
}

export default AddHashBox;
