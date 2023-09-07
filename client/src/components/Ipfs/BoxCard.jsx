import { saveAs } from "file-saver";
import { IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react";
import React, { useState } from "react";
import { Box, Center, HStack } from "@chakra-ui/react";
import { Image, Tooltip, notification } from "antd";
// This is a function which renders the friends in the friends list

function BoxCard(props) {
  const { onCopy, value, setValue, hasCopied } = useClipboard(props.publicKey);

  const openNotification = () => {
    notification.open({
      message: "Copied to clipboard",
      description: `${props.publicKey}`,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const ipfsObject = "https://ipfs.io/ipfs/" + props.publicKey;

  const downloadObject = () => {
    saveAs(ipfsObject, props.name);
  };

  return (
    <Box
      style={{
        fontSize: "12px",
        padding: "10px",
        border: "2px solid blue",
      }}
    >
      {/*
      <img
        width="100px"
        height="100px"
        src={`https://ipfs.io/ipfs/${props.publicKey}`}
      ></img>
      */}

      <HStack>
        <div
          onClick={openNotification}
          style={{
            fontSize: "9px",
            color: "#9c9c9c",

            fontWeight: "normal",
            overflow: "hidden",
          }}
        >
          {" "}
          {props.publicKey.length > 80
            ? props.publicKey.substring(0, 20) + " ..."
            : props.publicKey}{" "}
          <Tooltip title="Copy to clipboard">
            <IconButton
              m={5}
              p={2}
              onClick={onCopy}
              variant="outline"
              colorScheme="teal"
              aria-label="Copy to clipboard"
              icon={<CopyIcon />}
            >
              {hasCopied ? "Copied!" : "Copy"}
            </IconButton>
          </Tooltip>
        </div>
      </HStack>
      <button onClick={downloadObject}> Download </button>
    </Box>
  );
}

export default BoxCard;
