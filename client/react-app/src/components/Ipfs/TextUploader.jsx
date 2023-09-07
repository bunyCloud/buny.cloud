// TextUpload : Returns the URL of the Text after uploading
import React, { useState } from "react";
import { TextUpload } from "react-ipfs-uploader";
import { Box } from "@chakra-ui/react";

const TextUploader = (props) => {
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
      <TextUpload setUrl={props.setIpfsUrl} />
      Ipfs Hash :{" "}
      <a href={props.ipfsUrl} target="_blank" rel="noopener noreferrer">
        {props.ipfsUrl}
      </a>
    </Box>
  );
};

export default TextUploader;
