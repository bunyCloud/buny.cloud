// FolderUpload Component : Uploads a Folder to IPFS and returns the URL
import React, { useState } from "react";
import { FolderUpload } from "react-ipfs-uploader";
import { Box } from "@chakra-ui/react";

const FolderUploader = (props) => {
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
      <FolderUpload setUrl={props.setIpfsUrl} />
      url :{" "}
      <a href={props.ipfsUrl} target="_blank" rel="noopener noreferrer">
        {props.ipfsUrl}
      </a>
    </Box>
  );
};

export default FolderUploader;
