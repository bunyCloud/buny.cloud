import React, { useState } from "react";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis } from "react-moralis";

import { Center, Box, Divider } from "@chakra-ui/react";
import { CapsuleTabs } from "antd-mobile";

function CreateContent() {
  const [chain, setChain] = useState();

  const [log, setLog] = useState();
  const { user } = useMoralis();
  const { authenticate, isAuthenticated, logout } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();

  //const networkName = chainId === 0xa869 ? 'Avalanche Mainnet' : 'Avalanche Testnet'

  return (
    <div style={{ padding: "10px", backgroundColor: "black", color: "white" }}>
      <Box>
        <CapsuleTabs>
          <CapsuleTabs.Tab title=" Market Listing " key=" fruits ">
            NFT Market Listing
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title="Auction" key="vegetables">
            Live NFT Auction
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title=" Complete NFT Collection " key=" collection ">
            Complete NFT Collection
          </CapsuleTabs.Tab>
        </CapsuleTabs>
      </Box>
    </div>
  );
}

export default CreateContent;
