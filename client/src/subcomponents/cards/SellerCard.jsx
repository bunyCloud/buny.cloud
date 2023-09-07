import React, { useState } from "react";
import { Center, Box, HStack } from "@chakra-ui/react";
import { VStack, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import { Popover } from "antd";
import { Modal } from "antd";

export default function SellerCard({ nft, url = "/" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tokenIdPopover = (
    <div>
      <p>Token Id: {nft.tokenId}</p>
    </div>
  );

  const itemIdPopover = (
    <div>
      <p>Listing Id: {nft.itemId}</p>
    </div>
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [visible, setVisible] = useState(false);

  //const router = useRouter();
  return (
    <Center py={2}>
      <VStack>
        <Box
          w={"150px"}
          m={5}
          bg={useColorModeValue("black", "gray")}
          boxShadow={"outline"}
          rounded={"md"}
          noOfLines={[1, 2]}
          overflow="hidden"
          isTruncated
        >
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            <GridItem colSpan={2} h="30" bg="black">
              <Box
                color="white"
                fontSize="11px"
                w={"100%"}
                p={5}
                lineHeight="tight"
                noOfLines={[1, 2]}
                isTruncated
              >
                <HStack>
                  <Popover content={tokenIdPopover} title="">
                    <p>{nft.tokenId} |</p>
                  </Popover>
                </HStack>
              </Box>
            </GridItem>
            <GridItem colStart={3} colEnd={6} h="30" bg="papayawhip">
              <Box
                mt="1"
                p={3}
                paddingRight={"15px"}
                h={30}
                fontWeight="semibold"
                color="white"
                bg={"#0000ed"}
                fontSize="12px"
                lineHeight="tight"
                noOfLines={[1]}
                isTruncated
                overflow={"hidden"}
              >
                <p style={{ textAlign: "center" }}> {nft.price}/avax</p>
              </Box>
            </GridItem>
          </Grid>

          <div>
            <model-viewer
              shadow-intensity="1"
              style={{ width: "200px", height: "200px" }}
              poster={nft.image}
              src={nft.image}
            ></model-viewer>
          </div>

          <Box
            mt="1"
            fontWeight="semibold"
            textAlign={"center"}
            color="white"
            h={18}
            p={0}
            fontSize="12px"
            w={"100%"}
            lineHeight="tight"
            noOfLines={[1]}
            isTruncated
          >
            {" "}
            <strong>{nft.name}</strong>
          </Box>
          <Box
            mt="2"
            fontWeight="semibold"
            textAlign={"center"}
            color="white"
            h={40}
            p={1}
            fontSize="12px"
            w={"100%"}
            lineHeight="tight"
            noOfLines={[1, 2]}
            isTruncated
          >
            {nft.description}
          </Box>
        </Box>
      </VStack>
    </Center>
  );
}
