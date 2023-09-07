import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  DAppProvider,
  DEFAULT_SUPPORTED_CHAINS,
  useEthers,
  Config,
  Optimism,
  BSC,
  BSCTestnet,
  Polygon,
  Fantom,
  FantomTestnet,
  Mumbai,
  Arbitrum,
  Sepolia,
  ArbitrumGoerli,
  Avalanche,
  AvalancheTestnet,
  Mainnet,
} from "@usedapp/core";
import { Telos, TelosTestnet } from "./telos.js";
import { getDefaultProvider } from "ethers";
import "./index.css";

const config: Config = {
  readOnlyChainId: Avalanche.chainId,
  readOnlyChainId: Telos.chainId,
  readOnlyChainId: Sepolia.chainId,
  //readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]:"https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948",
      [Sepolia.chainId]: 'https://sepolia.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948',
      [Arbitrum.chainId]: "https://arb1.arbitrum.io/rpc",
      [ArbitrumGoerli.chainId]: "https://goerli-rollup.arbitrum.io/rpc",
      [Avalanche.chainId]: "https://avalanche-mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948",
      [AvalancheTestnet.chainId]: "https://avalanche-fuji.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948",
      [BSC.chainId]:"https://bsc-dataseed.binance.org	",
      [BSCTestnet.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      [Fantom.chainId]: "https://rpcapi.fantom.network/",
      [FantomTestnet.chainId]: "https://rpc.testnet.fantom.network",
      [Optimism.chainId]: "https://mainnet.optimism.io",
      [Polygon.chainId]: "https://polygon-mainnet.infura.io/v3/00eecaae285845319b8f09c7354157ef",
      [Mumbai.chainId]: "https://polygon-mumbai.infura.io/v3/00eecaae285845319b8f09c7354157ef",
      [Telos.chainId]: getDefaultProvider("https://mainnet.telos.net/evm"),
      [TelosTestnet.chainId]: getDefaultProvider("https://testnet.telos.net/evm"),
  },
  networks: [...DEFAULT_SUPPORTED_CHAINS, Telos, TelosTestnet],
};

const Application = () => {

  return <App />;
};
ReactDOM.render(
  // <React.StrictMode>
  <DAppProvider config={config}>
    <Application />,
  </DAppProvider>,
  // </React.StrictMode>,
  document.getElementById("root"),
);
