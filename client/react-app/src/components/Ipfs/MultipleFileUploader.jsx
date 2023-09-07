// MultipleFilesUpload Component : Uploads Multiple files to IPFS and returns the URL
import React, { useState } from "react";
import { MultipleFilesUpload } from "react-ipfs-uploader";
import { Box } from "@chakra-ui/react";

const MultipleFileUploader = () => {
  const [multipleFilesUrl, setMultipleFilesUrl] = useState("");

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
      <MultipleFilesUpload setUrl={setMultipleFilesUrl} />
      IPFS Hash :{" "}
      <a href={multipleFilesUrl} target="_blank" rel="noopener noreferrer">
        {multipleFilesUrl}
      </a>
    </Box>
  );
};

export default MultipleFileUploader;
