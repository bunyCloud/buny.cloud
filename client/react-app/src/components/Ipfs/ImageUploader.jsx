// ImageUpload : Shows the user a preview of the selected Image and returns the URL after uploading .
import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { ImageUpload } from "react-ipfs-uploader";
import { Button } from "antd";

const ImageUploader = (props) => {
  ///const [ipfsUrl, setIpfsUrl] = useState("");

  return (
    <>
      <ImageUpload setUrl={props.setIpfsUrl} />
      url:{" "}
      <a href={props.ipfsUrl} target="_blank" rel="noopener noreferrer">
        {props.ipfsUrl}
      </a>
    </>
  );
};

export default ImageUploader;
