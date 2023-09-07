import fallbackImg from "../icons/bunyBlue.svg";
import { useState } from "react";
import { Image, Button, Popover } from "antd";
import { Modal } from "antd";
import { Center, Box, HStack } from "@chakra-ui/react";
import { VStack, Grid, GridItem } from "@chakra-ui/react";
import MarketDescriptionModal from "./MarketDescriptionModal";
import { nftAddress } from "contracts/config/networkAddress";
import { Link } from "react-router-dom";

const styles = {
  nfts: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    width: "180px",
    maxWidth: "180px",
    maxHeight: "180px",
    padding: "5px",
    minHeight: "180px",
  },
  layout: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    //margin: "10px auto",
    width: "100%",
    backgroundColor: "white",
  },
};

export default function MarketNftCard({ nft, showInfo, showBuyBtn, buyNft }) {
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

  return (
    <Center py={5} px={0}>
      <VStack>
        <Box
          w={"180px"}
          h={"320px"}
          m={5}
          bg={"black"}
          border={"1px solid white"}
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
                  <Popover content={itemIdPopover} title="">
                    <p>| {nft.itemId}</p>
                  </Popover>
                </HStack>
              </Box>
            </GridItem>
            <GridItem colStart={4} colEnd={6} h="30" bg="black">
              <Box
                mt="1"
                p={10}
                paddingRight={"15px"}
                h={30}
                fontWeight="semibold"
                color="white"
                bg={"#0000ed"}
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
            <Image
              style={styles.nfts}
              fallback={fallbackImg}
              src={nft.image}
              alt={nft.name}
              align="center"
              preview={false}
            />
          </div>

          <Modal
            title={`Item: ${nft.name}`}
            open={isModalOpen}
            okText={"Buy nftAddress"}
            onOk={buyNft}
            onCancel={handleCancel}
            style={{ height: "100%" }}
            bodyStyle={{ overflowY: "scroll", padding: "6px" }}
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
            <strong>{nft.name.slice(0, 50)}</strong>
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
            <li key={nft.tokenId}>
              <Link
                to={`/token/${nftAddress}/${nft.tokenId}`}
                price={nft.price}
              >
                View Details
              </Link>
            </li>
          </Box>
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
                type
                primary
                block
                style={{
                  backgroundColor: "#001fff",
                  height: "28px",
                  color: "white",
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
