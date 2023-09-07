import { SimpleGrid, Box } from "@chakra-ui/react";
import React from "react";
import { Image } from "antd";
import fallbackImg from "../icons/bunyBlue.svg";
import { nftAddress } from "contracts/config/networkAddress";

export default function MarketDescriptionModal({
  name,
  description,
  showModal,
  price,
  image,
  buyNft,
  tokenId,
  itemId,
}) {
  return (
    <React.Fragment>
      <div>
        <Box
          mt="1"
          textAlign={"center"}
          color="white"
          fontSize="12px"
          w={"100%"}
          maxWidth={"600px"}
        >
          <Image
            fallback={fallbackImg}
            src={image}
            alt={name}
            height="400px"
            width="100%"
            preview={false}
          />
        </Box>

        <Box
          fontWeight="semibold"
          textAlign={"left"}
          p={2}
          color="white"
          bg={"black"}
          h={"100%"}
          fontSize="14px"
          w={"100%"}
          lineHeight="tight"
          noOfLines={[1, 2, 3]}
          isTruncated
        >
          <Box
            bg="white"
            w={"100%"}
            textAlign={"left"}
            height="25px"
            marginTop="0"
            boxShadow={"outline"}
            rounded={"md"}
            noOfLines={[1, 2]}
            overflow="hidden"
            isTruncated
          >
            <p>
              <h5>Name: {name}</h5>
            </p>
          </Box>
          <Box
            mt="1"
            textAlign={"center"}
            color="white"
            w={"100%"}
            maxWidth={"600px"}
          >
            <strong> Address: </strong> {nftAddress}
          </Box>
          <SimpleGrid columns={2} spacingX="20px" spacingY="20px">
            <Box bg="black" color="white" textAlign={"center"} height="20px">
              <p>
                <strong>Token Id:</strong> {tokenId}
              </p>
            </Box>
            <Box bg="black" color="white" height="40px">
              <p>
                <strong>Market Id:</strong> {itemId}
              </p>
            </Box>
          </SimpleGrid>
          <Box bg="black" noOfLines={[4]} color="white" minHeight="50px">
            {description}
          </Box>
        </Box>
        <Box
          bg="white"
          color="black"
          textAlign={"right"}
          w={"100%"}
          marginTop="30px"
          paddingRight="20px"
        >
          <strong>Price: {price}</strong> /Avax
        </Box>
      </div>
    </React.Fragment>
  );
}
