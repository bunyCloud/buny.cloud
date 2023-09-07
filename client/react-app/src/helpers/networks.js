export const networkConfigs = {
  "0x1": {
    chainId: 1,
    chainName: "Ethereum",
    currencyName: "Ethereum",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io/",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    blockExplorerName: "Etherscan.io",
  },
  "0x2a": {
    chainId: 2,
    chainName: "Ethereum Kovan Testnet",
    currencyName: "Ethereum",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://kovan.etherscan.io/",
    blockExplorerName: "Etherscan.io",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  "0x4": {
    chainId: 4,
    chainName: "Ethereum",
    currencyName: "Ethereum",
    currencySymbol: "ETH",
    blockExplorerName: "Etherscan.io",
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
  },
  "0x5": {
    chainId: 5,
    chainName: "Goerli Ethereum Testnet",
    currencySymbol: "ETH",
    currencyName: "Ethereum",
    blockExplorerName: "Etherscan.io",
    blockExplorerUrl: "https://goerli.etherscan.io/",
  },
  "0xa86a": {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerName: "Snowtrace.io",
    blockExplorerUrl: "https://cchain.explorer.avax.network/",
  },
  "0xa869": {
    chainId: 43113,
    chainName: "Avalanche Testnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://testnet.snowtrace.io/",
    explorerLogo:
      "https://gateway.pinata.cloud/ipfs/QmdgdEYHk2P7gDiMEaF5QgT7Xwx3NsYL7Jym1kKR1J2oZc/",
    blockExplorerName: "https://snowtrace.io",
  },
  "0x38": {
    chainId: 56,
    chainName: "Smart Chain",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorerUrl: "https://bscscan.com/",
    wrapped: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  "0x61": {
    chainId: 97,
    chainName: "Smart Chain - Testnet",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorerUrl: "https://testnet.bscscan.com/",
  },
  "0x89": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mainnet.maticvigil.com/",
    blockExplorerUrl: "https://polygonscan.com/",
    blockExplorerName: "Polygonscan.com",
    wrapped: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  },
  "0x13881": {
    chainId: 80001,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mumbai.matic.today/",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
    blockExplorerName: "Polygonscan.com",
  },
};

export const getNativeByChain = (chain) =>
  networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getChainByName = (chain) => networkConfigs[chain]?.chainName;

export const getExplorerName = (chain) =>
  networkConfigs[chain]?.blockExplorerName;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
  networkConfigs[chain]?.wrapped || null;
