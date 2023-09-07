import UseDappConnect from "../UseDapp/UseDappConnect";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { Badge, TabBar } from "antd-mobile";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Card } from "antd";
import {
  ShopbagOutline,
  UploadOutline,
  UnorderedListOutline,
  UserOutline,
  CouponOutline,
} from "antd-mobile-icons";

export default function HomepageTabBar() {
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    async function getChainId() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setChainId(network.chainId);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const tabs = [
    {
      key: "marketplace",
      title: [
        <>
          <Link to="/nft-marketplace">Market</Link>
        </>,
      ],
      icon: [
        <>
          <Link to="/nft-marketplace">
            <ShopbagOutline />
          </Link>
        </>,
      ],
      // badge: '1',
    },

    {
      key: "hashbox",
      title: [
        <>
          <Link to={"/ipfs"}>HashBox</Link>
        </>,
      ],
      icon: [
        <>
          <Link to={"/ipfs"}>
            <UploadOutline />
          </Link>
        </>,
      ],
    },

    {
      key: "collections",
      title: [
        <>
          <Link to={"/collections"}>Collections</Link>
        </>,
      ],
      icon: [
        <>
          <Link to={"/collections"}>
            <UnorderedListOutline />
          </Link>
        </>,
      ],
    },

    {
      key: "raffle",
      title: [
        <>
          <Link to={"/buny-raffle"}>Raffle</Link>
        </>,
      ],
      icon: [
        <>
          <Link to={"/buny-raffle"}>
            <CouponOutline />
          </Link>
        </>,
      ],
    },
  ];

  return (
    <>
      <Card
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#514d5b",
          border:'2px solid white',
          color: "#2d2a5d",
        }}
        title={
          <>
            <Box w={360}>
              <UseDappConnect />
            </Box>
          </>
        }
        bodyStyle={{ padding: "5px" }}
      >
        <Box bg="white">
          <TabBar>
            {tabs.map((item) => (
              <TabBar.Item
                style={{
                  color: "#2d2a5d",
                }}
                key={item.key}
                icon={item.icon}
                title={item.title}
                badge={item.badge}
              />
            ))}
          </TabBar>
        </Box>
      </Card>
    </>
  );
}
