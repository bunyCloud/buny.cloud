// FileUpload Component : Uploads the selcted File and returns the URL after uploading the file .
import React, { useState } from "react";
import { FileUpload } from "react-ipfs-uploader";
import { Center, Box } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const ModelUploader = (props) => {
  //const [ipfsUrl, setIpfsUrl] = useState("");

  return (
    <Box
      mt="1"
      fontWeight="semibold"
      color="black"
      width={"100%"}
      bg={"white"}
      minHeight={235}
      fontSize="12px"
      lineHeight="tight"
      isTruncated
    >
      <FileUpload setUrl={props.setIpfsUrl} />
      IPFS Hash :{" "}
      <a href={props.ipfsUrl} target="_blank" rel="noopener noreferrer">
        {props.ipfsUrl}
      </a>
      <Center>
        <div>
          {props.ipfsUrl && (
            <model-viewer
              style={{ width: "180px", height: "180px" }}
              camera-controls
              poster="https://buny.us-southeast-1.linodeobjects.com/tvLoading.gif"
              alt="Upload GLB 3D Model to IPFS"
              src={props.ipfsUrl}
            ></model-viewer>
          )}
        </div>
      </Center>
    </Box>
  );
};

export default ModelUploader;
