import { Chain } from "@usedapp/core";
//import { getAddressLink, getTransactionLink } from '../../helpers/chainExplorerLink'

const telosExplorerUrl = "https://teloscan.io";

export const Telos: Chain = {
  chainId: 40,
  chainName: "Telos",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0xE1A34ca06e57f981A51C6a9518d1bCDAb3cE1c6d",
  rpcUrl: "https://mainnet.telos.net/evm",
  nativeCurrency: {
    name: "TLOS",
    symbol: "TLOS",
    decimals: 18,
  },
  blockExplorerUrl: telosExplorerUrl,
  //getExplorerAddressLink: getAddressLink(telosExplorerUrl),
  //getExplorerTransactionLink: getTransactionLink(telosExplorerUrl),
};

const telosTestnetExplorerUrl = "https://testnet.teloscan.io";

export const TelosTestnet: Chain = {
  chainId: 41,
  chainName: "Telos Testnet",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0x39b0CF441E616e4e21a5f7b37c9CE0Ca750bd05B",
  rpcUrl: "https://mainnet.telos.net/evm",
  nativeCurrency: {
    name: "TLOS",
    symbol: "TLOS",
    decimals: 18,
  },
  blockExplorerUrl: telosTestnetExplorerUrl,
  //getExplorerAddressLink: getAddressLink(telosTestnetExplorerUrl),
  //getExplorerTransactionLink: getTransactionLink(telosTestnetExplorerUrl),
};

export default {
  Telos,
  TelosTestnet,
};
