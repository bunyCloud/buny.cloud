import { Tag, Button } from "antd";
import React, { useState, useEffect } from "react";
import { Box, Center, Stack } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { abi } from "contracts/HashBoxFactory.json";
import { HashBoxFactoryAddress } from "contracts/config/networkAddress.jsx";

export default function AvatarConnect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const CONTRACT_ADDRESS = HashBoxFactoryAddress;
  const [myPublicKey, setMyPublicKey] = useState(null);
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const userBalance = useEtherBalance(account);
  const [myName, setMyName] = useState(null);

  const contractABI = abi;
  let provider;
  let signer;

  async function loginUser() {
    setIsLoggedIn(false);
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

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
    setIsLoggedIn(true);
  }

  //fetch user info on load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Box bg={"black"} color={"white"} p={0}>
        <Center>{account && <p>Account: {account}</p>}</Center>
        <Center>
          {userBalance && (
            <p>Avalanche Balance: {formatEther(userBalance)} AVAX </p>
          )}
        </Center>
        <Center>
          <Stack direction="column" bg="black" m={10} alignItems="center">
            <div>
              {}
              Logged in as:{" "}
              <Tag h="30px" color="pink">
                {myName}
              </Tag>
            </div>

            <div>
              {!myName && (
                <Button type="primary" block onClick={loginUser}>
                  Register
                </Button>
              )}
              {!account && (
                <Button type="primary" block onClick={activateBrowserWallet}>
                  {" "}
                  Connect{" "}
                </Button>
              )}
              {account && (
                <Button type="primary" block onClick={deactivate}>
                  {" "}
                  Disconnect{" "}
                </Button>
              )}
            </div>
          </Stack>
        </Center>
      </Box>
    </>
  );
}
