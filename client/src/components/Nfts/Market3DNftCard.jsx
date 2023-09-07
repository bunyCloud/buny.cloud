import { useState } from "react";
import { Link } from "react-router-dom";
import { nftAddress } from "contracts/config/networkAddress";
import { Button, Popover } from "antd";
import { Modal } from "antd";
import { Center, Box, HStack } from "@chakra-ui/react";
import { VStack, Grid, GridItem } from "@chakra-ui/react";
import MarketDescriptionModal from "./MarketDescriptionModal3D";
import { TwitterShareButton } from "react-twitter-embed";

export default function Market3DNftCard({ nft, showInfo, showBuyBtn, buyNft }) {
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Center py={5} px={0}>
      <VStack>
        <Box
          w={"180px"}
          h={"300px"}
          m={5}
          bg={"white"}
          border={"2px solid #f6ccd0"}
          boxShadow={"outline"}
          rounded={"md"}
          noOfLines={[1, 2]}
          overflow="hidden"
          isTruncated
        >
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            <GridItem colSpan={2} h="30">
              <Box
                color="black"
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
                  <Popover content={itemIdPopover} title="">
                    <p>| {nft.itemId}</p>
                  </Popover>
                </HStack>
              </Box>
            </GridItem>
            <GridItem colStart={4} colEnd={6} h="30" bg="black">
              <Box
                p={10}
                paddingRight={"15px"}
                h={"auto"}
                fontWeight="semibold"
                color="black"
                bg={"#bbdccb"}
                fontSize="11px"
                w={"250px"}
                lineHeight="tight"
                noOfLines={[1]}
                isTruncated
                overflow={"hidden"}
              >
                {nft.price} /AVAX
              </Box>
            </GridItem>
          </Grid>

          <div onClick={showModal}>
            <Center>
              <div>
                <model-viewer
                  style={{ width: "180px", height: "180px" }}
                  camera-controls
                  poster={nft.image}
                  src={nft.image}
                ></model-viewer>
              </div>
            </Center>
          </div>

          <Modal
            /*
            title={[
              <>
                <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                  <GridItem w="330px" h="15">
                    <div style={{ fontSize: "14px" }}>{nft.name}</div>
                  </GridItem>
                  <GridItem w="100px" h="15">
                    <div style={{ fontSize: "14px", textAlign: "right" }}>
                      <strong>{`Item: ${nft.itemId}`}</strong>
                    </div>
                  </GridItem>
                </Grid>
              </>,
            ]}

            */
            footer={[
              <>
                <div
                  style={{
                    backgroundColor: "#bbdccb",
                  }}
                >
                  <Button
                    //type="primary"
                    block
                    style={{
                      width: "100%",
                      color: "black",
                      height: "60px",
                      backgroundColor: "#bbdccb",
                      fontSize: "20px",
                      marginTop: "-20px",
                    }}
                    onClick={buyNft}
                  >
                    Buy NFT ({nft.price} /avax)
                  </Button>
                </div>
              </>,
            ]}
            open={isModalOpen}
            onOk={buyNft}
            onCancel={handleCancel}
            style={{ height: "auto", top: 5 }}
            bodyStyle={{ overflowY: "hide", padding: "6px" }}
          >
            <MarketDescriptionModal
              name={nft.name}
              image={nft.image}
              itemId={nft.itemId}
              description={nft.description}
              tokenId={nft.tokenId}
              showModal={showModal}
              price={nft.price}
              buyNft={buyNft}
            />
          </Modal>
          <Box
            mt="1"
            fontWeight="semibold"
            textAlign={"center"}
            color="black"
            h={18}
            p={0}
            fontSize="12px"
            w={"100%"}
            lineHeight="tight"
            noOfLines={[1]}
            isTruncated
          >
            {" "}
            <strong>{nft.name.slice(0, 50)}</strong>
          </Box>
          {/*
          <Box
            mt="2"
            fontWeight="semibold"
            textAlign={"center"}
            color="#bbdccb"
            h={20}
            p={1}
            fontSize="12px"
            w={"100%"}
            lineHeight="tight"
            noOfLines={[1, 2]}
            isTruncated
          >
            {nft.description}
          </Box>
          */}
          <Center>
            <Box
              mt="2"
              fontWeight="semibold"
              textAlign={"center"}
              color="#f9836e"
              h={"auto"}
              p={1}
              fontSize="12px"
              w={"100%"}
              lineHeight="tight"
              noOfLines={[1, 2]}
              isTruncated
            >
              <li key={nft.tokenId}>
                <div onClick={showModal}>
                  <Button
                    type="primary"
                    primary
                    block
                    style={{
                      backgroundColor: "#bbdccb",
                      height: "auto",
                      color: "black",
                      marginBottom: "5px",
                    }}
                  >
                    View Details{" "}
                  </Button>
                </div>
              </li>
            </Box>
          </Center>
          <Box
            mt="1"
            fontWeight="semibold"
            textAlign={"center"}
            color="white"
            fontSize="12px"
            w={"100%"}
            lineHeight="tight"
            noOfLines={[1]}
          >
            {showBuyBtn && (
              <Button
                type="primary"
                primary
                block
                style={{
                  backgroundColor: "#bbdccb",
                  height: "28px",
                  color: "black",
                }}
                onClick={buyNft}
              >
                BUY
              </Button>
            )}
          </Box>
        </Box>
      </VStack>
    </Center>
  );
}
