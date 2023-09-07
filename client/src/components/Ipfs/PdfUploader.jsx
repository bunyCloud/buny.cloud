// PdfUpload : Shows the user a preview of the selected PDF and returns the URL after uploading .
import React from "react";
import { PdfUpload } from "react-ipfs-uploader";
import { Box } from "@chakra-ui/react";

const PdfUploader = (props) => {
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
      <PdfUpload setUrl={props.setIpfsUrl} />
      Ipfs Hash :{" "}
      <a href={props.ipfsUrl} target="_blank" rel="noopener noreferrer">
        {props.ipfsUrl}
      </a>
    </Box>
  );
};

export default PdfUploader;
