import React from 'react';
import { Button } from 'antd';
import { ethers } from 'ethers';

const BlockExplorer = ({ chainId }) => {
  const getExplorerURL = () => {
    if (chainId === 1) { 
      return "https://etherscan.io/";
    } else if (chainId === 43114) { // Avalanche Mainnet
      return "https://snowtrace.io/";
    } else if (chainId === 137) { // Polygon Mainnet
      return "https://polygonscan.com/";
    } else if (chainId === 40) { // Telos Mainnet
        return "https://teloscan.io/";
      } else if (chainId === 41) {
        return "https://testnet.teloscan.io/";
      }
    return null;
  };

  const explorerURL = getExplorerURL();

  return (
    <Button type="link" href={explorerURL} target="_blank">
      {explorerURL ? ethers.constants.getNetwork(chainId).name : "Double check your busted ass network..."}
    </Button>
  );
};

export default BlockExplorer;
