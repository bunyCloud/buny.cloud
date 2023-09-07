import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import {
  useEthers,
  useEtherBalance,
  Mainnet,
  Avalanche,
  AvalancheTestnet,
  Polygon,
  Mumbai,
} from "@usedapp/core";
import { useState } from "react";
import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";
import "subcomponents/hoverButton.scss";
import { Button, Modal, Tag } from "antd-mobile";
import { Telos, TelosTestnet } from "./UseDappCore";
import CurrencySymbol from "./CurrencySymbol";

export default function ConnectButton({ handleOpenModal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { activateBrowserWallet, chainId, switchNetwork, account } =
    useEthers();
  const userBalance = useEtherBalance(account);
  function handleConnectWallet() {
    setIsLoggedIn(false);
    activateBrowserWallet();
    setIsLoggedIn(true);
  }
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
        return "Polygon";
      case 246:
        return "Energy Web Chain";
      case 250:
        return "Fantom";
        case 4002:
          return "Fantom Testnet";
      case 42220:
        return "Celo Mainnet";
      case 42161:
        return "Arbitrum One";
      case 44787:
        return "Edgeware Mainnet";
      case 4689:
        return "xDai Chain";
      case 1666600000:
        return "Harmony Mainnet";
      case 1666600001:
        return "Harmony Testnet";
      case 43113:
        return "Fuji Testnet";
      case 43112:
        return "Near Mainnet";
      case 80001:
        return "Mumbai Testnet";
      case 1666700000:
        return "Moonbeam Mainnet";
      case 1666700001:
        return "Moonbase Alpha Testnet";
      case 43114:
        return "Avalanche";
      case 43113:
        return "Fuji";
      default:
        return "Unknown network";
    }
  }

  const networkName = getNetworkName(chainId);


  return account ? (
    <VStack>
      <Button
        onClick={handleOpenModal}
        bg="white"
        //width="360px"
        block
        border="1px solid #f6ccd0"
        _hover={{
          border: "4px",
          borderStyle: "solid",
          borderColor: "#f6ccd0",
        }}
        borderRadius="xl"
      >
        <Center>
          <HStack>
            <Text color="#2d2a5d" fontSize="12px" fontWeight="medium">
              <div>
                <Center>
                  <HStack gap={5}>
                    <div style={{ fontSize: "12px", maxWidth: "40px" }}>
                      {userBalance && (
                        <Text>
                          {ethers.utils
                            .formatEther(userBalance.toString(), "ether")
                            .substring(0, 6)}
                        </Text>
                      )}
                    </div>

                    <CurrencySymbol chainId={chainId} />
                  </HStack>
                </Center>
              </div>
              {account}
            </Text>
          </HStack>
        </Center>
      </Button>
   
    </VStack>
  ) : (
    <div>
      <Button
        onClick={handleConnectWallet}
        w={375}
        /*
    
      */
        className="pulse"
      >
        Connect
      </Button>
    </div>
  );
}
