import { Button, Modal } from "antd";
import React, { useState } from "react";
import fallbackImg from "../icons/bunyBlue.svg";
import NftDescriptionModal from "./NftDescriptionModal";
import { Image } from "antd";
import { Box, useColorModeValue, Center, VStack } from "@chakra-ui/react";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    width: "120px",
    maxWidth: "120px",
    maxHeight: "120px",
    minHeight: "120px",
    margin: "0px",
  },
};

export const NftCard = ({ data }) => {
  const { metadata, token_address } = data;
  const {
    name,
    image_url_png,
    image,

    description,
  } = metadata;

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

  const [visible, setVisible] = useState(false);
  return (
    <Center py={6}>
      <div style={{ border: "1px solid white" }}>
        <Box
          display="flex"
          mt="2"
          alignItems="center"
          height={"215px"}
          maxW={"120px"}
          maxH={"215px"}
          bg={useColorModeValue("black", "gray")}
          boxShadow={"2xl"}
          rounded={"md"}
          noOfLines={[1, 2, 3]}
          p={30}
          overflow={"hidden"}
          isTruncated
        >
          <VStack>
            <Image
              style={styles.NFTs}
              fallback={fallbackImg}
              src={image_url_png || image}
              alt={name}
              align="center"
              preview={false}
            />

            <Box
              mt="1"
              fontWeight="semibold"
              color="white"
              minHeight={35}
              maxHeight={35}
              fontSize="12px"
              maxW={"120px"}
              lineHeight="tight"
              noOfLines={[1, 2]}
              isTruncated
            >
              {name.slice(0, 50)}
            </Box>

            <Modal
              title={`NFT Details: ${name}`}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <NftDescriptionModal
                token_address={token_address}
                nftName={name}
                image_url_png={image}
                nftDescription={description}
                showModal={showModal}
              />
            </Modal>
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Button
                width={"100%"}
                block
                style={{ backgroundColor: "#001fff", color: "white" }}
                onClick={showModal}
              >
                Details
              </Button>
            </div>
          </VStack>
        </Box>
      </div>
    </Center>
  );
};
