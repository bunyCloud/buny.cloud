import React from "react";
import { ethers } from "ethers";
import { Button, Grid, GridItem, Center, Box, Link } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import fallbackImg from "components/icons/bunyBlue.svg";
import { Image } from "antd";

const styles = {
  layout: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    width: "100%",
    gap: "10px",
  },
  nfts: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    width: "250px",
    maxWidth: "250px",
    maxHeight: "250px",
    minHeight: "250px",
  },
};

export default function Card({ nft, url = "/" }) {
  //const router = useRouter();
  return (
    <Box p={10} bg={"black"}>
      <div>
        <Link href={`${url}${nft.tokenId}`}>
          <Image
            style={styles.nfts}
            fallback={fallbackImg}
            padding={3}
            src={nft.image}
            alt={nft.name}
            preview={false}
          />
        </Link>
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={2} h="33" p={5} bg="tomato">
            <h5>{nft.name}</h5>
          </GridItem>
          <GridItem
            colStart={4}
            colEnd={6}
            w={"100%"}
            maxW={"100px"}
            p={5}
            h="33"
            bg="tomato"
          >
            <p style={{ color: "white" }}>{nft.price.toString()} AVAX</p>
          </GridItem>
        </Grid>
        <p style={{ color: "white", height: "40px", overflow: "hidden" }}>
          {nft.description}
        </p>
        <Button
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "5px",
            width: "100%",
          }}
        >
          {" "}
          Buy{" "}
        </Button>
      </div>
    </Box>

    // Anothrt Navbar
  );
}
