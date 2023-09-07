import {
  Box,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from "@chakra-ui/react";
import { Center, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import FileUploader from "components/Ipfs/FileUploader";
import OwnerLoadContract from "./OwnerLoadContract";

function ContractLoader() {
  return (
    <Grid
      h="350px"
      w="100%"
      templateRows="repeat(4, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap={30}
    >
      <GridItem colSpan={4} bg="white" padding={"20px"} height={"100%"}>
        {/* initially mounted */}
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" height="100%">
          <OwnerLoadContract />
        </Box>
      </GridItem>
    </Grid>
  );
}

export default ContractLoader;
