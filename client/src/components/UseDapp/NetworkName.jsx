import React from "react";

function NetworkName({ chainId }) {
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
      case 42220:
        return "Celo Mainnet";
      case 42161:
        return "Arbitrum One";
      case 43112:
        return "Near Mainnet";
      case 43113:
        return "Fuji Testnet";
      case 43114:
        return "Avalanche";
      case 44787:
        return "Edgeware Mainnet";
      case 4689:
        return "xDai Chain";
      case 80001:
        return "Mumbai Testnet";
      case 1666600000:
        return "Harmony Mainnet";
      case 1666600001:
        return "Harmony Testnet";
      case 1666700000:
        return "Moonbeam Mainnet";
      case 1666700001:
        return "Moonbase Alpha Testnet";
      default:
        return "Unknown network";
    }
  }

  const networkName = getNetworkName(chainId);
  return <span>{networkName}</span>;
}

export default NetworkName;
