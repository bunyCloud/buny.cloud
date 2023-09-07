import {
  VStack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import React from "react";
import List3dItem from "./List3dItem";
import ListItem from "./ListItem";

function ListNftTabs() {
  return (
    <>
      <VStack>
        <Box
          width="300px"
          padding="0px"
          marginBottom="-10px"
          bg="black"
          color="white"
        >
          <h6 style={{ color: "blue" }}>Select NFT type:</h6>
        </Box>

        <Tabs isLazy>
          <Center bg="white">
            <TabList
              style={{
                backgroundColor: "black",
                marginBottom: "5px",
                padding: "10px",
                gap: "30px",
              }}
            >
              <Tab width="120px" height="50px" className="ipfsTabs">
                {" "}
                Standard{" "}
              </Tab>
              <Tab width="120px" height="50px" className="ipfsTabs">
                3D Model{" "}
              </Tab>
            </TabList>
          </Center>

          <TabPanels>
            {/* initially mounted */}
            <TabPanel>
              <Box maxW="sm" borderWidth="1px" borderRadius="lg" height="100%">
                <Box width="300px" padding="10px" bg="white" color="black">
                  <p style={{ padding: "15px" }}>
                    <strong>Standard:</strong> Single Image NFT: Extensions:(
                    *.png, *.gif, *jpg)
                  </p>
                </Box>
                <ListItem />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="sm" borderWidth="1px" borderRadius="lg" height="100%">
                <Box width="300px" padding="10px" bg="white" color="black">
                  <p style={{ padding: "15px" }}>
                    <strong>3D Model:</strong> Single 3D NFT: Extensions:(
                    *.glb, *.gltf)
                  </p>
                </Box>
                <List3dItem />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </>
  );
}

export default ListNftTabs;
