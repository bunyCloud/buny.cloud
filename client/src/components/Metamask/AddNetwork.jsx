import React, { useState } from "react";
import { Avatar, Button, Card,Select, Tag } from "antd";
import { nftAddress } from "contracts/config/networkAddress";
import { HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";

function AddNetwork() {
  const [chain, setChain] = useState();

  const [log, setLog] = useState();

  const addNetwork = (params) =>
    // eslint-disable-next-line no-undef
    window.ethereum
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => {
        setLog([
          ...log,
          `Switched to ${params[0].chainName} (${parseInt(params[0].chainId)})`,
        ]);
        setChain(parseInt(params[0].chainId));
      })
      .catch((error) => setLog([...log, `Error: ${error.message}`]));

  const addTelosTestnet = (params) =>
    addNetwork([
      {
        chainId: "0x29", //41
        chainName: "Telos Testnet",
        nativeCurrency: {
          name: "TLOS",
          symbol: "TLOS",
          decimals: 18,
        },
        rpcUrls: ["https://testnet.telos.net/evm"],
        blockExplorerUrls: ["https://teloscan.io"],
      },
    ]);

  const addTelosMainnet = (params) =>
    addNetwork([
      {
        chainId: "0x28", //40
        chainName: "Telos Mainnet",
        nativeCurrency: {
          name: "TLOS",
          symbol: "TLOS",
          decimals: 18,
        },
        rpcUrls: ["https://mainnet.telos.net/evm"],
        blockExplorerUrls: ["https://teloscan.io"],
      },
    ]);

  const addAvalancheTestnet = (params) =>
    addNetwork([
      {
        chainId: "0xa869",
        chainName: "Avalanche Fuji Testnet",
        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
          decimals: 18,
        },
        rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io"],
      },
    ]);

  const addAvalancheMainnet = (params) =>
    addNetwork([
      {
        chainId: "0xA86A",
        chainName: "Avalanche Mainnet",
        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
          decimals: 18,
        },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io"],
      },
    ]);



    return (
      <div style={{ padding: "10px", backgroundColor: "white", color: "black" }}>
        <Select
        defaultValue="Select network"
        style={{ width: 120 }}
        onChange={(value) => {
          if (value === "avalanche-mainnet") {
            addAvalancheMainnet();
          } else if (value === "avalanche-testnet") {
            addAvalancheTestnet();
          } else if (value === "telos-mainnet") {
            addTelosMainnet();
          } else if (value === "telos-testnet") {
            addTelosTestnet();
          }
        }}
      >
        <Option value="avalanche-mainnet">Avalanche Mainnet</Option>
        <Option value="avalanche-testnet">Avalanche Testnet</Option>
        <Option value="telos-mainnet">Telos Mainnet</Option>
        <Option value="telos-testnet">Telos Testnet</Option>
      </Select>
      </div>
    );
    
}

export default AddNetwork;
