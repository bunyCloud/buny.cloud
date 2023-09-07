// FileUpload Component : Uploads the selcted File and returns the URL after uploading the file .
import React, { useState } from "react";
import { FileUpload } from "react-ipfs-uploader";
import { Box } from "@chakra-ui/react";

const FileUploader = (props) => {
  //const [ipfsUrl, setIpfsUrl] = useState("");

  return (
    <>
      <div style={{ backgroundColor: "rgb(229 231 235)" }}>
        <FileUpload setUrl={props.setIpfsUrl} />
        url:{" "}
        <a href={props.ipfsUrl} target="_blank" rel="noopener noreferrer">
          {props.ipfsUrl}
        </a>
      </div>
    </>
  );
};

export default FileUploader;
