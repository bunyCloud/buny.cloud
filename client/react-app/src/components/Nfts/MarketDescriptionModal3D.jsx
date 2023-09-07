import { SimpleGrid, Center, Box, HStack } from "@chakra-ui/react";
import React from "react";
import { nftAddress } from "contracts/config/networkAddress";
import { Button, Tooltip } from "antd";
import { ExpandAltOutlined } from "@ant-design/icons";

export default function MarketDescriptionModal3D({
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
      <div style={{ textAlign: "center", backgroundColor: "#bbdccb" }}>
        <Box
          mt="1"
          textAlign={"center"}
          color="white"
          fontSize="12px"
          bg="white"
          w={"100%"}
        >
          <Center>
            <div>
              <model-viewer
                shadow-intensity="3"
                style={{
                  width: "375px",
                  height: "375px",
                  backgroundColor: "rgb(229 231 235)",
                }}
                camera-controls
                //alt={`3D NFT Model:${name}`}
                poster={image}
                src={image}
                auto-rotate
              ></model-viewer>
            </div>
          </Center>
          <Center>
            <Box
              fontWeight="semibold"
              textAlign={"left"}
              //p={2}
              color="black"
              h={"100%"}
              p={12}
              fontSize="12px"
              w={"100%"}
              minWidth={"375px"}
              lineHeight="tight"
              noOfLines={[1, 2, 3]}
              isTruncated
            >
              <Box
                bg="#bbdccb"
                p={8}
                color="black"
                w={"100%"}
                height="auto"
                marginTop="0"
                boxShadow={"outline"}
                overflow="hidden"
                isTruncated
              >
                <p>
                  <h5 style={{ color: "black" }}> {name}</h5>
                </p>
              </Box>

              <Box mt="1" p={8} color="black" fontSize="12px">
                <HStack>
                  <div>{nftAddress}</div>
                  <div>
                    <strong>Token Id:</strong> {tokenId}
                  </div>
                </HStack>
              </Box>
              <Box p={6} color="black" bg="#bbdccb">
                <Tooltip title="View token page">
                  <Button
                    href={`/token/${nftAddress}/${tokenId}`}
                    style={{ marginBottom: "2px" }}
                    //type="ghost"
                    block
                  >
                    <ExpandAltOutlined style={{ marginRight: "5px" }} /> View
                    Token Page
                  </Button>
                </Tooltip>
              </Box>

              <Box
                bg="white"
                color="black"
                height="150px"
                overflow="auto"
                p={20}
              >
                {description}
              </Box>
            </Box>
          </Center>
        </Box>
      </div>
    </React.Fragment>
  );
}
